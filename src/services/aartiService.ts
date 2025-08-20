import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Aarti, AartiFormData, DeityType } from '@/types/aarti';

const AARTI_COLLECTION = 'aartis';

// Utility function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Create a new aarti
export const createAarti = async (formData: AartiFormData): Promise<string> => {
  try {
    const slug = generateSlug(formData.title.hinglish);
    
    const aartiData: Omit<Aarti, 'id'> = {
      ...formData,
      slug,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, AARTI_COLLECTION), aartiData);
    
    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });
    
    console.log('✅ Aarti created successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating aarti:', error);
    throw new Error('Failed to create aarti');
  }
};

// Update an existing aarti
export const updateAarti = async (id: string, formData: AartiFormData): Promise<void> => {
  try {
    const slug = generateSlug(formData.title.hinglish);
    
    const updateData = {
      ...formData,
      slug,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(doc(db, AARTI_COLLECTION, id), updateData);
    console.log('✅ Aarti updated successfully:', id);
  } catch (error) {
    console.error('❌ Error updating aarti:', error);
    throw new Error('Failed to update aarti');
  }
};

// Delete an aarti
export const deleteAarti = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, AARTI_COLLECTION, id));
    console.log('✅ Aarti deleted successfully:', id);
  } catch (error) {
    console.error('❌ Error deleting aarti:', error);
    throw new Error('Failed to delete aarti');
  }
};

// Get all aartis with optional filters
export const getAartis = async (filters?: {
  deity?: DeityType;
  isPopular?: boolean;
  isActive?: boolean;
  tags?: string[];
  limitCount?: number;
}): Promise<Aarti[]> => {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Start with active aartis only (basic filter)
    constraints.push(where('isActive', '==', true));
    
    // Add deity filter if specified
    if (filters?.deity) {
      constraints.push(where('deity', '==', filters.deity));
    }
    
    // Add popular filter if specified
    if (filters?.isPopular !== undefined) {
      constraints.push(where('isPopular', '==', filters.isPopular));
    }
    
    // For now, order by creation date only (simplifies indexing)
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }
    
    const q = query(collection(db, AARTI_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    
    let aartis: Aarti[] = [];
    querySnapshot.forEach((doc) => {
      aartis.push({ id: doc.id, ...doc.data() } as Aarti);
    });
    
    // Apply tag filtering in memory (to avoid complex index requirements)
    if (filters?.tags && filters.tags.length > 0) {
      aartis = aartis.filter(aarti => 
        aarti.tags.some(tag => filters.tags!.includes(tag))
      );
    }
    
    console.log(`✅ Retrieved ${aartis.length} aartis`);
    return aartis;
  } catch (error) {
    console.error('❌ Error getting aartis:', error);
    throw new Error('Failed to retrieve aartis');
  }
};

// Get a single aarti by ID
export const getAartiById = async (id: string): Promise<Aarti | null> => {
  try {
    const docSnap = await getDoc(doc(db, AARTI_COLLECTION, id));
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Aarti;
    } else {
      console.log('❌ No aarti found with ID:', id);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting aarti by ID:', error);
    throw new Error('Failed to retrieve aarti');
  }
};

// Get aarti by slug
export const getAartiBySlug = async (slug: string): Promise<Aarti | null> => {
  try {
    const q = query(
      collection(db, AARTI_COLLECTION), 
      where('slug', '==', slug),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Aarti;
    } else {
      console.log('❌ No aarti found with slug:', slug);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting aarti by slug:', error);
    throw new Error('Failed to retrieve aarti');
  }
};

// Get popular aartis
export const getPopularAartis = async (limitCount: number = 10): Promise<Aarti[]> => {
  try {
    // Try simplified query first
    const q = query(
      collection(db, AARTI_COLLECTION),
      where('isPopular', '==', true),
      where('isActive', '==', true),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    const aartis: Aarti[] = [];
    querySnapshot.forEach((doc) => {
      aartis.push({ id: doc.id, ...doc.data() } as Aarti);
    });
    
    console.log(`✅ Retrieved ${aartis.length} popular aartis`);
    return aartis;
  } catch (error) {
    console.error('❌ Error getting popular aartis, trying fallback:', error);
    // Fallback to the complex query
    return getAartis({
      isPopular: true,
      isActive: true,
      limitCount
    });
  }
};

// Get aartis by deity
export const getAartisByDeity = async (deity: DeityType): Promise<Aarti[]> => {
  try {
    // Simple query with just deity filter (to avoid index requirements)
    const q = query(
      collection(db, AARTI_COLLECTION),
      where('deity', '==', deity),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    const aartis: Aarti[] = [];
    querySnapshot.forEach((doc) => {
      aartis.push({ id: doc.id, ...doc.data() } as Aarti);
    });
    
    console.log(`✅ Retrieved ${aartis.length} aartis for ${deity}`);
    return aartis;
  } catch (error) {
    console.error(`❌ Error getting aartis for ${deity}, trying fallback:`, error);
    // Fallback: get all active aartis and filter in memory
    try {
      const allAartis = await getAllActiveAartis();
      const filteredAartis = allAartis.filter(aarti => aarti.deity === deity);
      console.log(`✅ Fallback retrieved ${filteredAartis.length} aartis for ${deity}`);
      return filteredAartis;
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      throw new Error(`Failed to retrieve aartis for ${deity}`);
    }
  }
};

// Search aartis by title
export const searchAartis = async (searchTerm: string): Promise<Aarti[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation. For production, consider using Algolia or similar
    const allAartis = await getAartis({ isActive: true });
    
    const searchResults = allAartis.filter(aarti => 
      aarti.title.hinglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aarti.title.marathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aarti.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    console.log(`✅ Search found ${searchResults.length} results for: ${searchTerm}`);
    return searchResults;
  } catch (error) {
    console.error('❌ Error searching aartis:', error);
    throw new Error('Failed to search aartis');
  }
};

// Simplified function to get all active aartis (no complex queries)
export const getAllActiveAartis = async (): Promise<Aarti[]> => {
  try {
    // Simple query with only one where clause
    const q = query(
      collection(db, AARTI_COLLECTION),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    const aartis: Aarti[] = [];
    querySnapshot.forEach((doc) => {
      aartis.push({ id: doc.id, ...doc.data() } as Aarti);
    });
    
    console.log(`✅ Retrieved ${aartis.length} active aartis`);
    return aartis;
  } catch (error) {
    console.error('❌ Error getting active aartis:', error);
    throw new Error('Failed to retrieve active aartis');
  }
};
