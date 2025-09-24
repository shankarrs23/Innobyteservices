import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, PlusCircle, User, LogOut, Home, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    ...(user ? [
      { name: 'My Posts', path: '/my-posts', icon: FileText },
      { name: 'Create Post', path: '/create-post', icon: PlusCircle }
    ] : [])
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 glass-morph-dark shadow-2xl border-b border-cyan-400/30 z-40 backdrop-blur-xl">
      {/* Neon Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-xl font-bold group transition-all duration-300"
          >
            <div className="relative">
              <BookOpen className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" size={32} />
              <div className="absolute inset-0 text-cyan-400 opacity-50 blur-sm group-hover:opacity-70 transition-opacity duration-300">
                <BookOpen size={32} />
              </div>
            </div>
            <span className="holographic text-cyber font-bold text-2xl tracking-wider">
              CYBER<span className="text-cyan-400">BLOG</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-futuristic transition-all duration-300 group ${
                    isActivePath(item.path)
                      ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 shadow-lg shadow-cyan-400/20'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/5 border border-transparent hover:border-cyan-400/20'
                  }`}
                >
                  <Icon size={18} className="group-hover:animate-pulse" />
                  <span className="tracking-wide">{item.name}</span>
                  {isActivePath(item.path) && (
                    <div className="absolute inset-0 rounded-lg bg-cyan-400/5 animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 glass-morph-light border border-cyan-400/30 rounded-lg relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-400/20 relative z-10"
                  />
                  <span className="text-sm font-medium text-cyber relative z-10">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 border border-red-400/30 hover:border-red-400/50 rounded-lg transition-all duration-300 group"
                >
                  <LogOut size={18} className="group-hover:animate-pulse" />
                  <span className="tracking-wide">LOGOUT</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 tracking-wide"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="cyber-button-primary text-sm font-medium tracking-wide"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30 transition-all duration-300 group"
          >
            <div className="relative">
              {isMenuOpen ? (
                <X size={24} className="group-hover:animate-pulse" />
              ) : (
                <Menu size={24} className="group-hover:animate-pulse" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-morph-dark border-t border-cyan-400/30 relative">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 to-purple-400/5 animate-pulse"></div>
          <div className="relative z-10 px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActivePath(item.path)
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20'
                  }`}
                >
                  <Icon size={20} className="group-hover:animate-pulse" />
                  <span className="tracking-wide">{item.name.toUpperCase()}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-cyan-400/30 pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2 glass-morph-light border border-cyan-400/30 rounded-lg">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-400/50"
                    />
                    <span className="text-sm font-medium text-cyber">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 border border-red-400/30 hover:border-red-400/50 rounded-lg transition-all duration-300 group"
                  >
                    <LogOut size={20} className="group-hover:animate-pulse" />
                    <span className="tracking-wide">LOGOUT</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20 rounded-lg transition-all duration-300 tracking-wide text-center"
                  >
                    LOGIN
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="cyber-button-primary w-full text-center text-sm tracking-wide"
                  >
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}