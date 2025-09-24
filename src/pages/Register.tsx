import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { register, isLoading } = useAuth();
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

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register(formData.name, formData.email, formData.password);
      showToast('success', 'Neural profile created successfully! Welcome to the collective.');
      navigate('/');
    } catch (error) {
      showToast('error', 'Profile creation failed. Please recalibrate and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Additional cyber effects for this page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-24 h-24 border border-purple-400/20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 border border-cyan-400/20 animate-spin" style={{animationDuration: '15s'}}></div>
        <div className="absolute top-1/3 left-10 w-px h-32 bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"></div>
        <div className="absolute bottom-1/3 right-10 w-px h-32 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 glass-morph-dark border border-purple-400/30 rounded-full mb-4 relative group">
            <UserPlus className="text-purple-400 group-hover:animate-pulse" size={28} />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h1 className="text-3xl font-bold holographic mb-2 tracking-wider">NEURAL REGISTRATION</h1>
          <p className="text-gray-400 tracking-wide">Initialize new profile in the collective</p>
        </div>

        {/* Register Form */}
        <div className="glass-morph-dark border border-purple-400/30 rounded-2xl p-8 relative group">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-cyan-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-cyber mb-2 tracking-wide">
                IDENTITY MARKER
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-purple-400/70 group-focus-within:text-purple-400 transition-colors duration-200" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`cyber-input pl-12 ${
                    errors.name ? 'border-red-400/50 bg-red-400/5' : ''
                  }`}
                  placeholder="Enter neural designation"
                />
                {/* Data stream effect */}
                <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent data-stream"></div>
                </div>
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2 font-mono">
                  <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30 flex-shrink-0">!</span>
                  <span>ERROR: {errors.name}</span>
                </p>
              )}
            </div>            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyber mb-2 tracking-wide">
                COMMUNICATION CHANNEL
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
                  placeholder="Enter data transmission address"
                />
                {/* Data stream effect */}
                <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent data-stream" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2 font-mono">
                  <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30 flex-shrink-0">!</span>
                  <span>ERROR: {errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cyber mb-2 tracking-wide">
                PRIMARY ENCRYPTION KEY
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-400/70" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`cyber-input ${
                    errors.password ? 'border-red-400/50 bg-red-400/5' : ''
                  }`}
                  placeholder="Create security passphrase"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400/70 hover:text-purple-400 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {/* Data stream effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent data-stream" style={{animationDelay: '0.6s'}}></div>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1 font-mono">
                  <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30">!</span>
                  ERROR: {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-cyber mb-2 tracking-wide">
                VERIFICATION SEQUENCE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-pink-400/70" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`cyber-input ${
                    errors.confirmPassword ? 'border-red-400/50 bg-red-400/5' : ''
                  }`}
                  placeholder="Confirm security passphrase"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400/70 hover:text-pink-400 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {/* Data stream effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent data-stream" style={{animationDelay: '0.9s'}}></div>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1 font-mono">
                  <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30">!</span>
                  ERROR: {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-purple-400 focus:ring-purple-500 border-purple-400/30 rounded bg-transparent mt-0.5"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-400 tracking-wide">
                I agree to the{' '}
                <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors duration-200 tracking-wider">
                  Neural Network Protocols
                </button>{' '}
                and{' '}
                <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 tracking-wider">
                  Data Stream Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button-secondary w-full justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  INITIALIZING PROFILE...
                </>
              ) : (
                'CREATE NEURAL PROFILE'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 tracking-wide">
              Already have access credentials?{' '}
              <Link
                to="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200 tracking-wider"
              >
                ACCESS SYSTEM
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 glass-morph-light border border-purple-400/30 rounded-lg">
          <h3 className="text-sm font-medium text-purple-400 mb-2 tracking-wide">SECURITY PROTOCOLS</h3>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            • Minimum 6-character encryption key required<br />
            • Neural signatures must be unique across the network<br />
            • All communications are quantum-encrypted by default
          </p>
        </div>
      </div>
    </div>
  );
}
