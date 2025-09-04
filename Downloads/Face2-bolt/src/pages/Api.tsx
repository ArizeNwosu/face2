import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Code, Key, Zap, Shield, Copy, ExternalLink } from 'lucide-react';

const Api = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Code className="w-4 h-4" />
              <span>API Documentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              MedSpaGen <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">API</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integrate our AI-powered before & after video generation directly into your applications with our RESTful API.
            </p>
          </div>

          {/* Getting Started */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get API Key</h3>
                <p className="text-gray-600 text-sm">Sign up and get your API key from the dashboard</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Make Request</h3>
                <p className="text-gray-600 text-sm">Send before/after images to our generation endpoint</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Video</h3>
                <p className="text-gray-600 text-sm">Receive your generated video URL within seconds</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Base URL</h3>
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border">
                <code className="text-sm text-gray-800 flex-1">https://api.medspagen.com/v1</code>
                <button
                  onClick={() => copyToClipboard('https://api.medspagen.com/v1')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">API Reference</h3>
                <nav className="space-y-2">
                  <a href="#authentication" className="block text-purple-600 hover:text-purple-800 py-2 px-3 rounded-lg hover:bg-purple-50">Authentication</a>
                  <a href="#generate-video" className="block text-gray-600 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50">Generate Video</a>
                  <a href="#get-status" className="block text-gray-600 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50">Get Status</a>
                  <a href="#webhooks" className="block text-gray-600 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50">Webhooks</a>
                  <a href="#errors" className="block text-gray-600 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50">Error Codes</a>
                  <a href="#rate-limits" className="block text-gray-600 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50">Rate Limits</a>
                </nav>
              </div>
            </div>

            {/* Main API Documentation */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Authentication */}
              <section id="authentication" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  All API requests require authentication using your API key in the Authorization header.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Header Format</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`curl -X POST https://api.medspagen.com/v1/generate \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "before_image": "data:image/jpeg;base64,/9j/4AAQSkZJ...",
    "after_image": "data:image/jpeg;base64,/9j/4AAQSkZJ...",
    "options": {
      "animation": "before_head_turn",
      "effect": "hand_gesture",
      "speed": "normal"
    }
  }'`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Generate Video */}
              <section id="generate-video" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Generate Video</h2>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">POST</span>
                  <code className="text-lg text-gray-800">/generate</code>
                </div>

                <p className="text-gray-600 mb-6">
                  Create a before & after video from two images with customizable animation options.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Body</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-900">Parameter</th>
                            <th className="text-left py-2 font-medium text-gray-900">Type</th>
                            <th className="text-left py-2 font-medium text-gray-900">Description</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-2">
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-purple-600 font-mono">before_image</td>
                            <td className="py-2 text-gray-600">string</td>
                            <td className="py-2 text-gray-600">Base64 encoded image data</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-purple-600 font-mono">after_image</td>
                            <td className="py-2 text-gray-600">string</td>
                            <td className="py-2 text-gray-600">Base64 encoded image data</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-purple-600 font-mono">options</td>
                            <td className="py-2 text-gray-600">object</td>
                            <td className="py-2 text-gray-600">Animation configuration options</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-purple-600 font-mono">webhook_url</td>
                            <td className="py-2 text-gray-600">string</td>
                            <td className="py-2 text-gray-600">Optional webhook for completion notification</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Options Object</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <table className="w-full text-sm">
                        <tbody className="space-y-2">
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-purple-600 font-mono">animation</td>
                            <td className="py-2 text-gray-600">before_head_turn | after_head_turn | after_smile | after_surprise</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-purple-600 font-mono">effect</td>
                            <td className="py-2 text-gray-600">none | hand_gesture | subtle_zoom</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-purple-600 font-mono">speed</td>
                            <td className="py-2 text-gray-600">slow | normal | fast</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Response</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "id": "vid_1234567890",
  "status": "processing",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_completion": "2024-01-15T10:31:30Z",
  "webhook_url": "https://your-app.com/webhooks/video-complete"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Get Status */}
              <section id="get-status" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <ExternalLink className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Get Video Status</h2>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
                  <code className="text-lg text-gray-800">/videos/{'{video_id}'}</code>
                </div>

                <p className="text-gray-600 mb-6">
                  Check the status of a video generation request and get the download URL when complete.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Response - Processing</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "id": "vid_1234567890",
  "status": "processing",
  "progress": 65,
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_completion": "2024-01-15T10:31:30Z"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Response - Complete</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "id": "vid_1234567890",
  "status": "completed",
  "download_url": "https://cdn.medspagen.com/videos/vid_1234567890.mp4",
  "thumbnail_url": "https://cdn.medspagen.com/thumbs/vid_1234567890.jpg",
  "duration": 8,
  "file_size": 2048576,
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:31:15Z"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Webhooks */}
              <section id="webhooks" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Webhooks</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Receive real-time notifications when your video generation is complete by providing a webhook URL.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Webhook Payload</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "event": "video.completed",
  "data": {
    "id": "vid_1234567890",
    "status": "completed",
    "download_url": "https://cdn.medspagen.com/videos/vid_1234567890.mp4",
    "thumbnail_url": "https://cdn.medspagen.com/thumbs/vid_1234567890.jpg",
    "duration": 8,
    "file_size": 2048576,
    "completed_at": "2024-01-15T10:31:15Z"
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Security</h4>
                    <p className="text-blue-800 text-sm">
                      Webhooks include a signature header for verification. Check the 
                      <code className="bg-blue-100 px-1 rounded">X-MedSpaGen-Signature</code> header to verify the payload.
                    </p>
                  </div>
                </div>
              </section>

              {/* Error Codes */}
              <section id="errors" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Error Codes</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">400</span>
                      <h4 className="font-semibold text-gray-900">Bad Request</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Invalid request format or missing required parameters</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">401</span>
                      <h4 className="font-semibold text-gray-900">Unauthorized</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Invalid or missing API key</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-mono">429</span>
                      <h4 className="font-semibold text-gray-900">Rate Limited</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Too many requests. Check rate limit headers for retry timing</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">500</span>
                      <h4 className="font-semibold text-gray-900">Internal Server Error</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Server error during processing. Retry the request or contact support</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Error Response Format</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "error": {
    "code": "invalid_image_format",
    "message": "The before_image must be a valid base64 encoded image",
    "details": "Supported formats: JPEG, PNG, WebP"
  }
}`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Rate Limits</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">10/min</div>
                    <div className="text-sm text-gray-600">Starter Plan</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">50/min</div>
                    <div className="text-sm text-gray-600">Pro Plan</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">200/min</div>
                    <div className="text-sm text-gray-600">Enterprise Plan</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Rate Limit Headers</h3>
                    <p className="text-gray-600 mb-4">
                      Each response includes rate limit information in the headers:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <code className="text-sm text-gray-800 block">
                        X-RateLimit-Limit: 50<br/>
                        X-RateLimit-Remaining: 47<br/>
                        X-RateLimit-Reset: 1642252800
                      </code>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">Need Higher Limits?</h4>
                    <p className="text-amber-800 text-sm">
                      Contact our sales team for custom enterprise pricing with higher rate limits and dedicated support.
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Api;