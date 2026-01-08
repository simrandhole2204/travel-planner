import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useTripStore from '../../src/store/tripStore';
import { deleteTrip } from '../../src/services/tripService';
import Card from '../../src/components/ui/Card';
import Loading from '../../src/components/ui/Loading';
import Button from '../../src/components/ui/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';
import { formatDate, getDateRangeString, getDaysBetween } from '../../src/utils/dateHelpers';

export default function TripDashboard() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { currentTrip, fetchTripById, removeTrip } = useTripStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrip();
    }, [id]);

    const loadTrip = async () => {
        setLoading(true);
        await fetchTripById(id);
        setLoading(false);
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Trip',
            'Are you sure you want to delete this trip? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTrip(id);
                            removeTrip(id);
                            router.back();
                        } catch (error) {
                            console.error('Error deleting trip:', error);
                        }
                    },
                },
            ]
        );
    };

    if (loading || !currentTrip) {
        return <Loading fullScreen />;
    }

    const tripDuration = getDaysBetween(currentTrip.startDate, currentTrip.endDate);
    const dateRange = getDateRangeString(currentTrip.startDate, currentTrip.endDate);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{currentTrip.title}</Text>
                <Text style={styles.destination}>
                    <Ionicons name="location" size={16} color={COLORS.gray[600]} />
                    {' '}{currentTrip.destination}
                </Text>
                <Text style={styles.dates}>{dateRange}</Text>
            </View>

            <View style={styles.statsContainer}>
                <Card style={styles.statCard}>
                    <Ionicons name="calendar-outline" size={32} color={COLORS.primary[600]} />
                    <Text style={styles.statValue}>{tripDuration}</Text>
                    <Text style={styles.statLabel}>Days</Text>
                </Card>

                {currentTrip.budget && (
                    <Card style={styles.statCard}>
                        <Ionicons name="wallet-outline" size={32} color={COLORS.primary[600]} />
                        <Text style={styles.statValue}>${currentTrip.budget}</Text>
                        <Text style={styles.statLabel}>Budget</Text>
                    </Card>
                )}

                <Card style={styles.statCard}>
                    <Ionicons name="people-outline" size={32} color={COLORS.primary[600]} />
                    <Text style={styles.statValue}>{currentTrip.travelType}</Text>
                    <Text style={styles.statLabel}>Type</Text>
                </Card>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push(`/trip/${id}/itinerary`)}
                >
                    <View style={styles.actionIcon}>
                        <Ionicons name="list-outline" size={24} color={COLORS.primary[600]} />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Itinerary</Text>
                        <Text style={styles.actionDescription}>View and manage your day-by-day plan</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push(`/trip/${id}/budget`)}
                >
                    <View style={styles.actionIcon}>
                        <Ionicons name="wallet-outline" size={24} color={COLORS.primary[600]} />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Budget</Text>
                        <Text style={styles.actionDescription}>Track your expenses</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push(`/trip/${id}/map`)}
                >
                    <View style={styles.actionIcon}>
                        <Ionicons name="map-outline" size={24} color={COLORS.primary[600]} />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Map</Text>
                        <Text style={styles.actionDescription}>View locations on map</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Button
                    title="Delete Trip"
                    onPress={handleDelete}
                    variant="outline"
                    style={styles.deleteButton}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    header: {
        backgroundColor: COLORS.primary[600],
        padding: SPACING.xl,
        paddingTop: SPACING.xxl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    destination: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: SPACING.xs,
    },
    dates: {
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        gap: SPACING.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    statValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.gray[900],
        marginTop: SPACING.sm,
    },
    statLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        marginTop: SPACING.xs,
    },
    section: {
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.gray[900],
        marginBottom: SPACING.md,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.gray[900],
        marginBottom: SPACING.xs,
    },
    actionDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    deleteButton: {
        borderColor: COLORS.error,
        marginTop: SPACING.lg,
    },
});
