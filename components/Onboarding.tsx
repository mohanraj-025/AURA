import React, { useState } from 'react';
import Logo from './Logo';
import { WearIcon, FeedIcon, VibeIcon } from './Icons';
import { InitialUserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: InitialUserProfile) => void;
}

const STYLE_PREFERENCES = [
  'Casual', 'Streetwear', 'Formal', 'Vintage', 
  'Minimalist', 'Sporty', 'Bohemian', 'Goth'
];

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 mb-8">
    <div
      className="bg-purple-500 h-1.5 rounded-full transition-all duration-500 ease-in-out"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    />
  </div>
);

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<InitialUserProfile>({
    name: '',
    gender: 'Man',
    stylePreferences: [],
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const toggleStylePreference = (preference: string) => {
    setProfile(p => {
      const newPrefs = p.stylePreferences.includes(preference)
        ? p.stylePreferences.filter(item => item !== preference)
        : [...p.stylePreferences, preference];
      return { ...p, stylePreferences: newPrefs };
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <Logo className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to AURA</h1>
            <p className="text-gray-300 max-w-sm mx-auto mb-8">Your personal AI stylist. Ready to discover your unique style?</p>
            <button onClick={handleNext} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
              Get Started
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">How AURA Works</h2>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4">
                <WearIcon />
                <div>
                  <h3 className="font-semibold">Wear</h3>
                  <p className="text-sm text-gray-400">Get daily AI outfit suggestions.</p>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4">
                <FeedIcon />
                <div>
                  <h3 className="font-semibold">Feed</h3>
                  <p className="text-sm text-gray-400">Discover trends and user styles.</p>
                </div>
              </div>
               <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4">
                <VibeIcon />
                <div>
                  <h3 className="font-semibold">Vibe</h3>
                  <p className="text-sm text-gray-400">See local trends and rankings.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">Tell Us About You</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500" placeholder="e.g., Alex Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select name="gender" value={profile.gender} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-purple-500">
                  <option>Man</option>
                  <option>Woman</option>
                  <option>Kid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">What's your style? (Select a few)</label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_PREFERENCES.map(pref => (
                    <button
                      key={pref}
                      onClick={() => toggleStylePreference(pref)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${profile.stylePreferences.includes(pref) ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isFinalStep = step === 3;
  const canProceed = isFinalStep ? profile.name && profile.stylePreferences.length > 0 : true;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <ProgressBar currentStep={step} totalSteps={3} />
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-2xl min-h-[350px] flex flex-col justify-between">
          <div className="flex-grow">
            {renderStep()}
          </div>
           <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button onClick={handleBack} className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Back
              </button>
            )}
            <button
              onClick={isFinalStep ? () => onComplete(profile) : handleNext}
              disabled={!canProceed}
              className="flex-grow bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFinalStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
