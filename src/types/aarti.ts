import { Timestamp } from 'firebase/firestore';

export type DeityType = 'ganesha' | 'krishna' | 'shiva' | 'durga' | 'rama' | 'hanuman' | 'lakshmi' | 'saraswati';
export type DifficultyType = 'easy' | 'medium' | 'hard';

export interface AartiTitle {
  hinglish: string;
  marathi: string;
}

export interface AartiLyrics {
  hinglish: string;
  marathi: string;
}

export interface AartiStanza {
  id: string;
  hinglish: string;
  marathi: string;
  isChorus?: boolean; // Mark chorus/refrain stanzas
}

export interface Aarti {
  id: string;
  slug: string;
  deity: DeityType;
  title: AartiTitle;
  lyrics: AartiLyrics;
  stanzas?: AartiStanza[]; // Optional parsed stanzas
  difficulty: DifficultyType;
  tags: string[]; // ['popular', 'daily', 'festival']
  isPopular: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface AartiFormData {
  deity: DeityType;
  title: AartiTitle;
  lyrics: AartiLyrics;
  difficulty: DifficultyType;
  tags: string[];
  isPopular: boolean;
  isActive: boolean;
}

export const DEITY_OPTIONS: { value: DeityType; label: string; labelMarathi: string }[] = [
  { value: 'ganesha', label: 'Ganesha', labelMarathi: 'गणेश' },
  { value: 'krishna', label: 'Krishna', labelMarathi: 'कृष्ण' },
  { value: 'shiva', label: 'Shiva', labelMarathi: 'शिव' },
  { value: 'durga', label: 'Durga', labelMarathi: 'दुर्गा' },
  { value: 'rama', label: 'Rama', labelMarathi: 'राम' },
  { value: 'hanuman', label: 'Hanuman', labelMarathi: 'हनुमान' },
  { value: 'lakshmi', label: 'Lakshmi', labelMarathi: 'लक्ष्मी' },
  { value: 'saraswati', label: 'Saraswati', labelMarathi: 'सरस्वती' }
];

export const DIFFICULTY_OPTIONS: { value: DifficultyType; label: string; labelMarathi: string }[] = [
  { value: 'easy', label: 'Easy', labelMarathi: 'सोपे' },
  { value: 'medium', label: 'Medium', labelMarathi: 'मध्यम' },
  { value: 'hard', label: 'Hard', labelMarathi: 'कठीण' }
];

export const COMMON_TAGS = [
  'popular',
  'daily',
  'festival',
  'morning',
  'evening',
  'traditional',
  'modern',
  'fast',
  'slow',
  'beginner'
];
