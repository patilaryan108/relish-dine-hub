
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, UtensilsCrossed, CreditCard, UserPlus } from 'lucide-react';

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-navy text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')` }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gold">Luxe</span> Hotel Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Streamlined management for exceptional hospitality experiences
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-gold hover:bg-gold-light text-white">
                Get Started
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="hotel-card">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-navy-light flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-center mb-2">User Management</h3>
                <p className="text-gray-600 text-center mb-4">
                  Simple registration and login system for staff and administrators.
                </p>
                <Link to="/register" className="text-gold hover:underline flex justify-center items-center">
                  Register Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hotel-card">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-center mb-2">Restaurant Menu</h3>
                <p className="text-gray-600 text-center mb-4">
                  Manage food items with easy addition and categorization capabilities.
                </p>
                <Link to="/menu" className="text-gold hover:underline flex justify-center items-center">
                  View Menu <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hotel-card">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-center mb-2">Billing System</h3>
                <p className="text-gray-600 text-center mb-4">
                  Generate bills for customers with detailed itemization and payment processing.
                </p>
                <Link to="/billing" className="text-gold hover:underline flex justify-center items-center">
                  Go to Billing <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
            Ready to Enhance Your Hotel Experience?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join our platform to streamline your hotel operations and provide exceptional service to your guests.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gold hover:bg-gold-light text-white">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
