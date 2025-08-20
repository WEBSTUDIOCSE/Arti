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
import { Upload, Save, X, Plus } from 'lucide-react';
import { AartiFormData, DEITY_OPTIONS, DIFFICULTY_OPTIONS, COMMON_TAGS, DeityType, DifficultyType } from '@/types/aarti';
import { createAarti, generateSlug } from '@/services/aartiService';

const AartiUploadForm: React.FC = () => {
  const { t, isMarathi } = useLanguage();
  
  const [formData, setFormData] = useState<AartiFormData>({
    deity: 'ganesha',
    title: { hinglish: '', marathi: '' },
    lyrics: { hinglish: '', marathi: '' },
    duration: 0,
    difficulty: 'easy',
    tags: [],
    isPopular: false,
    isActive: true,
  });

  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof AartiFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (lang: 'hinglish' | 'marathi', value: string) => {
    setFormData(prev => ({
      ...prev,
      title: { ...prev.title, [lang]: value }
    }));
  };

  const handleLyricsChange = (lang: 'hinglish' | 'marathi', value: string) => {
    setFormData(prev => ({
      ...prev,
      lyrics: { ...prev.lyrics, [lang]: value }
    }));
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

    if (!formData.lyrics.hinglish.trim()) {
      toast.error("Validation Error: Hinglish lyrics are required");
      return false;
    }

    if (!formData.lyrics.marathi.trim()) {
      toast.error("Validation Error: Marathi lyrics are required");
      return false;
    }

    if (formData.duration <= 0) {
      toast.error("Validation Error: Duration must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const aartiId = await createAarti(formData);
      
      toast.success(`Aarti "${formData.title.hinglish}" uploaded successfully!`);

      // Reset form
      setFormData({
        deity: 'ganesha',
        title: { hinglish: '', marathi: '' },
        lyrics: { hinglish: '', marathi: '' },
        duration: 0,
        difficulty: 'easy',
        tags: [],
        isPopular: false,
        isActive: true,
      });

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

              {/* Lyrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    {isMarathi ? 'गीत (हिंग्लिश)' : 'Lyrics (Hinglish)'}
                  </Label>
                  <Textarea
                    value={formData.lyrics.hinglish}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleLyricsChange('hinglish', e.target.value)}
                    placeholder="Enter complete aarti lyrics in Hinglish..."
                    className="border-orange-200 focus:border-orange-500 min-h-[200px] resize-y"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    {isMarathi ? 'गीत (मराठी)' : 'Lyrics (Marathi)'}
                  </Label>
                  <Textarea
                    value={formData.lyrics.marathi}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleLyricsChange('marathi', e.target.value)}
                    placeholder="संपूर्ण आरती मराठीत टाका..."
                    className="border-orange-200 focus:border-orange-500 min-h-[200px] resize-y font-serif"
                    required
                  />
                </div>
              </div>

              {/* Duration and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    {isMarathi ? 'कालावधी (सेकंदात)' : 'Duration (seconds)'}
                  </Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    placeholder="180"
                    min="1"
                    className="border-orange-200 focus:border-orange-500"
                    required
                  />
                </div>
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
