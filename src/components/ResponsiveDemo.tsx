'use client';

import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AartiSabhaLanding from './AartiSabhaLanding';

const ResponsiveDemo = () => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const breakpoints = {
    mobile: { width: '375px', label: 'Mobile (375px)', icon: Smartphone },
    tablet: { width: '768px', label: 'Tablet (768px)', icon: Tablet },
    desktop: { width: '100%', label: 'Desktop (1024px+)', icon: Monitor }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Responsive Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Responsive Design Demo - Aarti Sabha
          </CardTitle>
          <CardDescription>
            View how the landing page adapts across different screen sizes with modern responsive design principles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeBreakpoint} onValueChange={(value) => setActiveBreakpoint(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              {Object.entries(breakpoints).map(([key, { label, icon: Icon }]) => (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{key}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="text-sm text-gray-600">
              <strong>Current viewport:</strong> {breakpoints[activeBreakpoint].label}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Design Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Responsive Design Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600">Mobile (320px-768px)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Single column layout</li>
                <li>• Hamburger menu navigation</li>
                <li>• Bottom navigation bar</li>
                <li>• 2-deity cards per row</li>
                <li>• Floating action button</li>
                <li>• Touch-friendly 44px+ targets</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Tablet (768px-1024px)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Hybrid 2-column sections</li>
                <li>• Expanded search bar</li>
                <li>• 3-deity cards per row</li>
                <li>• Side-by-side content</li>
                <li>• Floating action preserved</li>
                <li>• Optimized for landscape</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Desktop (1024px+)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Multi-column grid layout</li>
                <li>• Fixed sidebar navigation</li>
                <li>• 4-deity cards per row</li>
                <li>• Full horizontal navigation</li>
                <li>• Rich hover interactions</li>
                <li>• Advanced layout patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Viewport */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Preview</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Viewport:</span>
              <span className="font-mono">{breakpoints[activeBreakpoint].width}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden mx-auto" 
               style={{ 
                 width: activeBreakpoint === 'desktop' ? '100%' : breakpoints[activeBreakpoint].width,
                 maxWidth: '100%',
                 height: '800px'
               }}>
            <div className="h-full overflow-auto">
              <AartiSabhaLanding />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design System Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Design System & Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-orange-600">Color Palette</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-amber-50 border border-amber-200"></div>
                  <span className="text-sm">Background: Warm cream (#FFFEF7)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-orange-600"></div>
                  <span className="text-sm">Primary: Saffron orange (#FF6F00)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-red-800"></div>
                  <span className="text-sm">Secondary: Deep maroon (#8B1538)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-green-600"></div>
                  <span className="text-sm">Success: Forest green (#22C55E)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">Technical Stack</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Next.js 14 with TypeScript</li>
                <li>• Shadcn/UI component library</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Lucide React icons</li>
                <li>• Mobile-first responsive design</li>
                <li>• Accessibility-compliant (WCAG 2.1)</li>
                <li>• Cultural design considerations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveDemo;
