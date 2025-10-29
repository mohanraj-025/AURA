import React, { useState, useCallback } from 'react';
import { UserProfile, OutfitSuggestion } from '../types';
import { getOutfitSuggestion } from '../services/geminiService';
import { MagicWandIcon, XCircleIcon, ShoppingCartIcon } from './Icons';
import Logo from './Logo';

interface WearProps {
  userProfile: UserProfile;
}

const Spinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      <p className="text-gray-300 font-semibold">AURA is thinking...</p>
      <p className="text-sm text-gray-400 max-w-xs">Generating your outfit and creating a visual infographic...</p>
    </div>
);

const OutfitCard: React.FC<{ outfit: OutfitSuggestion; onClear: () => void; }> = ({ outfit, onClear }) => {
    const outfitParts = [
        { title: 'Topwear', ...outfit.topwear },
        { title: 'Bottomwear', ...outfit.bottomwear },
        { title: 'Footwear', ...outfit.footwear },
        { title: 'Accessories', ...outfit.accessories },
    ];

    return (
        <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 animate-slide-fade-in">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-purple-300">{outfit.outfitName}</h2>
                    <p className="text-gray-400 mt-1 max-w-md">{outfit.description}</p>
                </div>
                <button onClick={onClear} className="text-gray-500 hover:text-white transition-colors">
                    <XCircleIcon />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outfitParts.map(part => (
                    <div key={part.title} className="bg-gray-700/40 p-4 rounded-lg flex flex-col items-center text-center border border-gray-600">
                        <div className="h-40 w-full flex items-center justify-center mb-3">
                            <img src={part.imageUrl} alt={part.item} className="max-h-full max-w-full object-contain"/>
                        </div>
                        <div className="w-full">
                             <h3 className="font-semibold text-base text-white truncate">{part.item}</h3>
                             <p className="text-gray-300 text-xs mt-1">{part.description}</p>
                        </div>
                        {part.purchaseLinks && part.purchaseLinks.length > 0 && (
                            <div className="w-full mt-4 pt-3 border-t border-gray-600 text-left">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Where to Buy</h4>
                                <div className="space-y-1">
                                    {part.purchaseLinks.map((link, index) => (
                                        <a 
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-purple-300 hover:underline transition-colors"
                                        >
                                            <ShoppingCartIcon />
                                            <span className="truncate">{link.storeName}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


const Wear: React.FC<WearProps> = ({ userProfile }) => {
  const [occasion, setOccasion] = useState('');
  const [movieInspiration, setMovieInspiration] = useState('');
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!occasion) {
      setError('Please tell us the occasion!');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await getOutfitSuggestion(userProfile, occasion, movieInspiration);
      setSuggestion(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, occasion, movieInspiration]);

  const clearSuggestion = () => {
      setSuggestion(null);
      setOccasion('');
      setMovieInspiration('');
  }

  return (
    <div className="p-4 md:p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl text-center mb-8">
        {!suggestion && !isLoading && (
            <>
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                    AURA
                </h1>
                <p className="text-gray-300 mt-2">Your personal AI stylist. What's the plan today?</p>
            </>
        )}
      </div>

      <div className="w-full max-w-2xl">
        {isLoading ? <Spinner /> : suggestion ? <OutfitCard outfit={suggestion} onClear={clearSuggestion}/> : (
             <div className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 animate-slide-fade-in">
                <div>
                    <label htmlFor="occasion" className="block text-sm font-medium text-gray-300 mb-2">What's the occasion?</label>
                    <input
                        type="text"
                        id="occasion"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        placeholder="e.g., Casual brunch, night out, movie date"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="inspiration" className="block text-sm font-medium text-gray-300 mb-2">Any movie inspiration? (Optional)</label>
                    <input
                        type="text"
                        id="inspiration"
                        value={movieInspiration}
                        onChange={(e) => setMovieInspiration(e.target.value)}
                        placeholder="e.g., The Matrix, Dune, Blade Runner"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                </div>
                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MagicWandIcon />
                    Style Me
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default Wear;