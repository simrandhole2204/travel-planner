import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../src/store/authStore';
import useTripStore from '../../src/store/tripStore';
import TripCard from '../../src/components/trip/TripCard';
import Loading from '../../src/components/ui/Loading';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';

export default function HomeScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { trips, loading, fetchTrips, loadMoreTrips, hasMore } = useTripStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            fetchTrips(user.uid);
        }
    }, [user]);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (user) {
            await fetchTrips(user.uid, false);
        }
        setRefreshing(false);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore && user) {
            loadMoreTrips(user.uid);
        }
    };

    const handleCreateTrip = () => {
        router.push('/trip/create');
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="airplane-outline" size={64} color={COLORS.gray[300]} />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyText}>
                Start planning your next adventure!
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleCreateTrip}>
                <Text style={styles.emptyButtonText}>Create Your First Trip</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFooter = () => {
        if (!loading || trips.length === 0) return null;
        return (
            <View style={styles.footer}>
                <Loading />
            </View>
        );
    };

    if (loading && trips.length === 0) {
        return <Loading fullScreen />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={trips}
                renderItem={({ item }) => <TripCard trip={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={COLORS.primary[600]}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />

            <TouchableOpacity style={styles.fab} onPress={handleCreateTrip}>
                <Ionicons name="add" size={28} color={COLORS.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    listContent: {
        paddingVertical: SPACING.md,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.gray[700],
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    emptyButton: {
        backgroundColor: COLORS.primary[600],
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: 24,
    },
    emptyButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    footer: {
        paddingVertical: SPACING.lg,
    },
    fab: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: SPACING.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
