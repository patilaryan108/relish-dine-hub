
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FileText, ChartBar } from 'lucide-react';

interface DailySale {
  id: string;
  date: string;
  amount: number;
  employeesPresent: number;
  notes: string;
}

const Sales = () => {
  const [sales, setSales] = useState<DailySale[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authorization
    const userString = localStorage.getItem('karunadu_currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user);
      
      if (user.role !== 'owner') {
        toast.error('Only owner can access sales data');
        navigate('/');
        return;
      }
    } else {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }
    
    // Load existing sales
    const storedSales = localStorage.getItem('karunadu_sales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }

    // Load employees for salary calculation
    const storedEmployees = localStorage.getItem('karunadu_employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, [navigate]);

  // Calculate metrics
  const totalSales = sales.reduce((total, sale) => total + sale.amount, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
  
  const monthlySalesTotal = currentMonthSales.reduce((total, sale) => total + sale.amount, 0);
  
  // Calculate total monthly salary expense
  const totalMonthlySalary = employees.reduce((total, emp) => total + emp.salary, 0);
  
  // Calculate profit
  const monthlyProfit = monthlySalesTotal - totalMonthlySalary;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair font-bold text-navy mb-8">Sales Reports</h1>
      
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => navigate('/daily-sales')} 
          className="bg-navy hover:bg-navy-light text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Add Daily Sales
        </Button>
      </div>
      
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBar className="mr-2 h-5 w-5" />
              Monthly Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Current Month Sales:</span>
                <span className="text-lg font-bold text-green-600">₹{monthlySalesTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Employee Salary:</span>
                <span className="text-lg font-bold text-red-500">₹{totalMonthlySalary.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-t-2 border-navy">
                <span className="font-medium">Monthly Profit:</span>
                <span className={`text-lg font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  ₹{monthlyProfit.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">All-Time Sales:</span>
                <span className="text-lg font-bold">₹{totalSales.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      
        {/* Sales Records */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length > 0 ? (
                  [...sales]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(sale => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>₹{sale.amount.toFixed(2)}</TableCell>
                        <TableCell>{sale.employeesPresent}</TableCell>
                        <TableCell>{sale.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No sales records added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
