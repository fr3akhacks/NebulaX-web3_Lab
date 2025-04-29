import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Table } from 'react-bootstrap';

const PriceChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Predefined trusted price sources
  const TRUSTED_SOURCES = {
    'CoinGecko': 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    'CryptoCompare': 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
    'Binance': 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // If using a trusted source, use it directly
      const targetUrl = Object.values(TRUSTED_SOURCES).includes(url) 
        ? url 
        : `http://localhost:4000/api/fetchPrice?url=${encodeURIComponent(url)}`;

      const response = await fetch(targetUrl);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to fetch price data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="mb-4">Crypto Price Checker</h1>
          
          <div className="mb-4">
            <h5>Trusted Price Sources</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(TRUSTED_SOURCES).map(([name, sourceUrl]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setUrl(sourceUrl)}
                      >
                        Use This Source
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="mb-3 d-flex justify-content-end">
            <Button 
              variant="link" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-muted"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
          </div>

          {showAdvanced && (
            <Alert variant="warning" className="mb-4">
              <strong>Advanced Mode:</strong> Custom price sources may not be reliable.
              Use at your own risk.
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>
                {showAdvanced ? 'Custom Price Source URL:' : 'Selected Source:'}
              </Form.Label>
              <Form.Control
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={showAdvanced ? "Enter custom API endpoint..." : "Select a trusted source above"}
                readOnly={!showAdvanced}
              />
              <Form.Text className="text-muted">
                {showAdvanced 
                  ? "Enter any cryptocurrency price API endpoint" 
                  : "Using verified price sources only"}
              </Form.Text>
            </Form.Group>
            <Button type="submit" disabled={loading || (!showAdvanced && !Object.values(TRUSTED_SOURCES).includes(url))}>
              {loading ? 'Fetching...' : 'Get Price'}
            </Button>
          </Form>

          {error && (
            <Alert variant="danger">
              <pre className="mb-0">{error}</pre>
            </Alert>
          )}

          {result && (
            <div className="mt-4">
              <h5>Price Data:</h5>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PriceChecker; 