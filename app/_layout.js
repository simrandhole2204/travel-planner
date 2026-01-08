import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useAuthStore from '../src/store/authStore';

export default function RootLayout() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        // Initialize auth listener
        const unsubscribe = initializeAuth();
        return () => unsubscribe();
    }, []);

    return (
        <>
            <StatusBar style="auto" />
            <Slot />
        </>
    );
}
