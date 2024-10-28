import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiFetcher from '../../data/apiFetcher';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditJournal = () => {
  const { id } = useParams(); // Get the journal ID from the URL
  const navigate = useNavigate(); // For navigating back after saving
  const [title, setTitle] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [sessionNumber, setSessionNumber] = useState(0);
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState(''); // Added mood
  const [inspirationPoints, setInspirationPoints] = useState(0); // Added inspiration points
  const [privacyLevel, setPrivacyLevel] = useState('public'); // State for privacy level
  const [relatedQuest, setRelatedQuest] = useState(''); // Added related quest
  const [wordCount, setWordCount] = useState(0);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]); // Array of tag IDs
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch available tags
    apiFetcher.get('/tags', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => setAvailableTags(response.data))
    .catch((error) => console.error('Error fetching tags:', error));

    // Fetch the journal details by ID
    apiFetcher.get(`/journals/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      const journal = response.data;
      setTitle(journal.title || '');
      setCharacterName(journal.character_name || '');
      setCampaignTitle(journal.campaign_title || '');
      setSessionNumber(journal.session_number || 0);
      setLocation(journal.location || '');
      setMood(journal.mood || ''); // Set initial mood
      setInspirationPoints(journal.inspiration_points || 0); // Set initial inspiration points
      setRelatedQuest(journal.related_quest || ''); // Set initial related quest
      setContent(journal.content || '');
      setTags(journal.tags.map(tag => tag.id)); // Map tags to IDs
      setPrivacyLevel(journal.privacy_level || 'public'); // Set initial privacy level
    })
    .catch((error) => console.error('Error fetching journal:', error));
  }, [id]);

  const handleSave = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Ensure tags is an array; if no tags are selected, send an empty array
    const updatedTags = tags.length > 0 ? tags : [];

    apiFetcher.put(`/journals/${id}`, {
      title,
      character_name: characterName,
      campaign_title: campaignTitle,
      session_number: sessionNumber,
      location,
      mood, // Include mood in the update
      inspiration_points: inspirationPoints, // Include inspiration points
      related_quest: relatedQuest, // Include related quest
      content,
      privacy_level: privacyLevel, // Send updated privacy level
      tags: updatedTags // Send tag IDs (may be empty)
    }, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then(() => {
      alert('Journal updated successfully!');
      navigate(`/journals/${id}`); // Redirect to the journal view page after saving
    })
    .catch((error) => console.error('Error updating journal:', error));
  };

  const handleTagChange = (e) => {
    const selectedTagIds = Array.from(e.target.selectedOptions).map(option => parseInt(option.value, 10));
    setTags(selectedTagIds);
  };

  return (
    <div className="edit-journal-container">
      <h2>Edit Journal</h2>
      <form onSubmit={handleSave}>
        <div className="form-row">
          <div className="form-field">
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-field">
            <label>Character Name</label>
            <input type="text" value={characterName} onChange={(e) => setCharacterName(e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Campaign Title</label>
            <input type="text" value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Session Number</label>
            <input type="number" value={sessionNumber} onChange={(e) => setSessionNumber(parseInt(e.target.value, 10))} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Mood</label>
            <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Inspiration Points</label>
            <input type="number" value={inspirationPoints} onChange={(e) => setInspirationPoints(parseInt(e.target.value, 10))} />
          </div>

          <div className="form-field">
            <label>Privacy Level</label>
            <select value={privacyLevel} onChange={(e) => setPrivacyLevel(e.target.value)}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Related Quest</label>
            <input type="text" value={relatedQuest} onChange={(e) => setRelatedQuest(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Word Count</label>
            <input type="text" value={wordCount} readOnly />
          </div>
        </div>

        <div className="form-field">
          <label>Content</label>
          <ReactQuill value={content} onChange={setContent} />
        </div>

        <div className="form-field">
          <label>Tags</label>
          <select multiple value={tags} onChange={handleTagChange}>
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <small>Select tags for this journal. It's optional to add tags.</small>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditJournal;
