import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { handleError } from '../utils/errorHandler';

/**
 * Get itinerary for a trip
 * @param {string} tripId - Trip ID
 * @returns {Promise<Array>} Itinerary days
 */
export const getItinerary = async (tripId) => {
    try {
        const itineraryRef = collection(db, 'trips', tripId, 'itinerary');
        const q = query(itineraryRef, orderBy('day', 'asc'));
        const querySnapshot = await getDocs(q);

        const itinerary = [];
        querySnapshot.forEach((doc) => {
            itinerary.push({ id: doc.id, ...doc.data() });
        });

        return itinerary;
    } catch (error) {
        handleError(error, 'getItinerary');
        throw error;
    }
};

/**
 * Save generated itinerary to Firestore
 * @param {string} tripId - Trip ID
 * @param {Array} itinerary - Generated itinerary
 * @returns {Promise<void>}
 */
export const saveItinerary = async (tripId, itinerary) => {
    try {
        const batch = [];

        for (const day of itinerary) {
            const dayDocRef = doc(db, 'trips', tripId, 'itinerary', `day-${day.day}`);
            batch.push(
                setDoc(dayDocRef, {
                    ...day,
                    createdAt: new Date().toISOString(),
                })
            );
        }

        await Promise.all(batch);
    } catch (error) {
        handleError(error, 'saveItinerary');
        throw error;
    }
};

/**
 * Update a day's activities
 * @param {string} tripId - Trip ID
 * @param {string} dayId - Day document ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
export const updateDay = async (tripId, dayId, updates) => {
    try {
        const dayRef = doc(db, 'trips', tripId, 'itinerary', dayId);
        await updateDoc(dayRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        handleError(error, 'updateDay');
        throw error;
    }
};

/**
 * Delete a day from itinerary
 * @param {string} tripId - Trip ID
 * @param {string} dayId - Day document ID
 * @returns {Promise<void>}
 */
export const deleteDay = async (tripId, dayId) => {
    try {
        const dayRef = doc(db, 'trips', tripId, 'itinerary', dayId);
        await deleteDoc(dayRef);
    } catch (error) {
        handleError(error, 'deleteDay');
        throw error;
    }
};
