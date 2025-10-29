import React, { useState } from 'react';
import { Search, BookOpen, Heart, Loader, AlertCircle } from 'lucide-react';
import '../App.css';
import { searchOpenLibrary } from '../api/openLibrary';

export default function MainApp() {
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
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const ITEMS_PER_PAGE = 12;

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setBooks([]);

    try {
      const { docs, hasMore } = await searchOpenLibrary({
        query: searchQuery,
        page,
        limit: ITEMS_PER_PAGE,
        language,
        searchType,
        sortBy
      });

      setHasMoreResults(hasMore);

      if (!docs || docs.length === 0) {
        setError('No books found. Try a different search.');
        setBooks([]);
      } else {
        const processedBooks = docs.map(book => ({
          ...book,
          bestEdition: book.editions?.docs?.find(ed => ed.language?.includes(language)) || book.editions?.docs?.[0]
        }));
        setBooks(processedBooks);
      }
    } catch (err) {
      setError(err.message || 'Error fetching books. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (bookKey) => {
    setFavorites(prev => prev.includes(bookKey) ? prev.filter(k => k !== bookKey) : [...prev, bookKey]);
  };

  const favoriteBooks = books.filter(b => favorites.includes(b.key));
  const displayBooks = showFavoritesOnly ? favoriteBooks : books;
  const docsCount = displayBooks.length;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      performSearch();
    }
  };

  // When page changes, perform search again
  React.useEffect(() => {
    // only trigger if there's an existing query
    if (searchQuery.trim()) performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-10 shadow-md">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-5">
            <BookOpen size={40} className="text-white" />
            <div>
              <h1 className="text-3xl font-extrabold">Book Finder</h1>
              <p className="text-indigo-100 mt-1">Find books across Open Library — fast and beautifully</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-8">
        {/* Filters */}
        <div className="mb-6 bg-white rounded-2xl shadow-2xl p-6 mx-auto w-full sm:w-11/12 md:w-4/5 lg:w-3/4 max-w-5xl border border-transparent hover:border-gray-100 transition">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
              <select
                value={searchType}
                onChange={(e) => { setSearchType(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-md"
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
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-md"
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
                onChange={(e) => { setLanguage(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-md"
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
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-6 py-3 rounded-lg font-semibold text-base shadow-sm ${showFavoritesOnly ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {showFavoritesOnly ? `Favorites (${favorites.length})` : 'View All'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 items-center mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for books, authors, titles..."
            className="flex-1 p-4 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
          <button
            onClick={() => { setPage(1); performSearch(); }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                <Search />
                <span className="font-semibold">Search</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle /> {error}
          </div>
        )}

        {!error && (
          <div>
            <p className="text-gray-600 mb-6 font-medium">
              {showFavoritesOnly
                ? `${favorites.length} favorite book${favorites.length !== 1 ? 's' : ''}`
                : `Showing ${docsCount} book${docsCount !== 1 ? 's' : ''}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayBooks.map(book => (
                <div key={book.key} className="p-4 bg-white rounded-lg shadow hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
                  <div className="h-56 w-full mb-3 bg-gradient-to-br from-gray-100 to-white flex items-center justify-center overflow-hidden rounded-md">
                    {book.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-md"
                        onError={() => {
                          // fallback to no cover (react will show BookOpen)
                          setBooks(prev => prev.map(b => b.key === book.key ? { ...b, cover_i: null } : b));
                        }}
                      />
                    ) : (
                      <BookOpen size={64} className="text-gray-300" />
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
                  </p>

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

                  <div className="mt-3 flex items-center justify-between">
                    <a
                      href={`https://openlibrary.org${book.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      View on Open Library →
                    </a>

                    <button onClick={() => toggleFavorite(book.key)} className="p-2">
                      <Heart className={favorites.includes(book.key) ? 'text-red-500' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {!showFavoritesOnly && books.length > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMoreResults || loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-auto bg-gray-800 text-gray-400 text-center py-6">
        <p>Powered by Open Library API | Search millions of books</p>
      </footer>
    </div>
  );
}
