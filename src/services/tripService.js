import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { handleError } from '../utils/errorHandler';

const TRIPS_COLLECTION = 'trips';

/**
 * Create a new trip
 * @param {Object} tripData - Trip data
 * @returns {Promise<string>} Trip ID
 */
export const createTrip = async (tripData) => {
    try {
        const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
            ...tripData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return docRef.id;
    } catch (error) {
        handleError(error, 'createTrip');
        throw error;
    }
};

/**
 * Get trip by ID
 * @param {string} tripId - Trip ID
 * @returns {Promise<Object>} Trip data
 */
export const getTripById = async (tripId) => {
    try {
        const docRef = doc(db, TRIPS_COLLECTION, tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        handleError(error, 'getTripById');
        throw error;
    }
};

/**
 * Get all trips for a user with pagination
 * @param {string} userId - User ID
 * @param {number} pageSize - Number of trips per page
 * @param {Object} lastDoc - Last document for pagination
 * @returns {Promise<Object>} Trips and last document
 */
export const getUserTrips = async (userId, pageSize = 10, lastDoc = null) => {
    try {
        let q = query(
            collection(db, TRIPS_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
        );

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);
        const trips = [];
        let lastDocument = null;

        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() });
            lastDocument = doc;
        });

        return { trips, lastDocument };
    } catch (error) {
        handleError(error, 'getUserTrips');
        throw error;
    }
};

/**
 * Update trip
 * @param {string} tripId - Trip ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTrip = async (tripId, updates) => {
    try {
        const docRef = doc(db, TRIPS_COLLECTION, tripId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        handleError(error, 'updateTrip');
        throw error;
    }
};

/**
 * Delete trip
 * @param {string} tripId - Trip ID
 * @returns {Promise<void>}
 */
export const deleteTrip = async (tripId) => {
    try {
        const docRef = doc(db, TRIPS_COLLECTION, tripId);
        await deleteDoc(docRef);
    } catch (error) {
        handleError(error, 'deleteTrip');
        throw error;
    }
};

/**
 * Get upcoming trips for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Upcoming trips
 */
export const getUpcomingTrips = async (userId) => {
    try {
        const today = new Date().toISOString();
        const q = query(
            collection(db, TRIPS_COLLECTION),
            where('userId', '==', userId),
            where('startDate', '>=', today),
            orderBy('startDate', 'asc'),
            limit(5)
        );

        const querySnapshot = await getDocs(q);
        const trips = [];

        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() });
        });

        return trips;
    } catch (error) {
        handleError(error, 'getUpcomingTrips');
        throw error;
    }
};
