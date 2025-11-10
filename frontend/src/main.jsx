import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import GitHubTutorials from './pages/GitHubTutorials';
import QuestMap from './pages/QuestMap';
import QuestDetail from './pages/QuestDetail';
import GamificationStats from './pages/GamificationStats';
import Sidebar from './components/common/Sidebar';
import WorkflowDashboard from './pages/WorkflowDashboard';




import { router } from './router'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
