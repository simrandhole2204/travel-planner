import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

const BudgetSummary = ({ budget, totalSpent, expenses }) => {
    const remaining = budget - totalSpent;
    const percentageSpent = budget > 0 ? (totalSpent / budget) * 100 : 0;

    // Calculate category breakdown
    const categoryTotals = {};
    expenses.forEach((expense) => {
        const category = expense.category || 'other';
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += expense.amount || 0;
    });

    const getProgressColor = () => {
        if (percentageSpent >= 100) return COLORS.error;
        if (percentageSpent >= 80) return COLORS.warning;
        return COLORS.success;
    };

    const CATEGORY_CONFIG = {
        accommodation: { icon: 'bed-outline', color: '#8b5cf6', label: 'Accommodation' },
        food: { icon: 'restaurant-outline', color: '#f59e0b', label: 'Food' },
        transport: { icon: 'car-outline', color: '#3b82f6', label: 'Transport' },
        activities: { icon: 'bicycle-outline', color: '#10b981', label: 'Activities' },
        shopping: { icon: 'cart-outline', color: '#ec4899', label: 'Shopping' },
        other: { icon: 'ellipsis-horizontal-outline', color: '#6b7280', label: 'Other' },
    };

    return (
        <View style={styles.container}>
            {/* Budget Overview */}
            <View style={styles.overviewCard}>
                <Text style={styles.sectionTitle}>Budget Overview</Text>

                <View style={styles.amountRow}>
                    <View style={styles.amountItem}>
                        <Text style={styles.amountLabel}>Total Budget</Text>
                        <Text style={styles.amountValue}>${budget.toFixed(2)}</Text>
                    </View>
                    <View style={styles.amountItem}>
                        <Text style={styles.amountLabel}>Spent</Text>
                        <Text style={[styles.amountValue, { color: getProgressColor() }]}>
                            ${totalSpent.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.amountItem}>
                        <Text style={styles.amountLabel}>Remaining</Text>
                        <Text style={[styles.amountValue, { color: remaining >= 0 ? COLORS.success : COLORS.error }]}>
                            ${remaining.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${Math.min(percentageSpent, 100)}%`,
                                    backgroundColor: getProgressColor()
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>{percentageSpent.toFixed(1)}% used</Text>
                </View>

                {/* Warning */}
                {percentageSpent >= 80 && (
                    <View style={[styles.alert, percentageSpent >= 100 && styles.alertDanger]}>
                        <Ionicons
                            name={percentageSpent >= 100 ? 'alert-circle' : 'warning'}
                            size={20}
                            color={percentageSpent >= 100 ? COLORS.error : COLORS.warning}
                        />
                        <Text style={[styles.alertText, percentageSpent >= 100 && styles.alertTextDanger]}>
                            {percentageSpent >= 100
                                ? 'Budget exceeded!'
                                : 'Approaching budget limit'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Category Breakdown */}
            {Object.keys(categoryTotals).length > 0 && (
                <View style={styles.categoryCard}>
                    <Text style={styles.sectionTitle}>By Category</Text>
                    {Object.entries(categoryTotals)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
                            const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;

                            return (
                                <View key={category} style={styles.categoryItem}>
                                    <View style={styles.categoryHeader}>
                                        <View style={styles.categoryInfo}>
                                            <View style={[styles.categoryIcon, { backgroundColor: config.color + '20' }]}>
                                                <Ionicons name={config.icon} size={20} color={config.color} />
                                            </View>
                                            <Text style={styles.categoryLabel}>{config.label}</Text>
                                        </View>
                                        <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.categoryBar}>
                                        <View
                                            style={[
                                                styles.categoryBarFill,
                                                { width: `${percentage}%`, backgroundColor: config.color }
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: SPACING.md,
    },
    overviewCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.gray[900],
        marginBottom: SPACING.md,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    amountItem: {
        flex: 1,
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    amountValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.gray[900],
    },
    progressContainer: {
        marginBottom: SPACING.md,
    },
    progressBar: {
        height: 8,
        backgroundColor: COLORS.gray[200],
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: SPACING.xs,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        textAlign: 'right',
    },
    alert: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        backgroundColor: COLORS.warning + '20',
        borderRadius: BORDER_RADIUS.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning,
    },
    alertDanger: {
        backgroundColor: COLORS.error + '20',
        borderLeftColor: COLORS.error,
    },
    alertText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.warning,
    },
    alertTextDanger: {
        color: COLORS.error,
    },
    categoryCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryItem: {
        marginBottom: SPACING.md,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    categoryIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.gray[700],
    },
    categoryAmount: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.gray[900],
    },
    categoryBar: {
        height: 6,
        backgroundColor: COLORS.gray[200],
        borderRadius: 3,
        overflow: 'hidden',
    },
    categoryBarFill: {
        height: '100%',
        borderRadius: 3,
    },
});

export default BudgetSummary;
