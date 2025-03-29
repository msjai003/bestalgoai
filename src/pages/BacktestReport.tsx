
import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Download, 
  Save,
  Trash,
  ChevronLeft
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useBacktestResults, BacktestResult } from '@/hooks/strategy/useBacktestResults';
import { BacktestResultsTable } from '@/components/backtest/BacktestResultsTable';
import { BacktestDetailsView } from '@/components/backtest/BacktestDetailsView';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const saveFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  strategyName: z.string().optional(),
  entryDate: z.string().optional(),
  entryTime: z.string().optional(),
  entryPrice: z.union([z.string(), z.number()]).optional().transform(val => val === "" ? null : Number(val)),
  quantity: z.union([z.string(), z.number()]).optional().transform(val => val === "" ? null : Number(val)),
  instrumentKind: z.string().optional(),
  strikePrice: z.union([z.string(), z.number()]).optional().transform(val => val === "" ? null : Number(val)),
  position: z.string().optional(),
  exitDate: z.string().optional(),
  exitTime: z.string().optional(),
  exitPrice: z.union([z.string(), z.number()]).optional().transform(val => val === "" ? null : Number(val)),
  expiryDate: z.string().optional(),
  remarks: z.string().optional(),
});

type SaveFormValues = z.infer<typeof saveFormSchema>;

