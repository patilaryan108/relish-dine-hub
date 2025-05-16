import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Utensils, Coffee, IceCreamBowl, Droplet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

// Define types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'manager';
  preferences?: {
    favoriteItems?: string[];
    dietaryRestrictions?: string[];
  };
}

const defaultMenuItems: MenuItem[] = [
  // South Indian Items
  {
    id: '1',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling, served with sambar and chutney',
    price: 8.99,
    category: 'southIndian',
    image: 'https://images.unsplash.com/photo-1668236534235-1d76ffc88047?q=80&w=1500&auto=format'
  },
  {
    id: '2',
    name: 'Idli Sambar',
    description: 'Steamed rice cakes served with lentil soup and coconut chutney',
    price: 7.99,
    category: 'southIndian',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1500&auto=format'
  },
  {
    id: '3',
    name: 'Puri Bhaji',
    description: 'Deep-fried bread served with spiced potato curry',
    price: 6.99,
    category: 'southIndian',
    image: 'https://images.unsplash.com/photo-1606724546338-24a0468c7cc7?q=80&w=1500&auto=format'
  },
  {
    id: '4',
    name: 'South Indian Thali',
    description: 'Complete meal with rice, sambar, rasam, vegetables, curd and dessert',
    price: 14.99,
    category: 'southIndian',
    image: 'https://images.unsplash.com/photo-1627662055115-0c7cc67a610b?q=80&w=1500&auto=format'
  },
  {
    id: '5',
    name: 'Medu Vada',
    description: 'Crispy savory donuts made from urad dal, served with sambar and chutney',
    price: 5.99,
    category: 'southIndian',
    image: 'https://images.unsplash.com/photo-1630383249896-24c1129946b3?q=80&w=1500&auto=format'
  },
  {
    id: '6',
    name: 'Uttapam',
    description: 'Thick pancake topped with onions, tomatoes, and chilies',
    price: 8.99,
    category: 'southIndian',
    image: 'https://images.unsplash.com/photo-1541833000669-8dce2195ca20?q=80&w=1500&auto=format'
  },
  
  // Ice Cream Section
  {
    id: '7',
    name: 'Vanilla Ice Cream',
    description: 'Classic vanilla bean ice cream served in a waffle cone',
    price: 4.99,
    category: 'iceCream',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1500&auto=format'
  },
  {
    id: '8',
    name: 'Chocolate Sundae',
    description: 'Rich chocolate ice cream with hot fudge, whipped cream, and a cherry',
    price: 6.99,
    category: 'iceCream',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1500&auto=format'
  },
  {
    id: '9',
    name: 'Mango Kulfi',
    description: 'Traditional Indian frozen dessert made with condensed milk and mango',
    price: 5.99,
    category: 'iceCream',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=1500&auto=format'
  },
  
  // Beverages
  {
    id: '10',
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk',
    price: 3.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=1500&auto=format'
  },
  {
    id: '11',
    name: 'South Indian Filter Coffee',
    description: 'Strong coffee brewed with chicory and served with milk',
    price: 4.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1605158124569-51d5dc75d0ef?q=80&w=1500&auto=format'
  },
  {
    id: '12',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink with mango pulp',
    price: 4.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1626202858063-107bf2b95d32?q=80&w=1500&auto=format'
  },
  {
    id: '13',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with soda water, served sweet, salty or mixed',
    price: 3.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?q=80&w=1500&auto=format'
  },
  {
    id: '14',
    name: 'Cold Coffee',
    description: 'Chilled coffee with ice cream',
    price: 5.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1500&auto=format'
  },
  // Adding more tea and coffee options
  {
    id: '15',
    name: 'Green Tea',
    description: 'Refreshing green tea with antioxidants',
    price: 3.49,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=1500&auto=format'
  },
  {
    id: '16',
    name: 'Lemon Tea',
    description: 'Fresh tea with lemon and honey',
    price: 3.49,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1500&auto=format'
  },
  {
    id: '17',
    name: 'Espresso',
    description: 'Strong concentrated coffee served in a small cup',
    price: 3.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1510591509098-f4b5d5f0f01a?q=80&w=1500&auto=format'
  },
  {
    id: '18',
    name: 'Cappuccino',
    description: 'Coffee with equal parts of espresso, steamed milk, and milk foam',
    price: 4.79,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1500&auto=format'
  }
];

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'southIndian',
    image: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();
  // Add state for users
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'customer'
    },
    {
      id: '2',
      name: 'Staff Member',
      email: 'staff@karunadu.com',
      role: 'staff'
    },
    {
      id: '3',
      name: 'Restaurant Manager',
      email: 'manager@karunadu.com',
      role: 'manager',
      preferences: {
        favoriteItems: ['1', '11'],
        dietaryRestrictions: []
      }
    }
  ]);
  const [currentUser, setCurrentUser] = useState<UserData>(users[0]);

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
    
    // Save to currentUser favorites if they're a manager
    if (currentUser.role === 'manager') {
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            preferences: {
              ...user.preferences,
              favoriteItems: [...(user.preferences?.favoriteItems || []), id]
            }
          };
        }
        return user;
      });
      setUsers(updatedUsers);
    }
    
    // Reset form
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'southIndian',
      image: ''
    });
    
    setIsDialogOpen(false);
  };

  const handleAddToOrder = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price
    });
    
    toast.success(`Added ${item.name} to your order`);
  };

  // Add function to switch users
  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      toast.success(`Switched to ${user.name}`);
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'southIndian':
        return <Utensils className="h-4 w-4 mr-1" />;
      case 'iceCream':
        return <IceCreamBowl className="h-4 w-4 mr-1" />;
      case 'beverages':
        if (activeCategory === 'beverages') return <Droplet className="h-4 w-4 mr-1" />;
        return <Coffee className="h-4 w-4 mr-1" />;
      default:
        return <Utensils className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-navy">KARUNADU RESTAURANT</h1>
          <p className="text-gray-600 mt-2">Explore our authentic South Indian cuisine</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Select 
            value={currentUser.id}
            onValueChange={switchUser}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentUser.role === 'manager' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold-light text-white">
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
                        <SelectItem value="southIndian">South Indian</SelectItem>
                        <SelectItem value="iceCream">Ice Cream</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
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
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              All Items
            </TabsTrigger>
            <TabsTrigger value="southIndian" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              <Utensils className="h-4 w-4 mr-1" /> South Indian
            </TabsTrigger>
            <TabsTrigger value="iceCream" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              <IceCreamBowl className="h-4 w-4 mr-1" /> Ice Cream
            </TabsTrigger>
            <TabsTrigger value="beverages" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              <Coffee className="h-4 w-4 mr-1" /> Beverages
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
                    onClick={() => handleAddToOrder(item)}
                  >
                    {getCategoryIcon(item.category)} Add to Order
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
