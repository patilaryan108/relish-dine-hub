
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  joinDate: string;
}

const Employee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    salary: ''
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authorization
    const userString = localStorage.getItem('karunadu_currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user);
      
      if (user.role !== 'owner' && user.role !== 'staff') {
        toast.error('Unauthorized access');
        navigate('/');
        return;
      }
    } else {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }
    
    // Load existing employees
    const storedEmployees = localStorage.getItem('karunadu_employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.name || !newEmployee.position || !newEmployee.salary) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const salary = parseFloat(newEmployee.salary);
    if (isNaN(salary) || salary <= 0) {
      toast.error('Please enter a valid salary amount');
      return;
    }
    
    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      position: newEmployee.position,
      salary: salary,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    localStorage.setItem('karunadu_employees', JSON.stringify(updatedEmployees));
    
    setNewEmployee({
      name: '',
      position: '',
      salary: ''
    });
    
    toast.success('Employee added successfully');
  };

  const handleRemoveEmployee = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem('karunadu_employees', JSON.stringify(updatedEmployees));
    toast.success('Employee removed successfully');
  };

  // Calculate total salary expense
  const totalSalaryExpense = employees.reduce((total, emp) => total + emp.salary, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair font-bold text-navy mb-8">Employee Management</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Employee Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  placeholder="Employee name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={newEmployee.position}
                  onChange={handleInputChange}
                  placeholder="Job position"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="salary">Monthly Salary (₹)</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white">
                Add Employee
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Salary Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Employees:</span>
                <span className="text-lg font-bold">{employees.length}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Monthly Salary Expense:</span>
                <span className="text-lg font-bold text-navy">₹{totalSalaryExpense.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Average Salary:</span>
                <span className="text-lg font-bold">
                  ₹{employees.length > 0 ? (totalSalaryExpense / employees.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Employee List */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Monthly Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.joinDate}</TableCell>
                    <TableCell>₹{employee.salary.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveEmployee(employee.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No employees added yet
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

export default Employee;
