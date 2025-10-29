import React, { useState, useEffect, useCallback } from 'react';
import App from '../App';
import Login from './Login';
import Onboarding from './Onboarding';
import CookieConsent from './CookieConsent';
import { UserProfile, InitialUserProfile } from '../types';

const Auth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('aura_authenticated') === 'true';
  });
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('aura_onboarding_complete') === 'true';
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('aura_user_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'declined' | null>(() => {
    return localStorage.getItem('aura_cookie_consent') as 'accepted' | 'declined' | null;
  });

  const handleCookieConsent = (consent: 'accepted' | 'declined') => {
    localStorage.setItem('aura_cookie_consent', consent);
    setCookieConsent(consent);
  };

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('aura_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('aura_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const handleLogin = (method: 'google' | 'email') => {
    console.log(`Login attempt with: ${method}`);
    setIsAuthenticated(true);

    if (method === 'google') {
      // For Google login, we'll simulate a faster setup by creating a default
      // profile and skipping the manual onboarding steps.
      const googleProfile: UserProfile = {
        name: 'Alex Doe',
        gender: 'Man',
        stylePreferences: ['Casual', 'Minimalist', 'Streetwear'],
        age: 30,
        location: 'San Francisco, USA',
        points: 1250,
        streak: 5,
        rank: 42,
        avatarUrl: `https://i.pravatar.cc/150?u=alexdoe`
      };
      setUserProfile(googleProfile);
      setHasCompletedOnboarding(true);
      localStorage.setItem('aura_onboarding_complete', 'true');
    }
    // For 'email' login, the flow will naturally proceed to the onboarding
    // component because hasCompletedOnboarding is still false.
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setUserProfile(null);
    localStorage.removeItem('aura_authenticated');
    localStorage.removeItem('aura_onboarding_complete');
    localStorage.removeItem('aura_user_profile');
    // A full reload might be a bit jarring, but it's the simplest way
    // to ensure all state is reset correctly for this demo.
    window.location.reload();
  };

  const handleOnboardingComplete = useCallback((initialProfile: InitialUserProfile) => {
    const fullProfile: UserProfile = {
      ...initialProfile,
      age: 28, // Default age, can be updated in profile
      location: 'New York, USA', // Default location
      points: 0,
      streak: 0,
      rank: 999,
    };
    setUserProfile(fullProfile);
    setHasCompletedOnboarding(true);
    localStorage.setItem('aura_onboarding_complete', 'true');
  }, []);

  const handleProfileUpdate = useCallback((newProfile: UserProfile) => {
    setUserProfile(newProfile);
  }, []);

  return (
    <>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : !hasCompletedOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : userProfile ? (
        <App userProfile={userProfile} onProfileUpdate={handleProfileUpdate} onLogout={handleLogout} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}
      {!cookieConsent && (
        <CookieConsent
          onAccept={() => handleCookieConsent('accepted')}
          onDecline={() => handleCookieConsent('declined')}
        />
      )}
    </>
  );
};

export default Auth;