import React, { useState, useRef, useEffect } from 'react';
import { generateClinicalVideo } from './gemini.service.ts';

// Helper function to convert image to 16:9 aspect ratio with letterboxing/pillarboxing
const convertTo16x9 = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            // Set canvas to 16:9 aspect ratio (using 1920x1080 for high quality)
            const canvasWidth = 1920;
            const canvasHeight = 1080;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Fill canvas with black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Calculate scaling to fit image within 16:9 canvas without stretching
            const imageAspectRatio = image.width / image.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;
            
            let drawWidth, drawHeight, drawX, drawY;
            
            if (imageAspectRatio > canvasAspectRatio) {
                // Image is wider - letterbox (black bars on top/bottom)
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / imageAspectRatio;
                drawX = 0;
                drawY = (canvasHeight - drawHeight) / 2;
            } else {
                // Image is taller - pillarbox (black bars on left/right)
                drawWidth = canvasHeight * imageAspectRatio;
                drawHeight = canvasHeight;
                drawX = (canvasWidth - drawWidth) / 2;
                drawY = 0;
            }
            
            // Draw the image centered on the black canvas
            ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
            
            // Use PNG to preserve quality
            resolve(canvas.toDataURL('image/png'));
        };
        image.onerror = (error) => reject(error);
        image.src = dataUrl;
    });
};


