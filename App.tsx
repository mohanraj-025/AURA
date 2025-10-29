
import React from 'react';
import { UserProfile, ActiveTab } from './types';
import Navbar from './components/Navbar';
import Wear from './components/Wear';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Vibe from './components/Vibe';

interface AppProps {
  userProfile: UserProfile;
  onProfileUpdate: (newProfile: UserProfile) => void;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ userProfile, onProfileUpdate, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('wear');

  const renderContent = () => {
    switch (activeTab) {
      case 'wear':
        return <Wear userProfile={userProfile} />;
      case 'feed':
        return <Feed userProfile={userProfile} onProfileUpdate={onProfileUpdate} />;
      case 'vibe':
        return <Vibe userProfile={userProfile} />;
      case 'profile':
        return <Profile userProfile={userProfile} onProfileUpdate={onProfileUpdate} onLogout={onLogout} />;
      default:
        return <Wear userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
      <main className="pb-24">
        {renderContent()}
      </main>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
