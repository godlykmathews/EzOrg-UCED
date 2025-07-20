import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import Approvals from './pages/Approvals'
import Announcements from './pages/Announcements'
import NoticeBoard from './pages/NoticeBoard'
import Profile from './pages/Profile'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  console.log('App: Current state:', { user, loading });

  if (loading) {
    console.log('App: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('App: No user, showing Login');
    return <Login />;
  }

  console.log('App: User authenticated, showing main app');
  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/events" element={<Events user={user} />} />
          <Route path="/events/:id" element={<EventDetail user={user} />} />
          <Route path="/events/create" element={<CreateEvent user={user} />} />
          <Route path="/approvals" element={<Approvals user={user} />} />
          <Route path="/announcements" element={<Announcements user={user} />} />
          <Route path="/notice-board" element={<NoticeBoard user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
