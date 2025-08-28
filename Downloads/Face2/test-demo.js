#!/usr/bin/env node

/**
 * Clinical Photo Anonymizer - Quick Demo Test
 * 
 * This script demonstrates the core functionality by testing
 * both beautify and anonymize modes with sample data.
 */

const fs = require('fs');
const path = require('path');

// Mock base64 image data (1x1 pixel transparent PNG)
const MOCK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8xfQAAAABJRU5ErkJggg==';

console.log('🏥 Clinical Photo Anonymizer - Demo Test');
console.log('=========================================');
console.log('');

async function runDemo() {
    try {
        // Test server health
        console.log('1. Testing server health...');
        
        const healthResponse = await fetch('http://localhost:3000/health');
        if (healthResponse.ok) {
            const health = await healthResponse.json();
            console.log('✅ Server is healthy:', health.status);
        } else {
            console.log('❌ Server health check failed');
            return;
        }

        // Test beautify mode
        console.log('\n2. Testing Beautify Mode...');
        
        const beautifyPayload = {
            mode: 'beautify',
            images: {
                before: MOCK_IMAGE,
                after: MOCK_IMAGE
            },
            notes: 'Demo acne treatment showing clearer skin and improved texture',
            beautify_intensity: 7,
            advanced: {
                hair_micro_variation: true,
                clothing_type_lock: true,
                clothing_variation: true
            }
        };

        const beautifyResponse = await fetch('http://localhost:3000/api/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(beautifyPayload)
        });

        if (beautifyResponse.ok) {
            const beautifyResult = await beautifyResponse.json();
            console.log('✅ Beautify job completed:', beautifyResult.job_id);
            
            // Test feedback submission
            const feedbackResponse = await fetch('http://localhost:3000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_id: beautifyResult.job_id,
                    rating: 'up',
                    comment: 'Excellent skin enhancement while preserving identity'
                })
            });
            
            if (feedbackResponse.ok) {
                console.log('✅ Feedback submitted successfully');
            }
        } else {
            console.log('❌ Beautify test failed');
        }

        // Test anonymize mode
        console.log('\n3. Testing Anonymize Mode...');
        
        const anonymizePayload = {
            mode: 'anonymize',
            images: {
                before: MOCK_IMAGE,
                after: MOCK_IMAGE
            },
            notes: 'Botox treatment reducing forehead wrinkles and crow\'s feet',
            variation: 75,
            alignment_variance: 15,
            advanced: {
                hair_micro_variation: true,
                clothing_type_lock: false,
                clothing_variation: true,
                eye_color: 'hazel'
            }
        };

        const anonymizeResponse = await fetch('http://localhost:3000/api/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(anonymizePayload)
        });

        if (anonymizeResponse.ok) {
            const anonymizeResult = await anonymizeResponse.json();
            console.log('✅ Anonymize job completed:', anonymizeResult.job_id);
            
            // Retrieve job details
            const jobResponse = await fetch(`http://localhost:3000/api/job/${anonymizeResult.job_id}`);
            if (jobResponse.ok) {
                const jobDetails = await jobResponse.json();
                console.log('✅ Job details retrieved:', jobDetails.status);
            }
            
            // Submit feedback
            const feedbackResponse = await fetch('http://localhost:3000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_id: anonymizeResult.job_id,
                    rating: 'up',
                    comment: 'Good anonymization with realistic results'
                })
            });
            
            if (feedbackResponse.ok) {
                console.log('✅ Feedback submitted successfully');
            }
        } else {
            console.log('❌ Anonymize test failed');
        }

        console.log('\n🎉 Demo completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('- Open http://localhost:3000 in your browser');
        console.log('- Upload real medical photos to test the full functionality');
        console.log('- Check the outputs/ and logs/ directories for results');

    } catch (error) {
        console.error('❌ Demo failed:', error.message);
        console.log('');
        console.log('Make sure the server is running:');
        console.log('  npm start');
        console.log('  or');
        console.log('  ./start.sh');
    }
}

// Add fetch polyfill for older Node versions
if (!global.fetch) {
    console.log('Installing fetch polyfill...');
    const { default: fetch } = require('node-fetch');
    global.fetch = fetch;
}

runDemo();