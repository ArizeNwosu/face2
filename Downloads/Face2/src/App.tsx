import React, { useState, useRef, useCallback } from 'react';
import { 
  Camera, 
  Sparkles, 
  Shield, 
  Upload, 
  Settings, 
  ChevronDown, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Download, 
  RotateCcw,
  Eye,
  FileText
} from 'lucide-react';

interface ProcessingData {
  job_id: string;
  image_url: string;
  json_url?: string;
}

type Mode = 'beautify' | 'anonymize';
type EyeColor = 'random' | 'hazel' | 'green' | 'gray' | 'brown';

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('beautify');
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingData | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'up' | 'down' | null>(null);
  const [selectedEyeColor, setSelectedEyeColor] = useState<EyeColor>('random');
  
  // Form values
  const [notes, setNotes] = useState('');
  const [anonymizeStrength, setAnonymizeStrength] = useState(55);
  const [alignmentVariance, setAlignmentVariance] = useState(12);
  const [beautifyIntensity, setBeautifyIntensity] = useState(5);
  const [hairMicroVariation, setHairMicroVariation] = useState(true);
  const [clothingTypeLock, setClothingTypeLock] = useState(true);
  const [feedbackComment, setFeedbackComment] = useState('');

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const eyeColors: { color: EyeColor; name: string; bgClass: string }[] = [
    { color: 'random', name: 'Random', bgClass: 'bg-gradient-to-r from-blue-400 to-green-400' },
    { color: 'hazel', name: 'Hazel', bgClass: 'bg-amber-600' },
    { color: 'green', name: 'Green', bgClass: 'bg-green-600' },
    { color: 'gray', name: 'Gray', bgClass: 'bg-gray-500' },
    { color: 'brown', name: 'Brown', bgClass: 'bg-amber-900' },
  ];

  const handleFileUpload = useCallback((file: File, type: 'before' | 'after') => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'before') {
        setBeforeImage(result);
      } else {
        setAfterImage(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = (type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforeImage(null);
    } else {
      setAfterImage(null);
    }
  };

  const isValidInput = () => {
    if (currentMode === 'beautify') {
      return beforeImage && afterImage;
    }
    return beforeImage || afterImage;
  };

  const processImages = async () => {
    if (!isValidInput()) return;

    setIsProcessing(true);

    const payload = {
      mode: currentMode,
      images: {
        before: beforeImage,
        after: afterImage
      },
      notes,
      variation: currentMode === 'anonymize' ? anonymizeStrength : undefined,
      beautify_intensity: currentMode === 'beautify' ? beautifyIntensity : undefined,
      alignment_variance: alignmentVariance === 12 ? null : alignmentVariance,
      advanced: {
        hair_micro_variation: hairMicroVariation,
        clothing_type_lock: clothingTypeLock,
        clothing_variation: true,
        eye_color: currentMode === 'anonymize' ? selectedEyeColor : undefined
      },
      consent_verified: currentMode === 'beautify'
    };

    try {
      const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Processing failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Processing error:', error);
      alert(`Error processing images: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitFeedback = async (rating: 'up' | 'down') => {
    if (!results?.job_id) return;

    setFeedbackRating(rating);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_id: results.job_id,
          rating,
          comment: feedbackComment
        })
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const resetApp = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setResults(null);
    setNotes('');
    setFeedbackComment('');
    setAnonymizeStrength(55);
    setAlignmentVariance(12);
    setBeautifyIntensity(5);
    setSelectedEyeColor('random');
    setFeedbackRating(null);
  };

  const downloadResults = () => {
    if (!results?.image_url) return;
    
    const link = document.createElement('a');
    link.download = `clinical-photo-${currentMode}-${results.job_id}.png`;
    link.href = results.image_url;
    link.click();
  };

  const DropZone = ({ 
    type, 
    image, 
    onFileSelect 
  }: { 
    type: 'before' | 'after';
    image: string | null;
    onFileSelect: (file: File) => void;
  }) => {
    const inputRef = type === 'before' ? beforeInputRef : afterInputRef;
    
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    return (
      <div className="space-y-4">
        <label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          {type === 'before' ? 'Before' : 'After'} Photo
        </label>
        
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative group border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 min-h-64 flex flex-col justify-center items-center"
        >
          {image ? (
            <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-xl">
              <img 
                src={image} 
                alt={`${type} photo`} 
                className="absolute inset-0 w-full h-full object-contain rounded-xl shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(type);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
                aria-label={`Remove ${type} image`}
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                {type === 'before' ? 'Before' : 'After'} ✓
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                Upload {type === 'before' ? 'Before' : 'After'} Photo
              </h3>
              <p className="text-base text-slate-500">
                Click to select or drag and drop
              </p>
            </>
          )}
          
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 font-sans antialiased">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl shadow-lg">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-teal-700 bg-clip-text text-transparent">
              Clinical Photo Anonymizer
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Professional-grade photo processing for medical aesthetics, ensuring patient privacy while showcasing treatment results.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMode('beautify')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentMode === 'beautify'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Beautify
              </button>
              <button
                onClick={() => setCurrentMode('anonymize')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentMode === 'anonymize'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg scale-105'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                <Shield className="w-5 h-5" />
                Anonymize
              </button>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
          {/* Photo Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <DropZone 
              type="before" 
              image={beforeImage}
              onFileSelect={(file) => handleFileUpload(file, 'before')}
            />
            <DropZone 
              type="after" 
              image={afterImage}
              onFileSelect={(file) => handleFileUpload(file, 'after')}
            />
          </div>

          {/* Treatment Notes */}
          <div className="mb-8">
            <label className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              Treatment Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="(Optional) Describe the treatment procedures and expected outcomes. Be specific about the changes that should be visible in the after photo."
              className="w-full p-4 border-2 border-slate-200 rounded-xl resize-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700"
              rows={4}
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentMode === 'anonymize' && (
              <>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Anonymization Strength
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="15"
                      max="100"
                      value={anonymizeStrength}
                      onChange={(e) => setAnonymizeStrength(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-bold min-w-12 text-center">
                      {anonymizeStrength}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Alignment Variance
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={alignmentVariance}
                      onChange={(e) => setAlignmentVariance(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-bold min-w-12 text-center">
                      {alignmentVariance === 12 ? 'Auto' : alignmentVariance}
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentMode === 'beautify' && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Beautify Intensity
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={beautifyIntensity}
                    onChange={(e) => setBeautifyIntensity(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold min-w-12 text-center">
                    {beautifyIntensity}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 mb-8">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-600" />
                <span className="font-semibold text-slate-700">Advanced Options</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-600 transform transition-transform duration-200 ${
                showAdvanced ? 'rotate-180' : ''
              }`} />
            </button>
            
            {showAdvanced && (
              <div className="px-6 pb-6 space-y-6 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-3">
                  <input
                    id="hairMicroVariation"
                    type="checkbox"
                    checked={hairMicroVariation}
                    onChange={(e) => setHairMicroVariation(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="hairMicroVariation" className="text-sm text-slate-700">
                    Hair micro-variation (allow natural styling differences)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="clothingTypeLock"
                    type="checkbox"
                    checked={clothingTypeLock}
                    onChange={(e) => setClothingTypeLock(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="clothingTypeLock" className="text-sm text-slate-700">
                    Maintain consistent clothing style with natural variation
                  </label>
                </div>

                {currentMode === 'anonymize' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Eye Color Selection
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {eyeColors.map(({ color, name, bgClass }) => (
                        <button
                          key={color}
                          onClick={() => setSelectedEyeColor(color)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                            selectedEyeColor === color
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full ${bgClass} mx-auto mb-2`} />
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={processImages}
              disabled={!isValidInput() || isProcessing}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed min-h-[56px] ${
                currentMode === 'beautify'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600'
              }`}
            >
              {isProcessing ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {currentMode === 'beautify' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                  Run {currentMode === 'beautify' ? 'Beautify' : 'Anonymize'}
                </>
              )}
            </button>

            <button
              onClick={resetApp}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors duration-200 min-h-[56px]"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <img 
                src={results.image_url} 
                alt="Processing Result" 
                className="max-w-full rounded-xl shadow-lg mx-auto"
              />
            </div>

            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={downloadResults}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download Result
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-700 mb-4">Quality Feedback</h3>
              
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => submitFeedback('up')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    feedbackRating === 'up'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:border-green-300 text-slate-600'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  Excellent
                </button>
                <button
                  onClick={() => submitFeedback('down')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    feedbackRating === 'down'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:border-red-300 text-slate-600'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                  Needs Improvement
                </button>
              </div>

              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Optional feedback comments..."
                className="w-full p-3 border-2 border-slate-200 rounded-lg resize-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}