
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Billing', path: '/billing' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-playfair font-bold text-navy">
              <span className="text-gold">Luxe</span> Hotel
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-playfair text-base transition-colors ${
                isActive(link.path) 
                  ? 'text-gold font-medium border-b-2 border-gold' 
                  : 'text-gray-600 hover:text-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" className="border-gold text-navy hover:bg-gold hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-navy hover:bg-navy-light text-white">
                Register
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-navy p-2 rounded-md"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg animate-fade-in z-50">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-playfair text-base p-2 ${
                  isActive(link.path) 
                    ? 'text-gold font-medium border-l-4 border-gold pl-2' 
                    : 'text-gray-600 hover:text-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-gold text-navy hover:bg-gold hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-navy hover:bg-navy-light text-white">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
