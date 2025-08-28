// Load environment variables from .env file
require('dotenv').config();

// Log environment variable status
console.log('🔑 Environment check:');
console.log('   API_KEY:', process.env.API_KEY ? '✅ Set' : '❌ Missing');
console.log('   PORT:', process.env.PORT || '3000 (default)');

const express = require('express');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const imageProcessor = require('./imageProcessor');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from current directory
app.use(express.static(__dirname));

// Create required directories
async function initializeDirectories() {
    const dirs = [
        path.join(__dirname, 'uploads', 'originals'),
        path.join(__dirname, 'outputs'),
        path.join(__dirname, 'logs')
    ];
    
    for (const dir of dirs) {
        try {
            await fs.mkdir(dir, { recursive: true });
            console.log(`Directory ensured: ${dir}`);
        } catch (error) {
            console.error(`Error creating directory ${dir}:`, error);
        }
    }
}

// Utility functions
function generateJobId() {
    return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function computeHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

function base64ToBuffer(base64String) {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}

// In-memory storage for demo (replace with database in production)
const imageStore = new Map();
const jobStore = new Map();

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/upload - Upload single image and compute SHA-256
app.post('/api/upload', async (req, res) => {
    try {
        const { image, filename = 'image.jpg' } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        // Convert base64 to buffer
        const imageBuffer = base64ToBuffer(image);
        const sha256 = computeHash(imageBuffer);
        
        // Check if this is a derivative (prevent reuse of outputs)
        if (imageStore.has(sha256) && imageStore.get(sha256).isDerivative) {
            return res.status(400).json({ 
                error: 'Cannot reuse output images. Please use original photos only.',
                original_required: true
            });
        }

        // Store original
        const originalPath = path.join(__dirname, 'uploads', 'originals', `${sha256}.jpg`);
        await fs.writeFile(originalPath, imageBuffer);
        
        // Store metadata
        imageStore.set(sha256, {
            path: originalPath,
            filename,
            width: null, // Would get from image headers in real implementation
            height: null,
            isOriginal: true,
            isDerivative: false,
            uploadedAt: new Date().toISOString()
        });

        console.log(`Image uploaded: ${sha256} (${filename})`);

        res.json({
            original_sha256: sha256,
            width: 800, // Mock dimensions
            height: 600,
            url: `/uploads/originals/${sha256}.jpg`,
            message: 'Image uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// POST /api/job - Process images based on mode
app.post('/api/job', async (req, res) => {
    console.log('Received /api/job request with body:', JSON.stringify(req.body, null, 2));
    try {
        const {
            mode,
            images = {},
            notes,
            variation,
            beautify_intensity,
            alignment_variance,
            advanced = {},
            consent_verified = false
        } = req.body;

        console.log('Processing job:', { mode, hasImages: !!images, notesLength: notes?.length });

        // Validate mode
        if (!['beautify', 'anonymize'].includes(mode)) {
            return res.status(400).json({ error: 'Invalid mode. Must be "beautify" or "anonymize"' });
        }

        // Consent validation removed for beautify mode

        // Validate inputs based on mode
        if (mode === 'beautify' && (!images.before || !images.after)) {
            return res.status(400).json({ 
                error: 'Beautify mode requires both before and after images',
                validation_error: true
            });
        }

        // Check for statelessness - ensure images are originals, not derivatives
        const imageHashes = [];
        if (images.before) {
            const beforeBuffer = base64ToBuffer(images.before);
            const beforeHash = computeHash(beforeBuffer);
            if (imageStore.has(beforeHash) && imageStore.get(beforeHash).isDerivative) {
                return res.status(400).json({ 
                    error: 'Before image appears to be a processed output. Please use original images only.',
                    stateless_violation: true
                });
            }
            imageHashes.push(beforeHash);
        }

        if (images.after) {
            const afterBuffer = base64ToBuffer(images.after);
            const afterHash = computeHash(afterBuffer);
            if (imageStore.has(afterHash) && imageStore.get(afterHash).isDerivative) {
                return res.status(400).json({ 
                    error: 'After image appears to be a processed output. Please use original images only.',
                    stateless_violation: true
                });
            }
            imageHashes.push(afterHash);
        }

        const jobId = generateJobId();
        const timestamp = new Date().toISOString();

        // Create job parameters
        const jobParams = {
            job_id: jobId,
            mode,
            timestamp,
            images: {
                before: images.before ? imageHashes[0] : null,
                after: images.after ? imageHashes[images.before ? 1 : 0] : null
            },
            notes: notes || '',
            variation: mode === 'anonymize' ? (variation || 55) : undefined,
            beautify_intensity: mode === 'beautify' ? (beautify_intensity || 5) : undefined,
            alignment_variance: alignment_variance || null,
            advanced,
            consent_verified: mode === 'beautify' ? consent_verified : false,
            status: 'processing',
            created_at: timestamp
        };

        // Save job parameters
        const paramsPath = path.join(__dirname, 'logs', `${jobId}_params.json`);
        await fs.writeFile(paramsPath, JSON.stringify(jobParams, null, 2));

        jobStore.set(jobId, {
            ...jobParams,
            originalImages: {
                before: images.before,
                after: images.after
            }
        });

        console.log(`Job created: ${jobId} (${mode})`);

        const beforeBuffer = images.before ? base64ToBuffer(images.before) : null;
        const afterBuffer = images.after ? base64ToBuffer(images.after) : null;
        
        // Process with Image Processor Service
        let result;
        if (mode === 'beautify') {
            result = await imageProcessor.beautifyPhotos(beforeBuffer, afterBuffer, jobParams);
        } else { // anonymize
            result = await imageProcessor.anonymizePhotos(beforeBuffer, afterBuffer, jobParams);
        }

        // Save outputs
        const outputPath = path.join(__dirname, 'outputs', `${jobId}.png`);
        const logPath = path.join(__dirname, 'logs', `${jobId}.json`);

        await fs.writeFile(outputPath, result.compositeBuffer);
        await fs.writeFile(logPath, JSON.stringify(result.jsonLog, null, 2));

        // Mark derivative images in store
        const outputHash = computeHash(result.compositeBuffer);
        imageStore.set(outputHash, {
            path: outputPath,
            jobId,
            isOriginal: false,
            isDerivative: true,
            createdAt: timestamp
        });

        // Update job status in the in-memory store using the final log data
        jobStore.set(jobId, { ...jobStore.get(jobId), ...result.jsonLog });

        // Clear memory buffers to prevent memory leaks
        if (global.gc) {
            global.gc();
        }

        console.log(`Job completed: ${jobId}`);

        res.json({
            job_id: jobId,
            image_url: `/outputs/${jobId}.png`,
            json_url: `/logs/${jobId}.json`,
            status: 'completed'
        });

    } catch (error) {
        console.error('Job processing error:', error);
        res.status(500).json({ 
            error: 'Failed to process images',
            details: error.message
        });
    }
});

// POST /api/feedback - Submit feedback for a job
app.post('/api/feedback', async (req, res) => {
    try {
        const { job_id, rating, comment } = req.body;

        if (!job_id || !rating || !['up', 'down'].includes(rating)) {
            return res.status(400).json({ 
                error: 'Invalid feedback. Requires job_id and rating ("up" or "down")' 
            });
        }

        const feedback = {
            job_id,
            rating,
            comment: comment || '',
            timestamp: new Date().toISOString()
        };

        // Update job JSON log with feedback
        const logPath = path.join(__dirname, 'logs', `${job_id}.json`);
        
        try {
            const existingLog = JSON.parse(await fs.readFile(logPath, 'utf8'));
            
            if (!existingLog.feedback) {
                existingLog.feedback = [];
            }
            
            existingLog.feedback.push(feedback);
            await fs.writeFile(logPath, JSON.stringify(existingLog, null, 2));
        } catch (logError) {
            console.error('Error updating job log with feedback:', logError);
        }

        // Also store in global feedback index
        const feedbackIndexPath = path.join(__dirname, 'logs', 'feedback_index.json');
        let feedbackIndex = [];
        
        try {
            const indexData = await fs.readFile(feedbackIndexPath, 'utf8');
            feedbackIndex = JSON.parse(indexData);
        } catch (error) {
            // File doesn't exist yet, start with empty array
            feedbackIndex = [];
        }
        
        feedbackIndex.push(feedback);
        await fs.writeFile(feedbackIndexPath, JSON.stringify(feedbackIndex, null, 2));

        console.log(`Feedback received for job ${job_id}: ${rating}`);

        res.json({
            message: 'Feedback recorded successfully',
            feedback_id: feedback.timestamp
        });

    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ error: 'Failed to record feedback' });
    }
});

// GET /api/job/:id - Get job status and results
app.get('/api/job/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = jobStore.get(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const response = {
            job_id: jobId,
            status: job.status,
            mode: job.mode,
            created_at: job.created_at,
            completed_at: job.completed_at
        };

        if (job.status === 'completed') {
            response.image_url = `/outputs/${jobId}.png`;
            response.json_log = `/logs/${jobId}.json`;
        }

        res.json(response);

    } catch (error) {
        console.error('Job lookup error:', error);
        res.status(500).json({ error: 'Failed to retrieve job' });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/logs', express.static(path.join(__dirname, 'logs')));

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
    await initializeDirectories();
    
    app.listen(PORT, () => {
        console.log(`Clinical Photo Anonymizer server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('Ready to process images!');
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

startServer();