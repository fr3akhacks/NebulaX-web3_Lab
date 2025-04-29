import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';

interface LoginResponse {
  user?: {
    id: number;
    username: string;
    email: string;
    is_admin: number;
  };
  message?: string;
  error?: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setUserData(null);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data: LoginResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.user) {
        setSuccess(data.message || 'Login successful!');
        setUserData(data.user);
        // Redirect if the login is successful
        if (data.user.is_admin) {
          setTimeout(() => router.push('/admin'), 2000);
        }
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h1 className="mb-4 text-center">Login</h1>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-4">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mt-4">
                  {success}
                </Alert>
              )}

              {userData && (
                <Card className="mt-4">
                  <Card.Header>User Information</Card.Header>
                  <Card.Body>
                    <pre>{JSON.stringify(userData, null, 2)}</pre>
                  </Card.Body>
                </Card>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-muted">
                  <small>Note: This login page is intentionally vulnerable to SQL injection for educational purposes.</small>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 