
import React, { useState, useCallback } from 'react';
import { UserProfile, TimewarpSuggestion } from '../types';
import { getTimewarpSuggestion, generateVibeImage } from '../services/geminiService';
import { MagicWandIcon } from './Icons';

interface TimewarpProps {
  userProfile: UserProfile;
}

type VibeType = 'retrograde' | 'futurespective';

const TimewarpSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center h-full">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
    <p className="text-gray-300 font-semibold">Weaving through time...</p>
    <p className="text-sm text-gray-400 max-w-xs">Generating a unique vibe from the past and future.</p>
  </div>
);

const SuggestionCard: React.FC<{ suggestion: TimewarpSuggestion }> = ({ suggestion }) => (
    <div className="animate-fade-in space-y-4">
        <img src={suggestion.imageUrl} alt={suggestion.title} className="w-full h-80 object-cover rounded-lg shadow-lg" />
        <div className="text-center">
            <h3 className="text-xl font-bold text-purple-300">{suggestion.title}</h3>
            <p className="text-gray-400 mt-1">{suggestion.description}</p>
        </div>
    </div>
);


const Timewarp: React.FC<TimewarpProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<VibeType>('retrograde');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<TimewarpSuggestion | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      // 1. Get text concept and image prompt
      const { title, description, imagePrompt } = await getTimewarpSuggestion(userProfile, activeTab);
      // 2. Generate image
      const imageUrl = await generateVibeImage(imagePrompt);
      
      setSuggestion({ title, description, imageUrl });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, activeTab]);

  const selectTab = (tab: VibeType) => {
    setActiveTab(tab);
    setSuggestion(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-4">Timewarp</h2>
        <p className="text-center text-gray-400 mb-6">Explore styles from the past and future, reimagined by AI.</p>
        
        <div className="flex justify-center bg-gray-900/50 rounded-lg p-1 mb-6">
            <button 
                onClick={() => selectTab('retrograde')}
                className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'retrograde' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                Retrograde <span className="text-xs text-purple-200 block">(Youth Lacking)</span>
            </button>
            <button 
                onClick={() => selectTab('futurespective')}
                className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'futurespective' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                Futurespective <span className="text-xs text-purple-200 block">(Past Would)</span>
            </button>
        </div>

        <div className="min-h-[420px] flex flex-col justify-center">
            {isLoading ? <TimewarpSpinner /> : suggestion ? (
                <SuggestionCard suggestion={suggestion} />
            ) : (
                <div className="text-center flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">
                        {activeTab === 'retrograde' ? 'Discover Timeless Classics' : 'Reimagine History'}
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-sm">
                        {activeTab === 'retrograde' 
                            ? 'Unearth styles that defy trends. Generate a classic look with enduring appeal.'
                            : 'Blend a past era with a modern twist. What would they wear today?'
                        }
                    </p>
                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                    <button
                        onClick={handleGenerate}
                        className="w-full max-w-xs flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
                    >
                        <MagicWandIcon />
                        Generate Vibe
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default Timewarp;
