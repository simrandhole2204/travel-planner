import Constants from 'expo-constants';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Mock places data - Google Places API doesn't work from client-side React Native
 * For production, you'd need a backend server to call Google Places API
 */
export const searchNearbyPlaces = async (location, type = 'tourist_attraction', radius = 5000) => {
    console.log('🔍 Searching places for:', location, 'Type:', type);
    // Return mock data - works great for demo!
    return getMockPlaces(type);
};

export const getPlaceDetails = async (placeId) => {
    return getMockPlaceDetails();
};

export const getPhotoUrl = (photoReference, maxWidth = 400) => {
    return 'https://via.placeholder.com/400x300?text=No+Image';
};

const getMockPlaces = (type) => {
    const mockData = {
        tourist_attraction: [
            { id: '1', name: 'Eiffel Tower', address: 'Champ de Mars, Paris', rating: 4.6, userRatingsTotal: 50000, priceLevel: 2, types: ['tourist_attraction'], location: { lat: 48.8584, lng: 2.2945 } },
            { id: '2', name: 'Louvre Museum', address: 'Rue de Rivoli, Paris', rating: 4.7, userRatingsTotal: 45000, priceLevel: 2, types: ['museum'], location: { lat: 48.8606, lng: 2.3376 } },
            { id: '3', name: 'Arc de Triomphe', address: 'Place Charles de Gaulle, Paris', rating: 4.6, userRatingsTotal: 35000, priceLevel: 1, types: ['tourist_attraction'], location: { lat: 48.8738, lng: 2.2950 } },
        ],
        restaurant: [
            { id: '4', name: 'Le Jules Verne', address: 'Eiffel Tower, Paris', rating: 4.5, userRatingsTotal: 2000, priceLevel: 4, types: ['restaurant'], location: { lat: 48.8584, lng: 2.2945 } },
            { id: '5', name: 'L\'As du Fallafel', address: 'Le Marais, Paris', rating: 4.4, userRatingsTotal: 8000, priceLevel: 1, types: ['restaurant'], location: { lat: 48.8575, lng: 2.3597 } },
        ],
        cafe: [
            { id: '8', name: 'Café de Flore', address: 'Saint-Germain-des-Prés, Paris', rating: 4.3, userRatingsTotal: 5000, priceLevel: 3, types: ['cafe'], location: { lat: 48.8542, lng: 2.3320 } },
        ],
        lodging: [
            { id: '6', name: 'Le Bristol Paris', address: 'Rue du Faubourg Saint-Honoré, Paris', rating: 4.8, userRatingsTotal: 1500, priceLevel: 4, types: ['lodging'], location: { lat: 48.8708, lng: 2.3169 } },
            { id: '7', name: 'Hotel Plaza Athénée', address: 'Avenue Montaigne, Paris', rating: 4.7, userRatingsTotal: 1200, priceLevel: 4, types: ['lodging'], location: { lat: 48.8662, lng: 2.3044 } },
        ],
        museum: [
            { id: '9', name: 'Musée d\'Orsay', address: 'Rue de la Légion d\'Honneur, Paris', rating: 4.7, userRatingsTotal: 40000, priceLevel: 2, types: ['museum'], location: { lat: 48.8600, lng: 2.3266 } },
        ],
        park: [
            { id: '10', name: 'Luxembourg Gardens', address: '6th arrondissement, Paris', rating: 4.6, userRatingsTotal: 25000, priceLevel: 0, types: ['park'], location: { lat: 48.8462, lng: 2.3372 } },
        ],
    };

    return mockData[type] || mockData.tourist_attraction;
};

const getMockPlaceDetails = () => ({
    id: '1',
    name: 'Sample Place',
    address: '123 Main St, City',
    phone: '+1 234 567 8900',
    website: 'https://example.com',
    rating: 4.5,
    userRatingsTotal: 1000,
    priceLevel: 2,
    photos: [],
    reviews: [
        { author: 'John Doe', rating: 5, text: 'Amazing place! Highly recommended.', time: '2 weeks ago' },
        { author: 'Jane Smith', rating: 4, text: 'Great experience, will visit again.', time: '1 month ago' },
    ],
    openingHours: [
        'Monday: 9:00 AM – 6:00 PM',
        'Tuesday: 9:00 AM – 6:00 PM',
        'Wednesday: 9:00 AM – 6:00 PM',
        'Thursday: 9:00 AM – 6:00 PM',
        'Friday: 9:00 AM – 6:00 PM',
        'Saturday: 10:00 AM – 4:00 PM',
        'Sunday: Closed',
    ],
    isOpen: true,
});
