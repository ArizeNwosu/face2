# Clinical Photo Anonymizer

A web application for beautifying consent-approved medical photos and anonymizing non-consented photos while preserving clinical authenticity.

## Features

### 🏥 Two Processing Modes

**Beautify Mode** (for consent-approved photos)
- Enhances photo quality while preserving identity and treatment results  
- Adjustable intensity (1-10)
- Color correction, exposure optimization, sharpening
- Maintains clinical authenticity

**Anonymize Mode** (for non-consented photos)
- Creates consistent anonymized identity across before/after pairs
- Scalable anonymization strength (15-100)
- Preserves treatment improvements in AFTER photos only
- Maintains clinical realism with similarity guards

### ⚡ Key Technical Features

- **Stateless Processing**: Always processes from original images, never reuses derivatives
- **Feedback System**: Thumbs up/down with comments for model training data
- **JSON Logging**: Complete audit trail of all processing parameters
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: Smart input validation based on selected mode

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Open your browser**
   ```
   http://localhost:3000
   ```

### Development Mode
```bash
npm run dev
```
This starts the server with automatic restarts on file changes.

## Usage

### Beautify Mode
1. Select "Beautify" mode
2. Upload before and after photos (both required)
3. Add treatment notes describing what the after photo should show
4. Adjust beautify intensity (1-10, default: 5)
5. Configure advanced options if needed
6. Click "Run Beautify"

### Anonymize Mode
1. Select "Anonymize" mode  
2. Upload 0, 1, or 2 photos (flexible)
3. Add detailed treatment notes for proper after-photo improvements
4. Set anonymization strength (15-100, default: 55)
5. Optionally override alignment variance (5-20)
6. Configure advanced options:
   - Hair micro-variation
   - Clothing type consistency
   - Eye color selection
7. Click "Run Anonymize"

### Results & Feedback
- View side-by-side composite results
- Download processed images
- Review detailed JSON processing logs
- Submit thumbs up/down feedback with optional comments

## API Endpoints

### POST /api/upload
Upload individual image and get SHA-256 hash for original tracking.

### POST /api/job
Process images based on mode with full parameter control.

### POST /api/feedback  
Submit feedback (rating + comment) for processed results.

### GET /api/job/:id
Retrieve job status and results by job ID.

## Configuration

### Advanced Options

**Hair Micro-variation**: Allows subtle changes in hair parting, volume, and loose strands between panels while maintaining the same overall style.

**Clothing Type Lock**: Ensures same clothing type across panels but allows variation in folds/wrinkles (≤15%), neutral color shifts, and subtle texture changes.

**Eye Color Override**: For anonymize mode only - specify exact eye color or leave as "random".

### Anonymization Strength Guide

- **15-30**: Minimal anonymization, subtle changes
- **31-55**: Moderate anonymization (default: 55)  
- **56-80**: Strong anonymization, significant identity changes
- **81-100**: Maximum anonymization, dramatic alterations

## File Structure

```
clinical-photo-anonymizer/
├── index.html              # Single-page web application
├── server.js               # Express server with API endpoints
├── imageProcessor.js       # Core image processing logic
├── package.json           # Node.js dependencies
├── README.md              # This file
├── uploads/originals/     # Original uploaded images
├── outputs/               # Processed composite images
└── logs/                  # JSON processing logs & feedback
```

## Security Features

- **Statelessness Enforcement**: Server rejects attempts to reuse processed outputs as inputs
- **Original-Only Processing**: SHA-256 tracking ensures only original photos are used
- **Input Validation**: File type, size limits, and parameter validation
- **Feedback Analytics**: All user feedback stored for model improvement

## Similarity Guard

The anonymization process includes an automatic similarity guard:

1. Processes images with specified anonymization strength
2. Computes face similarity between original and anonymized versions
3. If similarity exceeds threshold (based on strength setting), increases edit weights and retries
4. Maximum 3 attempts to achieve acceptable anonymization level
5. All attempts logged in JSON output

## Development

### Adding New Features

The application is built with a modular architecture:

- **Frontend**: Single HTML file with embedded CSS/JS
- **Backend**: Express.js server with clear API separation  
- **Processing**: Isolated image processing module
- **Storage**: File-based with clear directory structure

### Testing

Basic health check:
```bash
curl http://localhost:3000/health
```

### Deployment

For production deployment:

1. Set NODE_ENV=production
2. Configure proper file storage (S3, etc.)
3. Add rate limiting and authentication
4. Set up proper logging and monitoring
5. Configure HTTPS and security headers

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please check the documentation or submit an issue with:
- Steps to reproduce
- Expected vs actual behavior  
- Browser/system information
- Sample images (if applicable)