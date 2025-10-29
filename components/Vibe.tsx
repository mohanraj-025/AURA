
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, LeaderboardUser } from '../types';
import { getLocalVibe } from '../services/geminiService';
import { LeaderboardIcon } from './Icons';
import Timewarp from './Timewarp';

const MOCK_LEADERBOARD_DATA: LeaderboardUser[] = [
    { id: 1, name: 'StyleSavvy', points: 9850, rank: 1, avatarUrl: 'https://i.pravatar.cc/150?u=stylesavvy' },
    { id: 2, name: 'TrendSetter', points: 9500, rank: 2, avatarUrl: 'https://i.pravatar.cc/150?u=trendsetter' },
    { id: 3, name: 'Fashionista', points: 8900, rank: 3, avatarUrl: 'https://i.pravatar.cc/150?u=fashionista' },
    { id: 42, name: 'Alex Doe', points: 1250, rank: 42, avatarUrl: 'https://i.pravatar.cc/150?u=alexdoe' },
    { id: 4, name: 'VibeKing', points: 8200, rank: 4, avatarUrl: 'https://i.pravatar.cc/150?u=vibeking' },
];


const Leaderboard: React.FC<{ currentUser: UserProfile }> = ({ currentUser }) => {
    // Sort and ensure current user is in the list for display
    const sortedUsers = MOCK_LEADERBOARD_DATA
        .filter(u => u.id !== currentUser.rank || u.name !== currentUser.name)
        .concat({
            id: currentUser.rank,
            name: currentUser.name,
            points: currentUser.points,
            rank: currentUser.rank,
            avatarUrl: currentUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.name.replace(' ', '')}`
        })
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5);


    return (
        <div className="w-full bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><LeaderboardIcon /> Global Ranking</h2>
            <ul className="space-y-3">
                {sortedUsers.map((user) => (
                    <li key={user.id} className={`flex items-center justify-between p-3 rounded-lg ${user.name === currentUser.name ? 'bg-purple-600/30 border border-purple-500' : 'bg-gray-700'}`}>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-lg w-6 text-center">{user.rank}</span>
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            <span className="font-semibold">{user.name}</span>
                        </div>
                        <span className="font-bold text-purple-300">{user.points} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const LocalVibe: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
    const [localVibe, setLocalVibe] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchVibe = useCallback(async () => {
        if (!userProfile.location) {
            setLocalVibe("No location set in your profile. Please update it to see local trends.");
            setIsLoading(false);
            return;
        };
        setIsLoading(true);
        try {
            const vibeData = await getLocalVibe(userProfile.location);
            setLocalVibe(vibeData);
        } catch (error) {
            console.error("Failed to fetch local vibe:", error);
            setLocalVibe("Could not fetch local trends. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [userProfile.location]);

    useEffect(() => {
        fetchVibe();
    }, [fetchVibe]);

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-center">What's the vibe in {userProfile.location || 'your area'}?</h2>
            <div className="mt-4 min-h-[100px] flex items-center justify-center">
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
                        <p className="text-sm text-gray-400">Analyzing local trends...</p>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-headings:text-purple-300 prose-strong:text-white" dangerouslySetInnerHTML={{ __html: localVibe.replace(/\n/g, '<br />') }} />
                )}
            </div>
        </div>
    );
};


const Vibe: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
  return (
    <div className="p-4 md:p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-2">Vibe Check</h1>
        
        <Timewarp userProfile={userProfile} />

        <LocalVibe userProfile={userProfile} />
        
        <div className="w-full max-w-2xl mx-auto">
            <Leaderboard currentUser={userProfile} />
        </div>
    </div>
  );
};

export default Vibe;