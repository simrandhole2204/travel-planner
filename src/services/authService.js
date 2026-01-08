import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInAnonymously,
    GoogleAuthProvider,
    signInWithCredential,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { handleError } from '../utils/errorHandler';

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise<Object>} User object
 */
export const signUpWithEmail = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: displayName || 'Traveler',
            createdAt: new Date().toISOString(),
            isAnonymous: false,
        });

        return user;
    } catch (error) {
        handleError(error, 'signUpWithEmail');
        throw error;
    }
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        handleError(error, 'signInWithEmail');
        throw error;
    }
};

/**
 * Sign in with Google
 * @param {string} idToken - Google ID token from auth session
 * @returns {Promise<Object>} User object
 */
export const signInWithGoogle = async (idToken) => {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        // Check if user document exists, create if not
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Traveler',
                photoURL: user.photoURL || null,
                createdAt: new Date().toISOString(),
                isAnonymous: false,
            });
        }

        return user;
    } catch (error) {
        handleError(error, 'signInWithGoogle');
        throw error;
    }
};

/**
 * Sign in anonymously (guest mode)
 * @returns {Promise<Object>} User object
 */
export const signInAsGuest = async () => {
    try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;

        // Create user document for guest
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName: 'Guest',
            createdAt: new Date().toISOString(),
            isAnonymous: true,
        });

        return user;
    } catch (error) {
        handleError(error, 'signInAsGuest');
        throw error;
    }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        handleError(error, 'logout');
        throw error;
    }
};

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function with user parameter
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