const NewGenerate = () => {
    const [compositeImage, setCompositeImage] = useState<string | null>(null);
    const [playableVideoUrl, setPlayableVideoUrl] = useState<string | null>(null);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    // Feedback state
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState<'good' | 'bad' | null>(null);
    const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
    const [feedbackCategory, setFeedbackCategory] = useState<string>('');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    
    // Video customization state
    const [primaryAnimation, setPrimaryAnimation] = useState('animate_before_head_turn');
    const [emphasisEffect, setEmphasisEffect] = useState('none');
    const [motionSpeed, setMotionSpeed] = useState('normal');
    
    const toolSectionRef = useRef<HTMLDivElement>(null);
    const loadingStages = ['Preparing Image', 'Sending to AI', 'Generating Video', 'Finalizing Result'];

    useEffect(() => {
        // Clean up the object URL to avoid memory leaks when the component unmounts or the URL changes.
        return () => {
            if (playableVideoUrl) {
                window.URL.revokeObjectURL(playableVideoUrl);
            }
        };
    }, [playableVideoUrl]);

    const scrollToTool = () => {
        toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string | null) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    setError(null);
                    const originalImage = reader.result as string;
                    const letterboxedImage = await convertTo16x9(originalImage);
                    setImage(letterboxedImage);
                } catch (formatError) {
                    console.error("Failed to format image:", formatError);
                    setError("Failed to process the image. Please try a different one.");
                    setImage(null);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const generateVideo = async () => {
        if (!compositeImage) {
            setError("Please upload a composite 'before and after' photo.");
            return;
        }

        setIsLoading(true);
        setLoadingStage(0);
        setError(null);
        setPlayableVideoUrl(null);
        setVideoBlob(null);

        try {
            setLoadingStage(1); // Preparing Image
            const imageBase64 = compositeImage.split(',')[1];
            
            const videoOptions = { primaryAnimation, emphasisEffect, motionSpeed };
            const videoApiUrl = await generateClinicalVideo(imageBase64, videoOptions, setLoadingStage);

            // Fetch the video data to create a playable blob URL
            setLoadingStage(4); // "Finalizing Result"
            const response = await fetch(videoApiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch generated video: ${response.status} ${response.statusText}`);
            }
            const blob = await response.blob();
            setVideoBlob(blob);

            const localUrl = window.URL.createObjectURL(blob);
            setPlayableVideoUrl(localUrl);

        } catch (err: any) {
            console.error(err);
            let errorMessage = `An error occurred: ${err.message || 'Please try again.'}`;
            if (err.message && (err.message.includes('429') || err.message.toUpperCase().includes('RESOURCE_EXHAUSTED'))) {
                errorMessage = "You've exceeded the current API usage quota. Please check your plan and billing details with Google AI Studio and try again later.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setLoadingStage(0);
        }
    };

    const handleDownload = async () => {
        if (!videoBlob) return;
        setIsDownloading(true);
        setError(null);
        try {
            const url = window.URL.createObjectURL(videoBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'clinical-video.mp4';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            
            // Show feedback after successful download
            setTimeout(() => {
                if (!feedbackGiven) {
                    setShowFeedback(true);
                }
            }, 1000);
        } catch (downloadError) {
            console.error('Download failed:', downloadError);
            setError('Failed to download the video. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Feedback functions
    const handleFeedbackRating = (rating: 'good' | 'bad') => {
        setFeedbackRating(rating);
        if (rating === 'bad') {
            setShowDetailedFeedback(true);
        } else {
            // For good rating, submit immediately
            submitFeedback(rating, '', '');
        }
    };

    const handleDetailedFeedback = (category: string, text: string = '') => {
        setFeedbackCategory(category);
        submitFeedback('bad', category, text);
    };

    const submitFeedback = async (rating: 'good' | 'bad', category: string = '', text: string = '') => {
        setIsSubmittingFeedback(true);
        
        try {
            // Prepare feedback data
            const feedbackData = {
                rating,
                category,
                text,
                videoUrl: playableVideoUrl,
                compositeImageHash: compositeImage ? btoa(compositeImage.substring(0, 100)) : null,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                prompt: "Clinical demonstration video generation", // This would be the actual prompt used
            };

            console.log('📊 Feedback submitted:', feedbackData);
            
            // In production, you would send this to your backend:
            // await fetch('/api/feedback', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(feedbackData)
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setFeedbackGiven(true);
            setShowFeedback(false);
            setShowDetailedFeedback(false);
            
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmittingFeedback(false);
        }
    };
    
    const ImageUploader = ({ id, label, image, setImage }: { id: string, label: string, image: string | null, setImage: (value: string | null) => void }) => (
        <div className="mb-6 w-full overflow-hidden">
            <label htmlFor={id} className="block text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{label}</label>
            <div className={`relative border-2 border-dashed rounded-xl transition-colors w-full ${
                image ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`} style={{ 
                aspectRatio: image ? 'auto' : '16/9',
                minHeight: image ? 'auto' : '200px',
                maxWidth: '100%'
            }}>
                {!image ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-gray-600 mb-2 text-center">
                            <span className="font-medium text-sm sm:text-base">Click to upload</span> 
                            <span className="hidden sm:inline"> or drag and drop</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 text-center px-2 leading-tight">PNG, JPG, WEBP (formatted to 16:9 widescreen)</p>
                    </div>
                ) : (
                    <div className="relative w-full h-full min-h-0">
                        <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl max-w-full" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}
                <input 
                    id={id} 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={(e) => handleFileChange(e, setImage)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
            {image && (
                <button 
                    onClick={() => setImage(null)} 
                    className="mt-3 text-xs sm:text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                    Remove Image
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <img 
                                src="/logo.svg" 
                                alt="MedSpaGen Logo" 
                                className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                            <span className="text-lg sm:text-xl font-bold text-gray-900">MedSpaGen</span>
                        </a>
                        <nav className="flex items-center">
                            <a href="/" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors">Back to Home</a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Create Your Before & After Video</h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                        Upload your composite before & after photo to create stunning transformation videos for your MedSpa or aesthetic practice
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                    <div className="upload-area mb-8">
                        <ImageUploader 
                            id="composite-upload" 
                            label="Upload Composite Before & After Photo" 
                            image={compositeImage} 
                            setImage={setCompositeImage} 
                        />
                    </div>

                    {/* Video Style Customization Section */}
                    <div className="video-style-section mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-sm">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                                Customize Your Video Style
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Fine-tune the animation and emphasis to match your clinical presentation needs
                            </p>
                        </div>
                        
                        <div className="style-controls grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            <div className="style-control group">
                                <label htmlFor="primary-animation" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    Primary Animation
                                </label>
                                <div className="relative">
                                    <select 
                                        id="primary-animation"
                                        value={primaryAnimation}
                                        onChange={(e) => setPrimaryAnimation(e.target.value)}
                                        className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <option value="animate_before_head_turn">Animate 'Before' (Head Turn)</option>
                                        <option value="animate_after_head_turn">Animate 'After' (Head Turn)</option>
                                        <option value="animate_after_smile">Animate 'After' (Gentle Smile)</option>
                                        <option value="animate_after_surprise">Animate 'After' (Pleased Surprise)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="style-control group">
                                <label htmlFor="emphasis-effect" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    Emphasis Effect
                                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <select 
                                        id="emphasis-effect"
                                        value={emphasisEffect}
                                        onChange={(e) => setEmphasisEffect(e.target.value)}
                                        className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <option value="none">None</option>
                                        <option value="hand_gesture">Highlight with Hand Gesture</option>
                                        <option value="subtle_zoom">Subtle Zoom on 'After'</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="style-control group">
                                <label htmlFor="motion-speed" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Motion Speed
                                </label>
                                <div className="relative">
                                    <select 
                                        id="motion-speed"
                                        value={motionSpeed}
                                        onChange={(e) => setMotionSpeed(e.target.value)}
                                        className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <option value="slow">Slow</option>
                                        <option value="normal">Normal</option>
                                        <option value="fast">Slightly Faster</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-6 sm:mb-8">
                        <button 
                            onClick={generateVideo} 
                            disabled={!compositeImage || isLoading} 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>{isLoading ? 'Generating...' : 'Generate Video'}</span>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                            <div className="flex">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="result-area">
                        {isLoading && (
                            <div className="loading-container text-center px-2">
                                <div className="progress-stages flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6 overflow-x-auto">
                                    {loadingStages.map((stage, index) => (
                                        <div key={stage} className={`stage-item flex flex-col items-center flex-shrink-0 ${index < loadingStage - 1 ? 'completed' : ''} ${index + 1 === loadingStage ? 'active' : ''}`}>
                                            <div className={`stage-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 ${
                                                index < loadingStage - 1 ? 'bg-green-500' : 
                                                index + 1 === loadingStage ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                                            }`}>
                                                <div className="stage-icon-circle w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                            </div>
                                            <div className={`stage-label text-xs sm:text-sm text-center min-w-0 ${
                                                index < loadingStage - 1 ? 'text-green-600 font-semibold' :
                                                index + 1 === loadingStage ? 'text-blue-600 font-semibold' : 'text-gray-500'
                                            }`}>{stage}</div>
                                        </div>
                                    ))}
                                </div>
                                <p className="loading-text text-base sm:text-lg font-medium text-gray-900 mb-2">{loadingStages[loadingStage-1] || 'Initializing'}...</p>
                                {loadingStage === 3 && <p className="loading-subtext text-sm text-gray-600">This can take a few minutes. Please keep this window open.</p>}
                            </div>
                        )}
                        {playableVideoUrl && !isLoading && (
                            <div className="video-container text-center px-2">
                                <div className="mb-4 sm:mb-6">
                                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Video Generated Successfully!</h3>
                                    <p className="text-gray-600">Your transformation video is ready</p>
                                </div>
                                <div className="mb-4 sm:mb-6">
                                    <video 
                                        src={playableVideoUrl} 
                                        poster={compositeImage || undefined} 
                                        controls 
                                        autoPlay 
                                        playsInline 
                                        loop 
                                        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                                    />
                                </div>
                                <button 
                                    onClick={handleDownload} 
                                    disabled={isDownloading} 
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors mx-auto disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>{isDownloading ? 'Downloading...' : 'Download Video'}</span>
                                </button>

                                {/* Feedback Module */}
                                {showFeedback && !feedbackGiven && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">How was your video?</h4>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={() => handleFeedbackRating('good')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
                                            >
                                                <span className="text-xl">👍</span>
                                                <span>Good</span>
                                            </button>
                                            <button
                                                onClick={() => handleFeedbackRating('bad')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
                                            >
                                                <span className="text-xl">👎</span>
                                                <span>Bad</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Detailed Feedback Modal */}
                                {showDetailedFeedback && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Help us improve</h3>
                                            <p className="text-gray-600 mb-4">What went wrong with your video?</p>
                                            
                                            <div className="space-y-3 mb-4">
                                                {[
                                                    'Unnatural Movement',
                                                    'Face Was Distorted',
                                                    "Didn't Follow Instructions",
                                                    'Generated Outside The Box',
                                                    'Other'
                                                ].map((category) => (
                                                    <button
                                                        key={category}
                                                        onClick={() => setFeedbackCategory(category)}
                                                        className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                                                            feedbackCategory === category
                                                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                placeholder="Additional details (optional)..."
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                                                rows={3}
                                            />

                                            <div className="flex justify-end space-x-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setShowDetailedFeedback(false);
                                                        setFeedbackGiven(true);
                                                        setShowFeedback(false);
                                                    }}
                                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDetailedFeedback(feedbackCategory, feedbackText)}
                                                    disabled={!feedbackCategory || isSubmittingFeedback}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Thank You Message */}
                                {feedbackGiven && (
                                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-green-800 font-medium">Thank you for your feedback!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-2">
                    <p>Supported formats: PNG, JPG, WEBP • Images will be automatically formatted to 16:9 widescreen with letterboxing</p>
                </div>
            </main>

            <section className="bg-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">How It Works & FAQ</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="instructions">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Simple Steps to Your Video</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Upload Your Photo</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">Click the upload box and select a single composite image showing a "before" and "after" result side-by-side. The image will be cropped to a square.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Generate Video</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">Click the "Generate Video" button. Our AI will get to work, which can take a few minutes. Keep this window open while it processes.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Download & Share</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">Once complete, your video will appear. You can play it, and when you're ready, click the "Download Video" button to save it as an MP4 file.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="faq">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
                            <div className="space-y-6">
                                <div className="faq-item">
                                    <h4 className="font-semibold text-gray-900 mb-2">What kind of photo should I use?</h4>
                                    <p className="text-gray-600 text-sm sm:text-base">For the best results, use a high-quality, single image file that contains both the "before" and "after" photos placed side-by-side. Ensure good lighting and a clear view of the treatment area.</p>
                                </div>
                                <div className="faq-item">
                                    <h4 className="font-semibold text-gray-900 mb-2">How long does video generation take?</h4>
                                    <p className="text-gray-600 text-sm sm:text-base">The AI process is complex and typically takes 2-5 minutes. The progress bar will keep you updated on the status. We appreciate your patience!</p>
                                </div>
                                <div className="faq-item">
                                    <h4 className="font-semibold text-gray-900 mb-2">Can I upload two separate photos?</h4>
                                    <p className="text-gray-600 text-sm sm:text-base">Currently, the tool only accepts one composite image. You can easily create one using free tools like Canva, or any simple photo editor, by placing your two images next to each other and saving it as a single JPG or PNG.</p>
                                </div>
                                <div className="faq-item">
                                    <h4 className="font-semibold text-gray-900 mb-2">What happens to my uploaded images?</h4>
                                    <p className="text-gray-600 text-sm sm:text-base">Your privacy is important. Images are sent directly to the AI for processing and are not stored on our servers or used for any other purpose.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewGenerate;