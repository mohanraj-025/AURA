import React from 'react';

const MissionPassedToast: React.FC = () => {
    return (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] animate-fade-in`}>
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-wider" style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 0 10px rgba(196, 181, 253, 0.7), 0 0 20px rgba(139, 92, 246, 0.5)' }}>
                    MISSION PASSED
                </h1>
                <p className="text-2xl md:text-3xl font-bold text-green-400 mt-2" style={{ textShadow: '0 0 5px rgba(52, 211, 153, 0.7)' }}>
                    + RESPECT
                </p>
            </div>
        </div>
    );
};

export default MissionPassedToast;