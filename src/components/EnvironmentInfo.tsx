'use client';

import React from 'react';
import { useEnvironment } from '@/hooks/useEnvironment';

const EnvironmentInfo: React.FC = () => {
  const { environment, firebaseConfig, settings, isUAT, isPROD } = useEnvironment();

  return (
    <div className="p-6 bg-gray-100 rounded-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Environment Configuration
      </h2>
      
      {/* Environment Badge */}
      <div className="text-center mb-6">
        <span 
          className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
            isUAT ? 'bg-orange-500' : 'bg-green-500'
          }`}
        >
          {environment} Environment
        </span>
      </div>

      {/* Environment Details */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">Environment Settings</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Environment:</strong> {settings.environment}</li>
            <li><strong>Debug Mode:</strong> {settings.isDebug ? 'Enabled' : 'Disabled'}</li>
            <li><strong>Log Level:</strong> {settings.logLevel}</li>
            <li><strong>API Timeout:</strong> {settings.apiTimeout}ms</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">Firebase Configuration</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Project ID:</strong> {firebaseConfig.projectId}</li>
            <li><strong>Auth Domain:</strong> {firebaseConfig.authDomain}</li>
            <li><strong>Storage Bucket:</strong> {firebaseConfig.storageBucket}</li>
            <li><strong>Messaging Sender ID:</strong> {firebaseConfig.messagingSenderId}</li>
            <li><strong>App ID:</strong> {firebaseConfig.appId}</li>
            <li><strong>Measurement ID:</strong> {firebaseConfig.measurementId}</li>
          </ul>
        </div>

        {/* Environment Specific Features */}
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">Environment Features</h3>
          <div className="space-y-2 text-sm">
            {isUAT && (
              <div className="text-orange-600">
                <p>✓ Testing mode enabled</p>
                <p>✓ Extended logging</p>
                <p>✓ Debug tools available</p>
              </div>
            )}
            {isPROD && (
              <div className="text-green-600">
                <p>✓ Production optimizations</p>
                <p>✓ Minimal logging</p>
                <p>✓ Performance monitoring</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Environment Switch Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded border-l-4 border-blue-400">
        <h4 className="font-semibold text-blue-800 mb-2">How to Switch Environments</h4>
        <p className="text-blue-700 text-sm">
          To switch between UAT and PROD environments, change the 
          <code className="bg-blue-100 px-1 mx-1 rounded">IS_UAT_ENVIRONMENT</code> 
          boolean in <code className="bg-blue-100 px-1 mx-1 rounded">src/config/env.ts</code>
        </p>
        <p className="text-blue-700 text-sm mt-2">
          <strong>true</strong> = UAT Environment | <strong>false</strong> = PROD Environment
        </p>
      </div>
    </div>
  );
};

export default EnvironmentInfo;
