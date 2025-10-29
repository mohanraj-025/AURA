
import React, { useState, useRef, useMemo } from 'react';
import { FeedItem, UserProfile } from '../types';
import { ProTipIcon, FeaturedIcon, ShareIcon, PlusIcon, ProfileIcon } from './Icons';
import CreatePost from './CreatePost';
import MissionPassedToast from './MissionPassedToast';

const MOCK_FEED_DATA: FeedItem[] = [
  { id: 1, type: 'featured', imageUrl: 'https://picsum.photos/seed/fashion1/800/1200', title: 'Cyber-Punk Reinvented', description: 'The latest collection from NeoWear.' },
  { id: 2, type: 'pro-tip', imageUrl: 'https://picsum.photos/seed/fashion2/800/800', title: 'Accessorizing 101', author: 'Anna Wintour', description: 'How to pick the perfect accessories to elevate any outfit.' },
  { id: 3, type: 'user-style', imageUrl: 'https://picsum.photos/seed/fashion3/800/1000', title: 'Tokyo Drift Vibes', author: 'user_yuki', description: 'My take on streetwear in Shibuya.' },
  { id: 4, type: 'user-style', imageUrl: 'https://picsum.photos/seed/fashion4/800/900', title: 'Coffee Shop Comfort', author: 'coffeeguy', description: 'Keeping it cozy and stylish.' },
  { id: 5, type: 'featured', imageUrl: 'https://picsum.photos/seed/fashion5/800/1200', title: 'Urban Explorer Gear', description: 'Function meets fashion for the modern adventurer.' },
  { id: 6, type: 'user-style', imageUrl: 'https://picsum.photos/seed/fashion6/800/800', title: 'Minimalist Monday', author: 'simple_jane', description: 'Less is more.' },
  { id: 7, type: 'pro-tip', imageUrl: 'https://picsum.photos/seed/fashion7/800/1000', title: 'Mastering Layers', author: 'Style Savant', description: 'A guide to layering clothes for transitional weather.' },
  { id: 8, type: 'user-style', imageUrl: 'https://picsum.photos/seed/fashion8/800/1200', title: 'Vintage Finds', author: 'retro_king', description: 'Found this gem at a thrift store!' },
];

const FeedCard: React.FC<{ item: FeedItem }> = ({ item }) => {
  const [isShared, setIsShared] = useState(false);
  let cardIcon: React.ReactNode = null;
  if (item.type === 'pro-tip') cardIcon = <ProTipIcon />;
  if (item.type === 'featured') cardIcon = <FeaturedIcon />;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Shared item: ${item.id} - ${item.title}`);
    setIsShared(true);
    setTimeout(() => {
      setIsShared(false);
    }, 2000);
  };

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg">
      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      {cardIcon && <div className="absolute top-4 right-4">{cardIcon}</div>}

      <div className="absolute bottom-0 left-0 p-4 w-full">
        <div className="flex justify-between items-end gap-2">
            <div className="flex-grow min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{item.title}</h3>
                {item.author && <p className="text-purple-300 text-sm font-semibold truncate">by {item.author}</p>}
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 truncate">{item.description}</p>
            </div>
            <div className="flex-shrink-0">
              {isShared ? (
                <span className="text-green-400 font-semibold text-sm animate-fade-in">Shared!</span>
              ) : (
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-black/40 text-white hover:bg-purple-600/60 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                  aria-label="Share post"
                >
                  <ShareIcon />
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

interface FeedProps {
  userProfile: UserProfile;
  onProfileUpdate: (newProfile: UserProfile) => void;
}

const Feed: React.FC<FeedProps> = ({ userProfile, onProfileUpdate }) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(MOCK_FEED_DATA);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showMissionPassed, setShowMissionPassed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFeedItems = useMemo(() => {
    if (!searchTerm) {
        return feedItems;
    }
    return feedItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [feedItems, searchTerm]);

  const handleCreatePost = (newPostData: Omit<FeedItem, 'id' | 'type' | 'author'>) => {
    const newPost: FeedItem = {
      id: Date.now(),
      type: 'user-style',
      author: userProfile.name, // Use the user's name
      ...newPostData,
    };
    setFeedItems(prevItems => [newPost, ...prevItems]);
    setIsCreatingPost(false);
    setShowMissionPassed(true);
    setTimeout(() => setShowMissionPassed(false), 3000); // Hide after 3 seconds
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProfileUpdate({
          ...userProfile,
          avatarUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Style Feed</h1>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
            aria-label="Upload profile picture"
          />
          <button
            onClick={handleAvatarClick}
            className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-transform transform hover:scale-110"
            aria-label="Change profile picture"
          >
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Your profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ProfileIcon />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
            type="text"
            placeholder="Search feed by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFeedItems.map((item, index) => (
          <div key={item.id} className={(index === 0 || index === 4) && !searchTerm ? 'col-span-2 row-span-2' : ''}>
            <FeedCard item={item} />
          </div>
        ))}
      </div>
      {filteredFeedItems.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-400">No results found for "{searchTerm}".</p>
        </div>
      )}

      <button
        onClick={() => setIsCreatingPost(true)}
        className="fixed bottom-24 right-4 md:right-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 z-40"
        aria-label="Create new post"
      >
        <PlusIcon />
      </button>

      {isCreatingPost && (
        <CreatePost
          onClose={() => setIsCreatingPost(false)}
          onCreatePost={handleCreatePost}
        />
      )}
      
      {showMissionPassed && <MissionPassedToast />}
    </div>
  );
};

export default Feed;
