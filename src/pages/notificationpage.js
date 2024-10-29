import React, { useEffect, useState } from 'react';
import apiFetcher from '../data/apiFetcher';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiFetcher.get('/notifications/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        setNotifications(response.data);
      } catch (err) {
        setError('Error fetching notifications');
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (notificationId) => {
    const token = localStorage.getItem('token');
    try {
      await apiFetcher.delete(`/notifications/${notificationId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
      alert('Notification deleted successfully!');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <div className="notification" key={notification.id}>
            <p>
              {notification.notification_type} - {new Date(notification.created_at).toLocaleString()}
            </p>
            {notification.journal_entry && (
              <p>
                Related Entry: {notification.journal_entry_title}
              </p>
            )}
            {notification.comment && (
              <p>
                Comment: 
                <div 
                  className="comment-content" 
                  dangerouslySetInnerHTML={{ __html: notification.comment_content }} // Render HTML content
                />
              </p>
            )}
            <button onClick={() => handleDelete(notification.id)} className="notification-delete-button">Delete</button>
          </div>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationPage;
