import React, { useState } from 'react';
import { Search, BookOpen, Heart, Loader, AlertCircle } from 'lucide-react';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState('eng');
  const [docsCount, setDocsCount] = useState(0); // Track current docs count
  const [previousDocsCount, setPreviousDocsCount] = useState(0); // Track previous page docs count
  const ITEMS_PER_PAGE = 12;

  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setBooks([]);

    try {
      const fields = [
        'key', 'title', 'author_name', 'author_key', 'cover_i',
        'first_publish_year', 'language', 'edition_count',
        'editions.key', 'editions.title', 'editions.language',
        'editions.ebook_access', 'has_fulltext', 'public_scan_b'
      ].join(',');

      let searchParams = new URLSearchParams({
        fields,
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE, // Use offset instead of page
        lang: language
      });

      // Add search parameters based on type
      if (searchType === 'title') {
        searchParams.append('title', searchQuery.trim());
      } else if (searchType === 'author') {
        searchParams.append('author', searchQuery.trim());
      } else {
        searchParams.append('q', searchQuery.trim());
      }

      // Add sort parameter if specified
      if (sortBy) {
        searchParams.append('sort', sortBy);
      }

      const url = `https://openlibrary.org/search.json?${searchParams.toString()}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      console.log('Docs count:', data.docs?.length);

      if (!data || !Array.isArray(data.docs)) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid response format from API');
      }

      // Store the current docs count
      const currentDocsCount = data.docs.length;
      setDocsCount(currentDocsCount);
      
      // Store previous count to detect if we've reached the end
      if (currentDocsCount < ITEMS_PER_PAGE) {
        setPreviousDocsCount(0); // Mark as last page
      } else {
        setPreviousDocsCount(currentDocsCount);
      }

      if (data.docs.length === 0) {
        setError('No books found. Try a different search.');
        setBooks([]);
      } else {
        const processedBooks = data.docs.map(book => ({
          ...book,
          // Get the first matching edition with the user's language preference
          bestEdition: book.editions?.docs?.find(ed => 
            ed.language?.includes(language)) || book.editions?.docs?.[0]
        }));
        setBooks(processedBooks);
      }
    } catch (err) {
      const errorMessage = err.message || 'Error fetching books. Please try again.';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (book) => {
    const bookId = book.key;
    if (favorites.find(fav => fav.key === bookId)) {
      setFavorites(favorites.filter(fav => fav.key !== bookId));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  const isFavorited = (book) => favorites.some(fav => fav.key === book.key);

  const displayBooks = showFavoritesOnly ? favorites : books;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchBooks();
    }
  };

  // Determine if there are more results based on docs count
  const hasMoreResults = docsCount >= ITEMS_PER_PAGE;

  // Handle next page click
  const handleNextPage = () => {
    setPage(p => p + 1);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle previous page click
  const handlePreviousPage = () => {
    setPage(p => Math.max(1, p - 1));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Re-fetch when page changes
  React.useEffect(() => {
    if (searchQuery.trim()) {
      searchBooks();
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={32} />
            <h1 className="text-3xl font-bold">Book Finder</h1>
          </div>
          <p className="text-indigo-100">Your personal library search companion</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setPage(1); // Reset page when changing search type
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Fields</option>
                  <option value="title">By Title</option>
                  <option value="author">By Author</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1); // Reset page when changing sort
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Relevance</option>
                  <option value="new">Newest First</option>
                  <option value="old">Oldest First</option>
                  <option value="rating">Rating</option>
                  <option value="editions">Most Editions</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setPage(1); // Reset page when changing language
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="eng">English</option>
                  <option value="fre">French</option>
                  <option value="spa">Spanish</option>
                  <option value="ger">German</option>
                  <option value="rus">Russian</option>
                  <option value="chi">Chinese</option>
                  <option value="jpn">Japanese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                    showFavoritesOnly
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {showFavoritesOnly ? `Favorites (${favorites.length})` : 'View All'}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Search by ${searchType}...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  setPage(1); // Reset to page 1 on new search
                  searchBooks();
                }}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50"
              >
                <Search size={20} />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        {/* Empty State */}
        {!loading && displayBooks.length === 0 && !error && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {showFavoritesOnly ? 'No favorite books yet. Start adding some!' : 'Start searching to find your next great read'}
            </p>
          </div>
        )}

        {/* Books Grid */}
        {displayBooks.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6 font-medium">
              {showFavoritesOnly
                ? `${favorites.length} favorite book${favorites.length !== 1 ? 's' : ''}`
                : `Found ${docsCount} book${docsCount !== 1 ? 's' : ''} on this page`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayBooks.map((book) => (
                <div
                  key={book.key}
                  className="book-card bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative bg-gray-200 h-64 overflow-hidden flex items-center justify-center">
                    {book.cover_i ? (
                      <div className="w-full h-full">
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.log('Cover image failed to load:', book.cover_i);
                            book.cover_i = null;
                            setBooks([...books]);
                          }}
                        />
                      </div>
                    ) : (
                      <BookOpen size={48} className="text-gray-400" />
                    )}
                    <button
                      onClick={() => toggleFavorite(book)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                    >
                      <Heart
                        size={20}
                        className={isFavorited(book) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                      />
                    </button>
                  </div>

                  {/* Book Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-500 flex-1">
                      {book.first_publish_year && (
                        <p>
                          <span className="font-medium">Year:</span> {book.first_publish_year}
                        </p>
                      )}
                      {book.edition_count && (
                        <p>
                          <span className="font-medium">Editions:</span> {book.edition_count}
                        </p>
                      )}
                      {book.isbn && book.isbn.length > 0 && (
                        <p>
                          <span className="font-medium">ISBN:</span> {book.isbn[0]}
                        </p>
                      )}
                      {book.language && book.language.length > 0 && (
                        <p>
                          <span className="font-medium">Language:</span> {book.language[0]}
                        </p>
                      )}
                      {book.ebook_access && (
                        <p>
                          <span className="font-medium">Ebook:</span>{' '}
                          {book.ebook_access === 'public' ? 'Available' : 
                           book.ebook_access === 'borrowable' ? 'Borrowable' : 
                           book.ebook_access === 'printdisabled' ? 'Print Disabled' : 'Not Available'}
                        </p>
                      )}
                    </div>

                    {/* View Details Link */}
                    <a
                      href={`https://openlibrary.org${book.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      View on Open Library →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {!showFavoritesOnly && books.length > 0 && (
              <div className="mt-8 flex justify-center gap-2 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                  Page {page}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!hasMoreResults || loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!hasMoreResults ? 'No more results available' : 'Load next page'}
                >
                  Next →
                </button>

                <span className="px-2 py-2 text-xs text-gray-600">
                  (Showing {docsCount} results)
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-16">
        <p>Powered by Open Library API | Search millions of books</p>
      </footer>
    </div>
  );
}

export default App;