import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-16 w-16" }) => (
    <svg 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="logoGradient" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C4B5FD"/>
                <stop offset="1" stopColor="#8B5CF6"/>
            </linearGradient>
        </defs>
        <path d="M32 4L12 60H20L26 44H38L44 60H52L32 4ZM28.5 36L32 26L35.5 36H28.5Z" fill="url(#logoGradient)"/>
        <path d="M32 28C32.7956 28 33.5587 27.6839 34.1213 27.1213C34.6839 26.5587 35 25.7956 35 25C35 24.2044 34.6839 23.4413 34.1213 22.8787C33.5587 22.3161 32.7956 22 32 22C31.2044 22 30.4413 22.3161 29.8787 22.8787C29.3161 23.4413 29 24.2044 29 25C29 25.7956 29.3161 26.5587 29.8787 27.1213C30.4413 27.6839 31.2044 28 32 28Z" fill="#A78BFA"/>
    </svg>
);

export default Logo;
