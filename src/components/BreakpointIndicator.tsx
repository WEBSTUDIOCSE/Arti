'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const BreakpointIndicator = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('');
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      if (width < 768) {
        setCurrentBreakpoint('Mobile');
      } else if (width < 1024) {
        setCurrentBreakpoint('Tablet');
      } else {
        setCurrentBreakpoint('Desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const getIcon = () => {
    switch (currentBreakpoint) {
      case 'Mobile': return <Smartphone className="h-4 w-4" />;
      case 'Tablet': return <Tablet className="h-4 w-4" />;
      case 'Desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getColor = () => {
    switch (currentBreakpoint) {
      case 'Mobile': return 'bg-green-100 text-green-800 border-green-200';
      case 'Tablet': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Desktop': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge className={`${getColor()} flex items-center gap-2 px-3 py-2 text-sm font-medium`}>
        {getIcon()}
        {currentBreakpoint} ({screenWidth}px)
      </Badge>
    </div>
  );
};

export default BreakpointIndicator;
