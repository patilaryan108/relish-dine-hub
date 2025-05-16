
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Utensils } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Define types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const defaultMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon, grilled to perfection with lemon herb butter',
    price: 24.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: '2',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil leaves drizzled with balsamic glaze',
    price: 12.99,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: '3', 
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream',
    price: 9.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: '4',
    name: 'Filet Mignon',
    description: '8oz premium beef tenderloin steak, served with truffle mashed potatoes',
    price: 34.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: '5',
    name: 'Shrimp Cocktail',
    description: 'Chilled jumbo shrimp served with house cocktail sauce',
    price: 16.99,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1565280654386-361675079b9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: '6',
    name: 'Crème Brûlée',
    description: 'Classic French custard with caramelized sugar top',
    price: 8.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
];

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'main',
    image: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSelectChange = (value: string) => {
    setNewItem(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.description || newItem.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Date.now().toString();
    
    // Use a default image if none provided
    const image = newItem.image || 
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80';
    
    const createdItem = { ...newItem, id, image };
    
    setMenuItems(prev => [...prev, createdItem]);
    toast.success("New menu item added!");
    
    // Reset form
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'main',
      image: ''
    });
    
    setIsDialogOpen(false);
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-navy">Restaurant Menu</h1>
          <p className="text-gray-600 mt-2">Explore our exquisite culinary offerings</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 bg-gold hover:bg-gold-light text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-playfair text-xl">Add New Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the menu item"
                  value={newItem.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.price || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  defaultValue={newItem.category}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starters">Starters</SelectItem>
                    <SelectItem value="main">Main Course</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (Optional)</Label>
                <Input
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={newItem.image}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gold hover:bg-gold-light text-white">
                  Add Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              All Items
            </TabsTrigger>
            <TabsTrigger value="starters" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              Starters
            </TabsTrigger>
            <TabsTrigger value="main" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              Main Course
            </TabsTrigger>
            <TabsTrigger value="desserts" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              Desserts
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="menu-card overflow-hidden flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="font-playfair text-xl">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-2 border-t">
                  <p className="text-navy font-playfair font-semibold">${item.price.toFixed(2)}</p>
                  <Button 
                    variant="outline" 
                    className="border-gold text-gold hover:bg-gold hover:text-white"
                    size="sm"
                  >
                    <Utensils className="h-4 w-4 mr-1" /> Add to Order
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No menu items found in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Menu;
