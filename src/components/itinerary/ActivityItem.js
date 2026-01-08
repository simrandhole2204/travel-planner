import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

const ActivityItem = ({ activity, onEdit, onDelete, isLast }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'sightseeing':
                return 'camera-outline';
            case 'food':
                return 'restaurant-outline';
            case 'activity':
                return 'bicycle-outline';
            case 'rest':
                return 'bed-outline';
            default:
                return 'location-outline';
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'sightseeing':
                return '#3b82f6';
            case 'food':
                return '#f59e0b';
            case 'activity':
                return '#10b981';
            case 'rest':
                return '#8b5cf6';
            default:
                return COLORS.gray[500];
        }
    };

    return (
        <View style={styles.container}>
            {/* Timeline */}
            <View style={styles.timeline}>
                <View style={[styles.dot, { backgroundColor: getActivityColor(activity.type) }]} />
                {!isLast && <View style={styles.line} />}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.timeContainer}>
                        <Ionicons name="time-outline" size={16} color={COLORS.gray[500]} />
                        <Text style={styles.time}>{activity.time}</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                            <Ionicons name="create-outline" size={20} color={COLORS.primary[600]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.activityInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
                        <Ionicons name={getActivityIcon(activity.type)} size={20} color={getActivityColor(activity.type)} />
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.title}>{activity.title}</Text>
                        {activity.location && (
                            <View style={styles.locationContainer}>
                                <Ionicons name="location" size={14} color={COLORS.gray[500]} />
                                <Text style={styles.location}>{activity.location}</Text>
                            </View>
                        )}
                        {activity.description && (
                            <Text style={styles.description}>{activity.description}</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    timeline: {
        width: 40,
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: COLORS.gray[200],
        marginTop: SPACING.xs,
    },
    content: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    time: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionButton: {
        padding: SPACING.xs,
    },
    activityInfo: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.gray[900],
        marginBottom: SPACING.xs,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: SPACING.xs,
    },
    location: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    description: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        lineHeight: 20,
    },
});

export default ActivityItem;
