export type ActiveTab = 'wear' | 'feed' | 'vibe' | 'profile';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'Man' | 'Woman' | 'Kid';
  location: string;
  stylePreferences: string[];
  points: number;
  streak: number;
  rank: number;
  avatarUrl?: string;
}

export interface InitialUserProfile {
  name:string;
  gender: 'Man' | 'Woman' | 'Kid';
  stylePreferences: string[];
}

export interface OutfitItem {
  item: string;
  description: string;
  imageUrl: string;
  purchaseLinks: {
    storeName: string;
    url: string;
  }[];
}

export interface OutfitSuggestion {
  outfitName: string;
  description: string;
  topwear: OutfitItem;
  bottomwear: OutfitItem;
  footwear: OutfitItem;
  accessories: OutfitItem;
}

export interface FeedItem {
  id: number;
  type: 'featured' | 'pro-tip' | 'user-style';
  imageUrl: string;
  title: string;
  author?: string;
  description: string;
}

export interface LeaderboardUser {
    id: number;
    name: string;
    points: number;
    rank: number;
    avatarUrl: string;
}

export interface TimewarpSuggestion {
  title: string;
  description: string;
  imageUrl: string;
}