'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createAarti } from '@/services/aartiService';
import { SAMPLE_AARTIS } from '@/data/sampleAartis';

const DataSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [seedResults, setSeedResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });

  const seedSampleData = async () => {
    setIsSeeding(true);
    setSeedProgress(0);
    setSeedResults({ success: 0, failed: 0 });

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < SAMPLE_AARTIS.length; i++) {
      const aarti = SAMPLE_AARTIS[i];
      
      try {
        await createAarti(aarti);
        successCount++;
        toast.success(`✅ Uploaded: ${aarti.title.hinglish}`);
      } catch (error) {
        failedCount++;
        console.error(`❌ Failed to upload ${aarti.title.hinglish}:`, error);
        toast.error(`❌ Failed: ${aarti.title.hinglish}`);
      }

      setSeedProgress(((i + 1) / SAMPLE_AARTIS.length) * 100);
      setSeedResults({ success: successCount, failed: failedCount });

      // Small delay to prevent overwhelming Firebase
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsSeeding(false);
    
    if (successCount > 0) {
      toast.success(`🎉 Successfully uploaded ${successCount} aartis!`);
    }
    
    if (failedCount > 0) {
      toast.error(`⚠️ Failed to upload ${failedCount} aartis`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Aarti Data Seeder
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sample Aarti Collection
              </h3>
              <p className="text-gray-600">
                This will upload {SAMPLE_AARTIS.length} popular aartis including:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {SAMPLE_AARTIS.map((aarti, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl">
                      {aarti.deity === 'ganesha' ? '🐘' : 
                       aarti.deity === 'krishna' ? '🦚' : 
                       aarti.deity === 'hanuman' ? '🐒' :
                       aarti.deity === 'durga' ? '👑' :
                       aarti.deity === 'shiva' ? '🔱' : '🙏'}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{aarti.title.hinglish}</p>
                      <p className="text-xs text-gray-600 capitalize">{aarti.deity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isSeeding && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Uploading aartis... {Math.round(seedProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${seedProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Success: {seedResults.success}
                  </span>
                  <span className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Failed: {seedResults.failed}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={seedSampleData}
                disabled={isSeeding}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3"
              >
                {isSeeding ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading Sample Data...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Sample Aartis
                  </span>
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              ⚠️ Make sure Firebase is properly configured before uploading data
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataSeeder;
