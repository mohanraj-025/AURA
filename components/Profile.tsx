
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { RankIcon, StreakIcon, PointsIcon, EditIcon, SaveIcon, UserCircleIcon } from './Icons';

interface ProfileProps {
  userProfile: UserProfile;
  onProfileUpdate: (newProfile: UserProfile) => void;
  onLogout: () => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center text-center">
        <div className="text-purple-400 mb-2">{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
    </div>
);

const Profile: React.FC<ProfileProps> = ({ userProfile, onProfileUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'stylePreferences') {
        setFormData({ ...formData, [name]: value.split(',').map(s => s.trim()) });
    } else if (name === 'age') {
        setFormData({ ...formData, age: parseInt(value, 10) || 0 });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    onProfileUpdate(formData);
    setIsEditing(false);
  };
  
  return (
    <div className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Profile</h1>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    {isEditing ? <><SaveIcon /> Save</> : <><EditIcon /> Edit</>}
                </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {userProfile.avatarUrl ? (
                            <img src={userProfile.avatarUrl} alt="Your profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircleIcon />
                        )}
                    </div>
                    <div>
                         {isEditing ? (
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="bg-gray-700 text-2xl font-bold rounded p-1"/>
                         ) : (
                            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                         )}
                         <p className="text-gray-400">Style enthusiast</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Gender</label>
                        {isEditing ? (
                             <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1">
                                <option>Man</option>
                                <option>Woman</option>
                                <option>Kid</option>
                            </select>
                        ) : (
                            <p className="font-semibold">{userProfile.gender}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Age</label>
                        {isEditing ? (
                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1"/>
                        ) : (
                            <p className="font-semibold">{userProfile.age}</p>
                        )}
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Location</label>
                        {isEditing ? (
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1"/>
                        ) : (
                            <p className="font-semibold">{userProfile.location}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Style Preferences</label>
                        {isEditing ? (
                             <input type="text" name="stylePreferences" value={formData.stylePreferences.join(', ')} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1" placeholder="e.g. Casual, Streetwear"/>
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {userProfile.stylePreferences.map(pref => (
                                    <span key={pref} className="bg-purple-600/50 text-purple-200 text-xs font-medium px-2.5 py-1 rounded-full">{pref}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <StatCard icon={<RankIcon />} label="Global Rank" value={`#${userProfile.rank}`} />
                <StatCard icon={<StreakIcon />} label="Daily Streak" value={userProfile.streak} />
                <StatCard icon={<PointsIcon />} label="Points" value={userProfile.points} />
            </div>

            <button 
                onClick={onLogout}
                className="w-full mt-8 bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
                Logout
            </button>

            <div className="mt-4 text-center text-gray-500 text-sm">
                <p>Your data is securely stored and is only used to personalize your fashion experience.</p>
                <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
            </div>
        </div>
    </div>
  );
};

export default Profile;
