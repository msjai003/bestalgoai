
import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Upload, FileCsv, CheckCircle, AlertCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define the CSV row structure for backtest data
interface BacktestCsvRow {
  [key: string]: string;
  'Strategy Name'?: string;
  'Entry-Date'?: string;
  'Entry-Weekday'?: string;
  'Entry-Time'?: string;
  'Entry-Price'?: string;
  'Quantity'?: string;
  'Instrument-Kind'?: string;
  'StrikePrice'?: string;
  'Position'?: string;
  'ExitDate'?: string;
  'Exit-Weekday'?: string;
  'ExitTime'?: string;
  'ExitPrice'?: string;
  'P/L'?: string;
  'P/L-Percentage'?: string;
  'ExpiryDate'?: string;
  'Highest MTM(Candle Close)'?: string;
  'Lowest MTM(Candle Close)'?: string;
  'Remarks'?: string;
}

// Define the expected database column structure
interface BacktestDbRow {
  strategy_name: string | null;
  entry_date: string | null;
  entry_weekday: string | null;
  entry_time: string | null;
  entry_price: number | null;
  quantity: number | null;
  instrument_kind: string | null;
  strike_price: number | null;
  position: string | null;
  exit_date: string | null;
  exit_weekday: string | null;
  exit_time: string | null;
  exit_price: number | null;
  pl: number | null;
  pl_percentage: number | null;
  expiry_date: string | null;
  highest_mtm: number | null;
  lowest_mtm: number | null;
  remarks: string | null;
  user_id: string;
}

const BacktestImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [csvData, setCsvData] = useState<BacktestCsvRow[]>([]);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    success: number;
    failed: number;
    errors: string[];
  }>({
    total: 0,
    success: 0,
    failed: 0,
    errors: []
  });
  const [fileName, setFileName] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Map CSV column names to database column names
  const columnMapping: Record<string, keyof BacktestDbRow> = {
    'Strategy Name': 'strategy_name',
    'Entry-Date': 'entry_date',
    'Entry-Weekday': 'entry_weekday',
    'Entry-Time': 'entry_time',
    'Entry-Price': 'entry_price',
    'Quantity': 'quantity',
    'Instrument-Kind': 'instrument_kind',
    'StrikePrice': 'strike_price',
    'Position': 'position',
    'ExitDate': 'exit_date',
    'Exit-Weekday': 'exit_weekday',
    'ExitTime': 'exit_time',
    'ExitPrice': 'exit_price',
    'P/L': 'pl',
    'P/L-Percentage': 'pl_percentage',
    'ExpiryDate': 'expiry_date',
    'Highest MTM(Candle Close)': 'highest_mtm',
    'Lowest MTM(Candle Close)': 'lowest_mtm',
    'Remarks': 'remarks'
  };

  // Convert CSV data to database format
  const convertToDatabaseFormat = (csvRow: BacktestCsvRow): BacktestDbRow => {
    if (!user) throw new Error('User not authenticated');
    
    const dbRow: Partial<BacktestDbRow> = {
      user_id: user.id
    };
    
    // Map each CSV column to its database equivalent
    Object.entries(csvRow).forEach(([csvCol, value]) => {
      const dbCol = columnMapping[csvCol];
      
      if (dbCol) {
        // Handle numeric values
        if (['entry_price', 'exit_price', 'quantity', 'strike_price', 'pl', 'pl_percentage', 'highest_mtm', 'lowest_mtm'].includes(dbCol)) {
          dbRow[dbCol] = value ? Number(value) : null;
        } else {
          dbRow[dbCol] = value || null;
        }
      }
    });
    
    return dbRow as BacktestDbRow;
  };

  // Handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewError(null);
    setCsvData([]);
    
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    // Parse CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setPreviewError(`CSV parsing error: ${results.errors[0].message}`);
          return;
        }
        
        const data = results.data as BacktestCsvRow[];
        
        if (data.length === 0) {
          setPreviewError('CSV file is empty');
          return;
        }
        
        // Check for required columns
        const requiredColumns = ['Strategy Name', 'Entry-Date'];
        const missingColumns = requiredColumns.filter(
          col => !Object.keys(data[0]).includes(col)
        );
        
        if (missingColumns.length > 0) {
          setPreviewError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }
        
        setCsvData(data);
      },
      error: (error) => {
        setPreviewError(`Error reading CSV file: ${error.message}`);
      }
    });
  }, []);

  // Trigger file input dialog
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  // Handle upload to database
  const handleUpload = async () => {
    if (!user) {
      toast.error('You must be logged in to upload data');
      return;
    }
    
    if (csvData.length === 0) {
      toast.error('No data to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const results = {
      total: csvData.length,
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    try {
      // Process in batches of 50 for better performance
      const batchSize = 50;
      const batches = Math.ceil(csvData.length / batchSize);
      
      for (let i = 0; i < batches; i++) {
        const batchStart = i * batchSize;
        const batchEnd = Math.min((i + 1) * batchSize, csvData.length);
        const batch = csvData.slice(batchStart, batchEnd);
        
        // Convert batch to database format
        const dbRows = batch.map(row => convertToDatabaseFormat(row));
        
        // Insert batch into database
        const { data, error } = await supabase
          .from('backtest_reports')
          .insert(dbRows);
        
        if (error) {
          console.error('Batch insert error:', error);
          results.failed += batch.length;
          results.errors.push(`Batch ${i+1} error: ${error.message}`);
        } else {
          results.success += batch.length;
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / batches) * 100));
      }
      
      setUploadResults(results);
      
      if (results.failed === 0) {
        toast.success(`Successfully imported ${results.success} records`);
      } else {
        toast.warning(`Imported ${results.success} records with ${results.failed} failures`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
      
      if (error instanceof Error) {
        results.errors.push(error.message);
      }
      
      setUploadResults(results);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setCsvData([]);
    setFileName('');
    setPreviewError(null);
    setUploadResults({
      total: 0,
      success: 0,
      failed: 0,
      errors: []
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-charcoalPrimary min-h-screen">
        <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/dashboard" className="p-2">
              <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
            </Link>
            <h1 className="text-charcoalTextPrimary text-lg font-medium">Backtest Import</h1>
            <div className="w-8"></div>
          </div>
        </header>

        <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
          <Card className="mb-8 bg-charcoalSecondary border-gray-700">
            <CardHeader>
              <CardTitle>Import Backtest Data</CardTitle>
              <CardDescription>
                Upload CSV files containing backtest data to import into the database
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-xl bg-charcoalSecondary/20 relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {!fileName ? (
                  <>
                    <FileCsv className="w-12 h-12 text-gray-500 mb-4" />
                    <h3 className="text-charcoalTextPrimary text-lg font-medium mb-2">Select CSV File</h3>
                    <p className="text-charcoalTextSecondary text-sm text-center mb-6 max-w-md">
                      Upload a CSV file with columns for Strategy Name, Entry-Date, Entry-Price, etc.
                    </p>
                    <Button 
                      onClick={handleSelectFile} 
                      variant="default" 
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Browse Files
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4 w-full max-w-md">
                      <FileCsv className="w-8 h-8 text-cyan" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-white font-medium truncate">{fileName}</p>
                        <p className="text-gray-400 text-sm">{csvData.length} records found</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 w-full justify-center">
                      <Button 
                        onClick={handleSelectFile} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Change File
                      </Button>
                      
                      {csvData.length > 0 && (
                        <Button 
                          onClick={handleUpload} 
                          variant="default" 
                          size="sm"
                          disabled={isUploading}
                          className="flex items-center gap-1"
                        >
                          {isUploading ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {isUploading ? 'Uploading...' : 'Import Data'}
                        </Button>
                      )}
                      
                      <Button 
                        onClick={handleReset} 
                        variant="destructive" 
                        size="sm"
                        disabled={isUploading}
                        className="flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Reset
                      </Button>
                    </div>
                    
                    {isUploading && (
                      <div className="w-full max-w-md mt-4">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-center mt-1 text-gray-400">
                          Importing {uploadProgress}% complete
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {previewError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{previewError}</AlertDescription>
                </Alert>
              )}
              
              {uploadResults.total > 0 && (
                <Alert className={`mt-4 ${uploadResults.failed === 0 ? 'bg-green-900/20 text-green-400 border-green-900' : 'bg-yellow-900/20 text-yellow-400 border-yellow-900'}`}>
                  {uploadResults.failed === 0 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {uploadResults.failed === 0 ? 'Import Complete' : 'Import Completed with Errors'}
                  </AlertTitle>
                  <AlertDescription>
                    <p>
                      Successfully imported {uploadResults.success} of {uploadResults.total} records.
                      {uploadResults.failed > 0 && ` Failed to import ${uploadResults.failed} records.`}
                    </p>
                    {uploadResults.errors.length > 0 && (
                      <ul className="list-disc list-inside mt-2 text-sm">
                        {uploadResults.errors.slice(0, 3).map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                        {uploadResults.errors.length > 3 && (
                          <li>...and {uploadResults.errors.length - 3} more errors</li>
                        )}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter>
              <p className="text-xs text-gray-400">
                The CSV file should contain columns that match the backtest report format, including Strategy Name, Entry-Date, etc.
              </p>
            </CardFooter>
          </Card>
          
          {csvData.length > 0 && (
            <Card className="bg-charcoalSecondary border-gray-700">
              <CardHeader>
                <CardTitle>CSV Data Preview</CardTitle>
                <CardDescription>
                  Showing {Math.min(5, csvData.length)} of {csvData.length} records
                </CardDescription>
              </CardHeader>
              
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(csvData[0]).slice(0, 6).map((header, i) => (
                        <TableHead key={i} className="text-charcoalTextSecondary">{header}</TableHead>
                      ))}
                      {Object.keys(csvData[0]).length > 6 && (
                        <TableHead className="text-charcoalTextSecondary">...</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.slice(0, 5).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.entries(row).slice(0, 6).map(([col, value], colIndex) => (
                          <TableCell key={colIndex} className="text-charcoalTextPrimary">
                            {value || '-'}
                          </TableCell>
                        ))}
                        {Object.keys(row).length > 6 && (
                          <TableCell className="text-charcoalTextPrimary">...</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
        
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
};

export default BacktestImport;
