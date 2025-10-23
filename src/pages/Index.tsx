import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, X } from "lucide-react";
import { FoodItemCard } from "@/components/FoodItemCard";
import { TotalMacros } from "@/components/TotalMacros";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-food.jpg";

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AnalysisResult {
  items: FoodItem[];
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodItem[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose a photo under 10MB",
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
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      // TODO: Replace with actual API endpoint
      const apiEndpoint = "https://aryanjain.app.n8n.cloud/webhook-test/eatn";
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - replace with actual API call
      const mockResponse: AnalysisResult = {
        items: [
          {
            name: "Grilled Chicken Breast",
            quantity: "150g",
            calories: 165,
            protein: 31,
            carbs: 0,
            fat: 3.6,
          },
          {
            name: "Brown Rice",
            quantity: "1 cup",
            calories: 218,
            protein: 5,
            carbs: 46,
            fat: 2,
          },
          {
            name: "Mixed Vegetables",
            quantity: "200g",
            calories: 80,
            protein: 3,
            carbs: 16,
            fat: 0.5,
          },
        ],
      };

      setResults(mockResponse.items);
      toast({
        title: "Analysis complete",
        description: `Found ${mockResponse.items.length} items`,
      });

      // Uncomment when API is ready:
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data: AnalysisResult = await response.json();
      setResults(data.items);
      
      toast({
        title: "Analysis complete",
        description: `Found ${data.items.length} items`,
      });
      

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            <div className="glass-card rounded-3xl shadow-large p-8 md:p-12 text-center animate-scale-in">
              <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  Upload your meal
                </h2>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-input"
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-3"
                  >
                    <Camera className="w-6 h-6" />
                    Take Photo
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
      </div>
    </div>
  );
};

export default Index;
