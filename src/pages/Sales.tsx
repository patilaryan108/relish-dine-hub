
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DailySale {
  id: string;
  date: string;
  amount: number;
  employeesPresent: number;
  notes: string;
}

const Sales = () => {
  const [sales, setSales] = useState<DailySale[]>([]);
  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    employeesPresent: '',
    notes: ''
  });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSale(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSale.date || !newSale.amount || !newSale.employeesPresent) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const amount = parseFloat(newSale.amount);
    const employeesPresent = parseInt(newSale.employeesPresent);
    
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid sale amount');
      return;
    }
    
    if (isNaN(employeesPresent) || employeesPresent < 0) {
      toast.error('Please enter a valid number of employees present');
      return;
    }
    
    const sale: DailySale = {
      id: Date.now().toString(),
      date: newSale.date,
      amount: amount,
      employeesPresent: employeesPresent,
      notes: newSale.notes
    };
    
    const updatedSales = [...sales, sale];
    setSales(updatedSales);
    localStorage.setItem('karunadu_sales', JSON.stringify(updatedSales));
    
    setNewSale({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      employeesPresent: '',
      notes: ''
    });
    
    toast.success('Sales record added successfully');
  };

  const handleRemoveSale = (id: string) => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    setSales(updatedSales);
    localStorage.setItem('karunadu_sales', JSON.stringify(updatedSales));
    toast.success('Sales record removed successfully');
  };

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
      <h1 className="text-3xl font-playfair font-bold text-navy mb-8">Sales Management</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Sales Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Daily Sales Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newSale.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Sale Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={newSale.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="employeesPresent">Employees Present</Label>
                <Input
                  id="employeesPresent"
                  name="employeesPresent"
                  type="number"
                  value={newSale.employeesPresent}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={newSale.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes (optional)"
                />
              </div>
              
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white">
                Add Sales Record
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Sales Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Financial Summary</CardTitle>
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
      </div>
      
      {/* Sales Records */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Employees Present</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveSale(sale.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No sales records added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
