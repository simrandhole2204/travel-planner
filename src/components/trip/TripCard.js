import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Card from '../ui/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';
import { formatDate, getDateRangeString, getDaysBetween } from '../../utils/dateHelpers';

const TripCard = ({ trip }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/trip/${trip.id}`);
    };

    const tripDuration = getDaysBetween(trip.startDate, trip.endDate);
    const dateRange = getDateRangeString(trip.startDate, trip.endDate);

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <Card style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {trip.title}
                        </Text>
                        <Text style={styles.destination} numberOfLines={1}>
                            <Ionicons name="location" size={14} color={COLORS.gray[500]} />
                            {' '}{trip.destination}
                        </Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </View>
                </View>

                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.primary[600]} />
                        <Text style={styles.detailText}>{dateRange}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.primary[600]} />
                        <Text style={styles.detailText}>
                            {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
                        </Text>
                    </View>

                    {trip.budget && (
                        <View style={styles.detailItem}>
                            <Ionicons name="wallet-outline" size={16} color={COLORS.primary[600]} />
                            <Text style={styles.detailText}>${trip.budget}</Text>
                        </View>
                    )}
                </View>

                {trip.travelType && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{trip.travelType}</Text>
                    </View>
                )}
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    titleContainer: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.gray[900],
        marginBottom: SPACING.xs,
    },
    destination: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    iconContainer: {
        padding: SPACING.xs,
    },
    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    detailText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[700],
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primary[100],
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        marginTop: SPACING.md,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primary[700],
        fontWeight: '600',
    },
});

export default TripCard;
