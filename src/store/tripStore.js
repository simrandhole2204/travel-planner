import { create } from 'zustand';
import { getUserTrips, getTripById } from '../services/tripService';
import { setCache, getCache } from '../utils/cache';

const CACHE_KEY = 'user_trips';

const useTripStore = create((set, get) => ({
    trips: [],
    currentTrip: null,
    loading: false,
    lastDocument: null,
    hasMore: true,

    // Set trips
    setTrips: (trips) => set({ trips }),

    // Add trip
    addTrip: (trip) => set((state) => ({
        trips: [trip, ...state.trips]
    })),

    // Update trip
    updateTrip: (tripId, updates) => set((state) => ({
        trips: state.trips.map((trip) =>
            trip.id === tripId ? { ...trip, ...updates } : trip
        ),
        currentTrip: state.currentTrip?.id === tripId
            ? { ...state.currentTrip, ...updates }
            : state.currentTrip,
    })),

    // Remove trip
    removeTrip: (tripId) => set((state) => ({
        trips: state.trips.filter((trip) => trip.id !== tripId),
        currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip,
    })),

    // Set current trip
    setCurrentTrip: (trip) => set({ currentTrip: trip }),

    // Set loading
    setLoading: (loading) => set({ loading }),

    // Fetch trips with caching
    fetchTrips: async (userId, useCache = true) => {
        set({ loading: true });

        try {
            // Try to get from cache first
            if (useCache) {
                const cachedTrips = await getCache(CACHE_KEY);
                if (cachedTrips) {
                    set({ trips: cachedTrips, loading: false });
                    return;
                }
            }

            // Fetch from Firestore
            const { trips, lastDocument } = await getUserTrips(userId);
            set({
                trips,
                lastDocument,
                hasMore: trips.length >= 10,
                loading: false
            });

            // Cache the trips
            await setCache(CACHE_KEY, trips);
        } catch (error) {
            console.error('Error fetching trips:', error);
            set({ loading: false });
        }
    },

    // Load more trips (pagination)
    loadMoreTrips: async (userId) => {
        const { lastDocument, hasMore } = get();
        if (!hasMore) return;

        set({ loading: true });

        try {
            const { trips: newTrips, lastDocument: newLastDoc } = await getUserTrips(
                userId,
                10,
                lastDocument
            );

            set((state) => ({
                trips: [...state.trips, ...newTrips],
                lastDocument: newLastDoc,
                hasMore: newTrips.length >= 10,
                loading: false,
            }));
        } catch (error) {
            console.error('Error loading more trips:', error);
            set({ loading: false });
        }
    },

    // Fetch trip by ID
    fetchTripById: async (tripId) => {
        set({ loading: true });

        try {
            const trip = await getTripById(tripId);
            set({ currentTrip: trip, loading: false });
            return trip;
        } catch (error) {
            console.error('Error fetching trip:', error);
            set({ loading: false });
            return null;
        }
    },

    // Clear trips
    clearTrips: () => set({
        trips: [],
        currentTrip: null,
        lastDocument: null,
        hasMore: true,
    }),
}));

export default useTripStore;
