import Constants from 'expo-constants';
import { handleError } from '../utils/errorHandler';

// Get Gemini API key from environment
const GEMINI_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY;

/**
 * Generate itinerary using Google Gemini AI (v1beta API)
 * @param {Object} tripData - Trip information
 * @returns {Promise<Array>} Generated itinerary
 */
export const generateItinerary = async (tripData) => {
    try {
        if (!GEMINI_API_KEY) {
            console.warn('Gemini API key not found, using fallback itinerary');
            return generateFallbackItinerary(tripData);
        }

        const { destination, startDate, endDate, travelType, budget } = tripData;

        // Calculate number of days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const prompt = `Create a detailed ${days}-day itinerary for a ${travelType.toLowerCase()} trip to ${destination} from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}. ${budget ? `Budget: $${budget}.` : ''} 

For each day, provide 4-6 activities including:
- Morning activities (breakfast, sightseeing)
- Afternoon activities (lunch, attractions)  
- Evening activities (dinner, entertainment)

Include specific times, locations, and brief descriptions. Mix popular attractions with local experiences.

IMPORTANT: Respond ONLY with a valid JSON array, no additional text. Use this exact structure:
[
  {
    "day": 1,
    "date": "${start.toISOString().split('T')[0]}",
    "activities": [
      {
        "time": "09:00 AM",
        "title": "Activity name",
        "description": "Brief description",
        "location": "Specific location name",
        "type": "sightseeing"
      }
    ]
  }
]

Activity types must be one of: sightseeing, food, activity, rest

Generate the itinerary now:`;

        // Use Gemini v1beta API with gemini-2.5-flash (newest model)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        console.log('🤖 Calling Gemini API...');

        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                }
            }),
        });

        // Handle 503 (overloaded) with retry
        if (response.status === 503) {
            console.log('⏳ Model is overloaded, retrying in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Retry once
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4096,
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Gemini API error after retry:', response.status, errorText);
                console.log('Using fallback itinerary instead');
                return generateFallbackItinerary(tripData);
            }
            console.log('✅ Gemini response received after retry');
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Gemini API error:', response.status, errorText);
            console.log('Using fallback itinerary instead');
            return generateFallbackItinerary(tripData);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.warn('No response from Gemini, using fallback');
            return generateFallbackItinerary(tripData);
        }

        console.log('✅ Gemini response received');
        console.log('📄 Response starts with:', text.substring(0, 50));

        // Try to extract JSON - Gemini wraps it in markdown code blocks
        let jsonText = text.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```')) {
            // Remove opening ```json or ```
            jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '');
            // Remove closing ```
            jsonText = jsonText.replace(/\n?```\s*$/, '');
            console.log('📦 Removed code block markers');
        }

        // The jsonText should now be pure JSON
        try {
            // Check if JSON looks complete (ends with ])
            const trimmedJson = jsonText.trim();
            if (!trimmedJson.endsWith(']')) {
                console.warn('⚠️ JSON appears truncated (doesn\'t end with ])');
                console.log('Last 100 chars:', trimmedJson.slice(-100));
                console.log('💡 Response may have hit token limit. Using fallback.');
                return generateFallbackItinerary(tripData);
            }

            const itinerary = JSON.parse(jsonText);

            // Validate itinerary structure
            if (!Array.isArray(itinerary) || itinerary.length === 0) {
                console.warn('Invalid itinerary structure, using fallback');
                return generateFallbackItinerary(tripData);
            }

            console.log('✅ Successfully generated AI itinerary with', itinerary.length, 'days');
            return itinerary;
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError.message);
            console.log('First 200 chars:', jsonText.substring(0, 200));
            console.log('Last 200 chars:', jsonText.slice(-200));
            return generateFallbackItinerary(tripData);
        }
    }
    catch (error) {
        console.error('❌ Error generating itinerary with Gemini:', error.message);
        handleError(error, 'generateItinerary');
        // Return fallback instead of throwing
        console.log('Using fallback itinerary');
        return generateFallbackItinerary(tripData);
    }
};

/**
 * Generate a simple fallback itinerary if AI fails
 * @param {Object} tripData - Trip information
 * @returns {Array} Basic itinerary
 */
export const generateFallbackItinerary = (tripData) => {
    const { startDate, endDate, destination } = tripData;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    console.log('📝 Generating fallback itinerary for', days, 'days');

    const itinerary = [];

    for (let i = 0; i < days; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);

        itinerary.push({
            day: i + 1,
            date: currentDate.toISOString().split('T')[0],
            activities: [
                {
                    time: '09:00 AM',
                    title: 'Morning Exploration',
                    description: `Explore ${destination} and discover local attractions`,
                    location: destination,
                    type: 'sightseeing',
                },
                {
                    time: '12:00 PM',
                    title: 'Lunch Break',
                    description: 'Try local cuisine and specialties',
                    location: destination,
                    type: 'food',
                },
                {
                    time: '03:00 PM',
                    title: 'Afternoon Activity',
                    description: 'Visit museums, parks, or cultural sites',
                    location: destination,
                    type: 'activity',
                },
                {
                    time: '07:00 PM',
                    title: 'Dinner & Evening',
                    description: 'Enjoy dinner and evening entertainment',
                    location: destination,
                    type: 'food',
                },
            ],
        });
    }

    return itinerary;
};
