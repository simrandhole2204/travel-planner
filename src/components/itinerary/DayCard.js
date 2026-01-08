import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActivityItem from './ActivityItem';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

const DayCard = ({ day, onEditActivity, onDeleteActivity, onAddActivity }) => {
    const [expanded, setExpanded] = useState(true);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity
                style={styles.header}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <View style={styles.headerLeft}>
                    <View style={styles.dayBadge}>
                        <Text style={styles.dayNumber}>Day {day.day}</Text>
                    </View>
                    <View>
                        <Text style={styles.date}>{formatDate(day.date)}</Text>
                        <Text style={styles.activityCount}>
                            {day.activities?.length || 0} activities
                        </Text>
                    </View>
                </View>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={COLORS.gray[400]}
                />
            </TouchableOpacity>

            {/* Activities */}
            {expanded && (
                <View style={styles.content}>
                    {day.activities && day.activities.length > 0 ? (
                        day.activities.map((activity, index) => (
                            <ActivityItem
                                key={index}
                                activity={activity}
                                isLast={index === day.activities.length - 1}
                                onEdit={() => onEditActivity(day.day, index, activity)}
                                onDelete={() => onDeleteActivity(day.day, index)}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={48} color={COLORS.gray[300]} />
                            <Text style={styles.emptyText}>No activities planned yet</Text>
                        </View>
                    )}

                    {/* Add Activity Button */}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => onAddActivity(day.day)}
                    >
                        <Ionicons name="add-circle-outline" size={20} color={COLORS.primary[600]} />
                        <Text style={styles.addButtonText}>Add Activity</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.gray[50],
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.white,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    dayBadge: {
        backgroundColor: COLORS.primary[600],
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
    },
    dayNumber: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
    date: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.gray[900],
    },
    activityCount: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
        marginTop: 2,
    },
    content: {
        padding: SPACING.md,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
        marginTop: SPACING.sm,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        backgroundColor: COLORS.primary[50],
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary[200],
        borderStyle: 'dashed',
        marginTop: SPACING.sm,
    },
    addButtonText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary[600],
        fontWeight: '600',
    },
});

export default DayCard;
