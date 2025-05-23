
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// User interface matching the one in Register.tsx
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'staff' | 'owner';
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('karunadu_users') || '[]');
      
      // Find user by email
      const user = users.find((u: User) => u.email === formData.email);
      
      // Check if user exists and password matches
      if (user && user.password === formData.password) {
        // Set current user
        localStorage.setItem('karunadu_currentUser', JSON.stringify(user));
        
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/');
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md shadow-lg border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="font-playfair text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-xs text-gold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
              />
              <Label 
                htmlFor="rememberMe" 
                className="text-sm font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-navy hover:bg-navy-light text-white" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
