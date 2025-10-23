import OpenAI from "openai";

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AnalysisResult {
  items: FoodItem[];
}

class AIService {
  private client: OpenAI | null = null;
  // Using faster model as primary for better response times
  private primaryModel = "google/gemini-2.0-flash-exp:free";
  private fallbackModel = "openrouter/andromeda-alpha";

  constructor() {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (apiKey && apiKey !== "your_api_key_here") {
      this.client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage
      });
    }
  }

  /**
   * Compress and optimize image for faster upload and processing
   */
  private async compressImage(
    base64Image: string,
    maxWidth = 1024
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Create canvas and compress
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with quality 0.8
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        resolve(compressed);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = base64Image;
    });
  }

  private isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Parse AI response to extract food items
   */
  private parseAIResponse(text: string): FoodItem[] {
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const items = JSON.parse(jsonMatch[0]) as Array<
          Record<string, unknown>
        >;
        return items.map((item) => ({
          name: String(item.name || item.food || "Unknown Item"),
          quantity: String(item.quantity || item.serving || "1 serving"),
          calories: parseFloat(String(item.calories)) || 0,
          protein: parseFloat(String(item.protein)) || 0,
          carbs: parseFloat(String(item.carbs || item.carbohydrates)) || 0,
          fat: parseFloat(String(item.fat)) || 0,
        }));
      }

      // If no JSON found, return empty array
      return [];
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse nutrition data from image");
    }
  }

  /**
   * Analyze food image using OpenRouter API with automatic retry and fallback
   */
  async analyzeFoodImage(base64Image: string): Promise<AnalysisResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file"
      );
    }

    // Compress image for faster upload and processing
    console.log("Compressing image for faster processing...");
    const compressedImage = await this.compressImage(base64Image);
    console.log(
      `Image size reduced: ${base64Image.length} -> ${compressedImage.length} bytes`
    );

    const prompt = `Analyze this food image and provide nutritional information for each distinct food item visible.

Return ONLY a valid JSON array with this exact structure (no additional text or markdown):
[
  {
    "name": "Food item name",
    "quantity": "Estimated portion size (e.g., '150g', '1 cup', '1 piece')",
    "calories": number,
    "protein": number (in grams),
    "carbs": number (in grams),
    "fat": number (in grams)
  }
]

Important guidelines:
- Identify each distinct food item in the image
- Provide realistic portion size estimates
- Use standard nutritional databases for accurate macro values
- If you can't identify an item clearly, make your best estimate
- Return empty array [] if no food is visible
- Ensure all numeric values are numbers, not strings`;

    // Try primary model first, fallback to secondary if it fails
    let lastError: Error | null = null;

    // Try primary model (Gemini 2.0 Flash - Faster!)
    try {
      console.log(
        `Attempting analysis with primary model (${this.primaryModel})...`
      );

      const completion = await this.client!.chat.completions.create(
        {
          model: this.primaryModel,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: compressedImage,
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            "HTTP-Referer": "https://eaten.app",
            "X-Title": "Eaten - Food Nutrition Analyzer",
          },
        }
      );

      const text = completion.choices[0]?.message?.content || "";
      const items = this.parseAIResponse(text);

      if (items.length === 0) {
        throw new Error(
          "No food items detected in the image. Please try a clearer photo."
        );
      }

      return { items };
    } catch (error) {
      console.warn("Primary model failed, trying fallback model...", error);
      lastError = error instanceof Error ? error : new Error(String(error));

      // Try fallback model (Andromeda Alpha - More accurate but slower)
      try {
        console.log(
          `Attempting analysis with fallback model (${this.fallbackModel})...`
        );

        const completion = await this.client!.chat.completions.create(
          {
            model: this.fallbackModel,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: prompt,
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: compressedImage,
                    },
                  },
                ],
              },
            ],
          },
          {
            headers: {
              "HTTP-Referer": "https://eaten.app",
              "X-Title": "Eaten - Food Nutrition Analyzer",
            },
          }
        );

        const text = completion.choices[0]?.message?.content || "";
        const items = this.parseAIResponse(text);

        if (items.length === 0) {
          throw new Error(
            "No food items detected in the image. Please try a clearer photo."
          );
        }

        return { items };
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
        lastError = fallbackError instanceof Error ? fallbackError : lastError;
      }
    }

    // If we get here, both models failed
    const errorMessage = lastError?.message || "Unknown error";

    if (errorMessage.includes("API key") || errorMessage.includes("401")) {
      throw new Error(
        "Invalid API key. Please check your OpenRouter API key configuration."
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      throw new Error("API quota exceeded. Please try again later.");
    }

    if (errorMessage.includes("overloaded") || errorMessage.includes("503")) {
      throw new Error(
        "AI models are currently overloaded. Please try again in a few moments."
      );
    }

    throw new Error(
      errorMessage || "Failed to analyze image. Please try again."
    );
  }
}

// Export singleton instance
export const geminiService = new AIService();
