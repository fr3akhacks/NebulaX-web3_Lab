const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NebulaX Metadata Service',
    endpoints: [
      '/metadata - Instance metadata',
      '/metadata/iam - IAM credentials',
      '/metadata/network - Network information',
      '/metadata/user-data - User data'
    ]
  });
});

// Simulated instance metadata
app.get('/metadata', (req, res) => {
  res.json({
    instanceId: 'i-07b9c94684c245eb9',
    instanceType: 'm5.large',
    region: 'us-west-2',
    availabilityZone: 'us-west-2c',
    privateIpv4: '172.31.45.12',
    publicIpv4: '54.214.78.91',
    amiId: 'ami-0c55b159cbfafe1f0'
  });
});

// Simulated IAM credentials (sensitive information)
app.get('/metadata/iam', (req, res) => {
  res.json({
    role: 'nebulax-admin-role',
    accessKeyId: 'AKIA1234567890ABCDEF',
    secretAccessKey: 'NQzV9SwCVDeiY4VJ5JbvS+Y93HD8AdUKt/n+8LD1',
    token: 'IQoJb3JpZ2luX2VjELT//////////wEaCXVzLXdlc3QtMiBHGdaZXkmfiOxxFmZxc9EHcFDhgFv3zYKVZFLv',
    expiration: '2023-12-31T23:59:59Z'
  });
});

// Simulated network information
app.get('/metadata/network', (req, res) => {
  res.json({
    interfaces: [
      {
        name: 'eth0',
        mac: '0e:a5:b3:c2:d8:e1',
        ipv4: {
          private: '172.31.45.12',
          public: '54.214.78.91',
          subnet: '172.31.32.0/20',
          gateway: '172.31.32.1'
        },
        ipv6: {
          address: 'fe80::ca5:b3ff:fec2:d8e1',
          prefix: '64'
        }
      }
    ],
    vpc: {
      id: 'vpc-1a2b3c4d',
      cidr: '172.31.0.0/16',
      securityGroups: [
        {
          id: 'sg-091b3c8e',
          name: 'nebulax-sg',
          rules: [
            {
              port: 22,
              protocol: 'tcp',
              source: '0.0.0.0/0'
            },
            {
              port: 80,
              protocol: 'tcp',
              source: '0.0.0.0/0'
            },
            {
              port: 443,
              protocol: 'tcp',
              source: '0.0.0.0/0'
            }
          ]
        }
      ]
    }
  });
});

// Simulated user data (contains "secrets")
app.get('/metadata/user-data', (req, res) => {
  res.json({
    environment: 'production',
    database: {
      host: 'nebulax-db.cluster-c8a7b3mn45d2.us-west-2.rds.amazonaws.com',
      port: 5432,
      username: 'nebulax_admin',
      password: 'V3ryStr0ngP@ssw0rd!',
      name: 'nebulax_prod'
    },
    apiKeys: {
      stripe: 'sk_live_1234567890abcdefghijklmnopqrstuvwxyz',
      mailchimp: '1234567890abcdefghijklmnopqrstuvwxyz-us4',
      s3AccessKey: 'AKIA9876543210ZYXWVU',
      s3SecretKey: 'UvWxYz9876543210AbCdEfGhIjKlMnOpQrStU'
    },
    deploymentConfig: {
      version: '1.2.3',
      timestamp: '2023-04-15T12:34:56Z',
      gitCommit: 'a1b2c3d4e5f6g7h8i9j0'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Metadata server running on port ${PORT}`);
}); 