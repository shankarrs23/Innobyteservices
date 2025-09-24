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
      showToast('success', 'Welcome back! You have been logged in successfully.');
      navigate('/');
    } catch (error) {
      showToast('error', 'Login failed. Please check your credentials.');
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
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyber mb-2 tracking-wide">
                EMAIL IDENTIFIER
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyan-400/70" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`cyber-input ${
                    errors.email ? 'border-red-400/50 bg-red-400/5' : ''
                  }`}
                  placeholder="Enter access credentials"
                />
                {/* Data stream effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent data-stream"></div>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1 font-mono">
                  <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30">!</span>
                  ERROR: {errors.email}
                </p>
              )}
            </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-xs">!</span>
                  {errors.password}
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <p className="text-sm text-blue-600">
            <strong>Email:</strong> demo@example.com<br />
            <strong>Password:</strong> demo123
          </p>
        </div>
      </div>
    </div>
  );
}