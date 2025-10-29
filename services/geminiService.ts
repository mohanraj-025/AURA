import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, OutfitSuggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const outfitJsonStructure = `{
  "outfitName": "A catchy name for the outfit",
  "description": "A brief, encouraging description of the overall look",
  "topwear": { "item": "Specific top wear", "description": "Details about it", "purchaseLinks": [{ "storeName": "Example Store", "url": "https://example.com/product" }] },
  "bottomwear": { "item": "Specific bottom wear", "description": "Details about it", "purchaseLinks": [] },
  "footwear": { "item": "Specific footwear", "description": "Details about it", "purchaseLinks": [] },
  "accessories": { "item": "List of accessories", "description": "Details about them", "purchaseLinks": [] }
}`;

const timewarpSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A catchy, creative name for the fashion style.' },
        description: { type: Type.STRING, description: 'A one or two sentence description of the style, its origins, and its key elements.' },
        imagePrompt: { type: Type.STRING, description: 'A concise, visually-rich prompt for an image generation AI. Should include details on clothing, setting, style, and mood. For example: "A man wearing a tailored tweed blazer, high-waisted trousers, and leather brogues, standing on a misty London street. Cinematic, vintage, photorealistic style."' },
    },
    required: ['title', 'description', 'imagePrompt'],
};

const generateItemImage = async (itemDescription: string): Promise<string> => {
    const prompt = `Generate a high-quality, photorealistic PNG image of the following clothing item on a transparent background: "${itemDescription}". The item should be professionally photographed for an e-commerce website, clean, and perfectly isolated without any shadows or context.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { responseModalities: [Modality.IMAGE] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in response for item.");
    } catch(e) {
        console.error(`Failed to generate image for item "${itemDescription}":`, e);
        // Return a placeholder or throw an error
        throw new Error(`AI failed to generate an image for ${itemDescription}.`);
    }
};


export const getOutfitSuggestion = async (profile: UserProfile, occasion: string, movieInspiration: string): Promise<OutfitSuggestion> => {
  const prompt = `
    Act as "AURA", a world-class personal stylist and expert movie costume replicator.
    Your task is to generate a complete, personalized outfit suggestion based on the provided user profile, occasion, and VERY IMPORTANTLY, the movie inspiration.

    User Profile:
    - Gender: ${profile.gender}
    - Age: ${profile.age}
    - Style Preferences: ${profile.stylePreferences.join(', ')}
    - Location: ${profile.location}

    Context:
    - Occasion: "${occasion}"
    - Movie Inspiration: "${movieInspiration}"

    **CRITICAL INSTRUCTIONS:**
    1.  **Prioritize Movie Inspiration:** The outfit MUST be heavily inspired by the costumes in the movie "${movieInspiration}". Analyze the iconic looks of characters that match the user's gender (${profile.gender}). The result should be a modern, wearable interpretation of that movie's aesthetic. If no movie is provided, create a general outfit for the occasion.
    2.  **Find Real Products:** Use your web search capabilities to find REAL, purchasable items that match the generated outfit pieces. For each item (topwear, bottomwear, footwear, accessories), provide up to 3 links to online stores where the user can buy a similar product. These links must be valid URLs.
    3.  **JSON Output:** You MUST format your entire response as a single, valid JSON object. Do not include any text, notes, or explanations outside of the JSON structure. The JSON object must strictly adhere to the following structure:
        ${outfitJsonStructure}
    
    Ensure all fields are filled. If you cannot find a purchase link for an item, provide an empty array for "purchaseLinks". Be specific with colors, fits, and materials in your descriptions.
    `;

    // Step 1: Get the text-based outfit suggestion with purchase links
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
      });

    const jsonText = response.text.trim();
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    let textSuggestion: Omit<OutfitSuggestion, 'topwear' | 'bottomwear' | 'footwear' | 'accessories'> & { 
        topwear: { item: string; description: string; purchaseLinks: { storeName: string, url: string }[] }, 
        bottomwear: { item: string; description: string; purchaseLinks: { storeName: string, url: string }[] }, 
        footwear: { item: string; description: string; purchaseLinks: { storeName: string, url: string }[] }, 
        accessories: { item: string; description: string; purchaseLinks: { storeName: string, url: string }[] } 
    };

    try {
        textSuggestion = JSON.parse(cleanedJsonText);
    } catch (e) {
        console.error("Failed to parse Gemini response:", e, "Raw response:", jsonText);
        throw new Error("AI failed to generate a valid outfit. The movie might be too obscure or there was a network issue. Please try again.");
    }


    // Step 2: Generate images for each item concurrently
    try {
        const [topwearImage, bottomwearImage, footwearImage, accessoriesImage] = await Promise.all([
            generateItemImage(textSuggestion.topwear.item),
            generateItemImage(textSuggestion.bottomwear.item),
            generateItemImage(textSuggestion.footwear.item),
            generateItemImage(textSuggestion.accessories.item),
        ]);

        return {
            ...textSuggestion,
            topwear: { ...textSuggestion.topwear, imageUrl: topwearImage },
            bottomwear: { ...textSuggestion.bottomwear, imageUrl: bottomwearImage },
            footwear: { ...textSuggestion.footwear, imageUrl: footwearImage },
            accessories: { ...textSuggestion.accessories, imageUrl: accessoriesImage },
        };
    } catch (e) {
        console.error("Failed during image generation step:", e);
        throw new Error("AI failed to visualize the outfit. Please try again.");
    }
};

export const getLocalVibe = async (location: string): Promise<string> => {
    const prompt = `
    You are a fashion trend analyst for "AURA".
    Based on the location "${location}", describe the top 3 fashion "vibes" or trends currently popular there.
    Keep it concise, trendy, and use markdown for formatting (e.g., bold headings).
    Example:
    **1. Utilitarian Workwear:** Think carhartt jackets, baggy cargo pants, and durable boots. It's all about functional, rugged style.
    **2. Y2K Revival:** Low-rise jeans, vibrant colors, and futuristic sunglasses are back.
    **3. Gorpcore:** Technical outerwear from brands like Arc'teryx, trail running shoes, and functional backpacks are being worn as everyday fashion.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
};

