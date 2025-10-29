import React, { useState } from 'react';
import Logo from './Logo';
import { GoogleIcon, MailIcon } from './Icons';

interface LoginProps {
  onLogin: (method: 'google' | 'email') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  type View = 'login' | 'reset-password' | 'verify-email';
  const [view, setView] = useState<View>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Instead of logging in, show the verification step
    setView('verify-email');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
      e.preventDefault();
      if (!resetEmail) {
          setResetMessage("Please enter an email address.");
          return;
      }
      // In a real app, this would be an API call
      setResetMessage(`If an account exists for ${resetEmail}, a password reset link has been sent.`);
  }

  const renderLoginView = () => (
    <div className="w-full max-w-xs space-y-4 mt-10">
      <button
        onClick={() => onLogin('google')}
        className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 border border-gray-600"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
      
      <div className="relative">
          <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">OR</span>
          </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          aria-label="Email address"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          aria-label="Password"
        />
         <div className="text-right -mt-2">
            <button type="button" onClick={() => setView('reset-password')} className="text-xs font-medium text-purple-400 hover:underline">
                Forgot Password?
            </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          <MailIcon />
          Continue with Email
        </button>
      </form>
    </div>
  );

  const renderResetPasswordView = () => (
      <div className="w-full max-w-xs mt-10 text-left">
          <h2 className="text-xl font-bold text-white mb-2 text-center">Reset Password</h2>
          <p className="text-gray-400 mb-6 text-sm text-center">Enter your email and we'll send you a link to get back into your account.</p>
          <form onSubmit={handlePasswordReset} className="space-y-4">
              <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => {
                      setResetEmail(e.target.value);
                      setResetMessage('');
                  }}
                  placeholder="Email address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  aria-label="Email for password reset"
              />
              {resetMessage && <p className="text-green-400 text-sm text-center">{resetMessage}</p>}
              <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
              >
                  Send Reset Link
              </button>
          </form>
          <button onClick={() => setView('login')} className="w-full text-center mt-4 text-sm text-purple-400 hover:underline">
              Back to Login
          </button>
      </div>
  );

  const renderVerifyEmailView = () => (
    <div className="w-full max-w-xs mt-10 space-y-6">
        <h2 className="text-xl font-bold text-white">Check Your Email</h2>
        <p className="text-gray-300">We've sent a verification link to <br/><span className="font-bold text-purple-300 break-words">{email}</span>.</p>
        <p className="text-sm text-gray-400">Click the link in the email to finish signing up. For this demo, you can click the button below to simulate verification.</p>
        <div className="space-y-3">
             <button
                onClick={() => onLogin('email')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
                Complete Sign Up
            </button>
            <button
                onClick={() => alert(`Verification email resent to ${email}`)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Resend Email
            </button>
        </div>
        <button onClick={() => setView('login')} className="w-full text-center mt-4 text-sm text-purple-400 hover:underline">
            Back to Login
        </button>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'login': return renderLoginView();
      case 'reset-password': return renderResetPasswordView();
      case 'verify-email': return renderVerifyEmailView();
      default: return renderLoginView();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <Logo className="h-20 w-20" />
      </div>
      
      {view === 'login' && (
        <>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Unlock Your Style
            </h1>
            <p className="text-gray-300 mt-3 max-w-sm">
                Sign in to AURA to get personalized outfit recommendations and track your fashion journey.
            </p>
        </>
      )}
      
      {renderContent()}

    </div>
  );
};

export default Login;