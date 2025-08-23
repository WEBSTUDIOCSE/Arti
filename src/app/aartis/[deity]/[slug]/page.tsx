'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAartiBySlug } from '@/services/aartiService';
import { Aarti, DeityType, AartiStanza } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StanzaDisplay } from '@/components/StanzaDisplay';
import { parseLyricsIntoStanzas, estimateStanzaTiming } from '@/utils/stanzaParser';
import { 
  Heart, 
  Share2, 
  Download,
  Bookmark,
  Star,
  Users,
  RotateCcw,
  Languages,
  ChevronLeft,
  Copy,
  Check,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AartiDisplayPage() {
  const params = useParams();
  const { language, isMarathi } = useLanguage();
  const [aarti, setAarti] = useState<Aarti | null>(null);
  const [stanzas, setStanzas] = useState<AartiStanza[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoAdvance, setAutoAdvance] = useState(true);
  
  const deity = params?.deity as DeityType;
  const slug = params?.slug as string;

  useEffect(() => {
    const fetchAarti = async () => {
      try {
        setLoading(true);
        const fetchedAarti = await getAartiBySlug(slug);
        if (fetchedAarti) {
          setAarti(fetchedAarti);
          
          // Parse lyrics into stanzas
          const parsedStanzas = parseLyricsIntoStanzas(fetchedAarti.lyrics);
          setStanzas(parsedStanzas);
          
          // Reset to first stanza
          setCurrentStanzaIndex(0);
        }
      } catch (error) {
        console.error('Error fetching aarti:', error);
        toast.error('Failed to load aarti');
      } finally {
        setLoading(false);
      }
    };

    if (slug && deity) {
      fetchAarti();
    }
  }, [slug, deity]);

  // Auto-advance stanzas during playback
  useEffect(() => {
    if (isPlaying && autoAdvance && stanzas.length > 0) {
      const stanzaTiming = estimateStanzaTiming(stanzas, 240); // 4 minutes default
      const currentStanzaDuration = (stanzaTiming[currentStanzaIndex + 1] - stanzaTiming[currentStanzaIndex]) * 1000 / playbackSpeed;
      
      const timer = setTimeout(() => {
        if (currentStanzaIndex < stanzas.length - 1) {
          setCurrentStanzaIndex(prev => prev + 1);
        } else {
          setIsPlaying(false); // End of aarti
          setCurrentStanzaIndex(0); // Reset to beginning
        }
      }, currentStanzaDuration);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStanzaIndex, autoAdvance, stanzas, playbackSpeed]);

  const handleShare = async () => {
    try {
      if (navigator.share && aarti) {
        await navigator.share({
          title: isMarathi ? aarti.title.marathi : aarti.title.hinglish,
          text: `Check out this beautiful aarti: ${isMarathi ? aarti.title.marathi : aarti.title.hinglish}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const handleCopyAllLyrics = async () => {
    if (aarti) {
      const lyrics = isMarathi ? aarti.lyrics.marathi : aarti.lyrics.hinglish;
      const title = isMarathi ? aarti.title.marathi : aarti.title.hinglish;
      const textToCopy = `${title}\n\n${lyrics}`;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast.success('Complete aarti copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy aarti');
      }
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getDeityGradient = (deityType: DeityType) => {
    const gradients = {
      ganesha: 'from-orange-100 via-yellow-50 to-red-50',
      krishna: 'from-blue-100 via-indigo-50 to-purple-50',
      shiva: 'from-blue-100 via-gray-50 to-white',
      durga: 'from-red-100 via-pink-50 to-orange-50',
      rama: 'from-green-100 via-blue-50 to-teal-50',
      hanuman: 'from-orange-100 via-red-50 to-yellow-50',
      lakshmi: 'from-pink-100 via-rose-50 to-red-50',
      saraswati: 'from-white via-blue-50 to-indigo-50'
    };
    return gradients[deityType] || 'from-gray-100 via-gray-50 to-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!aarti) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Aarti not found</h1>
          <Link href="/browse">
            <Button>Browse Aartis</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getDeityGradient(aarti.deity)}`}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link href="/browse" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 p-2 rounded-xl hover:bg-white/20">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm sm:text-base">Back to Browse</span>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="glass-divine h-10 w-10 rounded-full border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300"
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleBookmark}
              className={`glass-divine h-10 w-10 rounded-full border-orange-200/50 hover:border-orange-300 transition-all duration-300 ${isBookmarked ? 'bg-orange-50 text-orange-600 border-orange-300' : 'hover:bg-orange-50/50'}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="glass-divine border-0 shadow-2xl mb-4 sm:mb-6 aarti-card-hover rounded-3xl overflow-hidden">
          <CardHeader className="text-center border-b border-orange-100/50 pb-6 px-4 sm:px-8 pt-6 sm:pt-8">
            {/* Deity Badge */}
            <div className="flex justify-center mb-4">
              <Badge 
                variant="secondary" 
                className="text-lg px-6 py-3 btn-spiritual text-white border-0 rounded-2xl shadow-lg"
              >
                {aarti.deity.charAt(0).toUpperCase() + aarti.deity.slice(1)}
              </Badge>
            </div>
            
            {/* Title */}
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 heading-cultural bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight animate-text-glow text-shadow-warm`} 
                style={{ fontSize: `${Math.max(fontSize + 12, 24)}px` }}>
              {isMarathi ? aarti.title.marathi : aarti.title.hinglish}
            </h1>

            {/* Subtitle in other language */}
            <p className="text-lg text-gray-600 mb-6 italic">
              {isMarathi ? aarti.title.hinglish : aarti.title.marathi}
            </p>

            {/* Tags and Stats */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge className={getDifficultyColor(aarti.difficulty)}>
                {aarti.difficulty.charAt(0).toUpperCase() + aarti.difficulty.slice(1)}
              </Badge>
              {aarti.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                  {tag}
                </Badge>
              ))}
              {aarti.isPopular && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Popular
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 px-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleLike}
                className={`glass-divine rounded-2xl px-6 py-3 border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:scale-105 ${isLiked ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border-red-200 shadow-lg' : 'hover:bg-orange-50/50'}`}
              >
                <Heart className={`h-5 w-5 mr-2 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleCopyAllLyrics}
                className="glass-divine rounded-2xl px-6 py-3 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy All
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="glass-divine rounded-2xl px-6 py-3 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Stanza Display Component */}
            <StanzaDisplay
              stanzas={stanzas}
              isPlaying={isPlaying}
              currentStanzaIndex={currentStanzaIndex}
              fontSize={fontSize}
              onStanzaChange={setCurrentStanzaIndex}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onFontSizeChange={setFontSize}
            />

            {/* Additional Actions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-orange-100/50">
              <Button variant="outline" className="glass-divine rounded-2xl px-4 py-2 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="glass-divine rounded-2xl px-4 py-2 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300">
                <Users className="h-4 w-4 mr-2" />
                Start Sabha
              </Button>
              <Button variant="outline" className="glass-divine rounded-2xl px-4 py-2 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300">
                <RotateCcw className="h-4 w-4 mr-2" />
                Practice Mode
              </Button>
              <Button 
                variant="outline" 
                className={`glass-divine rounded-2xl px-4 py-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300 ${autoAdvance ? 'bg-orange-50 text-orange-600 border-orange-300' : 'hover:bg-orange-50/50'}`}
                onClick={() => setAutoAdvance(!autoAdvance)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Auto-advance: {autoAdvance ? 'On' : 'Off'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Aartis */}
        <Card className="glass-divine border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="px-4 sm:px-6 py-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-orange-700">More {aarti.deity.charAt(0).toUpperCase() + aarti.deity.slice(1)} Aartis</h2>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Placeholder for related aartis */}
              <div className="p-4 bg-white/60 rounded-2xl border border-orange-100/50 hover:bg-white/80 hover:border-orange-200 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg">
                <h3 className="font-semibold text-orange-700 mb-2 text-sm sm:text-base">Aarti Ganpati Bappa Morya</h3>
                <p className="text-xs sm:text-sm text-gray-600">Traditional • Popular</p>
              </div>
              <div className="p-4 bg-white/60 rounded-2xl border border-orange-100/50 hover:bg-white/80 hover:border-orange-200 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg">
                <h3 className="font-semibold text-orange-700 mb-2 text-sm sm:text-base">Ganesh Chaturthi Special</h3>
                <p className="text-xs sm:text-sm text-gray-600">Festival • Medium</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
