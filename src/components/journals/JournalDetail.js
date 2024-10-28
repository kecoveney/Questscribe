import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiFetcher from '../../data/apiFetcher';
import ReactQuill from 'react-quill'; // Import Quill for comment box
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const JournalDetail = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [comments, setComments] = useState([]); // To store comments
  const [newComment, setNewComment] = useState(''); // To store new comment input
  const [likeMessage, setLikeMessage] = useState(''); // To display like message

  useEffect(() => {
    // Fetch the journal details
    apiFetcher.get(`/journals/${id}`)
      .then((response) => {
        setJournal(response.data);
        setComments(response.data.comments || []); // Set the comments
      })
      .catch((error) => console.error('Error fetching journal:', error));

    // Fetch the current user's profile to get their user ID
    apiFetcher.get('/profile')
      .then((response) => {
        setCurrentUserId(response.data.id); // Set the current user ID
      })
      .catch((error) => console.error('Error fetching user profile:', error));
  }, [id]);

  const handleLikeToggle = () => {
    const token = localStorage.getItem('token');

    // Check if the current user has already liked the journal
    const userHasLiked = Array.isArray(journal.likes) && journal.likes.includes(currentUserId);

    // Toggle like or unlike
    apiFetcher.post(`/journals/${id}/like`, {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then(() => {
      // Re-fetch the updated journal data
      apiFetcher.get(`/journals/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setJournal(response.data); // Update journal with the latest data

        // Update like message based on like or unlike action
        if (!userHasLiked && response.data.likes.includes(currentUserId)) {
          setLikeMessage('Thank you for the like!');
        } else if (userHasLiked && !response.data.likes.includes(currentUserId)) {
          setLikeMessage('You have unliked this journal.');
        }
      })
      .catch((error) => console.error('Error re-fetching journal after like:', error));
    })
    .catch((error) => console.error('Error toggling like:', error));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Submit new comment
    apiFetcher.post(`/journals/${id}/add_comment`, { content: newComment }, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      // Update the comments list with the newly added comment
      setComments([...comments, response.data]);
      setNewComment(''); // Clear the comment input field
    })
    .catch((error) => console.error('Error adding comment:', error));
  };

  if (!journal) return <p>Loading...</p>;

  // Determine button label based on like status
  const isLikedByCurrentUser = journal.likes && journal.likes.includes(currentUserId);
  const likeButtonLabel = isLikedByCurrentUser ? 'Unlike' : 'Like';

  return (
    <div className="journal-detail">
      <h2>{journal.title}</h2>
      <div 
        className="journal-content"
        dangerouslySetInnerHTML={{ __html: journal.content }} // Render HTML content
      />
      
      {/* Only show the Like button if the current user is not the author */}
      {currentUserId !== journal.user_id && (
        <button onClick={handleLikeToggle}>
          {likeButtonLabel}
        </button>
      )}

      {/* Display message for liking */}
      {likeMessage && <p className="like-message">{likeMessage}</p>} {/* External message for likes */}

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments:</h3>
        {comments && comments.length > 0 ? (
          <div className="comments-boxes">
            {comments.map(comment => (
              <div key={comment.id} className="comment-box">
                <strong>{comment.author_username}:</strong>
                <p>{comment.content.replace(/<\/?[^>]+(>|$)/g, "")}</p> {/* Remove HTML tags */}
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {/* Comment Form using Quill */}
      <div className="comment-form">
        <h3>Leave a comment:</h3>
        <form onSubmit={handleCommentSubmit}>
          <ReactQuill
            value={newComment}
            onChange={setNewComment}
            placeholder="Write your comment..."
            theme="snow"
          />
          <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default JournalDetail;
