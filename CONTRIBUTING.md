# Contributing to NebulaX

Thank you for your interest in contributing to NebulaX! This document provides guidelines and instructions for contributing to this security lab project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find bugs or issues (beyond the intentional vulnerabilities), please create an issue with the following information:

1. Clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Environment details (OS, browser, etc.)

### Suggesting Enhancements

For enhancement suggestions:

1. Use a clear and descriptive title
2. Provide a detailed description of the suggested enhancement
3. Explain why this enhancement would be useful
4. Provide examples of how this would be used

### Adding New Vulnerabilities

If you'd like to add a new intentional vulnerability:

1. Clearly document the vulnerability in both code comments and documentation
2. Explain the educational value of the vulnerability
3. Provide an example exploit
4. Add detection and remediation guidance

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Update documentation as needed
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards

- Follow existing code style and formatting
- Write clear, commented code
- Include tests where applicable
- Update documentation for any new features

## Project Structure

```
NebulaX-web3_Lab/
├── frontend/           # Next.js web application
├── backend/            # Express.js API server
├── contracts/          # Smart contracts and blockchain
├── db/                 # Database initialization scripts
├── metadata-server/    # Simulated metadata service
├── docker/             # Docker configuration files
└── docker-compose.yml  # Main docker-compose configuration
```

## Development Setup

1. Clone the repository
2. Run `./setup.sh` to set up the development environment
3. Make your changes to the relevant components
4. Test thoroughly

## Contact

If you have questions or need clarification, please open an issue for discussion.

Thank you for contributing to NebulaX! 