const BacktestReport = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [currentBacktest, setCurrentBacktest] = useState<BacktestResult | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    backtestResults, 
    loading: resultsLoading,
    saveBacktestResult,
    deleteBacktestResult 
  } = useBacktestResults();
  
  const saveForm = useForm<SaveFormValues>({
    resolver: zodResolver(saveFormSchema),
    defaultValues: {
      title: "",
      description: "",
      strategyName: "",
      entryDate: "",
      entryTime: "",
      entryPrice: "",
      quantity: "",
      instrumentKind: "",
      strikePrice: "",
      position: "",
      exitDate: "",
      exitTime: "",
      exitPrice: "",
      expiryDate: "",
      remarks: "",
    },
  });

  // Function to calculate weekday from a date string
  const getWeekday = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Function to handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // For demo purposes, we'll set hardcoded values
        // In a real app, you would parse the CSV and extract values
        const mockData: BacktestResult = {
          id: "temp-id",
          title: file.name.replace(".csv", ""),
          description: null,
          strategyId: null,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          strategyName: "NIFTY Options Strategy",
          entryDate: new Date().toISOString().split('T')[0],
          entryWeekday: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
          entryTime: "09:15:00",
          entryPrice: 450.75,
          quantity: 50,
          instrumentKind: "OPTIONS",
          strikePrice: 19500,
          position: "LONG",
          exitDate: new Date().toISOString().split('T')[0],
          exitWeekday: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
          exitTime: "15:20:00",
          exitPrice: 487.25,
          pl: 1825,
          plPercentage: 8.1,
          expiryDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
          highestMtm: 520.50,
          lowestMtm: 440.25,
          remarks: "Strong momentum trade with good follow-through",
          createdAt: new Date().toISOString()
        };

        setCurrentBacktest(mockData);
        setFileUploaded(true);
        toast.success("Backtest data loaded successfully");
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("There was an error processing your file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveBacktest = async (values: SaveFormValues) => {
    // Calculate weekdays from dates
    const entryWeekday = values.entryDate ? getWeekday(values.entryDate) : "";
    const exitWeekday = values.exitDate ? getWeekday(values.exitDate) : "";
    
    // Calculate P/L and P/L percentage if entry and exit prices are provided
    let pl = null;
    let plPercentage = null;
    
    // Ensure all values used in calculations are numbers, not strings
    const entryPrice = values.entryPrice ? Number(values.entryPrice) : null;
    const exitPrice = values.exitPrice ? Number(values.exitPrice) : null;
    const quantity = values.quantity ? Number(values.quantity) : null;
    
    if (entryPrice && exitPrice && quantity) {
      const entryValue = entryPrice * quantity;
      const exitValue = exitPrice * quantity;
      
      if (values.position?.toUpperCase() === 'LONG') {
        pl = exitValue - entryValue;
      } else if (values.position?.toUpperCase() === 'SHORT') {
        pl = entryValue - exitValue;
      }
      
      if (pl !== null && entryValue !== 0) {
        plPercentage = (pl / entryValue) * 100;
      }
    }
    
    // Prepare the data for saving
    const backtestData = {
      title: values.title,
      description: values.description || null,
      strategyId: null,
      startDate: values.entryDate || new Date().toISOString().split('T')[0],
      endDate: values.exitDate || new Date().toISOString().split('T')[0],
      strategyName: values.strategyName || null,
      entryDate: values.entryDate || null,
      entryWeekday: entryWeekday || null,
      entryTime: values.entryTime || null,
      entryPrice: entryPrice,
      quantity: quantity,
      instrumentKind: values.instrumentKind || null,
      strikePrice: values.strikePrice ? Number(values.strikePrice) : null,
      position: values.position || null,
      exitDate: values.exitDate || null,
      exitWeekday: exitWeekday || null,
      exitTime: values.exitTime || null,
      exitPrice: exitPrice,
      pl: pl,
      plPercentage: plPercentage,
      expiryDate: values.expiryDate || null,
      highestMtm: entryPrice ? entryPrice * 1.1 : null, // Mock data for demo
      lowestMtm: entryPrice ? entryPrice * 0.9 : null, // Mock data for demo
      remarks: values.remarks || null
    };
    
    const result = await saveBacktestResult(backtestData);
    
    if (result) {
      setSaveDialogOpen(false);
      saveForm.reset();
    }
  };

  const loadBacktestResult = (result: BacktestResult) => {
    setCurrentBacktest(result);
    setFileUploaded(true);
    setLoadDialogOpen(false);
  };

  const handleDeleteBacktest = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this backtest result?")) {
      await deleteBacktestResult(id);
      // If the deleted result was the current one, clear the view
      if (currentBacktest && currentBacktest.id === id) {
        setCurrentBacktest(null);
        setFileUploaded(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const exportToCSV = () => {
    try {
      if (!currentBacktest) {
        toast.error("No backtest data to export");
        return;
      }
      
      // Create header row
      const headers = [
        "Strategy Name", "Entry Date", "Entry Weekday", "Entry Time", "Entry Price", 
        "Quantity", "Instrument Kind", "Strike Price", "Position",
        "Exit Date", "Exit Weekday", "Exit Time", "Exit Price",
        "P/L", "P/L Percentage", "Expiry Date", "Highest MTM", "Lowest MTM", "Remarks"
      ].join(",");
      
      // Create data row
      const data = [
        currentBacktest.strategyName || "",
        currentBacktest.entryDate || "",
        currentBacktest.entryWeekday || "",
        currentBacktest.entryTime || "",
        currentBacktest.entryPrice || "",
        currentBacktest.quantity || "",
        currentBacktest.instrumentKind || "",
        currentBacktest.strikePrice || "",
        currentBacktest.position || "",
        currentBacktest.exitDate || "",
        currentBacktest.exitWeekday || "",
        currentBacktest.exitTime || "",
        currentBacktest.exitPrice || "",
        currentBacktest.pl || "",
        currentBacktest.plPercentage || "",
        currentBacktest.expiryDate || "",
        currentBacktest.highestMtm || "",
        currentBacktest.lowestMtm || "",
        currentBacktest.remarks || ""
      ].join(",");
      
      // Combine header and data
      const csv = headers + "\n" + data;
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `backtest-${currentBacktest.title || 'report'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Backtest Report</h1>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-charcoalSecondary/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button className="bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary py-2 px-4 rounded-lg text-sm font-medium">
              Backtesting
            </button>
            <Link to="/strategy-builder" className="text-charcoalTextSecondary py-2 px-4 rounded-lg text-sm font-medium text-center">
              Strategy Builder
            </Link>
          </div>
        </div>

        {!fileUploaded ? (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-700 rounded-xl bg-charcoalSecondary/20 mt-8">
            <Upload className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-charcoalTextPrimary text-lg font-medium mb-2">Upload Backtest Data</h3>
            <p className="text-charcoalTextSecondary text-sm text-center mb-6">
              Upload a CSV file containing your trading data to generate a detailed backtest report
            </p>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex flex-col space-y-3 w-full items-center">
              <Button onClick={triggerFileInput} className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Select CSV File
              </Button>
              
              {backtestResults.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setLoadDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Load Saved Backtest
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                  {currentBacktest ? currentBacktest.title : "Current Backtest"}
                </h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSaveDialogOpen(true)}
                    className="text-xs"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportToCSV}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  {currentBacktest && currentBacktest.id && currentBacktest.id !== "temp-id" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteBacktest(currentBacktest.id)}
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      <Trash className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              
              {currentBacktest?.description && (
                <p className="text-charcoalTextSecondary text-sm">
                  {currentBacktest.description}
                </p>
              )}

              {currentBacktest && (
                <BacktestDetailsView backtest={currentBacktest} />
              )}
            </section>
          </>
        )}

        {backtestResults.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Backtest Results</h2>
            <BacktestResultsTable results={backtestResults.slice(0, 5)} />
            {backtestResults.length > 5 && (
              <div className="text-center mt-2">
                <Button 
                  variant="link" 
                  onClick={() => setLoadDialogOpen(true)}
                  className="text-cyan"
                >
                  View All Results
                </Button>
              </div>
            )}
          </section>
        )}
      </main>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Backtest Result</DialogTitle>
            <DialogDescription>
              Save your backtest result to access it later.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...saveForm}>
            <form onSubmit={saveForm.handleSubmit(handleSaveBacktest)} className="space-y-4">
              <FormField
                control={saveForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="NIFTY Options Strategy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={saveForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Short description of this backtest..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={saveForm.control}
                  name="strategyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy Name</FormLabel>
                      <FormControl>
                        <Input placeholder="NIFTY Options" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={saveForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="LONG/SHORT" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="entryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="exitDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exit Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="entryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="exitTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exit Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="entryPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="exitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exit Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="instrumentKind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instrument Type</FormLabel>
                      <FormControl>
                        <Input placeholder="OPTIONS/FUTURES" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="strikePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strike Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={saveForm.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes about this trade..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Backtest</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Load Saved Backtest Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Load Saved Backtest</DialogTitle>
            <DialogDescription>
              Select a previously saved backtest result to load.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {backtestResults.length === 0 ? (
              <p className="text-center text-gray-400">No saved backtest results found.</p>
            ) : (
              backtestResults.map((result) => (
                <div 
                  key={result.id}
                  className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan/50 cursor-pointer transition-colors"
                  onClick={() => loadBacktestResult(result)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{result.title}</h4>
                      <p className="text-xs text-gray-400">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBacktest(result.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col mt-2 text-xs">
                    <div className="flex space-x-4">
                      <span className="text-gray-400">Strategy: {result.strategyName || 'N/A'}</span>
                      <span className="text-gray-400">Date: {result.entryDate || 'N/A'}</span>
                    </div>
                    
                    <div className="flex space-x-4 mt-1">
                      <span className={result.pl && result.pl > 0 ? 'text-green-400' : result.pl && result.pl < 0 ? 'text-red-400' : 'text-gray-400'}>
                        P/L: {result.pl ? `₹${result.pl}` : 'N/A'}
                      </span>
                      <span className="text-gray-400">Position: {result.position || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default BacktestReport;
