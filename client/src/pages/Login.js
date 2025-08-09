import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const demo = searchParams.get('demo');
    
    if (error) {
      switch (error) {
        case 'discord_failed':
          toast.error('Discord login failed. Please try again.');
          break;
        case 'bnet_failed':
          toast.error('Battle.net login failed. Please try again.');
          break;
        case 'discord_not_configured':
          toast.error('Discord OAuth is not configured on this server.');
          break;
        case 'bnet_not_configured':
          toast.error('Battle.net OAuth is not configured on this server.');
          break;
        default:
          toast.error('Login failed. Please try again.');
      }
    }

    if (demo === 'true') {
      toast.success('Demo mode detected! Use the Demo Login button below.');
    }
  }, [searchParams]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDiscordLogin = () => {
    login.discord();
  };

  const handleBattlenetLogin = () => {
    login.battlenet();
  };

  const handleDemoLogin = async () => {
    try {
      const response = await axios.post('/auth/demo-login');
      if (response.data.message) {
        toast.success('Demo login successful!');
        // Refresh the page to update auth state
        window.location.href = '/dashboard';
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Demo login is only available when the server is running in demo mode.');
      } else {
        toast.error('Demo login failed. Please try again.');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: '#0f0f12',
        backgroundImage: 'linear-gradient(rgba(15, 15, 18, 0.95), rgba(15, 15, 18, 0.95)), url("/background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-dark-gradient opacity-50"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="card-premium p-8 text-center">
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="FiveStack Logo" 
              className="h-16 mx-auto object-contain mb-4"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.5))'
              }}
            />
            <h1 className="text-2xl font-wow font-bold text-white mb-2">
              Welcome to <span className="text-premium">FiveStack</span>
            </h1>
            <p className="text-gray-400">
              Sign in to start building your Mythic+ team
            </p>
          </div>

          <div className="space-y-4">
            {/* Discord Login */}
            <button
              onClick={handleDiscordLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
              </svg>
              <span>Continue with Discord</span>
            </button>

            {/* Battle.net Login */}
            <button
              onClick={handleBattlenetLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.999 0C9.613 0 7.552.688 6.147 1.657c-1.404.97-2.24 2.317-2.24 3.795v2.456c-.777.265-1.35.675-1.725 1.246-.375.571-.563 1.302-.563 2.191v8.208c0 1.333.472 2.458 1.416 3.375.944.917 2.125 1.375 3.542 1.375h7.248c1.417 0 2.598-.458 3.542-1.375.944-.917 1.416-2.042 1.416-3.375v-8.208c0-.889-.188-1.62-.563-2.191-.375-.571-.948-.981-1.725-1.246V5.452c0-1.478-.836-2.825-2.24-3.795C16.448.688 14.387 0 11.999 0zm0 1.875c1.889 0 3.458.542 4.313 1.313.854.771 1.312 1.729 1.312 2.764v2.083h-11.25V5.952c0-1.035.458-1.993 1.313-2.764C8.541 2.417 10.11 1.875 11.999 1.875z"/>
              </svg>
              <span>Continue with Battle.net</span>
            </button>

            {/* Demo Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-obsidian-900 text-gray-400">Demo Mode</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full btn-secondary py-3 px-4 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Try Demo (No Auth Required)</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gold-500/10 rounded-full blur-xl animate-float floating"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float floating delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gold-400/5 rounded-full blur-xl animate-float floating delay-500"></div>
    </div>
  );
};

export default Login; 