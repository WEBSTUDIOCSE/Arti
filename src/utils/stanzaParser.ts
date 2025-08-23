import { AartiLyrics, AartiStanza } from '@/types/aarti';

/**
 * Parse lyrics text into structured stanzas
 * Handles traditional Sanskrit/Marathi aarti formats
 */
export const parseLyricsIntoStanzas = (lyrics: AartiLyrics): AartiStanza[] => {
  const parseLanguage = (text: string): string[] => {
    if (!text.trim()) return [];
    
    let stanzas: string[] = [];
    
    // Method 1: Split by traditional Sanskrit/Marathi stanza markers (॥)
    if (text.includes('॥')) {
      stanzas = text
        .split(/॥\s*/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    // Method 2: Split by double line breaks
    else if (text.includes('\n\n')) {
      stanzas = text
        .split(/\n\s*\n+/) 
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    // Method 3: Intelligent line grouping for traditional format
    else {
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // Group lines into stanzas (typically 4 lines per stanza for aartis)
      if (lines.length >= 4) {
        stanzas = [];
        const linesPerStanza = 4;
        
        for (let i = 0; i < lines.length; i += linesPerStanza) {
          const stanzaLines = lines.slice(i, i + linesPerStanza);
          if (stanzaLines.length >= 2) {
            stanzas.push(stanzaLines.join('\n'));
          }
        }
      } else {
        stanzas = [text]; // Single stanza
      }
    }

    return stanzas;
  };

  const hinglishStanzas = parseLanguage(lyrics.hinglish);
  const marathiStanzas = parseLanguage(lyrics.marathi);
  
  const maxStanzas = Math.max(hinglishStanzas.length, marathiStanzas.length);
  const parsedStanzas: AartiStanza[] = [];

  for (let i = 0; i < maxStanzas; i++) {
    const hinglishText = hinglishStanzas[i] || '';
    const marathiText = marathiStanzas[i] || '';
    
    // Detect if this is a chorus/refrain (common patterns)
    const isChorus = detectChorus(hinglishText, marathiText, i, hinglishStanzas, marathiStanzas);
    
    parsedStanzas.push({
      id: `stanza_${i + 1}`,
      hinglish: hinglishText,
      marathi: marathiText,
      isChorus
    });
  }

  return parsedStanzas;
};

/**
 * Detect if a stanza is a chorus/refrain
 */
const detectChorus = (
  hinglishText: string, 
  marathiText: string, 
  index: number, 
  allHinglish: string[], 
  allMarathi: string[]
): boolean => {
  // Common chorus patterns in aartis
  const chorusPatterns = [
    /^(jai|जय).*(dev|देव|deva|देवा)/i,
    /^(om|ओम).*(namah|नमः)/i,
    /darshan.*purti|दर्शन.*पूर्ती/i,
    /jai.*jai.*jai|जय.*जय.*जय/i
  ];

  const textToCheck = hinglishText + ' ' + marathiText;
  
  // Check if it matches common chorus patterns
  const matchesPattern = chorusPatterns.some(pattern => pattern.test(textToCheck));
  
  // Check if this stanza repeats in the text (indicates chorus)
  const repeatsInHinglish = allHinglish.filter(stanza => 
    stanza.toLowerCase().trim() === hinglishText.toLowerCase().trim()
  ).length > 1;
  
  const repeatsInMarathi = allMarathi.filter(stanza => 
    stanza.toLowerCase().trim() === marathiText.toLowerCase().trim()
  ).length > 1;

  return matchesPattern || repeatsInHinglish || repeatsInMarathi;
};

/**
 * Get stanza timing for audio sync (estimated)
 */
export const estimateStanzaTiming = (stanzas: AartiStanza[], totalDuration: number = 240): number[] => {
  const timings: number[] = [];
  const baseTimePerStanza = totalDuration / stanzas.length;
  
  let currentTime = 0;
  
  stanzas.forEach((stanza, index) => {
    timings.push(currentTime);
    
    // Chorus stanzas typically take less time
    const stanzaDuration = stanza.isChorus ? baseTimePerStanza * 0.8 : baseTimePerStanza;
    currentTime += stanzaDuration;
  });

  return timings;
};

/**
 * Format stanza text for display (clean up formatting)
 */
export const formatStanzaText = (text: string): string => {
  return text
    .trim()
    .replace(/॥\s*$/g, '') // Remove trailing ॥
    .replace(/^\s*॥\s*/g, '') // Remove leading ॥
    .replace(/\n\s*\n/g, '\n') // Clean up extra line breaks
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .trim();
};
