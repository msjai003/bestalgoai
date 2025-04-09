
import { useState, useEffect } from "react";
import { BrokerDetail } from "@/types/broker";
import { getAllBrokerDetails } from "@/utils/brokerDetailsUtils";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BrokerDetailsView = () => {
  const navigate = useNavigate();
  const [brokerDetails, setBrokerDetails] = useState<BrokerDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrokerDetails = async () => {
      setLoading(true);
      try {
        const data = await getAllBrokerDetails();
        setBrokerDetails(data);
      } catch (error) {
        console.error("Error fetching broker details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerDetails();
  }, []);

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-charcoalSecondary z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5 text-charcoalTextSecondary" />
          </Button>
          <h1 className="text-lg font-semibold">Broker Details</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <div className="bg-charcoalSecondary rounded-lg p-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading broker details...</p>
            </div>
          ) : brokerDetails.length === 0 ? (
            <div className="text-center py-8">
              <p>No broker details found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Broker Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Required Inputs</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokerDetails.map(broker => (
                  <TableRow key={broker.id}>
                    <TableCell>{broker.id}</TableCell>
                    <TableCell>{broker.broker_name}</TableCell>
                    <TableCell>{broker.description || "N/A"}</TableCell>
                    <TableCell>
                      {broker.required_inputs ? 
                        (Array.isArray(broker.required_inputs) 
                          ? broker.required_inputs.map(input => String(input)).join(", ") 
                          : typeof broker.required_inputs === 'object' 
                            ? Object.keys(broker.required_inputs).join(", ")
                            : String(broker.required_inputs)
                        ) 
                        : "None"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${broker.is_active ? 'bg-green-900/50 text-green-500' : 'bg-red-900/50 text-red-500'}`}>
                        {broker.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrokerDetailsView;
