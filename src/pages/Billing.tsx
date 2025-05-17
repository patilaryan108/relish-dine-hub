
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { CreditCard, FileText, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, setBillData } = useCart();
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.0825; // 8.25% tax
  const total = subtotal - discountAmount + tax;
  
  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleGenerateBill = () => {
    if (cartItems.length === 0) {
      toast.error("Please add items to the bill");
      return;
    }
    
    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    
    if (!tableNumber.trim()) {
      toast.error("Please enter table number");
      return;
    }
    
    // Create the bill data object
    const billData = {
      customerName,
      tableNumber,
      orderItems: cartItems,
      subtotal,
      discount,
      discountAmount,
      tax,
      total,
      paymentMethod,
      timestamp: new Date()
    };
    
    // Save to context
    setBillData(billData);
    
    // Navigate to bill view
    navigate('/bill-view');
  };
  
  const handleClearBill = () => {
    clearCart();
    setCustomerName('');
    setTableNumber('');
    setDiscount(0);
    setPaymentMethod('card');
    toast.info("Bill cleared");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-navy mb-8">Billing</h1>
      
      <div className="max-w-4xl mx-auto">
        <Card className="h-full">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
            <CardTitle className="font-playfair text-xl flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" /> 
              Order Summary {cartItems.length > 0 && `(${cartItems.length})`}
            </CardTitle>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Button variant="outline" onClick={handleClearBill} size="sm" className="text-gray-600">
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
              <Button 
                onClick={handleGenerateBill} 
                size="sm"
                className="bg-navy hover:bg-navy-light text-white"
              >
                <FileText className="h-4 w-4 mr-1" /> Generate Bill
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 space-y-4 border-b">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input 
                    id="customerName" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tableNumber">Table Number</Label>
                  <Input 
                    id="tableNumber" 
                    value={tableNumber} 
                    onChange={e => setTableNumber(e.target.value)} 
                    placeholder="Enter table number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input 
                    id="discount" 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={discount} 
                    onChange={e => setDiscount(parseFloat(e.target.value) || 0)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="mobile">Mobile Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Item</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.length > 0 ? (
                    cartItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                        No items added to the bill yet. Please select items from the menu first.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col border-t">
            <div className="w-full pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount ({discount}%):</span>
                    <span className="text-red-500">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (8.25%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-base">Total:</span>
                  <span className="font-bold text-navy text-base">₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/menu')}
                >
                  Back to Menu
                </Button>
                
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <CreditCard className="h-4 w-4 mr-2" /> Process Payment
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
