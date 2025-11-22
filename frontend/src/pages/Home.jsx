import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import AuthModal from '../components/auth/AuthModal';
import { 
  RocketLaunchIcon, 
  CodeBracketIcon, 
  TrophyIcon, 
  SparklesIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, testLogin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

  const features = [
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: 'Interactive Learning',
      description: 'Master coding through gamified quests with real-time feedback and AI guidance.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <TrophyIcon className="w-8 h-8" />,
      title: 'Achievement System',
      description: 'Unlock badges, earn XP, and climb leaderboards as you progress through challenges.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      title: 'Real Projects',
      description: 'Contribute to actual open source projects and build your professional portfolio.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: 'Global Community',
      description: 'Connect with developers worldwide, share knowledge, and grow together.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: 'Progress Analytics',
      description: 'Track your growth with detailed insights and personalized learning paths.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'AI-Powered',
      description: 'Get intelligent suggestions, code reviews, and personalized mentoring.',
      gradient: 'from-pink-500 to-rose-500'
    },
  ];

  const stats = [
    { label: 'Active Learners', value: 15420, suffix: '+' },
    { label: 'Coding Challenges', value: 800, suffix: '+' },
    { label: 'Projects Completed', value: 12000, suffix: '+' },
    { label: 'Global Community', value: 85000, suffix: '+' },
  ];

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      stats.forEach((stat, index) => {
        let currentValue = 0;
        const increment = stat.value / 100;
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= stat.value) {
            currentValue = stat.value;
            clearInterval(timer);
          }
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = Math.floor(currentValue);
            return newStats;
          });
        }, 20);
      });
    };

    animateStats();
  }, []);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleTestLogin = () => {
    testLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2s"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4s"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
              CodeQuest
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-20"></div>
              <RocketLaunchIcon className="w-8 h-8 text-purple-400 animate-bounce" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-20"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your coding journey with gamified learning, AI-powered guidance, and real-world open source contributions
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleGetStarted}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <PlayIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Start Your Journey
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                </button>
                <button
                  onClick={handleTestLogin}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <BoltIcon className="w-6 h-6" />
                    Try Demo
                  </div>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <ChartBarIcon className="w-6 h-6" />
                  Go to Dashboard
                </div>
              </button>
            )}
          </div>

          {/* Features Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CodeBracketIcon className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-bold text-white mb-2">Learn by Doing</h3>
              <p className="text-gray-300 text-sm">Interactive coding challenges</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <TrophyIcon className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
              <h3 className="text-lg font-bold text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-300 text-sm">XP, badges, and achievements</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <RocketLaunchIcon className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-lg font-bold text-white mb-2">Real Impact</h3>
              <p className="text-gray-300 text-sm">Contribute to open source</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Trusted by Thousands
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
              <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
              <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
              <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
              <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-2">Loved by developers worldwide</span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {animatedStats[idx]?.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Excel</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive tools and features designed to accelerate your coding journey from beginner to expert
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
            Join Developers From Top Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Google</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Microsoft</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Meta</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Netflix</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
            <FireIcon className="w-16 h-16 text-orange-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are building their careers through gamified learning and real-world contributions
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <RocketLaunchIcon className="w-6 h-6" />
                    Start Learning Now
                  </div>
                </button>
                <button
                  onClick={() => navigate('/tutorials')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="w-6 h-6" />
                    Explore Tutorials
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      {!isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white p-4 rounded-2xl shadow-2xl max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <BoltIcon className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold text-sm">Quick Demo Access</span>
            </div>
            <p className="text-xs opacity-90 mb-3">
              Try the platform instantly with our demo account - no signup required!
            </p>
            <button
              onClick={handleTestLogin}
              className="w-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold py-2 px-4 rounded-xl border border-white/30 hover:bg-white/30 transition-colors"
            >
              Launch Demo
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Home;
