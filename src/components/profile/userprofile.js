import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import profileFetcher from '../../data/profileFetcher'; // Adjust path as needed

const UserProfile = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [profile, setProfile] = useState(null); // State to hold profile data
  const [error, setError] = useState(null); // State to hold error messages
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileFetcher.getProfileById(id); // Use profileFetcher to get user data
        setProfile(response); // Set the profile data
        console.log("Fetched Profile:", response); // Debugging log to check profile data
      } catch (err) {
        setError('Error fetching user profile'); // Handle error
        console.error("Error fetching profile:", err); // Debugging log for errors
      }
    };

    fetchProfile();
  }, [id]);

  if (error) return <p>{error}</p>; // Display error message if any
  if (!profile) return <p>Loading...</p>; // Show loading state while fetching

  // Debugging logs for comparison
  const loggedInUserId = parseInt(localStorage.getItem('user_id'), 10);
  console.log("Profile User ID:", profile.user_id);
  console.log("Logged-in User ID from localStorage:", loggedInUserId);

  return (
    <div className="profile-page">
      <h2>{profile.display_name}'s Profile</h2>
      <div className="profile-card">
        <div className="profile-header">
          <img src={profile.profile_photo} alt="Profile" />

          <div className="profile-info-column">
            <h1>{profile.display_name}</h1>
            <h2>{profile.username}</h2>
            <h3>{profile.role}</h3>
          </div>
        </div>
        <div className="profile-details-container">
          <div className="profile-info">
            <div className="detail-box">
              <p><strong>Email:</strong> {profile.email}</p>
            </div>
            <div className="detail-box">
              <p><strong>Bio:</strong> {profile.bio}</p>
            </div>
            <div className="detail-box">
              <p><strong>Member Since:</strong> {new Date(profile.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
          {/* Show the edit button only for the logged-in user */}
          {profile.user_id === loggedInUserId && (
            <div className="button-container">
              <button onClick={() => navigate('/profile/edit')}>Edit Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
