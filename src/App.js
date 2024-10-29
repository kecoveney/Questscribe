import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Profile from './pages/Profile';
import ProfileEdit from './components/profile/ProfileEdit';
import JournalFormPage from './pages/JournalFormPage';
import JournalDetail from './components/journals/JournalDetail';
import JournalsPage from './pages/JournalsPage';
import EditJournal from './components/journals/EditJournal';
import UserList from './components/UserList';           // Import UserList
import UserProfile from './components/profile/userprofile'; // Import UserProfile
import NotificationPage from './pages/notificationpage'; // Make sure this is correctly imported

import './css/styles.css';  // Global CSS

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />  {/* Navbar visible on all pages */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />  {/* Home Page */}
            <Route path="/login" element={<LoginPage />} />  {/* Login Page */}
            <Route path="/signup" element={<SignupPage />} />  {/* Signup Page */}
            <Route path="/profile" element={<Profile />} />  {/* Profile Page */}
            <Route path="/profile/edit" element={<ProfileEdit />} /> {/* Edit Profile Page */}
            <Route path="/journals/edit/:id" element={<EditJournal />} /> {/* Edit Journal Page */}
            <Route path="/journals/new" element={<JournalFormPage />} />  {/* New Journal Page */}
            <Route path="/journals/:id" element={<JournalDetail />} />  {/* Journal Detail Page */}
            <Route path="/journals" element={<JournalsPage />} /> {/* Journals List Page */}
            <Route path="/users" element={<UserList />} />          {/* User List Page */}
            <Route path="/notifications" element={<NotificationPage />} /> {/* Correct this line */}
            <Route path="/profile/:id" element={<UserProfile />} />    {/* User Profile Page */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
