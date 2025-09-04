import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Menu, X, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { logout } from '../services/authService';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, userProfile, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      logoutStore();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="MedSpaGen Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">MedSpaGen</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
                <Link to="/documentation" className="text-gray-700 hover:text-blue-600 transition-colors">Docs</Link>
                <Link to="/api" className="text-gray-700 hover:text-blue-600 transition-colors">API</Link>
                <Link to="/support" className="text-gray-700 hover:text-blue-600 transition-colors">Support</Link>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/generate" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Generate
                </Link>
                <Link to="/documentation" className="text-gray-700 hover:text-blue-600 transition-colors">Docs</Link>
                <Link to="/api" className="text-gray-700 hover:text-blue-600 transition-colors">API</Link>
                <Link to="/support" className="text-gray-700 hover:text-blue-600 transition-colors">Support</Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {userProfile?.photoURL ? (
                      <img 
                        src={userProfile.photoURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-sm">{userProfile?.displayName || user?.displayName || 'User'}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/generate"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Generate Videos
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!user ? (
                <>
                  <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Features</a>
                  <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600">How It Works</a>
                  <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Pricing</a>
                  <Link 
                    to="/documentation" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                  <Link 
                    to="/api" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    API
                  </Link>
                  <Link 
                    to="/support" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/generate" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Generate Videos
                  </Link>
                  <Link 
                    to="/documentation" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                  <Link 
                    to="/api" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    API
                  </Link>
                  <Link 
                    to="/support" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-700 hover:text-red-600 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;