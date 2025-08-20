'use client';

import React, { useState, useEffect } from 'react';
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
  Star
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
  const [fontSize, setFontSize] = useState(18);
  const [nightMode, setNightMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contentLanguage, setContentLanguage] = useState<'hinglish' | 'marathi'>('hinglish');
  const [showScrollToTop, setShowScrollToTop] = useState(false);

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
    // Split by double line breaks for stanzas, then by single line breaks for lines
    const stanzas = lyrics.split('\\n\\n').filter(stanza => stanza.trim() !== '');
    
    return stanzas.map((stanza, stanzaIndex) => {
      const lines = stanza.split('\\n').filter(line => line.trim() !== '');
      
      // Detect if this stanza contains a refrain (chorus)
      const hasRefrain = lines.some(line => 
        line.includes('जय देव') || 
        line.includes('Jay Dev') || 
        line.includes('दर्शन') || 
        line.includes('Darshan')
      );
      
      // Split main stanza from refrain if both exist
      let mainLines: string[] = [];
      let refrainLines: string[] = [];
      
      if (hasRefrain && lines.length > 4) {
        // Typically first 4 lines are main stanza, rest is refrain
        mainLines = lines.slice(0, 4);
        refrainLines = lines.slice(4);
      } else {
        mainLines = lines;
      }
      
      return (
        <Card 
          key={stanzaIndex} 
          className={`transition-all duration-300 hover:shadow-lg ${
            nightMode 
              ? 'bg-gray-800 border-gray-600 hover:bg-gray-750' 
              : 'bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-orange-200 hover:border-orange-300'
          }`}
        >
          <CardContent className="p-8">
            {/* Stanza Number */}
            <div className="flex items-center mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                nightMode 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
              }`}>
                {stanzaIndex + 1}
              </div>
              <div className={`ml-4 h-px flex-1 ${
                nightMode ? 'bg-gradient-to-r from-gray-600 to-transparent' : 'bg-gradient-to-r from-orange-300 to-transparent'
              }`} />
            </div>
            
            {/* Main Stanza Lines */}
            <div className={`space-y-3 ${
              nightMode ? 'bg-gray-750 border-gray-600' : 'bg-white/60 border-orange-100'
            } rounded-lg p-6 border-l-4 ${
              nightMode ? 'border-l-orange-500' : 'border-l-orange-400'
            }`}>
              {mainLines.map((line, lineIndex) => (
                <div 
                  key={lineIndex} 
                  className={`transition-all duration-300 ${
                    contentLanguage === 'marathi' 
                      ? 'text-xl leading-relaxed font-serif' 
                      : 'text-lg leading-relaxed'
                  } ${
                    nightMode ? 'text-gray-100' : 'text-gray-800'
                  }`}
                  style={{ 
                    fontSize: `${fontSize + (contentLanguage === 'marathi' ? 6 : 4)}px`,
                    lineHeight: 1.8
                  }}
                >
                  {line.trim()}
                </div>
              ))}
            </div>

            {/* Refrain/Chorus Section */}
            {refrainLines.length > 0 && (
              <div className={`mt-6 space-y-3 ${
                nightMode ? 'bg-amber-900/20 border-amber-600/30' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
              } rounded-lg p-6 border-2 border-dashed relative`}>
                {/* Refrain Label */}
                <div className={`absolute -top-3 left-4 px-3 py-1 text-xs font-bold rounded-full ${
                  nightMode 
                    ? 'bg-amber-700 text-amber-100' 
                    : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white'
                } shadow-md`}>
                  {contentLanguage === 'marathi' ? 'टेक' : 'Refrain'}
                </div>
                
                {refrainLines.map((line, lineIndex) => (
                  <div 
                    key={lineIndex} 
                    className={`transition-all duration-300 text-center ${
                      contentLanguage === 'marathi' 
                        ? 'text-xl leading-relaxed font-serif font-semibold' 
                        : 'text-lg leading-relaxed font-semibold'
                    } ${
                      nightMode ? 'text-amber-200' : 'text-amber-800'
                    }`}
                    style={{ 
                      fontSize: `${fontSize + (contentLanguage === 'marathi' ? 6 : 4)}px`,
                      lineHeight: 1.8
                    }}
                  >
                    {line.trim()}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      );
    });
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
                          max={28}
                          min={14}
                          step={2}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>14px</span>
                          <span>28px</span>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Aarti Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-300 ${
            nightMode ? 'text-gray-100' : 'text-gray-900'
          } ${contentLanguage === 'marathi' ? 'font-serif' : ''}`}
          style={{ fontSize: `${fontSize + 12}px` }}>
            {aarti.title[contentLanguage]}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2 text-sm">
              {getDeityName(aarti.deity)}
            </Badge>
            <Badge variant="outline" className="capitalize px-4 py-2 text-sm">
              {aarti.difficulty}
            </Badge>
            {aarti.isPopular && (
              <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
                <Star className="h-4 w-4 mr-2" />
                Popular
              </Badge>
            )}
          </div>
        </div>

        {/* Aarti Stanzas */}
        <div className="space-y-8 mb-12">
          {formatLyrics(aarti.lyrics[contentLanguage])}
        </div>

        {/* Tags */}
        {aarti.tags.length > 0 && (
          <Card className={`transition-colors duration-300 ${
            nightMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white/60 backdrop-blur-sm border-orange-200'
          }`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${nightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {aarti.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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

export default AartiReaderPage;
