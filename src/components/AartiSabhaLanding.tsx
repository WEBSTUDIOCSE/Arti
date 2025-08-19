'use client';

import React, { useState } from 'react';
import { Search, Menu, X, Play, Users, Star, Heart, Filter, ChevronRight, Globe, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BreakpointIndicator from './BreakpointIndicator';

const AartiSabhaLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const deities = [
    { name: 'Ganesha', icon: '🐘', count: 25, color: 'bg-orange-100 border-orange-200' },
    { name: 'Krishna', icon: '🪈', count: 18, color: 'bg-blue-100 border-blue-200' },
    { name: 'Shiva', icon: '🔱', count: 22, color: 'bg-purple-100 border-purple-200' },
    { name: 'Durga', icon: '🌺', count: 15, color: 'bg-pink-100 border-pink-200' },
    { name: 'Rama', icon: '🏹', count: 12, color: 'bg-green-100 border-green-200' },
    { name: 'Hanuman', icon: '💪', count: 20, color: 'bg-red-100 border-red-200' },
    { name: 'Lakshmi', icon: '🪷', count: 14, color: 'bg-yellow-100 border-yellow-200' },
    { name: 'Saraswati', icon: '🎵', count: 16, color: 'bg-indigo-100 border-indigo-200' },
  ];

  const popularAartis = [
    {
      title: 'Ganesha Aarti',
      deity: 'Ganesha',
      duration: '4:32',
      popularity: 95,
      language: 'Hindi',
      singers: 1250,
      description: 'Traditional aarti for Lord Ganesha'
    },
    {
      title: 'Om Jai Jagdish Hare',
      deity: 'Universal',
      duration: '6:15',
      popularity: 88,
      language: 'Hindi',
      singers: 980,
      description: 'Universal aarti for all deities'
    },
    {
      title: 'Shiva Aarti',
      deity: 'Shiva',
      duration: '5:20',
      popularity: 82,
      language: 'Sanskrit',
      singers: 750,
      description: 'Sacred aarti for Lord Shiva'
    },
    {
      title: 'Krishna Aarti',
      deity: 'Krishna',
      duration: '4:45',
      popularity: 90,
      language: 'Hindi',
      singers: 890,
      description: 'Devotional aarti for Lord Krishna'
    },
  ];

  const quickFilters = ['Popular', 'Recent', 'Favorites', 'Festival Special'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Breakpoint Indicator */}
      <BreakpointIndicator />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-amber-200 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white text-xl font-bold">
                🕉️
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Aarti Sabha</h1>
                <p className="text-xs text-gray-600">Digital Aarti Book & Sabha Companion</p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search aartis, deities, or festivals..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/60 border-amber-200 focus:border-orange-400"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                हिंदी
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search aartis..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 border-amber-200"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-amber-200 bg-white/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Language: हिंदी
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Experience Divine <span className="text-orange-600">Harmony</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Connect with family across distances through synchronized aarti singing with SwarSetu technology
            </p>
            
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                <Users className="h-5 w-5 mr-2" />
                Host Sabha
              </Button>
              <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8">
                <Play className="h-5 w-5 mr-2" />
                Join Sabha
              </Button>
              <Button size="lg" variant="ghost" className="text-gray-600 hover:text-gray-900">
                Browse Aartis
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {quickFilters.map((filter) => (
              <Badge
                key={filter}
                variant="outline"
                className="cursor-pointer hover:bg-orange-100 border-orange-200 text-orange-700 px-4 py-2"
              >
                {filter}
              </Badge>
            ))}
          </div>
        </section>

        {/* Deity Browse Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Browse by Deity</h3>
            <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {deities.map((deity) => (
              <Card key={deity.name} className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${deity.color}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{deity.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{deity.name}</h4>
                  <p className="text-sm text-gray-600">{deity.count} aartis</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Aartis Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Popular Aartis</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularAartis.map((aarti, index) => (
              <Card key={index} className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/60 border-amber-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">{aarti.title}</CardTitle>
                      <CardDescription className="text-gray-600">{aarti.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-orange-200 text-orange-700">
                      {aarti.deity}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{aarti.popularity}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Duration: {aarti.duration}</span>
                    <span>{aarti.language}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{aarti.singers} singers</span>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SwarSetu Features Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">SwarSetu Sync Technology</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real-time synchronization technology that keeps your family connected during aarti, 
              no matter where you are in the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/60 border-amber-200">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Family Connect</h4>
                <p className="text-gray-600 text-sm">Sync with family members across different locations in real-time</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 border-amber-200">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Perfect Timing</h4>
                <p className="text-gray-600 text-sm">Advanced sync ensures everyone starts and follows together</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 border-amber-200 md:col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Global Sabha</h4>
                <p className="text-gray-600 text-sm">Join public sabhas during festivals with devotees worldwide</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Responsive Tabs Section */}
        <section className="mb-12">
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white/60 border border-amber-200">
              <TabsTrigger value="trending" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Trending
              </TabsTrigger>
              <TabsTrigger value="festivals" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Festivals
              </TabsTrigger>
              <TabsTrigger value="regional" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Regional
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {popularAartis.slice(0, 4).map((aarti, index) => (
                  <Card key={index} className="bg-white/60 border-amber-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{aarti.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{aarti.deity} • {aarti.duration}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{aarti.language}</Badge>
                            <span className="text-xs text-gray-500">{aarti.singers} active</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="festivals" className="mt-6">
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Festival Aartis</h4>
                <p className="text-gray-600">Special collections for Ganesh Chaturthi, Navratri, and more</p>
              </div>
            </TabsContent>
            
            <TabsContent value="regional" className="mt-6">
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Regional Collections</h4>
                <p className="text-gray-600">Aartis in different regional languages and styles</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Desktop Sidebar (Only visible on large screens) */}
      <aside className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 w-80">
        <Card className="bg-white/80 backdrop-blur-lg border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              <Users className="h-4 w-4 mr-2" />
              Host New Sabha
            </Button>
            <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
              <Search className="h-4 w-4 mr-2" />
              Find Sabha
            </Button>
            
            <div className="pt-4 border-t border-amber-200">
              <h5 className="font-semibold text-gray-900 mb-3">Active Sabhas</h5>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                    <span className="text-sm text-gray-700">Ganesha Sabha</span>
                    <Badge className="bg-green-600 text-white text-xs">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="text-sm text-gray-700">Family Circle</span>
                    <Badge variant="outline" className="text-xs">12 members</Badge>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-amber-200">
        <div className="grid grid-cols-4 h-16">
          <Button variant="ghost" className="flex-col space-y-1 h-full">
            <Search className="h-5 w-5" />
            <span className="text-xs">Browse</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-full">
            <Heart className="h-5 w-5" />
            <span className="text-xs">Favorites</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-full">
            <Users className="h-5 w-5" />
            <span className="text-xs">Sabha</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-full">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>

      {/* Floating Action Button for Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-20 right-6 z-40">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full h-14 w-14 bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
              <Users className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Start or Join Sabha</DialogTitle>
              <DialogDescription>
                Connect with family and friends for synchronized aarti singing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Users className="h-4 w-4 mr-2" />
                Host New Sabha
              </Button>
              <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
                <Play className="h-4 w-4 mr-2" />
                Join with Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
};

export default AartiSabhaLanding;
