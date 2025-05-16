
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { CreditCard, FileText, Printer, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const BillView: React.FC = () => {
  const { billData, clearBillData, clearCart } = useCart();
  const navigate = useNavigate();

  if (!billData) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-playfair text-xl text-center">No bill data found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>No active bill was found. Please return to the billing page.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/billing')} 
              className="bg-navy hover:bg-navy-light text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Return to Billing
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { 
    customerName, 
    tableNumber, 
    orderItems, 
    subtotal, 
    discount, 
    discountAmount, 
    tax, 
    total, 
    paymentMethod,
    timestamp = new Date()
  } = billData;

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = () => {
    toast.success("Payment processed successfully!");
    clearBillData();
    clearCart();
    navigate('/billing');
  };

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/billing')} 
            size="sm" 
            className="print:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-navy">Bill Receipt</h1>
          <Button 
            variant="outline" 
            onClick={handlePrint}
            size="sm"
            className="print:hidden"
          >
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
        </div>

        <Card className="mb-8 print:shadow-none">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="font-bold text-xl font-playfair">Grand Hotel Restaurant</p>
                <p className="text-gray-500">123 Luxury Avenue, Cityville</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-gray-500">{formattedDate}</p>
                <p className="text-gray-500">{formattedTime}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
                <p className="font-medium">{customerName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Table Number</h3>
                <p className="font-medium">{tableNumber}</p>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({discount}%):</span>
                  <span className="text-red-500">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8.25%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-navy">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-2">
                <span className="text-gray-600">Payment Method:</span>
                <span>{paymentMethod === 'card' ? 'Credit/Debit Card' : 
                       paymentMethod === 'cash' ? 'Cash' : 'Mobile Payment'}</span>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Thank you for dining with us!</p>
              <p className="mt-1">We hope to see you again soon.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6 print:hidden">
            <Button 
              onClick={handlePayment} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" /> Process Payment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BillView;
