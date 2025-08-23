'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Maximize,
  ArrowUp,
  Copy,
  MessageCircle,
  Star,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Aarti } from '@/types/aarti';
import { getAartiById, getAartiBySlug } from '@/services/aartiService';

const AartiReaderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const [aarti, setAarti] = useState<Aarti | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reader settings
  const [fontSize, setFontSize] = useState(16);
  const [nightMode, setNightMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contentLanguage, setContentLanguage] = useState<'hinglish' | 'marathi'>('hinglish');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Auto-scroll settings
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [currentStanza, setCurrentStanza] = useState(0);

  // Get aarti ID/slug from URL params
  const aartiId = searchParams.get('id');
  const aartiSlug = searchParams.get('slug');
  const deityFilter = searchParams.get('deity');

  useEffect(() => {
    const fetchAarti = async () => {
      try {
        setLoading(true);
        let fetchedAarti: Aarti | null = null;

        if (aartiSlug) {
          fetchedAarti = await getAartiBySlug(aartiSlug);
        } else if (aartiId) {
          fetchedAarti = await getAartiById(aartiId);
        }

        if (fetchedAarti) {
          setAarti(fetchedAarti);
        } else {
          setError('Aarti not found');
        }
      } catch (err) {
        console.error('Error fetching aarti:', err);
        setError('Failed to load aarti');
      } finally {
        setLoading(false);
      }
    };

    if (aartiId || aartiSlug) {
      fetchAarti();
    } else {
      setError('No aarti specified');
      setLoading(false);
    }
  }, [aartiId, aartiSlug]);

  // Handle scroll for "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem('aarti-reader-font-size');
    const savedNightMode = localStorage.getItem('aarti-reader-night-mode');
    const savedContentLang = localStorage.getItem('aarti-reader-content-language');

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedNightMode) setNightMode(JSON.parse(savedNightMode));
    if (savedContentLang) setContentLanguage(savedContentLang as 'hinglish' | 'marathi');
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || !aarti) return;

    const stanzas = aarti.lyrics[contentLanguage].split('\\n\\n').filter(s => s.trim() !== '');
    if (currentStanza >= stanzas.length) {
      setAutoScroll(false);
      setCurrentStanza(0);
      return;
    }

    const scrollToStanza = () => {
      const stanzaElement = document.getElementById(`stanza-${currentStanza}`);
      if (stanzaElement) {
        stanzaElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    };

    const timer = setTimeout(() => {
      scrollToStanza();
      setCurrentStanza(prev => prev + 1);
    }, 8000 / scrollSpeed); // Base 8 seconds per stanza

    return () => clearTimeout(timer);
  }, [autoScroll, currentStanza, scrollSpeed, aarti, contentLanguage]);

  const toggleAutoScroll = () => {
    if (autoScroll) {
      setAutoScroll(false);
      setCurrentStanza(0);
    } else {
      setAutoScroll(true);
      setCurrentStanza(0);
    }
  };

  const resetAutoScroll = () => {
    setAutoScroll(false);
    setCurrentStanza(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFontSizeChange = (size: number[]) => {
    const newSize = size[0];
    setFontSize(newSize);
    localStorage.setItem('aarti-reader-font-size', newSize.toString());
  };

  const handleNightModeToggle = (enabled: boolean) => {
    setNightMode(enabled);
    localStorage.setItem('aarti-reader-night-mode', JSON.stringify(enabled));
  };

  const handleContentLanguageToggle = () => {
    const newLang = contentLanguage === 'hinglish' ? 'marathi' : 'hinglish';
    setContentLanguage(newLang);
    localStorage.setItem('aarti-reader-content-language', newLang);
  };

  const handleShare = () => {
    if (navigator.share && aarti) {
      navigator.share({
        title: aarti.title[contentLanguage],
        text: `Check out this beautiful aarti: ${aarti.title[contentLanguage]}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    if (aarti) {
      const text = `🕉️ ${aarti.title[contentLanguage]}\\n\\nRead this beautiful aarti on Aarti Sabha:\\n${window.location.href}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const getDeityName = (deityId: string) => {
    const deityMap: Record<string, string> = {
      ganesha: t.deities?.ganesha || 'Ganesha',
      krishna: t.deities?.krishna || 'Krishna',
      shiva: t.deities?.shiva || 'Shiva',
      durga: t.deities?.durga || 'Durga',
      rama: t.deities?.rama || 'Rama',
      hanuman: t.deities?.hanuman || 'Hanuman',
      lakshmi: t.deities?.lakshmi || 'Lakshmi',
      saraswati: t.deities?.saraswati || 'Saraswati',
    };
    return deityMap[deityId] || deityId;
  };

  const formatLyrics = (lyrics: string) => {
    // Split by double line breaks for stanzas
    const stanzas = lyrics.split('\\n\\n').filter(stanza => stanza.trim() !== '');
    
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4">
        {stanzas.map((stanza, stanzaIndex) => {
          const lines = stanza.split('\\n').filter(line => line.trim() !== '');
          
          return (
            <div 
              id={`stanza-${stanzaIndex}`}
              key={stanzaIndex} 
              className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg transition-all duration-500 ${
                currentStanza === stanzaIndex && autoScroll
                  ? nightMode 
                    ? 'bg-orange-900/20 ring-2 ring-orange-400/30' 
                    : 'bg-orange-50 ring-2 ring-orange-300/50'
                  : nightMode 
                    ? 'hover:bg-gray-800/10' 
                    : 'hover:bg-orange-25'
              }`}
            >
              {/* Traditional Stanza Header with Indian Design */}
              <div className="flex items-center justify-center mb-4">
                <div className={`flex items-center space-x-3 ${
                  nightMode ? 'text-orange-300' : 'text-orange-600'
                }`}>
                  {/* Left Om Symbol */}
                  <span className="text-lg sm:text-xl">॥</span>
                  
                  {/* Stanza Number */}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    nightMode 
                      ? 'bg-orange-900/30 text-orange-200' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {stanzaIndex + 1}
                  </span>
                  
                  {/* Right Om Symbol */}
                  <span className="text-lg sm:text-xl">॥</span>
                </div>
              </div>
              
              {/* Traditional Stanza Layout - Compact and Clean */}
              <div className="space-y-2 sm:space-y-3">
                {lines.map((line, lineIndex) => (
                  <div 
                    key={lineIndex} 
                    className={`text-center transition-colors duration-300 ${
                      contentLanguage === 'marathi' 
                        ? 'font-serif tracking-wide' 
                        : 'font-barlow font-medium tracking-wide'
                    } ${
                      nightMode 
                        ? 'text-gray-100' 
                        : 'text-gray-800'
                    }`}
                    style={{ 
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.6,
                      letterSpacing: '0.02em'
                    }}
                  >
                    {line.trim()}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Traditional Closing */}
        <div className="text-center mt-8 mb-4">
          <div className={`text-2xl sm:text-3xl ${
            nightMode ? 'text-orange-300' : 'text-orange-600'
          }`}>
            ॥ श्री हरि ॥
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${nightMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 to-amber-50'}`}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            
            {/* Title and metadata skeleton */}
            <div className="text-center space-y-4 mb-8">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              
              <div className="flex flex-wrap justify-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Settings bar skeleton */}
          <div className="flex items-center justify-between mb-8 p-4 bg-white/80 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          
          {/* Content skeleton */}
          <Card className="bg-white/90 border-orange-200 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Stanza skeletons */}
                {[1, 2, 3, 4].map((stanza) => (
                  <div key={stanza} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-100">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-5/6" />
                      <Skeleton className="h-5 w-4/6" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                ))}
                
                {/* Tags skeleton */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((tag) => (
                      <Skeleton key={tag} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !aarti) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${nightMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 to-amber-50'}`}>
        <div className="text-center">
          <p className={`text-xl mb-4 ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>{error || 'Aarti not found'}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      nightMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-b from-orange-50 to-amber-50 text-gray-900'
    }`}>
      {/* Header */}
      {!fullscreen && (
        <header className={`sticky top-0 z-50 backdrop-blur-lg transition-colors duration-300 ${
          nightMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-orange-200'
        } border-b`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Back to {deityFilter ? getDeityName(deityFilter) : 'Browse'} Aartis
                  </span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {/* Content Language Toggle */}
                <div className="hidden sm:flex items-center gap-2 mr-4">
                  <Button
                    variant={contentLanguage === 'hinglish' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContentLanguage('hinglish')}
                    className="text-xs"
                  >
                    English
                  </Button>
                  <Button
                    variant={contentLanguage === 'marathi' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContentLanguage('marathi')}
                    className="text-xs"
                  >
                    मराठी
                  </Button>
                </div>

                {/* Mobile Language Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContentLanguageToggle}
                  className="sm:hidden"
                >
                  {contentLanguage === 'hinglish' ? 'EN' : 'मर'}
                </Button>

                {/* Settings Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
                    <SheetHeader>
                      <SheetTitle className={nightMode ? 'text-gray-100' : ''}>Reading Settings</SheetTitle>
                      <SheetDescription className={nightMode ? 'text-gray-300' : ''}>
                        Customize your reading experience
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6 mt-6">
                      <div>
                        <label className={`text-sm font-medium ${nightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Font Size: {fontSize}px
                        </label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={handleFontSizeChange}
                          max={24}
                          min={12}
                          step={1}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>12px</span>
                          <span>24px</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${nightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Night Mode
                        </label>
                        <Switch
                          checked={nightMode}
                          onCheckedChange={handleNightModeToggle}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${nightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Fullscreen Reading
                        </label>
                        <Switch
                          checked={fullscreen}
                          onCheckedChange={setFullscreen}
                        />
                      </div>

                      <div>
                        <label className={`text-sm font-medium ${nightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Content Language
                        </label>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant={contentLanguage === 'hinglish' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setContentLanguage('hinglish')}
                            className="flex-1"
                          >
                            English/Hinglish
                          </Button>
                          <Button
                            variant={contentLanguage === 'marathi' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setContentLanguage('marathi')}
                            className="flex-1"
                          >
                            मराठी
                          </Button>
                        </div>
                      </div>

                      {/* Auto-scroll Controls */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <label className={`text-sm font-medium ${nightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Auto-scroll Reading
                          </label>
                          <Switch
                            checked={autoScroll}
                            onCheckedChange={toggleAutoScroll}
                          />
                        </div>

                        {autoScroll && (
                          <div className="space-y-4">
                            <div>
                              <label className={`text-sm font-medium ${nightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Scroll Speed: {scrollSpeed}x
                              </label>
                              <Slider
                                value={[scrollSpeed]}
                                onValueChange={(value) => setScrollSpeed(value[0])}
                                max={3}
                                min={0.5}
                                step={0.5}
                                className="mt-2"
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0.5x (Slow)</span>
                                <span>3x (Fast)</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={resetAutoScroll}
                                className="flex-1"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Share Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
                    <DialogHeader>
                      <DialogTitle className={nightMode ? 'text-gray-100' : ''}>Share Aarti</DialogTitle>
                      <DialogDescription className={nightMode ? 'text-gray-300' : ''}>
                        Share this beautiful aarti with others
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Button 
                        onClick={handleWhatsAppShare} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Share on WhatsApp
                      </Button>
                      <Button 
                        onClick={handleShare} 
                        variant="outline" 
                        className="w-full"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content - Book-like Layout */}
      <main className={`min-h-screen transition-all duration-500 ${
        nightMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
          
          {/* Book-Style Header */}
          <div className={`text-center mb-12 sm:mb-20 relative ${
            nightMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {/* Decorative top border - responsive */}
            <div className={`flex justify-center mb-8 sm:mb-12 ${
              nightMode ? 'text-orange-300/50' : 'text-orange-500/50'
            }`}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 sm:w-20 h-0.5 bg-current rounded-full" />
                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-current" />
                <div className="w-8 sm:w-12 h-0.5 bg-current rounded-full" />
                <div className="text-2xl sm:text-3xl">॥</div>
                <div className="w-8 sm:w-12 h-0.5 bg-current rounded-full" />
                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-current" />
                <div className="w-12 sm:w-20 h-0.5 bg-current rounded-full" />
              </div>
            </div>
            
            {/* Main Title - Mobile Responsive */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 transition-all duration-300 px-2 ${
              contentLanguage === 'marathi' ? 'font-serif tracking-wider' : 'tracking-wide'
            }`}
            style={{ 
              fontSize: `clamp(${fontSize + 8}px, ${fontSize + 12}px + 2vw, ${fontSize + 20}px)`, 
              lineHeight: 1.1,
              textShadow: nightMode 
                ? '0 4px 8px rgba(0,0,0,0.8)' 
                : '0 4px 12px rgba(0,0,0,0.15)',
              letterSpacing: contentLanguage === 'marathi' ? '0.1em' : '0.05em'
            }}>
              {aarti.title[contentLanguage]}
            </h1>
            
            {/* Subtitle/Deity Information - Responsive */}
            <div className={`text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 px-2 ${
              nightMode ? 'text-orange-300' : 'text-orange-700'
            }`}>
              {contentLanguage === 'marathi' ? 'श्री' : 'Shri'} {getDeityName(aarti.deity)} {contentLanguage === 'marathi' ? 'आरती' : 'Aarti'}
            </div>

            {/* Decorative bottom border - responsive */}
            <div className={`flex justify-center ${
              nightMode ? 'text-orange-300/50' : 'text-orange-500/50'
            }`}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 sm:w-20 h-0.5 bg-current rounded-full" />
                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-current" />
                <div className="w-8 sm:w-12 h-0.5 bg-current rounded-full" />
                <div className="text-2xl sm:text-3xl">॥</div>
                <div className="w-8 sm:w-12 h-0.5 bg-current rounded-full" />
                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-current" />
                <div className="w-12 sm:w-20 h-0.5 bg-current rounded-full" />
              </div>
            </div>
          </div>

          {/* Aarti Content */}
          <div className="mb-12 sm:mb-16">
            {formatLyrics(aarti.lyrics[contentLanguage])}
          </div>

          {/* Metadata moved to footer - Clean display */}
          <div className={`text-center pt-8 sm:pt-12 border-t ${
            nightMode ? 'border-gray-700' : 'border-orange-200'
          }`}>
            <div className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-2xl backdrop-blur-sm border mb-6 ${
              nightMode 
                ? 'bg-gray-800/50 border-gray-600/40' 
                : 'bg-white/60 border-orange-200/60'
            }`}>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <div className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border ${
                  nightMode 
                    ? 'bg-orange-900/30 border-orange-600/40 text-orange-300' 
                    : 'bg-orange-100/80 border-orange-300/60 text-orange-800'
                }`}>
                  📿 {getDeityName(aarti.deity)}
                </div>
                <div className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium capitalize backdrop-blur-sm border ${
                  nightMode 
                    ? 'bg-gray-800/50 border-gray-600/40 text-gray-300' 
                    : 'bg-white/80 border-gray-300/60 text-gray-700'
                }`}>
                  📊 {aarti.difficulty} level
                </div>
                {aarti.isPopular && (
                  <div className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border ${
                    nightMode 
                      ? 'bg-yellow-900/30 border-yellow-600/40 text-yellow-300' 
                      : 'bg-yellow-100/80 border-yellow-300/60 text-yellow-800'
                  }`}>
                    ⭐ Popular
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            {aarti.tags.length > 0 && (
              <div className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-2xl backdrop-blur-sm border ${
                nightMode 
                  ? 'bg-gray-800/50 border-gray-600/40' 
                  : 'bg-white/60 border-orange-200/60'
              }`}>
                <h3 className={`text-sm sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  nightMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {contentLanguage === 'marathi' ? 'संबंधित शब्द' : 'Related Terms'}
                </h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {aarti.tags.map((tag, index) => (
                    <span key={index} className={`px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full ${
                      nightMode 
                        ? 'bg-gray-700/50 text-gray-300 border border-gray-600/30' 
                        : 'bg-orange-100/60 text-orange-700 border border-orange-200/60'
                    }`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Actions */}
      {!fullscreen && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg transition-colors duration-300 ${
          nightMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-orange-200'
        } border-t`}>
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  onClick={toggleFavorite}
                  className={isFavorite ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline ml-1">
                    {isFavorite ? 'Favorited' : 'Favorite'}
                  </span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && !fullscreen && (
        <Button
          className="fixed bottom-20 right-6 rounded-full h-12 w-12 bg-orange-600 hover:bg-orange-700 text-white shadow-lg z-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Auto-scroll Control Button */}
      {!fullscreen && (
        <div className="fixed bottom-20 left-6 z-50">
          <Button
            className={`rounded-full h-12 w-12 shadow-lg transition-all duration-300 ${
              autoScroll
                ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse'
                : nightMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-orange-300 border-orange-400/30'
                  : 'bg-white hover:bg-orange-50 text-orange-600 border-orange-300 shadow-orange-200/50'
            }`}
            onClick={toggleAutoScroll}
            variant={autoScroll ? "default" : "outline"}
          >
            {autoScroll ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Fullscreen Mode Overlay */}
      {fullscreen && (
        <Button
          className="fixed top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
          onClick={() => setFullscreen(false)}
          variant="outline"
        >
          <Maximize className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  );
};

const AartiReaderPageWrapper = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <AartiReaderPage />
    </Suspense>
  );
};

export default AartiReaderPageWrapper;
