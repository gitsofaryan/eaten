import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, X, Instagram, Dumbbell } from "lucide-react";
import { FoodItemCard } from "@/components/FoodItemCard";
import { TotalMacros } from "@/components/TotalMacros";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-food.jpg";
import { geminiService, FoodItem } from "@/services/geminiService";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodItem[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasWebcam, setHasWebcam] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check for webcam availability
  useEffect(() => {
    const checkWebcam = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasWebcam(videoDevices.length > 0);
      } catch (error) {
        console.error('Error checking for webcam:', error);
        setHasWebcam(false);
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      checkWebcam();
    } else {
      setHasWebcam(false);
    }
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('eaten_selectedImage');
    const savedResults = localStorage.getItem('eaten_results');

    if (savedImage) {
      setSelectedImage(savedImage);
    }
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (error) {
        console.error('Error parsing saved results:', error);
        localStorage.removeItem('eaten_results');
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (selectedImage) {
      localStorage.setItem('eaten_selectedImage', selectedImage);
    } else {
      localStorage.removeItem('eaten_selectedImage');
    }
  }, [selectedImage]);

  useEffect(() => {
    if (results) {
      localStorage.setItem('eaten_results', JSON.stringify(results));
    } else {
      localStorage.removeItem('eaten_results');
    }
  }, [results]);

  const processFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose a photo under 10MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setResults(null);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  }, [processFile]);

  // Add paste event listener with useEffect
  useEffect(() => {
    document.addEventListener('paste', handlePaste as EventListener);
    return () => document.removeEventListener('paste', handlePaste as EventListener);
  }, [handlePaste]);

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      // Use Gemini API directly to analyze the food image
      const result = await geminiService.analyzeFoodImage(selectedImage);

      setResults(result.items);
      toast({
        title: "Analysis complete",
        description: `Found ${result.items.length} food item${result.items.length !== 1 ? 's' : ''}`,
      });

    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not analyze photo. Please try again.";

      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults(null);
    localStorage.removeItem('eaten_selectedImage');
    localStorage.removeItem('eaten_results');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  const totals = results
    ? {
      calories: results.reduce((sum, item) => sum + item.calories, 0),
      protein: results.reduce((sum, item) => sum + item.protein, 0),
      carbs: results.reduce((sum, item) => sum + item.carbs, 0),
      fat: results.reduce((sum, item) => sum + item.fat, 0),
    }
    : null;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Hero Section */}
      <div className="relative container font-calligraphy mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up mb-8">
          <h1 className="text-6xl md:text-8xl font-calligraphy mb-3 text-white tracking-wide">
            eaten
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Snap. Analyze. Know your nutrition.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          {!selectedImage && (
            <div
              className={`glass-card rounded-3xl shadow-large p-8 md:p-12 text-center animate-scale-in transition-all duration-200 ${isDragging ? 'ring-4 ring-primary scale-105' : ''
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  {isDragging ? 'Drop your image here!' : 'Upload your meal'}
                </h2>

                {/* Camera input - opens camera */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="camera-input"
                />

                {/* Gallery input - opens file picker/gallery */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="gallery-input"
                />

                {!isDragging && (
                  <>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button
                        variant="hero"
                        size="xl"
                        onClick={() => {
                          if (hasWebcam === false) {
                            toast({
                              title: "No webcam detected",
                              description: "Please use the upload option to select a photo from your device",
                              variant: "destructive",
                            });
                          } else {
                            cameraInputRef.current?.click();
                          }
                        }}
                        className="gap-3"
                        disabled={hasWebcam === false}
                      >
                        <Camera className="w-6 h-6" />
                        {hasWebcam === false ? 'No Webcam Present' : 'Take Photo'}
                      </Button>

                      <Button
                        variant="upload"
                        size="xl"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-3"
                      >
                        <Upload className="w-6 h-6" />
                        Upload Photo
                      </Button>
                    </div>

                    <p className="text-sm text-white/60 mt-4">
                      Or drag & drop an image, or paste from clipboard (Ctrl+V)
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Image Preview & Analysis */}
          {selectedImage && !results && (
            <div className="space-y-6 animate-scale-in">
              <div className="glass-card rounded-3xl shadow-large overflow-hidden">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected meal"
                    className="w-full h-auto max-h-96 object-cover rounded-t-3xl"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleReset}
                    className="absolute top-4 right-4 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-6 text-white">
                    Ready to analyze
                  </h3>

                  <Button
                    variant="hero"
                    size="xl"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="gap-3"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Image Thumbnail */}
              <div className="glass-card rounded-3xl shadow-medium overflow-hidden">
                <div className="relative">
                  <img
                    src={selectedImage!}
                    alt="Analyzed meal"
                    className="w-full h-48 object-cover rounded-t-3xl"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    className="absolute top-4 right-4 gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    New
                  </Button>
                </div>
              </div>

              {/* Total Macros */}
              {totals && (
                <TotalMacros
                  totalCalories={totals.calories}
                  totalProtein={totals.protein}
                  totalCarbs={totals.carbs}
                  totalFat={totals.fat}
                />
              )}

              {/* Food Items */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-white px-2">
                  Breakdown
                </h3>
                <div className="space-y-4">
                  {results.map((item, index) => (
                    <FoodItemCard
                      key={index}
                      name={item.name}
                      quantity={item.quantity}
                      calories={item.calories}
                      protein={item.protein}
                      carbs={item.carbs}
                      fat={item.fat}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Credit Label */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="glass-card rounded-2xl px-4 py-3 shadow-large hover:scale-105 transition-transform duration-200">
            <a
              href="https://instagram.com/arien_jain"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <Dumbbell className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">Built by Arien</span>
                <span className="text-[10px] text-white/60 flex items-center gap-1">
                  <Instagram className="w-3 h-3" />
                  @arien_jain • For gym brats 💪
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