export const getTimewarpSuggestion = async (profile: UserProfile, type: 'retrograde' | 'futurespective'): Promise<{title: string; description: string; imagePrompt: string;}> => {
    let contextPrompt: string;

    if (type === 'retrograde') { // "Youth Lacking"
        contextPrompt = `
        **Concept: Retrograde Vibe**
        This concept celebrates timeless, classic, or elegantly mature fashion styles that are not mainstream youth trends.
        Think about styles that have an enduring appeal, sophistication, or a "classic cool" that defies fast fashion.
        It's about finding beauty in what might be considered "old-fashioned" and presenting it as aspirational.
        
        **Task:**
        Generate a "Retrograde Vibe" concept for a ${profile.gender}.
        1. Give it a catchy title.
        2. Write a short, inspiring description.
        3. Create a detailed prompt for an image AI to generate a visual representation.
        `;
    } else { // "Past Would"
        contextPrompt = `
        **Concept: Futurespective Vibe**
        This concept is about radically reinventing historical fashion for a modern or futuristic context.
        It's a creative blend of past and future. "What a person from the past *would* have worn."
        Example Ideas: "1920s flapper at a cyberpunk rave," "Victorian-era streetwear," "60s Mod on a Mars colony."

        **Task:**
        Generate a "Futurespective Vibe" concept for a ${profile.gender}.
        1. Give it a creative, futuristic title.
        2. Write a short, imaginative description.
        3. Create a detailed prompt for an image AI to generate a visual representation.
        `;
    }

    const prompt = `
    You are AURA, an avant-garde fashion historian and futurist.
    Based on the following concept, generate a response in JSON format.

    ${contextPrompt}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: timewarpSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Timewarp suggestion response:", e);
        throw new Error("AI failed to generate a valid Timewarp vibe.");
    }
};

export const generateVibeImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
    
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in response.");

    } catch(e) {
        console.error("Failed to generate vibe image:", e);
        throw new Error("AI failed to generate a visual. Please try again.");
    }
};