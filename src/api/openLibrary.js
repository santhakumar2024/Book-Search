export async function searchOpenLibrary({ query, page = 1, limit = 12, language = 'eng', searchType = 'all', sortBy = '' }) {
  if (!query || !query.trim()) {
    throw new Error('Please enter a search query');
  }

  const fields = [
    'key', 'title', 'author_name', 'author_key', 'cover_i',
    'first_publish_year', 'language', 'edition_count',
    'editions.key', 'editions.title', 'editions.language',
    'editions.ebook_access', 'has_fulltext', 'public_scan_b'
  ].join(',');

  const params = new URLSearchParams({
    fields,
    limit,
    page,
    lang: language
  });

  if (searchType === 'title') {
    params.append('title', query.trim());
  } else if (searchType === 'author') {
    params.append('author', query.trim());
  } else {
    params.append('q', query.trim());
  }

  if (sortBy) {
    params.append('sort', sortBy);
  }

  const url = `https://openlibrary.org/search.json?${params.toString()}`;
  const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.docs)) {
    throw new Error('Invalid response format from API');
  }

  const hasMore = (typeof data.numFound === 'number') ? data.numFound > (page * limit) : data.docs.length >= limit;

  return {
    docs: data.docs,
    numFound: data.numFound || data.docs.length,
    hasMore
  };
}
