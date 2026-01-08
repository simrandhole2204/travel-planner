import { create } from 'zustand';
import { subscribeToAuthChanges } from '../services/authService';

const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    isAuthenticated: false,

    // Set user
    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        loading: false
    }),

    // Set loading state
    setLoading: (loading) => set({ loading }),

    // Clear user (logout)
    clearUser: () => set({
        user: null,
        isAuthenticated: false,
        loading: false
    }),

    // Initialize auth listener
    initializeAuth: () => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            set({
                user,
                isAuthenticated: !!user,
                loading: false
            });
        });
        return unsubscribe;
    },
}));

export default useAuthStore;
