import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { generateClinicalVideo } from './gemini.service.ts';

// Helper function to crop an image data URL to a square
const cropImageToSquare = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            const size = Math.min(image.width, image.height);
            canvas.width = size;
            canvas.height = size;
            
            const x = (image.width - size) / 2;
            const y = (image.height - size) / 2;
            
            ctx.drawImage(image, x, y, size, size, 0, 0, size, size);
            
            // Use PNG to preserve quality
            resolve(canvas.toDataURL('image/png'));
        };
        image.onerror = (error) => reject(error);
        image.src = dataUrl;
    });
};


const App = () => {
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
                    const croppedImage = await cropImageToSquare(originalImage);
                    setImage(croppedImage);
                } catch (cropError) {
                    console.error("Failed to crop image:", cropError);
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
        <div className="image-uploader">
            <label htmlFor={id} className="uploader-label">{label}</label>
            <div className={`uploader-box ${image ? 'has-image' : ''}`} style={{ backgroundImage: image ? `url(${image})` : 'none' }}>
                {!image ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span>Click to upload</span>
                        <p>PNG, JPG, WEBP (will be cropped square)</p>
                    </>
                ) : (
                    <div className="upload-success-overlay">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                )}
                <input id={id} type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e, setImage)} />
            </div>
            {image && <button onClick={() => setImage(null)} className="clear-button">Remove</button>}
        </div>
    );

    return (
        <>
            <header className="header">
                <div className="container">
                    <nav className="navbar">
                        <a href="/" className="logo">Face2 AI</a>
                    </nav>
                </div>
            </header>

            <main>
                <section className="hero">
                    <div className="container">
                        <h1 className="hero-title">Transform Before & After Photos into Engaging Videos</h1>
                        <p className="hero-subtitle">Effortlessly create professional before-and-after videos for your MedSpa or aesthetic practice. Showcase results, build trust, and attract more clients.</p>
                        <button className="cta-button" onClick={scrollToTool}>Create Your Video Now</button>
                    </div>
                </section>

                <section className="features">
                    <div className="container">
                        <div className="feature-grid">
                            <div className="feature-item">
                                <h3>Showcase True Results</h3>
                                <p>Provide a dynamic, realistic view of treatment outcomes that static photos can't capture.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Engage Your Audience</h3>
                                <p>Video content is proven to be more engaging on social media, websites, and in consultations.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Simple & Fast</h3>
                                <p>No video editing skills required. Go from photo to professional video in just a few minutes.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="tool" ref={toolSectionRef} className="tool-section">
                    <div className="container">
                        <h2 className="tool-title">Generate Your Video</h2>
                        <div className="tool-content">
                            <div className="upload-area">
                                <ImageUploader id="composite-upload" label="Upload Composite Before & After Photo" image={compositeImage} setImage={setCompositeImage} />
                            </div>
                            <button onClick={generateVideo} disabled={!compositeImage || isLoading} className="generate-button">
                                {isLoading ? 'Generating...' : 'Generate Video'}
                            </button>
                            {error && <p className="error-message">{error}</p>}
                            <div className="result-area">
                                {isLoading && (
                                    <div className="loading-container">
                                        <div className="progress-stages">
                                            {loadingStages.map((stage, index) => (
                                                <div key={stage} className={`stage-item ${index < loadingStage - 1 ? 'completed' : ''} ${index + 1 === loadingStage ? 'active' : ''}`}>
                                                    <div className="stage-icon">
                                                        <div className="stage-icon-circle"></div>
                                                    </div>
                                                    <div className="stage-label">{stage}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="loading-text">{loadingStages[loadingStage-1] || 'Initializing'}...</p>
                                        {loadingStage === 3 && <p className="loading-subtext">This can take a few minutes. Please keep this window open.</p>}
                                    </div>
                                )}
                                {playableVideoUrl && !isLoading && (
                                    <div className="video-container">
                                        <video src={playableVideoUrl} poster={compositeImage || undefined} controls autoPlay playsInline loop />
                                        <button onClick={handleDownload} disabled={isDownloading} className="download-button">
                                            {isDownloading ? 'Downloading...' : 'Download Video'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Face2 AI. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);