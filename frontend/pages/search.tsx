import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import Head from 'next/head';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage
  const saveSearch = (term: string) => {
    // Don't save empty searches
    if (!term.trim()) return;
    
    const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mocking search results for demonstration
      const mockResults = [
        { id: 1, title: `Result for "${searchTerm}"`, content: `This is a result matching "${searchTerm}"` },
        { id: 2, title: 'Related result', content: 'This might also be interesting' },
        { id: 3, title: 'Popular item', content: 'Everyone is looking at this' }
      ];
      
      setResults(mockResults);
      saveSearch(searchTerm);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // XSS Vulnerability: Using dangerouslySetInnerHTML without sanitization
  const createMarkup = (html: string) => {
    return { __html: html };
  };

  // Function to highlight the search term (XSS vulnerable)
  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    // VULNERABLE: No sanitization of user input before rendering as HTML
    return text.replace(
      new RegExp(searchTerm, 'gi'), 
      `<span style="background-color: yellow; font-weight: bold;">${searchTerm}</span>`
    );
  };

  return (
    <Container className="py-5">
      <Head>
        <title>Search - NebulaX</title>
      </Head>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h1 className="mb-4">Search NebulaX</h1>
          
          <Form onSubmit={handleSearch}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for NFTs, tokens, or topics..."
                className="form-control-lg"
              />
            </Form.Group>
            <Button type="submit" variant="primary" size="lg" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Recent Searches - XSS Vulnerable */}
      {recentSearches.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Recent Searches</h5>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <Card 
                  key={index} 
                  className="p-2 cursor-pointer" 
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch(new Event('submit') as any);
                  }}
                >
                  {/* XSS Vulnerability: Directly rendering user input */}
                  <div dangerouslySetInnerHTML={createMarkup(term)} />
                </Card>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Search Results - XSS Vulnerable */}
      {results.length > 0 && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Search Results</h5>
          </Card.Header>
          <Card.Body>
            {results.map((result) => (
              <div key={result.id} className="mb-4">
                <h4>{result.title}</h4>
                {/* XSS Vulnerability: Rendering user input with HTML */}
                <p dangerouslySetInnerHTML={createMarkup(highlightSearchTerm(result.content))} />
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Search Tips - XSS vulnerability in URL parameter rendering */}
      {searchTerm && (
        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Tips</h5>
          </Card.Header>
          <Card.Body>
            <p>
              You searched for: 
              {/* XSS Vulnerability: Rendering URL parameter value as HTML */}
              <span dangerouslySetInnerHTML={createMarkup(`<em>${searchTerm}</em>`)} />
            </p>
            <ul>
              <li>Try using specific keywords for better results</li>
              <li>Use quotes for exact phrase matching</li>
              <li>Check out our <a href="#">advanced search options</a></li>
            </ul>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Search; 