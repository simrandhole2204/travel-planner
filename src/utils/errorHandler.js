import { Alert } from 'react-native';

/**
 * Centralized error handler for the app
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {boolean} showAlert - Whether to show an alert to the user
 */
export const handleError = (error, context = 'Unknown', showAlert = true) => {
    console.error(`[${context}] Error:`, error);

    if (showAlert) {
        const errorMessage = getErrorMessage(error);
        Alert.alert('Error', errorMessage);
    }
};

/**
 * Get user-friendly error message from error object
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';

    // Firebase Auth errors
    if (error.code) {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later';
            case 'permission-denied':
                return 'You don\'t have permission to perform this action';
            case 'not-found':
                return 'The requested resource was not found';
            case 'unavailable':
                return 'Service temporarily unavailable. Please try again';
            default:
                return error.message || 'An error occurred';
        }
    }

    return error.message || 'An error occurred';
};

/**
 * Async error wrapper for try-catch blocks
 * @param {Function} fn - Async function to execute
 * @param {string} context - Context for error logging
 * @returns {Promise<[Error|null, any]>} Tuple of [error, result]
 */
export const asyncHandler = async (fn, context = 'Unknown') => {
    try {
        const result = await fn();
        return [null, result];
    } catch (error) {
        handleError(error, context, false);
        return [error, null];
    }
};
