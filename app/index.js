import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import useAuthStore from '../src/store/authStore';
import Loading from '../src/components/ui/Loading';

export default function Index() {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) {
        return <Loading fullScreen />;
    }

    // Redirect based on auth state
    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
