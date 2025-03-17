
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
  });

  // Filter payments based on search query
  const filteredPayments = data?.data?.filter(payment => 
    payment.students?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate totals
  const totalPayments = filteredPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Payments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalPayments.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        {/* Additional summary cards could go here */}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search payments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button>
          Record Payment
        </Button>
      </div>
      
      {isLoading ? (
        <div>Loading payments...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Link 
                        to={`/students/${payment.student_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {payment.students?.full_name || "Unknown Student"}
                      </Link>
                    </TableCell>
                    <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                    <TableCell>{payment.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
