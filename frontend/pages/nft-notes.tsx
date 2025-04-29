import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Table } from 'react-bootstrap';

interface Note {
  id: number;
  nftId: number;
  memo: string;
  createdAt: string;
}

const NFTNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nftId, setNftId] = useState('');
  const [memo, setMemo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch notes on component mount and when search term changes
  useEffect(() => {
    fetchNotes();
  }, [searchTerm]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/submitMemo?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/submitMemo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftId: parseInt(nftId),
          memo: memo
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setNftId('');
        setMemo('');
        fetchNotes(); // Refresh the notes list
      }
    } catch (err) {
      setError('Failed to submit note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h1 className="mb-4">NFT Collection Notes</h1>
          <p className="text-muted">
            Add and manage notes for your NFT collection. Search through existing notes or add new ones.
          </p>

          {/* Search Form - Vulnerable to SQL Injection */}
          <Form className="mb-4">
            <Form.Group>
              <Form.Label>Search Notes:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Form.Text className="text-muted">
                Enter keywords to filter notes
              </Form.Text>
            </Form.Group>
          </Form>

          {/* Add New Note Form */}
          <h5 className="mt-4">Add New Note</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>NFT ID:</Form.Label>
              <Form.Control
                type="number"
                value={nftId}
                onChange={(e) => setNftId(e.target.value)}
                placeholder="Enter NFT ID"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note Content:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Enter your note about this NFT..."
                required
              />
            </Form.Group>

            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Add Note'}
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-4">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Notes Table */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-4">Collection Notes</h5>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>NFT ID</th>
                  <th>Note</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id}>
                    <td>{note.nftId}</td>
                    <td>{note.memo}</td>
                    <td>{new Date(note.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NFTNotes; 