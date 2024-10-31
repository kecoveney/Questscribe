import React, { useEffect, useState, useRef } from 'react';
import apiFetcher, { fetchTags } from '../../data/apiFetcher';
import ReactQuill from 'react-quill';


const JournalForm = () => {
  const [title, setTitle] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [sessionNumber, setSessionNumber] = useState(0);
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('');
  const [inspirationPoints, setInspirationPoints] = useState(0);
  const [privacyLevel, setPrivacyLevel] = useState('public');
  const [relatedQuest, setRelatedQuest] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]); // Array to hold selected tag ids
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const quillRef = useRef(null);

  // Fetch available tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags. Please try again later.');
      }
    };
    loadTags();
  }, []);

  // Track content and word count
  const handleQuillChange = (value) => {
    setContent(value);
    const count = value.split(' ').filter(word => word.length > 0).length;
    setWordCount(count);
  };

  // Handle tag selection (sending an array of tag IDs)
  const handleTagChange = (e) => {
    const selectedTagIds = Array.from(e.target.selectedOptions).map(option => parseInt(option.value, 10));
    setTags(selectedTagIds); // Ensure tags is an array of integers
  };

  // Ensure session number is a non-negative integer
  const handleSessionNumberChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10));
    setSessionNumber(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in.');
      setIsLoading(false);
      return;
    }

    try {
      await apiFetcher.post('/journals', {
        title,
        character_name: characterName,
        campaign_title: campaignTitle,
        session_number: sessionNumber,
        location,
        mood,
        content,
        inspiration_points: inspirationPoints,
        privacy_level: privacyLevel,
        related_quest: relatedQuest,
        word_count: wordCount,
        tags // Send only tag IDs
      });

      alert('Journal created successfully!');
      // Reset form fields after successful submission
      setTitle('');
      setCharacterName('');
      setCampaignTitle('');
      setSessionNumber(0);
      setLocation('');
      setMood('');
      setInspirationPoints(0);
      setRelatedQuest('');
      setContent('');
      setTags([]);
      setWordCount(0);
    } catch (error) {
      console.error('Error creating journal:', error);
      setError('Failed to create journal. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="journal-form">
      {error && <p className="error">{error}</p>}

      <div className="form-row">
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Character Name</label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Campaign Title</label>
          <input
            type="text"
            value={campaignTitle}
            onChange={(e) => setCampaignTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Session Number</label>
          <input
            type="number"
            value={sessionNumber}
            min="0"
            onChange={handleSessionNumberChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Mood</label>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Inspiration Points</label>
          <input
            type="number"
            value={inspirationPoints}
            onChange={(e) => setInspirationPoints(parseInt(e.target.value, 10))}
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Privacy Level</label>
          <select
            value={privacyLevel}
            onChange={(e) => setPrivacyLevel(e.target.value)}
            disabled={isLoading}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Related Quest</label>
          <input
            type="text"
            value={relatedQuest}
            onChange={(e) => setRelatedQuest(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Word Count</label>
          <input
            type="text"
            value={wordCount}
            readOnly
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label>Content</label>
        <ReactQuill value={content} onChange={handleQuillChange} />
      </div>

      <div>
        <label>Tags</label>
        <select
          multiple
          value={tags}
          onChange={handleTagChange}
          disabled={isLoading || availableTags.length === 0}
        >
          {availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))
          ) : (
            <option disabled>No tags available</option>
          )}
        </select>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Journal'}
      </button>
    </form>
  );
};

export default JournalForm;
