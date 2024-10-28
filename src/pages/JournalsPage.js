import React, { useEffect, useState } from 'react';
import apiFetcher from '../data/apiFetcher';
import JournalCard from '../components/journals/JournalCard';

const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [tags, setTags] = useState([]); // State for all tags
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState(null); // State for selected tag
  const [filterByUser, setFilterByUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch all tags
    apiFetcher.get('/tags', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => setTags(response.data))
    .catch((error) => console.error('Error fetching tags:', error));

    // Fetch the current user's profile to get their user ID
    apiFetcher
      .get('/profile', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => setCurrentUserId(response.data.id))
      .catch((error) => console.error('Error fetching user profile:', error));

    // Load journals initially
    fetchJournals();
  }, [filterByUser, searchTerm, selectedTagId]);

  const fetchJournals = () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    // Fetch journals with optional filtering and search parameters
    apiFetcher
      .get('/journals', {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: {
          search: searchTerm,
          user_only: filterByUser ? 'true' : 'false',
        },
      })
      .then((response) => {
        // Get the journals from the response
        let filteredJournals = response.data;
      
        // Filter journals by the selected tag if a tag is selected
        if (selectedTagId) {
          filteredJournals = filteredJournals.filter((journal) => 
            journal.tags && journal.tags.includes(Number(selectedTagId)) // Ensure selectedTagId is a number
          );
        }
      
        setJournals(filteredJournals);
        setNoResults(filteredJournals.length === 0); // Check for no results after filtering
      })
      
      .catch((error) => console.error('Error fetching journals:', error))
      .finally(() => setIsLoading(false));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term as user types
  };

  const handleTagChange = (e) => {
    setSelectedTagId(e.target.value); // Set the selected tag ID
  };

  const toggleUserFilter = (filterByCurrentUser) => {
    setFilterByUser(filterByCurrentUser); // Switch between all journals and current user's journals
  };

  const handleDelete = (id) => {
    setJournals(journals.filter((journal) => journal.id !== id)); // Remove deleted journal from state
  };

  return (
    <div className="journals-page">
      <h2>Journals</h2>

      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search journals..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Tag filter dropdown */}
      <div>
        <label htmlFor="tag-filter">Filter by Tag:</label>
        <select id="tag-filter" onChange={handleTagChange} value={selectedTagId || ''}>
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>

      {/* Buttons for filtering */}
      <div className="filter-buttons">
        <button 
          className={`filter-button ${!filterByUser ? 'active' : ''}`} 
          onClick={() => toggleUserFilter(false)} 
        >
          Show All Journals
        </button>

        <button 
          className={`filter-button ${filterByUser ? 'active' : ''}`} 
          onClick={() => toggleUserFilter(true)} 
        >
          Show My Journals
        </button>
      </div>

      {/* Journals list */}
      {isLoading ? (
        <p>Loading journals...</p>
      ) : noResults ? (
        <p>No journals available for the selected tag.</p> // Message when no journals are found
      ) : (
        <div className="journals-list">
          {journals.map((journal) => (
            <JournalCard
              key={journal.id}
              journal={journal}
              tags={tags} // Pass tags down to JournalCard
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalsPage;
