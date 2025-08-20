// Test the improved auto-detection logic with the exact aarti provided

const testAarti = `॥ श्री गणपतीची आरती ॥
सुखकर्ता दुःखहर्ता वार्ता विघ्नाची।
नुरवी पुरवी प्रेम कृपा जयाची।
सर्वांगी सुन्दर उटि शेंदुराची।
कण्ठी झळके माळ मुक्ताफळांची॥

जय देव जय देव जय मंगलमूर्ति।
दर्शनमात्रे मनकामना पुरती॥

रत्नखचित फरा तुज गौरीकुमरा।
चन्दनाची उटि कुंकुमकेशरा।
हिरे जड़ित मुकुट शोभतो बरा।
रुणझुणती नूपुरे चरणी घागरिया॥

जय देव जय देव जय मंगलमूर्ति।
दर्शनमात्रे मनकामना पुरती॥

लम्बोदर पीताम्बर फणिवर बन्धना।
सरळ सोण्ड वक्रतुण्ड त्रिनयना।
दास रामाचा वाट पाहे सदना।
संकटी पावावे निर्वाणी रक्षावे सुरवरवन्दना॥

जय देव जय देव जय मंगलमूर्ति।
दर्शनमात्रे मनकामना पुरती॥`;

function autoDetectStanzas(text) {
  if (!text.trim()) return [];
  
  let stanzas = [];
  
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
    const processedStanzas = [];
    
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
  
  return stanzas;
}

const result = autoDetectStanzas(testAarti);

console.log('=== IMPROVED AUTO-DETECTION TEST ===');
console.log(`Total stanzas detected: ${result.length}`);
console.log('');

result.forEach((stanza, index) => {
  console.log(`--- Stanza ${index + 1} ---`);
  console.log(stanza);
  console.log('');
});
