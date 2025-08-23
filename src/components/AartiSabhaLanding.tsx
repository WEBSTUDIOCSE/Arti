'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useLanguage } from '@/contexts/LanguageContext';
import AartiList from '@/components/AartiList';

const AartiSabhaLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t, language, setLanguage, isMarathi } = useLanguage();

  // Sample data with multilingual support
  const deities = [
    { 
      name: t.deities.ganesha, 
      icon: '🐘', 
      count: 25, 
      color: 'bg-orange-100 border-orange-200 hover:bg-orange-200',
      id: 'ganesha'
    },
    { 
      name: t.deities.krishna, 
      icon: '🪈', 
      count: 18, 
      color: 'bg-blue-100 border-blue-200 hover:bg-blue-200',
      id: 'krishna'
    },
    { 
      name: t.deities.shiva, 
      icon: '🔱', 
      count: 22, 
      color: 'bg-purple-100 border-purple-200 hover:bg-purple-200',
      id: 'shiva'
    },
    { 
      name: t.deities.durga, 
      icon: '🌺', 
      count: 15, 
      color: 'bg-pink-100 border-pink-200 hover:bg-pink-200',
      id: 'durga'
    },
    { 
      name: t.deities.rama, 
      icon: '🏹', 
      count: 12, 
      color: 'bg-green-100 border-green-200 hover:bg-green-200',
      id: 'rama'
    },
    { 
      name: t.deities.hanuman, 
      icon: '💪', 
      count: 20, 
      color: 'bg-red-100 border-red-200 hover:bg-red-200',
      id: 'hanuman'
    },
    { 
      name: t.deities.lakshmi, 
      icon: '🪷', 
      count: 14, 
      color: 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200',
      id: 'lakshmi'
    },
    { 
      name: t.deities.saraswati, 
      icon: '🎵', 
      count: 16, 
      color: 'bg-indigo-100 border-indigo-200 hover:bg-indigo-200',
      id: 'saraswati'
    },
  ];

  const popularAartis = [
    {
      title: isMarathi ? 'गणेश आरती' : 'Ganesha Aarti',
      deity: t.deities.ganesha,
      duration: '4:32',
      popularity: 95,
      language: isMarathi ? 'मराठी' : 'Marathi',
      singers: 1250,
      description: `${t.aarti.traditional} ${t.deities.ganesha}`
    },
    {
      title: isMarathi ? 'ॐ जै जगदीश हरे' : 'Om Jai Jagdish Hare',
      deity: isMarathi ? 'सर्वांसाठी' : 'Universal',
      duration: '6:15',
      popularity: 88,
      language: isMarathi ? 'संस्कृत' : 'Sanskrit',
      singers: 980,
      description: isMarathi ? 'सर्व देवतांसाठी सार्वत्रिक आरती' : 'Universal aarti for all deities'
    },
    {
      title: isMarathi ? 'शिव आरती' : 'Shiva Aarti',
      deity: t.deities.shiva,
      duration: '5:20',
      popularity: 82,
      language: isMarathi ? 'संस्कृत' : 'Sanskrit',
      singers: 750,
      description: `${t.aarti.sacred} ${t.deities.shiva}`
    },
    {
      title: isMarathi ? 'कृष्ण आरती' : 'Krishna Aarti',
      deity: t.deities.krishna,
      duration: '4:45',
      popularity: 90,
      language: isMarathi ? 'मराठी' : 'Marathi',
      singers: 890,
      description: `${t.aarti.devotional} ${t.deities.krishna}`
    },
  ];

  const quickFilters = [
    t.filters.popular,
    t.filters.recent,
    t.filters.favorites,
    t.filters.festivalSpecial
  ];

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
                <h1 className={`text-xl font-bold text-gray-900 ${isMarathi ? 'font-serif' : ''}`}>{t.header.title}</h1>
                <p className="text-xs text-gray-600">{t.header.tagline}</p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t.search.placeholder}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/60 border-amber-200 focus:border-orange-400"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                className="hover:bg-orange-50"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'en' ? 'मराठी' : 'English'}
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-orange-50">
                <Settings className="h-4 w-4" />
              </Button>
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
                placeholder={t.search.mobilePlaceholder}
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
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
              >
                <Globe className="h-4 w-4 mr-2" />
                {t.header.language}: {language === 'en' ? 'मराठी' : 'English'}
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                {t.header.settings}
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
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 ${isMarathi ? 'font-serif' : ''}`}>
              {t.hero.title} <span className="text-orange-600">{t.hero.titleHighlight}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
            
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                onClick={() => router.push('/create-session')}
              >
                <Users className="h-5 w-5 mr-2" />
                {t.hero.hostSabha}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8"
                onClick={() => router.push('/join')}
              >
                <Play className="h-5 w-5 mr-2" />
                {t.hero.joinSabha}
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push('/browse')}
              >
                {t.hero.browseAartis}
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
            <h3 className={`text-2xl font-bold text-gray-900 ${isMarathi ? 'font-serif' : ''}`}>{t.sections.browseByDeity}</h3>
            <Button 
              variant="ghost" 
              className="text-orange-600 hover:text-orange-700"
              onClick={() => router.push('/browse')}
            >
              {t.actions.viewAll}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {deities.map((deity) => (
              <Card 
                key={deity.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${deity.color} group`}
                onClick={() => router.push(`/browse?deity=${deity.id}`)}
              >
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{deity.icon}</div>
                  <h4 className={`font-semibold text-gray-900 mb-1 text-sm md:text-base ${isMarathi ? 'font-serif' : ''}`}>{deity.name}</h4>
                  <p className="text-xs md:text-sm text-gray-600">{deity.count} {t.deities.aartis}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Aartis Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold text-gray-900 ${isMarathi ? 'font-serif' : ''}`}>{t.sections.popularAartis}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                <Filter className="h-4 w-4 mr-2" />
                {t.actions.filter}
              </Button>
              <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                {t.actions.viewAll}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <AartiList filter="popular" limit={6} />
        </section>

        {/* SwarSetu Features Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold text-gray-900 mb-4 ${isMarathi ? 'font-serif' : ''}`}>{t.sections.swarSetuFeatures}</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isMarathi 
                ? 'वास्तविक वेळेत समक्रमण तंत्रज्ञान जे तुमच्या कुटुंबाला आरती दरम्यान जोडलेले ठेवते, तुम्ही जगात कुठेही असलात तरी.'
                : 'Real-time synchronization technology that keeps your family connected during aarti, no matter where you are in the world.'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-white/60 border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className={`font-semibold text-gray-900 mb-2 ${isMarathi ? 'font-serif' : ''}`}>{t.features.familyConnect.title}</h4>
                <p className="text-gray-600 text-sm">{t.features.familyConnect.description}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
                <h4 className={`font-semibold text-gray-900 mb-2 ${isMarathi ? 'font-serif' : ''}`}>{t.features.perfectTiming.title}</h4>
                <p className="text-gray-600 text-sm">{t.features.perfectTiming.description}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 border-amber-200 md:col-span-2 xl:col-span-1 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className={`font-semibold text-gray-900 mb-2 ${isMarathi ? 'font-serif' : ''}`}>{t.features.globalSabha.title}</h4>
                <p className="text-gray-600 text-sm">{t.features.globalSabha.description}</p>
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

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-amber-200">
        <div className="grid grid-cols-4 h-16">
          <Button 
            variant="ghost" 
            className="flex-col space-y-1 h-full"
            onClick={() => router.push('/browse')}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">{t.navigation.browse}</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-full">
            <Heart className="h-5 w-5" />
            <span className="text-xs">{t.navigation.favorites}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col space-y-1 h-full"
            onClick={() => router.push('/join')}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">{t.navigation.sabha}</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-full">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
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
              <DialogTitle className={isMarathi ? 'font-serif' : ''}>{t.dialog.startJoinSabha}</DialogTitle>
              <DialogDescription>
                {isMarathi 
                  ? 'समक्रमित आरती गायनासाठी कुटुंब आणि मित्रांशी जोडा'
                  : 'Connect with family and friends for synchronized aarti singing'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => router.push('/create-session')}
              >
                <Users className="h-4 w-4 mr-2" />
                {t.hero.hostSabha}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={() => router.push('/join')}
              >
                <Play className="h-4 w-4 mr-2" />
                {t.hero.joinSabha}
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
