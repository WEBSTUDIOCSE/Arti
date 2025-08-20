# Firebase Firestore Indexes Required

## Composite Indexes Needed

### 1. For Popular Aartis Query
**Collection**: `aartis`
**Fields**: 
- `isPopular` (Ascending)
- `isActive` (Ascending)

### 2. For Deity + Active Aartis Query  
**Collection**: `aartis`
**Fields**:
- `deity` (Ascending)
- `isActive` (Ascending)
- `createdAt` (Descending)

### 3. For Popular + Active + Ordering Query
**Collection**: `aartis`
**Fields**:
- `isPopular` (Ascending)
- `isActive` (Ascending) 
- `createdAt` (Descending)

## How to Create These Indexes

### Option 1: Use Firebase Console
1. Go to: https://console.firebase.google.com/project/env-uat-cd3c5/firestore/indexes
2. Click "Create Index"
3. Select collection: `aartis`
4. Add the fields as specified above
5. Click "Create Index"

### Option 2: Click on Error Links
When you see the index error in console, Firebase provides direct links like:
https://console.firebase.google.com/v1/r/project/env-uat-cd3c5/firestore/indexes?create_composite=Cl...

Just click those links to auto-create the required indexes.

### Option 3: Use Firebase CLI (firestore.indexes.json)
```json
{
  "indexes": [
    {
      "collectionGroup": "aartis",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isPopular", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "aartis", 
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "deity", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "aartis",
      "queryScope": "COLLECTION", 
      "fields": [
        { "fieldPath": "isPopular", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## Index Creation Status
⏳ Indexes typically take 5-10 minutes to build
✅ Once built, all queries will work without errors
🔄 Until then, the simplified queries (without ordering) should work
