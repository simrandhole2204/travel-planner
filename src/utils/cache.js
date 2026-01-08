import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@travel_planner_cache:';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Set item in cache with expiry
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} expiryMs - Expiry time in milliseconds (default: 24 hours)
 */
export const setCache = async (key, value, expiryMs = CACHE_EXPIRY) => {
    try {
        const cacheData = {
            value,
            timestamp: Date.now(),
            expiry: expiryMs,
        };
        await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Cache set error:', error);
    }
};

/**
 * Get item from cache if not expired
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null if expired/not found
 */
export const getCache = async (key) => {
    try {
        const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        const now = Date.now();
        const age = now - cacheData.timestamp;

        // Check if cache is expired
        if (age > cacheData.expiry) {
            await removeCache(key);
            return null;
        }

        return cacheData.value;
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
};

/**
 * Remove item from cache
 * @param {string} key - Cache key
 */
export const removeCache = async (key) => {
    try {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
        console.error('Cache remove error:', error);
    }
};

/**
 * Clear all cache
 */
export const clearAllCache = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
        await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
        console.error('Cache clear error:', error);
    }
};

/**
 * Check if cache exists and is valid
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} True if cache exists and is valid
 */
export const isCacheValid = async (key) => {
    const cached = await getCache(key);
    return cached !== null;
};
