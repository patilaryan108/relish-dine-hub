
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

interface DailySale {
  id: string;
  date: string;
  amount: number;
  employeesPresent: number;
  notes: string;
}

const DailySales = () => {
  const [sales, setSales] = useState<DailySale[]>([]);
  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    employeesPresent: '',
    notes: ''
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authorization
    const userString = localStorage.getItem('karunadu_currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user);
      
      if (user.role !== 'owner') {
        toast.error('Only owner can access sales data management');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair font-bold text-navy mb-8">Daily Sales Management</h1>
      
      <div className="grid md:grid-cols-1 gap-8 max-w-xl mx-auto">
        {/* Add Sales Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Add Daily Sales Record
            </CardTitle>
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
              
              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/sales')}
                >
                  View Sales Report
                </Button>
                <Button type="submit" className="bg-navy hover:bg-navy-light text-white">
                  Add Record
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailySales;
