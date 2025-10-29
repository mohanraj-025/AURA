import React from 'react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-[100] animate-fade-in">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-4 rounded-lg bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-700">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-purple-800">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">We use cookies for the best experience.</span>
                <span className="hidden md:inline">This website uses cookies and local storage to ensure you get the best experience.</span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <button
                onClick={onAccept}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Accept
              </button>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
               <button
                onClick={onDecline}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;