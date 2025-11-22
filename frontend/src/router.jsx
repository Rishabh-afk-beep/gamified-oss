import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './AppLayout';

// Import Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import InteractiveQuestDetail from './pages/InteractiveQuestDetail';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AIChat from './pages/AIChat';
import GitHubIntegration from "./pages/GitHubIntegration"; // ✅ Added this
import CodeReviewer from './pages/CodeReviewer'; // ✅ LeetCode-style code reviewer
import DetailedTutorials from './pages/DetailedTutorials';
import GamificationStats from './pages/GamificationStats';
import WorkflowDashboard from './pages/WorkflowDashboard';



export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/ai-chat',
        element: (
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        ),
      },
      {
        path: '/code-reviewer',
        element: (
          <ProtectedRoute>
            <CodeReviewer />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tutorials',
        element: <DetailedTutorials />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/workflow',
        element: <ProtectedRoute><WorkflowDashboard /></ProtectedRoute>,

      },
      {
        path: '/quests',
        element: (
          <ProtectedRoute>
            <Quests />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quests/:questId',
        element: (
          <ProtectedRoute>
            <InteractiveQuestDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '/leaderboard',
        element: (
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/analytics',
        element: (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gamification-stats',
        element: <ProtectedRoute><GamificationStats /></ProtectedRoute>,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // ✅ NEW GITHUB INTEGRATION PAGE
      {
        path: '/github',
        element: (
          <ProtectedRoute>
            <GitHubIntegration />
          </ProtectedRoute>
        ),
      },

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
