import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

const CATEGORY_CONFIG = {
    accommodation: { icon: 'bed-outline', color: '#8b5cf6', label: 'Accommodation' },
    food: { icon: 'restaurant-outline', color: '#f59e0b', label: 'Food & Dining' },
    transport: { icon: 'car-outline', color: '#3b82f6', label: 'Transportation' },
    activities: { icon: 'bicycle-outline', color: '#10b981', label: 'Activities' },
    shopping: { icon: 'cart-outline', color: '#ec4899', label: 'Shopping' },
    other: { icon: 'ellipsis-horizontal-outline', color: '#6b7280', label: 'Other' },
};

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
    const config = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.other;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onEdit}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
                <Ionicons name={config.icon} size={24} color={config.color} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.description} numberOfLines={1}>
                        {expense.description}
                    </Text>
                    <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.category}>{config.label}</Text>
                    <Text style={styles.date}>{formatDate(expense.date)}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    description: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.gray[900],
        marginRight: SPACING.sm,
    },
    amount: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.gray[900],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    category: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    date: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
    },
    deleteButton: {
        padding: SPACING.sm,
        marginLeft: SPACING.sm,
    },
});

export default ExpenseItem;
