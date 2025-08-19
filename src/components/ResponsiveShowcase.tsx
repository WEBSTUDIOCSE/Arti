'use client';

import React from 'react';
import { Smartphone, Tablet, Monitor, Users, Play, Search, Heart, Star, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResponsiveShowcase = () => {
  const deities = [
    { name: 'Ganesha', icon: '🐘', count: 25 },
    { name: 'Krishna', icon: '🪈', count: 18 },
    { name: 'Shiva', icon: '🔱', count: 22 },
    { name: 'Durga', icon: '🌺', count: 15 },
    { name: 'Rama', icon: '🏹', count: 12 },
    { name: 'Hanuman', icon: '💪', count: 20 },
  ];

  const aartiSample = {
    title: 'Ganesha Aarti',
    deity: 'Ganesha',
    duration: '4:32',
    popularity: 95,
    language: 'Hindi',
    singers: 1250,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Aarti Sabha <span className="text-orange-600">Responsive Design</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive responsive design showcase demonstrating how the Hindu devotional app adapts 
            seamlessly across mobile, tablet, and desktop experiences.
          </p>
        </div>

        {/* Responsive Breakpoint Demos */}
        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60 border border-amber-200">
            <TabsTrigger value="mobile" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="tablet" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Tablet className="h-4 w-4" />
              Tablet
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Monitor className="h-4 w-4" />
              Desktop
            </TabsTrigger>
          </TabsList>

          {/* Mobile Layout Demo */}
          <TabsContent value="mobile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-orange-600" />
                    Mobile Layout (320px-768px)
                  </CardTitle>
                  <CardDescription>
                    Single column layout optimized for one-handed use and touch interaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mobile Header Mockup */}
                  <div className="bg-white/60 backdrop-blur border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm">🕉️</div>
                        <div>
                          <div className="font-semibold text-sm">Aarti Sabha</div>
                          <div className="text-xs text-gray-600">Digital Aarti Book</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">☰</Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                      <input className="w-full pl-8 pr-3 py-2 text-sm border border-amber-200 rounded bg-white/60" placeholder="Search aartis..." />
                    </div>
                  </div>

                  {/* Mobile Deity Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {deities.slice(0, 4).map((deity) => (
                      <Card key={deity.name} className="bg-orange-100 border-orange-200 cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{deity.icon}</div>
                          <div className="font-medium text-sm">{deity.name}</div>
                          <div className="text-xs text-gray-600">{deity.count} aartis</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Mobile Bottom Navigation */}
                  <div className="bg-white/90 backdrop-blur border-t border-amber-200 rounded-lg p-2">
                    <div className="grid grid-cols-4 gap-1">
                      <Button variant="ghost" className="flex-col p-2 h-auto">
                        <Search className="h-4 w-4 mb-1" />
                        <span className="text-xs">Browse</span>
                      </Button>
                      <Button variant="ghost" className="flex-col p-2 h-auto">
                        <Heart className="h-4 w-4 mb-1" />
                        <span className="text-xs">Favorites</span>
                      </Button>
                      <Button variant="ghost" className="flex-col p-2 h-auto">
                        <Users className="h-4 w-4 mb-1" />
                        <span className="text-xs">Sabha</span>
                      </Button>
                      <Button variant="ghost" className="flex-col p-2 h-auto">
                        <div className="h-4 w-4 mb-1 rounded-full bg-gray-300"></div>
                        <span className="text-xs">Profile</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="bg-white/80 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Mobile Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Touch-friendly 44px+ tap targets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Bottom navigation for thumb accessibility</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Floating action button for key actions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Collapsible hamburger menu</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Single column content flow</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Aarti Card - Mobile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Card className="bg-white/60 border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{aartiSample.title}</div>
                            <div className="text-sm text-gray-600 mb-2">{aartiSample.deity} • {aartiSample.duration}</div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">{aartiSample.language}</Badge>
                              <span className="text-xs text-gray-500">{aartiSample.singers} active</span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tablet Layout Demo */}
          <TabsContent value="tablet">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tablet className="h-5 w-5 text-blue-600" />
                    Tablet Layout (768px-1024px)
                  </CardTitle>
                  <CardDescription>
                    Hybrid layout balancing content density with touch accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Tablet Header Mockup */}
                  <div className="bg-white/60 backdrop-blur border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm">🕉️</div>
                        <div>
                          <div className="font-semibold">Aarti Sabha</div>
                          <div className="text-xs text-gray-600">Digital Aarti Book & Sabha Companion</div>
                        </div>
                      </div>
                      <div className="flex-1 max-w-md">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                          <input className="w-full pl-8 pr-3 py-2 text-sm border border-amber-200 rounded bg-white/60" placeholder="Search aartis, deities..." />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs">हिंदी</Button>
                        <Button variant="ghost" size="sm" className="text-xs">⚙️</Button>
                      </div>
                    </div>
                  </div>

                  {/* Tablet Deity Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {deities.slice(0, 6).map((deity) => (
                      <Card key={deity.name} className="bg-orange-100 border-orange-200 cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3 text-center">
                          <div className="text-xl mb-1">{deity.icon}</div>
                          <div className="font-medium text-sm">{deity.name}</div>
                          <div className="text-xs text-gray-600">{deity.count}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Tablet Two-Column Content */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-white/60 border-amber-200">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm mb-1">Ganesha Aarti</div>
                        <div className="text-xs text-gray-600 mb-2">4:32 • Hindi</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">1.2k singers</span>
                          <Button size="sm" className="bg-orange-600 text-white h-6 px-2 text-xs">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/60 border-amber-200">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm mb-1">Krishna Aarti</div>
                        <div className="text-xs text-gray-600 mb-2">4:45 • Hindi</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">890 singers</span>
                          <Button size="sm" className="bg-orange-600 text-white h-6 px-2 text-xs">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="bg-white/80 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Tablet Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Expanded search bar in header</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">3-column deity grid for better use of space</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">2-column aarti cards layout</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Landscape orientation optimization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Retained floating action button</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Cultural Design Elements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs">🕉️</div>
                      <span className="text-sm">Respectful use of sacred symbols</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-amber-100 rounded border border-amber-300"></div>
                      <span className="text-sm">Warm color palette inspired by temple aesthetics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-600 rounded"></div>
                      <span className="text-sm">Saffron accents for spiritual significance</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Desktop Layout Demo */}
          <TabsContent value="desktop">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Desktop Main Content */}
              <div className="xl:col-span-2">
                <Card className="bg-white/80 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-green-600" />
                      Desktop Layout (1024px+)
                    </CardTitle>
                    <CardDescription>
                      Multi-column grid layout with sidebar navigation for comprehensive browsing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Desktop Header Mockup */}
                    <div className="bg-white/60 backdrop-blur border border-amber-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white">🕉️</div>
                          <div>
                            <div className="font-semibold">Aarti Sabha</div>
                            <div className="text-xs text-gray-600">Digital Aarti Book & Sabha Companion</div>
                          </div>
                        </div>
                        <div className="flex-1 max-w-md mx-8">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded bg-white/60" placeholder="Search aartis, deities, or festivals..." />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm">🌐 हिंदी</Button>
                          <Button variant="ghost" size="sm">⚙️</Button>
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Deity Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {deities.map((deity) => (
                        <Card key={deity.name} className="bg-orange-100 border-orange-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{deity.icon}</div>
                            <div className="font-semibold">{deity.name}</div>
                            <div className="text-sm text-gray-600">{deity.count} aartis</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop Aarti Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="bg-white/60 border-amber-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-semibold">Sample Aarti {i + 1}</div>
                                <div className="text-sm text-gray-600">Deity • 4:30</div>
                              </div>
                              <Heart className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">95%</span>
                              </div>
                              <Button size="sm" className="bg-orange-600 text-white">
                                <Play className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Desktop Sidebar */}
              <div className="space-y-4">
                <Card className="bg-white/80 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Desktop Sidebar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      <Users className="h-4 w-4 mr-2" />
                      Host New Sabha
                    </Button>
                    <Button variant="outline" className="w-full border-orange-600 text-orange-600">
                      <Search className="h-4 w-4 mr-2" />
                      Find Sabha
                    </Button>
                    
                    <div className="pt-3 border-t border-amber-200">
                      <div className="font-semibold mb-2">Active Sabhas</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                          <span className="text-sm">Ganesha Sabha</span>
                          <Badge className="bg-green-600 text-white text-xs">Live</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                          <span className="text-sm">Family Circle</span>
                          <Badge variant="outline" className="text-xs">12 members</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Desktop Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Fixed sidebar for quick actions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">4-column deity grid layout</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Rich hover interactions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Full horizontal navigation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Advanced filtering and search</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Design System Documentation */}
        <Card className="mt-12 bg-white/80 border-amber-200">
          <CardHeader>
            <CardTitle>Design System & Accessibility</CardTitle>
            <CardDescription>
              Modern responsive design principles with cultural sensitivity and elder-friendly accessibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-orange-600">Color System</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-50 border border-amber-200"></div>
                    <span className="text-sm">Warm cream base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-600"></div>
                    <span className="text-sm">Saffron primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-800"></div>
                    <span className="text-sm">Maroon secondary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-600"></div>
                    <span className="text-sm">Success green</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-blue-600">Typography</h4>
                <div className="space-y-2 text-sm">
                  <div>Headings: Noto Serif</div>
                  <div>Body: Inter sans-serif</div>
                  <div>Base size: 16px+</div>
                  <div>Line height: 1.6</div>
                  <div>Elder-friendly sizing</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-purple-600">Components</h4>
                <div className="space-y-2 text-sm">
                  <div>Shadcn/UI base</div>
                  <div>12px border radius</div>
                  <div>Glass morphism effects</div>
                  <div>Subtle drop shadows</div>
                  <div>Smooth animations</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-pink-600">Accessibility</h4>
                <div className="space-y-2 text-sm">
                  <div>WCAG 2.1 AA compliant</div>
                  <div>44px+ touch targets</div>
                  <div>High contrast ratios</div>
                  <div>Keyboard navigation</div>
                  <div>Screen reader support</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SwarSetu Technology Highlight */}
        <Card className="mt-8 bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl">SwarSetu Sync Technology</CardTitle>
            <CardDescription className="text-center text-lg">
              Real-time synchronization that connects families across distances during devotional singing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="h-16 w-16 mx-auto mb-4 bg-orange-600 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Family Connect</h4>
                <p className="text-sm text-gray-600">Sync with family members across different locations in real-time</p>
              </div>
              <div>
                <div className="h-16 w-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Perfect Timing</h4>
                <p className="text-sm text-gray-600">Advanced sync ensures everyone starts and follows together</p>
              </div>
              <div>
                <div className="h-16 w-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl">🌍</div>
                </div>
                <h4 className="font-semibold mb-2">Global Sabha</h4>
                <p className="text-sm text-gray-600">Join public sabhas during festivals with devotees worldwide</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveShowcase;
