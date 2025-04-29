import { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton with { ssr: false } to prevent server-side rendering
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

// Featured NFTs for homepage display with external image URLs
const FEATURED_NFTS = [
  {
    id: 1,
    name: 'NebulaX Genesis',
    image: 'https://picsum.photos/seed/nebula1/800/800',
    description: 'The first NFT in the NebulaX collection'
  },
  {
    id: 2,
    name: 'Cosmic Explorer',
    image: 'https://picsum.photos/seed/cosmic2/800/800',
    description: 'Navigate the cosmos with this exclusive NFT'
  }
];

// Featured Tokens for homepage display with external image URLs
const FEATURED_TOKENS = [
  {
    id: 'nebx',
    name: 'NebulaX',
    symbol: 'NEBX',
    price: '$0.45',
    image: 'https://picsum.photos/seed/nebx/200/200'
  },
  {
    id: 'stardust',
    name: 'Stardust',
    symbol: 'DUST',
    price: '$0.12',
    image: 'https://picsum.photos/seed/dust/200/200'
  }
];

export default function Home() {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const walletAddress = publicKey?.toBase58();

  // Prevent hydration errors by not rendering wallet-specific components until client-side
  if (!isMounted) {
    return (
      <Container className="py-5">
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="display-4 mb-4">Welcome to NebulaX Web3 Lab</h1>
            <p className="lead mb-4">
              Explore the future of decentralized finance and digital collectibles
            </p>
            <div className="d-flex justify-content-center mb-4">
              <Button variant="primary" disabled>Loading wallet...</Button>
            </div>
          </Col>
        </Row>
        {/* Skeleton loaders for NFTs and tokens would go here */}
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="display-4 mb-4">Welcome to NebulaX Web3 Lab</h1>
          <p className="lead mb-4">
            Explore the future of decentralized finance and digital collectibles
          </p>
          {!connected ? (
            <div className="d-flex justify-content-center mb-4">
              <WalletMultiButton />
            </div>
          ) : (
            <Alert variant="success" className="mb-4">
              Connected: {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
            </Alert>
          )}
        </Col>
      </Row>

      {/* NFT Section */}
      <Row className="mb-5">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Featured NFTs</h2>
            <Link href="/nfts" passHref>
              <Button variant="outline-primary">View All NFTs</Button>
            </Link>
          </div>
        </Col>
        {FEATURED_NFTS.map((nft) => (
          <Col md={6} key={nft.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <div style={{ position: 'relative', height: '200px' }}>
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <Card.Body>
                <Card.Title>{nft.name}</Card.Title>
                <Card.Text>{nft.description}</Card.Text>
                <Button 
                  variant="primary" 
                  onClick={() => router.push('/nfts')}
                >
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Token Section */}
      <Row>
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Featured Tokens</h2>
            <Link href="/tokens" passHref>
              <Button variant="outline-primary">View All Tokens</Button>
            </Link>
          </div>
        </Col>
        {FEATURED_TOKENS.map((token) => (
          <Col md={6} key={token.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <div className="d-flex align-items-center p-3">
                <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                  <img 
                    src={token.image} 
                    alt={token.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div className="ms-3">
                  <Card.Title>{token.name} ({token.symbol})</Card.Title>
                  <Card.Text>Current Price: {token.price}</Card.Text>
                </div>
              </div>
              <Card.Body>
                <Button 
                  variant="primary" 
                  onClick={() => router.push('/tokens')}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Development Section */}
      <Row className="mt-5">
        <Col className="text-center">
          <h3>Building the Future of Web3</h3>
          <p>Integrated with Solana networks</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button 
              variant="outline-secondary"
              onClick={() => window.open('https://github.com/yourusername/NebulaX-web3_Lab', '_blank')}
            >
              View on GitHub
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
} 