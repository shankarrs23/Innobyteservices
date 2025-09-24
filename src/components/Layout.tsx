import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Matrix rain effect
  useEffect(() => {
    const createMatrixChar = () => {
      const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', '|', '-', '_', '+', '='];
      const char = chars[Math.floor(Math.random() * chars.length)];
      const element = document.createElement('div');
      element.className = 'matrix-char';
      element.textContent = char;
      element.style.left = Math.random() * window.innerWidth + 'px';
      element.style.animationDuration = (Math.random() * 10 + 5) + 's';
      element.style.animationDelay = Math.random() * 5 + 's';
      
      const matrixBg = document.querySelector('.matrix-bg');
      if (matrixBg) {
        matrixBg.appendChild(element);
        
        setTimeout(() => {
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }, 15000);
      }
    };

    const interval = setInterval(createMatrixChar, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix Background Effect */}
      <div className="matrix-bg"></div>
      
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-cyan-400 rotate-45 animate-pulse opacity-20"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border-2 border-purple-400 animate-spin opacity-20" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-pink-400 rotate-12 animate-bounce opacity-20"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-blue-400 animate-pulse opacity-20"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-gradient-to-r from-pink-400 to-red-500 rounded-full blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Laser Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Scan Lines Effect */}
        <div className="absolute inset-0 scan-lines"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}