
import React from 'react';
import { ActiveTab } from '../types';
import { WearIcon, FeedIcon, VibeIcon, ProfileIcon } from './Icons';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
  >
    {icon}
    <span className="text-xs font-medium mt-1">{label}</span>
  </button>
);

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'wear', label: 'Wear', icon: <WearIcon /> },
    { id: 'feed', label: 'Feed', icon: <FeedIcon /> },
    { id: 'vibe', label: 'Vibe', icon: <VibeIcon /> },
    { id: 'profile', label: 'Profile', icon: <ProfileIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900/80 backdrop-blur-lg border-t border-gray-700 shadow-lg z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id as ActiveTab)}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
