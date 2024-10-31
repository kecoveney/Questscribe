import React from 'react';
import apiFetcher from '../../data/apiFetcher';
import ReactQuill from 'react-quill';


const JournalCard = ({ journal, tags, currentUserId, onDelete }) => {
  const handleDelete = () => {
    const token = localStorage.getItem('token');
    apiFetcher
      .delete(`/journals/${journal.id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        alert('Journal deleted successfully!');
        onDelete(journal.id);
      })
      .catch((error) => console.error('Error deleting journal:', error));
  };

  const contentPreview = journal.content.length > 150 
    ? `${journal.content.substring(0, 150)}...` 
    : journal.content;

  // Map tag IDs to tag names
  const tagNames = journal.tags.map(tagId => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.name : null;
  }).filter(Boolean); // Remove any null values

  // Only render the journal if it's public or belongs to the current user
  if (journal.privacy_level === 'private' && journal.user_id !== currentUserId) {
    return null;
  }

  return (
    <div className="journal-card">
      <h3>{journal.title || 'Untitled'}</h3>
      <p className="date">Posted on {new Date(journal.created_at).toLocaleDateString()}</p>
      
      {journal.privacy_level === 'private' && (
        <span className="privacy-label">Private</span>
      )}

      <p><strong>Character Name:</strong> {journal.character_name || 'N/A'}</p>
      <p><strong>Campaign Title:</strong> {journal.campaign_title || 'N/A'}</p>
      <p><strong>Session Number:</strong> {journal.session_number !== undefined ? journal.session_number : 'N/A'}</p>
      <p><strong>Location:</strong> {journal.location || 'N/A'}</p>

      {/* Preview content */}
      <ReactQuill 
        value={contentPreview} 
        readOnly={true}
        theme="bubble"
      />

      <div className="tags">
        {tagNames.length > 0 ? (
          tagNames.map((tagName, index) => (
            <span key={index} className="tag">{tagName}</span>
          ))
        ) : (
          <span className="tag no-tags">No tags available</span>
        )}
      </div>

      <a href={`/journals/${journal.id}`}>
        <button>Read More</button>
      </a>

      {journal.user_id && currentUserId === journal.user_id && (
        <>
          <a href={`/journals/edit/${journal.id}`}>
            <button>Edit</button>
          </a>
          <button onClick={handleDelete} className="delete-button">Delete</button>
        </>
      )}
    </div>
  );
};

export default JournalCard;
