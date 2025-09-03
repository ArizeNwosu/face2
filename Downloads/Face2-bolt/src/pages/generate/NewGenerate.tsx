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
            
            const videoApiUrl = await generateClinicalVideo(imageBase64, setLoadingStage);

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
        } catch (downloadError) {
            console.error('Download failed:', downloadError);
            setError('Failed to download the video. Please try again.');
        } finally {
            setIsDownloading(false);
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
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">MedSpaGen</span>
                        </div>
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