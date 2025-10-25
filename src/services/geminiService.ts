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
  // Using Google Gemini 2.5 Flash Preview 09-2025 - state-of-the-art for reasoning, vision, and scientific tasks
  // Ranked #1 in Marketing/SEO, #3 in Legal, #7 in Technology
  private model = "google/gemini-2.5-flash-preview-09-2025";

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
      // Remove any markdown code blocks
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Try to find JSON in the response
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const items = JSON.parse(jsonMatch[0]) as Array<
          Record<string, unknown>
        >;

        // Validate and clean each item
        const validItems = items
          .filter((item) => {
            // Must have a name and at least some nutritional data
            return (
              item.name &&
              (item.calories || item.protein || item.carbs || item.fat)
            );
          })
          .map((item) => {
            const calories = parseFloat(String(item.calories)) || 0;
            const protein = parseFloat(String(item.protein)) || 0;
            const carbs =
              parseFloat(String(item.carbs || item.carbohydrates)) || 0;
            const fat = parseFloat(String(item.fat)) || 0;

            // Basic sanity check: calories should roughly match macros
            // (protein × 4) + (carbs × 4) + (fat × 9)
            const calculatedCalories = protein * 4 + carbs * 4 + fat * 9;
            const caloriesDiff = Math.abs(calories - calculatedCalories);

            // If difference is too large (>30%), log a warning
            if (
              caloriesDiff > calculatedCalories * 0.3 &&
              calculatedCalories > 0
            ) {
              console.warn(
                `Potential inaccuracy for ${
                  item.name
                }: stated ${calories}kcal vs calculated ${calculatedCalories.toFixed(
                  0
                )}kcal`
              );
            }

            return {
              name: String(item.name || item.food || "Unknown Item").trim(),
              quantity: String(
                item.quantity || item.serving || "1 serving"
              ).trim(),
              calories: Math.round(calories * 100) / 100, // Round to 2 decimals
              protein: Math.round(protein * 100) / 100,
              carbs: Math.round(carbs * 100) / 100,
              fat: Math.round(fat * 100) / 100,
            };
          });

        return validItems;
      }

      // If no JSON found, return empty array
      console.error("No valid JSON array found in AI response:", text);
      return [];
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.error("Response text:", text);
      throw new Error("Failed to parse nutrition data from image");
    }
  }

  /**
   * Analyze food image using OpenRouter API with Google Gemini 2.5 Flash Preview
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

    const prompt = `You are a professional nutritionist analyzing food images. Analyze this food image carefully and provide accurate nutritional information for each distinct food item visible.

CRITICAL INSTRUCTIONS:
1. Only identify food items that are CLEARLY VISIBLE in the image
2. Do NOT make up or assume items that aren't shown
3. Provide REALISTIC and ACCURATE portion size estimates based on what you see
4. Use verified nutritional data from USDA or similar databases
5. If an item is partially visible or unclear, either skip it or clearly estimate conservatively
6. Consider typical serving sizes for the type of food shown

Return ONLY a valid JSON array with this exact structure (no additional text, markdown, or code blocks):
[
  {
    "name": "Specific food item name (e.g., 'Grilled Chicken Breast' not just 'Chicken')",
    "quantity": "Precise portion estimate with unit (e.g., '150g', '1 cup', '2 pieces', '1 medium apple')",
    "calories": number (kcal - be accurate, not rounded),
    "protein": number (grams - decimal precision),
    "carbs": number (grams - decimal precision),
    "fat": number (grams - decimal precision)
  }
]

ACCURACY GUIDELINES:
- Cross-reference nutritional values to ensure they make sense together
- Total calories should roughly equal: (protein × 4) + (carbs × 4) + (fat × 9)
- Be specific about preparation method if visible (fried, grilled, baked, etc.)
- Account for visible oils, sauces, or toppings in your calculations
- If portion size is uncertain, estimate conservatively and state it clearly
- Return empty array [] ONLY if absolutely no food is visible in the image

Examples of good responses:
- "Grilled Chicken Breast" with "150g" NOT "Chicken" with "1 piece"
- "Steamed White Rice" with "200g" NOT "Rice" with "some"
- "Medium Banana" with "118g" NOT "Banana" with "1"`;

    try {
      console.log(`Analyzing with ${this.model}...`);

      const completion = await this.client!.chat.completions.create(
        {
          model: this.model,
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
      console.error("Analysis failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

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
          "AI model is currently overloaded. Please try again in a few moments."
        );
      }

      throw new Error(
        errorMessage || "Failed to analyze image. Please try again."
      );
    }
  }
}

// Export singleton instance
export const geminiService = new AIService();
