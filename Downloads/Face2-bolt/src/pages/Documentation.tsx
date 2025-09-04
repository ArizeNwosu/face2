import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Book, Video, Code, Lightbulb, Download, Play, Settings, Zap } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Book className="w-4 h-4" />
              <span>Documentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Complete Guide to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MedSpaGen</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know to create stunning before & after videos for your medical spa practice.
            </p>
          </div>

          {/* Quick Start Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Start Guide</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Images</h3>
                <p className="text-gray-600 text-sm">Upload your before and after photos in any common format (JPG, PNG, WEBP)</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Customize Style</h3>
                <p className="text-gray-600 text-sm">Choose animation style, emphasis effects, and motion speed to match your brand</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Generate & Download</h3>
                <p className="text-gray-600 text-sm">AI generates your video in seconds. Download and share across all platforms</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Contents</h3>
                <nav className="space-y-2">
                  <a href="#getting-started" className="block text-blue-600 hover:text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-50">Getting Started</a>
                  <a href="#image-requirements" className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50">Image Requirements</a>
                  <a href="#customization" className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50">Customization Options</a>
                  <a href="#best-practices" className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50">Best Practices</a>
                  <a href="#troubleshooting" className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50">Troubleshooting</a>
                  <a href="#examples" className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50">Examples</a>
                </nav>
              </div>
            </div>

            {/* Main Documentation Content */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Getting Started */}
              <section id="getting-started" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Play className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
                </div>
                
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Setup</h3>
                  <p className="text-gray-600 mb-4">
                    Create your MedSpaGen account using your email address or Google account. Once verified, you'll have access to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                    <li>3 free video generations to test our service</li>
                    <li>Access to all animation styles and effects</li>
                    <li>High-quality video downloads (1080p)</li>
                    <li>Video history and management dashboard</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">First Video Creation</h3>
                  <p className="text-gray-600 mb-4">
                    Navigate to the "Generate" page and follow these steps:
                  </p>
                  <ol className="list-decimal list-inside text-gray-600 space-y-2">
                    <li>Upload your before photo - ensure good lighting and clear visibility of the treatment area</li>
                    <li>Upload your after photo - should match the pose and lighting of the before image</li>
                    <li>Select your preferred animation style (Before Head Turn, After Head Turn, etc.)</li>
                    <li>Choose emphasis effects and motion speed</li>
                    <li>Click "Generate Video" and wait 30-60 seconds for AI processing</li>
                  </ol>
                </div>
              </section>

              {/* Image Requirements */}
              <section id="image-requirements" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Image Requirements & Best Practices</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Requirements</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• <strong>Format:</strong> JPG, PNG, WEBP, or GIF</li>
                      <li>• <strong>Size:</strong> Maximum 10MB per image</li>
                      <li>• <strong>Resolution:</strong> Minimum 720px on the smallest side</li>
                      <li>• <strong>Aspect Ratio:</strong> Any ratio (automatically optimized)</li>
                      <li>• <strong>Quality:</strong> High resolution recommended for best results</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Photography Guidelines</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• <strong>Consistent Pose:</strong> Same angle and position in both photos</li>
                      <li>• <strong>Even Lighting:</strong> Avoid harsh shadows or overexposure</li>
                      <li>• <strong>Clear Focus:</strong> Treatment area should be sharp and visible</li>
                      <li>• <strong>Neutral Background:</strong> Simple, uncluttered backgrounds work best</li>
                      <li>• <strong>Face Visibility:</strong> Ensure the subject's face is clearly visible</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Pro Tip</h4>
                      <p className="text-amber-700">For the best results, take both photos in the same lighting conditions and camera position. This ensures seamless transitions and professional-looking videos.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Customization Options */}
              <section id="customization" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Code className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Customization Options</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Animation Styles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Before Head Turn</h4>
                        <p className="text-sm text-gray-600">The before panel shows dynamic head movement revealing the treatment area from multiple angles, while the after panel remains stable.</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">After Head Turn</h4>
                        <p className="text-sm text-gray-600">The before panel stays steady while the after panel showcases confident head movement displaying the successful results.</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">After Smile</h4>
                        <p className="text-sm text-gray-600">The after panel transitions into a natural, confident smile showing satisfaction with the treatment results.</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">After Surprise</h4>
                        <p className="text-sm text-gray-600">The after panel shows a pleased surprise expression, perfect for dramatic transformation reveals.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Emphasis Effects</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">None</h4>
                          <p className="text-sm text-gray-600">Clean, professional presentation without additional effects</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Hand Gesture</h4>
                          <p className="text-sm text-gray-600">Natural hand movement that highlights the treatment area</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Subtle Zoom</h4>
                          <p className="text-sm text-gray-600">Gentle zoom effect that draws attention to the results</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Motion Speed</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Slow</h4>
                        <p className="text-sm text-gray-600">Deliberate, clinical pace for detailed examination</p>
                      </div>
                      <div className="text-center p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Normal</h4>
                        <p className="text-sm text-gray-600">Natural, comfortable pace for general presentations</p>
                      </div>
                      <div className="text-center p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Fast</h4>
                        <p className="text-sm text-gray-600">Energetic pace for social media and marketing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Best Practices */}
              <section id="best-practices" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Best Practices</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">For Maximum Impact</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Use high-contrast before/after images that clearly show the transformation</li>
                      <li>• Ensure consistent lighting and camera angles between shots</li>
                      <li>• Choose animation styles that complement your brand personality</li>
                      <li>• Test different speeds and effects to find what resonates with your audience</li>
                      <li>• Keep the focus on the treatment area by using simple backgrounds</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Optimization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Social Media</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Use "Fast" speed for Instagram Stories and TikTok</li>
                          <li>• "Hand Gesture" effect works well for engagement</li>
                          <li>• Square crop videos perform better on Instagram</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Website & Presentations</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• "Normal" or "Slow" speed for professional contexts</li>
                          <li>• Clean animations without effects for medical presentations</li>
                          <li>• Full widescreen format for website headers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Troubleshooting */}
              <section id="troubleshooting" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Troubleshooting</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Issues</h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Video generation fails or takes too long</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Check that images are under 10MB each</li>
                          <li>• Ensure images are in supported formats (JPG, PNG, WEBP)</li>
                          <li>• Verify you have sufficient credits or subscription</li>
                          <li>• Try refreshing the page and attempting again</li>
                        </ul>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Poor video quality or unnatural movement</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Use higher resolution source images (min 720px)</li>
                          <li>• Ensure consistent pose and lighting between photos</li>
                          <li>• Avoid heavily edited or filtered source images</li>
                          <li>• Try different animation styles for better results</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Login or account issues</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Clear browser cache and cookies</li>
                          <li>• Try signing in with Google if email login fails</li>
                          <li>• Check spam folder for verification emails</li>
                          <li>• Contact support if issues persist</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Examples */}
              <section id="examples" className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Video className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Example Use Cases</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Facial Rejuvenation</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Showcase wrinkle reduction, skin tightening, or anti-aging treatments with subtle head movement in the before panel to reveal all angles.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Recommended:</strong> Before Head Turn, Normal Speed, No Effect
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Lip Enhancement</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Perfect for lip filler or lip flip results. The after smile animation naturally showcases the enhanced lips.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Recommended:</strong> After Smile, Normal Speed, Hand Gesture
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Acne Treatment</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Demonstrate clear skin results with steady before panel and confident movement in the after panel.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Recommended:</strong> After Head Turn, Slow Speed, Subtle Zoom
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Body Contouring</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Show dramatic transformation results with surprised reaction in the after panel to emphasize the improvement.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Recommended:</strong> After Surprise, Fast Speed, Hand Gesture
                    </div>
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

export default Documentation;