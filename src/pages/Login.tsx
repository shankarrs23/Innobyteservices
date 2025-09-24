import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      showToast('success', 'Neural link established! Authentication successful.');
      navigate('/');
    } catch (error) {
      showToast('error', 'Access denied. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Additional cyber effects for this page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-cyan-400/20 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-purple-400/20 animate-pulse"></div>
        <div className="absolute top-1/2 left-5 w-px h-40 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"></div>
        <div className="absolute top-1/2 right-5 w-px h-40 bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 glass-morph-dark border border-cyan-400/30 rounded-full mb-4 relative group">
            <Lock className="text-cyan-400 group-hover:animate-pulse" size={28} />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h1 className="text-3xl font-bold holographic mb-2 tracking-wider">SYSTEM ACCESS</h1>
          <p className="text-gray-400 tracking-wide">Initiate neural authentication protocol</p>
        </div>

        {/* Login Form */}
        <div className="glass-morph-dark border border-cyan-400/30 rounded-2xl p-8 relative group">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyber mb-2 tracking-wide">
                EMAIL IDENTIFIER
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-cyan-400/70 group-focus-within:text-cyan-400 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`cyber-input pl-12 ${
                    errors.email ? 'border-red-400/50 bg-red-400/5' : ''
                  }`}
                  placeholder="Enter access credentials"
                />
                {/* Data stream effect */}
                <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent data-stream"></div>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2 font-mono">
                  <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30 flex-shrink-0">!</span>
                  <span>ERROR: {errors.email}</span>
                </p>
              )}
            </div>            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cyber mb-2 tracking-wide">
                SECURITY KEY
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-cyan-400/70 group-focus-within:text-cyan-400 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`cyber-input pl-12 pr-12 ${
                    errors.password ? 'border-red-400/50 bg-red-400/5' : ''
                  }`}
                  placeholder="Enter security passphrase"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-400/70 hover:text-cyan-400 transition-colors duration-200 z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {/* Data stream effect */}
                <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent data-stream" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2 font-mono">
                  <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30 flex-shrink-0">!</span>
                  <span>ERROR: {errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-400 focus:ring-cyan-500 border-cyan-400/30 rounded bg-transparent"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 tracking-wide">
                  Maintain session
                </label>
              </div>
              
              <button
                type="button"
                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium tracking-wide transition-colors duration-200"
              >
                Recovery mode?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button-primary w-full justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  ESTABLISHING LINK...
                </>
              ) : (
                'INITIATE ACCESS'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 tracking-wide">
              Need system registration?{' '}
              <Link
                to="/register"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200 tracking-wider"
              >
                CREATE PROFILE
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 glass-morph-light border border-cyan-400/30 rounded-lg">
          <h3 className="text-sm font-medium text-cyan-400 mb-2 tracking-wide">DEMO ACCESS CODES</h3>
          <p className="text-sm text-gray-400 font-mono">
            <strong className="text-purple-400">EMAIL:</strong> demo@example.com<br />
            <strong className="text-purple-400">KEY:</strong> demo123
          </p>
        </div>
      </div>
    </div>
  );
}
