'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Save, X, Plus, Minus, Eye, EyeOff, Edit } from 'lucide-react';
import { AartiFormData, DEITY_OPTIONS, DIFFICULTY_OPTIONS, COMMON_TAGS, DeityType, DifficultyType } from '@/types/aarti';
import { createAarti, generateSlug } from '@/services/aartiService';

interface Stanza {
  id: string;
  hinglish: string;
  marathi: string;
}

const AartiUploadForm: React.FC = () => {
  const { t, isMarathi } = useLanguage();
  
  // Enhanced form data structure
  const [formData, setFormData] = useState<Omit<AartiFormData, 'lyrics'>>({
    deity: 'ganesha',
    title: { hinglish: '', marathi: '' },
    difficulty: 'easy',
    tags: [],
    isPopular: false,
    isActive: true,
  });

  const [stanzas, setStanzas] = useState<Stanza[]>([
    { id: '1', hinglish: '', marathi: '' }
  ]);

  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'hinglish' | 'marathi'>('hinglish');
  const [bulkText, setBulkText] = useState<{hinglish: string, marathi: string}>({
    hinglish: '',
    marathi: ''
  });
  const [showBulkInput, setShowBulkInput] = useState(true);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean | string[] | DeityType | DifficultyType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (lang: 'hinglish' | 'marathi', value: string) => {
    setFormData(prev => ({
      ...prev,
      title: { ...prev.title, [lang]: value }
    }));
  };

  // New stanza handlers
  const addStanza = () => {
    const newStanza: Stanza = {
      id: Date.now().toString(),
      hinglish: '',
      marathi: ''
    };
    setStanzas(prev => [...prev, newStanza]);
  };

  const removeStanza = (id: string) => {
    if (stanzas.length > 1) {
      setStanzas(prev => prev.filter(stanza => stanza.id !== id));
    }
  };

  const updateStanza = (id: string, lang: 'hinglish' | 'marathi', value: string) => {
    setStanzas(prev => 
      prev.map(stanza => 
        stanza.id === id 
          ? { ...stanza, [lang]: value }
          : stanza
      )
    );
  };

  // Convert stanzas to lyrics format for saving
  const stanzasToLyrics = () => {
    const hinglishLyrics = stanzas
      .map(stanza => stanza.hinglish.trim())
      .filter(content => content)
      .join('\\n\\n');
    
    const marathiLyrics = stanzas
      .map(stanza => stanza.marathi.trim())
      .filter(content => content)
      .join('\\n\\n');

    return {
      hinglish: hinglishLyrics,
      marathi: marathiLyrics
    };
  };

  // Auto-detect and split stanzas from bulk text
  const autoDetectStanzas = (text: string): string[] => {
    if (!text.trim()) return [];
    
    // Enhanced pattern detection for Sanskrit/Marathi aartis
    let stanzas: string[] = [];
    
    // Method 1: Split by traditional Sanskrit/Marathi stanza markers (॥)
    if (text.includes('॥')) {
      // First, clean the title if it exists
      let cleanText = text.replace(/^॥.*॥\s*/, '').trim(); // Remove title like "॥ श्री गणपतीची आरती ॥"
      
      stanzas = cleanText
        .split('॥')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      // For traditional aartis, keep stanza + refrain pairs together
      // Don't separate refrains - they belong with their preceding stanza
      const processedStanzas: string[] = [];
      
      for (let i = 0; i < stanzas.length; i += 2) {
        const mainStanza = stanzas[i];
        const refrain = stanzas[i + 1];
        
        if (mainStanza && refrain) {
          // Combine main stanza with its refrain
          processedStanzas.push(`${mainStanza}॥\n\n${refrain}॥`);
        } else if (mainStanza) {
          // Last stanza without refrain
          processedStanzas.push(`${mainStanza}॥`);
        }
      }
      
      stanzas = processedStanzas;
    }
    
    // Method 2: Split by double line breaks (backup method)
    if (stanzas.length === 0) {
      stanzas = text
        .split(/\n\s*\n+/) 
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }

    // Method 3: Intelligent line grouping (fallback)
    if (stanzas.length <= 1) {
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // For Sanskrit/Marathi aartis, typically 4 lines per stanza
      if (lines.length >= 4) {
        stanzas = [];
        const linesPerStanza = 4; // Standard for most aartis
        
        for (let i = 0; i < lines.length; i += linesPerStanza) {
          const stanzaLines = lines.slice(i, i + linesPerStanza);
          if (stanzaLines.length >= 2) { // Minimum 2 lines for a stanza
            stanzas.push(stanzaLines.join('\n'));
          }
        }
      }
    }

    return stanzas;
  };

  // Parse bulk text and convert to individual stanzas - Enhanced for both languages
  const parseBulkText = () => {
    const hinglishStanzas = autoDetectStanzas(bulkText.hinglish);
    const marathiStanzas = autoDetectStanzas(bulkText.marathi);
    
    if (hinglishStanzas.length === 0 && marathiStanzas.length === 0) {
      toast.error("Please enter text in at least one language!");
      return;
    }

    // Determine the maximum number of stanzas from either language
    const maxStanzas = Math.max(hinglishStanzas.length, marathiStanzas.length);
    const newStanzas: Stanza[] = [];

    for (let i = 0; i < maxStanzas; i++) {
      newStanzas.push({
        id: `${Date.now()}_${i}`,
        hinglish: hinglishStanzas[i] || '',
        marathi: marathiStanzas[i] || ''
      });
    }

    // Replace existing stanzas
    setStanzas(newStanzas);

    // Show success message
    const hinglishCount = hinglishStanzas.length;
    const marathiCount = marathiStanzas.length;
    const detectionMethod = (bulkText.hinglish.includes('॥') || bulkText.marathi.includes('॥')) ? '॥ markers' : 'line patterns';
    
    toast.success(`🎯 Auto-detected stanzas: ${hinglishCount} Hinglish + ${marathiCount} Marathi using ${detectionMethod}!`);
    
    // Clear bulk text and hide bulk input
    setBulkText({ hinglish: '', marathi: '' });
    setShowBulkInput(false);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim().toLowerCase());
      setCustomTag('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.hinglish.trim()) {
      toast.error("Validation Error: Hinglish title is required");
      return false;
    }

    if (!formData.title.marathi.trim()) {
      toast.error("Validation Error: Marathi title is required");
      return false;
    }

    // Validate stanzas
    const validStanzas = stanzas.filter(stanza => 
      stanza.hinglish.trim() && stanza.marathi.trim()
    );

    if (validStanzas.length === 0) {
      toast.error("Validation Error: At least one complete stanza (both languages) is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const lyrics = stanzasToLyrics();
      const completeFormData: AartiFormData = {
        ...formData,
        lyrics
      };

      const aartiId = await createAarti(completeFormData);
      
      toast.success(`Aarti "${formData.title.hinglish}" uploaded successfully!`);

      // Reset form
      setFormData({
        deity: 'ganesha',
        title: { hinglish: '', marathi: '' },
        difficulty: 'easy',
        tags: [],
        isPopular: false,
        isActive: true,
      });
      setStanzas([{ id: '1', hinglish: '', marathi: '' }]);

      console.log('✅ Aarti uploaded successfully with ID:', aartiId);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast.error("Upload Failed: Failed to upload aarti. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewSlug = formData.title.hinglish ? generateSlug(formData.title.hinglish) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg">
            <CardTitle className={`text-2xl flex items-center gap-2 ${isMarathi ? 'font-serif' : ''}`}>
              <Upload className="h-6 w-6" />
              {isMarathi ? 'आरती अपलोड करा' : 'Upload New Aarti'}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Deity Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  {isMarathi ? 'देवता निवडा' : 'Select Deity'}
                </Label>
                <Select value={formData.deity} onValueChange={(value: DeityType) => handleInputChange('deity', value)}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEITY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          {option.label}
                          <span className="text-orange-600 font-serif">({option.labelMarathi})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    {isMarathi ? 'शीर्षक (हिंग्लिश)' : 'Title (Hinglish)'}
                  </Label>
                  <Input
                    value={formData.title.hinglish}
                    onChange={(e) => handleTitleChange('hinglish', e.target.value)}
                    placeholder="e.g., Sukhkarta Dukhharta"
                    className="border-orange-200 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    {isMarathi ? 'शीर्षक (मराठी)' : 'Title (Marathi)'}
                  </Label>
                  <Input
                    value={formData.title.marathi}
                    onChange={(e) => handleTitleChange('marathi', e.target.value)}
                    placeholder="सुखकर्ता दुःखहर्ता"
                    className="border-orange-200 focus:border-orange-500 font-serif"
                    required
                  />
                </div>
              </div>

              {/* Slug Preview */}
              {previewSlug && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Label className="text-xs text-orange-600 font-semibold">URL Slug (auto-generated):</Label>
                  <p className="text-sm text-orange-800 font-mono">{previewSlug}</p>
                </div>
              )}

              {/* Auto-Detection Bulk Input */}
              {showBulkInput && (
                <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                          <Upload className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                            🎯 {isMarathi ? 'स्मार्ट ऑटो-डिटेक्शन' : 'Smart Auto-Detection'}
                          </CardTitle>
                          <p className="text-sm text-blue-600 mt-1">
                            {isMarathi ? 'दोन्ही भाषांमध्ये आरती पेस्ट करा, आम्ही आपोआप श्लोक विभाजित करू!' : 'Paste aarti in both languages, we\'ll auto-split into stanzas!'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBulkInput(false)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Hinglish Input */}
                      <div className="space-y-3">
                        <Label className="text-sm font-bold text-blue-700 flex items-center space-x-2">
                          <span className="p-1 bg-blue-100 rounded text-xs">EN</span>
                          <span>Hinglish - Complete Text</span>
                        </Label>
                        <Textarea
                          value={bulkText.hinglish}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkText(prev => ({ ...prev, hinglish: e.target.value }))}
                          placeholder={`Paste complete aarti in Hinglish here...

Example:
Sukhkarta Dukhaharta Varta Vighnachi
Nurvikar Nirvikalpa Agadhachi

Sarvangi Sundar Shendurarangi
Ratnasinghasana Rajitangi

Jay Dev Jay Dev Jay Mangalmurti
Darshan Matre Man Kamana Purti`}
                          className="border-2 border-blue-200 focus:border-blue-500 min-h-[180px] resize-y bg-white/80 backdrop-blur-sm rounded-lg shadow-sm transition-all duration-200"
                          rows={8}
                        />
                      </div>

                      {/* Marathi Input */}
                      <div className="space-y-3">
                        <Label className="text-sm font-bold text-purple-700 flex items-center space-x-2">
                          <span className="p-1 bg-purple-100 rounded text-xs font-serif">मर</span>
                          <span>Marathi - संपूर्ण मजकूर</span>
                        </Label>
                        <Textarea
                          value={bulkText.marathi}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkText(prev => ({ ...prev, marathi: e.target.value }))}
                          placeholder={`संपूर्ण आरती मराठीत इथे पेस्ट करा...

उदाहरण (॥ चिन्हाने श्लोक विभक्त करा):
सुखकर्ता दुःखहर्ता वार्ता विघ्नाची।
नुरवी पुरवी प्रेम कृपा जयाची।
सर्वांगी सुन्दर उटि शेंदुराची।
कण्ठी झळके माळ मुक्ताफळांची॥

जय देव जय देव जय मंगलमूर्ति।
दर्शनमात्रे मनकामना पुरती॥`}
                          className="border-2 border-purple-200 focus:border-purple-500 min-h-[180px] resize-y font-serif bg-white/80 backdrop-blur-sm rounded-lg shadow-sm transition-all duration-200"
                          rows={8}
                        />
                      </div>
                    </div>

                    {/* Single Auto-Detect Button */}
                    <div className="flex flex-col items-center space-y-3 pt-4 border-t border-gradient-to-r from-blue-200 to-purple-200">
                      <Button
                        type="button"
                        onClick={parseBulkText}
                        disabled={!bulkText.hinglish.trim() && !bulkText.marathi.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        size="lg"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        🎯 {isMarathi ? 'दोन्ही भाषा ऑटो-डिटेक्ट करा' : 'Auto-Detect Both Languages'}
                      </Button>
                      
                      <p className="text-xs text-center text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                        💡 {isMarathi ? 'टिप: ॥ चिन्ह वापरा किंवा दुहेरी लाइन ब्रेकने श्लोक विभक्त करा' : 'Tip: Use ॥ markers or double line breaks to separate stanzas'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!showBulkInput && (
                <div className="flex justify-center mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBulkInput(true)}
                    className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100 hover:border-blue-400 font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
                    size="lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    🎯 {isMarathi ? 'स्मार्ट ऑटो-डिटेक्शन वापरा' : 'Use Smart Auto-Detection'}
                  </Button>
                </div>
              )}

              {/* Stanza-by-Stanza Input */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-xl font-bold text-orange-800">
                        ✏️ {isMarathi ? 'मॅन्युअल आरती श्लोक' : 'Manual Aarti Stanzas'}
                      </Label>
                      <p className="text-sm text-orange-600 mt-1">
                        {isMarathi ? 'प्रत्येक श्लोक स्वतंत्रपणे संपादित करा किंवा फाईन-ट्यून करा' : 'Edit each stanza individually or fine-tune auto-detected content'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="border-orange-200 hover:border-orange-300"
                    >
                      {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveLanguage(activeLanguage === 'hinglish' ? 'marathi' : 'hinglish')}
                      className="border-orange-200 hover:border-orange-300"
                    >
                      {activeLanguage === 'hinglish' ? '🅷' : 'म'}
                    </Button>
                    {stanzas.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setStanzas([{ id: '1', hinglish: '', marathi: '' }]);
                          setShowBulkInput(true);
                          toast.info('🔄 Reset to start fresh!');
                        }}
                        className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
                      >
                        🔄 Reset
                      </Button>
                    )}
                  </div>
                </div>

                {previewMode ? (
                  /* Preview Mode */
                  <div className="space-y-4">
                    {stanzas.map((stanza, index) => (
                      <Card key={stanza.id} className="bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-orange-200">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="ml-3 h-px flex-1 bg-orange-200" />
                          </div>
                          <div className="space-y-3">
                            {stanza.hinglish && (
                              <div className="text-lg leading-relaxed text-gray-800">
                                {stanza.hinglish.split('\n').map((line, i) => (
                                  <div key={i}>{line}</div>
                                ))}
                              </div>
                            )}
                            {stanza.marathi && (
                              <div className="text-xl leading-relaxed font-serif text-gray-800 mt-3 pt-3 border-t border-orange-200">
                                {stanza.marathi.split('\n').map((line, i) => (
                                  <div key={i}>{line}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="space-y-4">
                    {stanzas.map((stanza, index) => (
                      <Card key={stanza.id} className="border-orange-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-orange-700">
                              {isMarathi ? `श्लोक ${index + 1}` : `Stanza ${index + 1}`}
                            </CardTitle>
                            <div className="flex space-x-2">
                              {stanzas.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeStanza(stanza.id)}
                                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-700">
                                Hinglish
                              </Label>
                              <Textarea
                                value={stanza.hinglish}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateStanza(stanza.id, 'hinglish', e.target.value)}
                                placeholder="Enter stanza in Hinglish..."
                                className="border-orange-200 focus:border-orange-500 min-h-[120px] resize-y"
                                rows={4}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-700">
                                Marathi (मराठी)
                              </Label>
                              <Textarea
                                value={stanza.marathi}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateStanza(stanza.id, 'marathi', e.target.value)}
                                placeholder="श्लोक मराठीत टाका..."
                                className="border-orange-200 focus:border-orange-500 min-h-[120px] resize-y font-serif"
                                rows={4}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Add Stanza Button */}
                    <Card className="border-2 border-dashed border-orange-300 hover:border-orange-400 transition-colors">
                      <CardContent className="p-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addStanza}
                          className="w-full border-orange-200 hover:border-orange-300 text-orange-600 hover:text-orange-700"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          {isMarathi ? 'नवा श्लोक जोडा' : 'Add New Stanza'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  {isMarathi ? 'कठिणता' : 'Difficulty'}
                </Label>
                <Select value={formData.difficulty} onValueChange={(value: DifficultyType) => handleInputChange('difficulty', value)}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          {option.label}
                          <span className="text-orange-600 font-serif">({option.labelMarathi})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  {isMarathi ? 'टॅग' : 'Tags'}
                </Label>
                
                {/* Common Tags */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">{isMarathi ? 'सामान्य टॅग:' : 'Common Tags:'}</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map(tag => (
                      <Badge
                        key={tag}
                        variant={formData.tags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          formData.tags.includes(tag) 
                            ? 'bg-orange-600 hover:bg-orange-700' 
                            : 'border-orange-200 hover:bg-orange-50'
                        }`}
                        onClick={() => formData.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Custom Tag Input */}
                <div className="flex gap-2">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder={isMarathi ? 'कस्टम टॅग जोडा' : 'Add custom tag'}
                    className="border-orange-200 focus:border-orange-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  />
                  <Button type="button" onClick={addCustomTag} size="sm" variant="outline" className="border-orange-200">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected Tags */}
                {formData.tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">{isMarathi ? 'निवडलेले टॅग:' : 'Selected Tags:'}</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} className="bg-orange-600 text-white">
                          {tag}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer hover:bg-orange-700 rounded-full" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked: boolean) => handleInputChange('isPopular', checked)}
                  />
                  <Label htmlFor="isPopular" className="text-sm font-medium text-gray-700 cursor-pointer">
                    {isMarathi ? 'लोकप्रिय आरती म्हणून चिन्हांकित करा' : 'Mark as Popular Aarti'}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked: boolean) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                    {isMarathi ? 'सक्रिय करा' : 'Make Active'}
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isMarathi ? 'अपलोड करत आहे...' : 'Uploading...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isMarathi ? 'आरती अपलोड करा' : 'Upload Aarti'}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AartiUploadForm;
