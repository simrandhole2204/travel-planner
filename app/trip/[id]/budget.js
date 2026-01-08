import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useTripStore from '../../../src/store/tripStore';
import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    calculateTotal,
} from '../../../src/services/expenseService';
import BudgetSummary from '../../../src/components/budget/BudgetSummary';
import ExpenseItem from '../../../src/components/budget/ExpenseItem';
import ExpenseModal from '../../../src/components/budget/ExpenseModal';
import { COLORS, SPACING, FONT_SIZES } from '../../../src/constants/theme';

export default function BudgetScreen() {
    const { id } = useLocalSearchParams();
    const { currentTrip, fetchTripById } = useTripStore();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load trip if not already loaded
            if (!currentTrip || currentTrip.id !== id) {
                await fetchTripById(id);
            }

            // Load expenses
            const expenseData = await getExpenses(id);
            setExpenses(expenseData);
        } catch (error) {
            console.error('Error loading budget data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = () => {
        setSelectedExpense(null);
        setModalVisible(true);
    };

    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setModalVisible(true);
    };

    const handleSaveExpense = async (expenseData) => {
        try {
            if (selectedExpense) {
                // Update existing expense
                await updateExpense(id, selectedExpense.id, expenseData);
                setExpenses(expenses.map(exp =>
                    exp.id === selectedExpense.id ? { ...exp, ...expenseData } : exp
                ));
            } else {
                // Add new expense
                const expenseId = await addExpense(id, expenseData);
                setExpenses([{ id: expenseId, ...expenseData }, ...expenses]);
            }
        } catch (error) {
            console.error('Error saving expense:', error);
            Alert.alert('Error', 'Failed to save expense');
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteExpense(id, expenseId);
                            setExpenses(expenses.filter(exp => exp.id !== expenseId));
                        } catch (error) {
                            console.error('Error deleting expense:', error);
                            Alert.alert('Error', 'Failed to delete expense');
                        }
                    },
                },
            ]
        );
    };

    const totalSpent = calculateTotal(expenses);
    const budget = currentTrip?.budget || 0;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary[600]} />
                <Text style={styles.loadingText}>Loading budget...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Budget Tracker</Text>
                    {currentTrip && (
                        <Text style={styles.subtitle}>
                            {currentTrip.destination} • {currentTrip.title}
                        </Text>
                    )}
                </View>

                {/* Budget Summary */}
                {budget > 0 ? (
                    <BudgetSummary
                        budget={budget}
                        totalSpent={totalSpent}
                        expenses={expenses}
                    />
                ) : (
                    <View style={styles.noBudgetCard}>
                        <Ionicons name="wallet-outline" size={48} color={COLORS.gray[400]} />
                        <Text style={styles.noBudgetTitle}>No Budget Set</Text>
                        <Text style={styles.noBudgetText}>
                            Set a budget for this trip to track your spending
                        </Text>
                    </View>
                )}

                {/* Expenses List */}
                <View style={styles.expensesSection}>
                    <View style={styles.expensesHeader}>
                        <Text style={styles.expensesTitle}>
                            Expenses ({expenses.length})
                        </Text>
                        <TouchableOpacity onPress={handleAddExpense} style={styles.addButton}>
                            <Ionicons name="add-circle" size={24} color={COLORS.primary[600]} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {expenses.length > 0 ? (
                        expenses.map((expense) => (
                            <ExpenseItem
                                key={expense.id}
                                expense={expense}
                                onEdit={() => handleEditExpense(expense)}
                                onDelete={() => handleDeleteExpense(expense.id)}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={64} color={COLORS.gray[300]} />
                            <Text style={styles.emptyTitle}>No Expenses Yet</Text>
                            <Text style={styles.emptyText}>
                                Start tracking your trip expenses
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.fab} onPress={handleAddExpense}>
                <Ionicons name="add" size={28} color={COLORS.white} />
            </TouchableOpacity>

            {/* Expense Modal */}
            <ExpenseModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveExpense}
                expense={selectedExpense}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray[50],
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
        paddingBottom: 80,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '700',
        color: COLORS.gray[900],
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
    },
    noBudgetCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    noBudgetTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.gray[700],
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    noBudgetText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
        textAlign: 'center',
    },
    expensesSection: {
        marginTop: SPACING.lg,
    },
    expensesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    expensesTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.gray[900],
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    addButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.primary[600],
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.gray[700],
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
        textAlign: 'center',
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
