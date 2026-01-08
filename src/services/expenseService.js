import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { handleError } from '../utils/errorHandler';

/**
 * Get all expenses for a trip
 * @param {string} tripId - Trip ID
 * @returns {Promise<Array>} Expenses
 */
export const getExpenses = async (tripId) => {
    try {
        const expensesRef = collection(db, 'trips', tripId, 'expenses');
        const q = query(expensesRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        const expenses = [];
        querySnapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });

        return expenses;
    } catch (error) {
        handleError(error, 'getExpenses');
        throw error;
    }
};

/**
 * Add a new expense
 * @param {string} tripId - Trip ID
 * @param {Object} expenseData - Expense data
 * @returns {Promise<string>} Expense ID
 */
export const addExpense = async (tripId, expenseData) => {
    try {
        const expensesRef = collection(db, 'trips', tripId, 'expenses');
        const docRef = await addDoc(expensesRef, {
            ...expenseData,
            createdAt: new Date().toISOString(),
        });
        return docRef.id;
    } catch (error) {
        handleError(error, 'addExpense');
        throw error;
    }
};

/**
 * Update an expense
 * @param {string} tripId - Trip ID
 * @param {string} expenseId - Expense ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
export const updateExpense = async (tripId, expenseId, updates) => {
    try {
        const expenseRef = doc(db, 'trips', tripId, 'expenses', expenseId);
        await updateDoc(expenseRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        handleError(error, 'updateExpense');
        throw error;
    }
};

/**
 * Delete an expense
 * @param {string} tripId - Trip ID
 * @param {string} expenseId - Expense ID
 * @returns {Promise<void>}
 */
export const deleteExpense = async (tripId, expenseId) => {
    try {
        const expenseRef = doc(db, 'trips', tripId, 'expenses', expenseId);
        await deleteDoc(expenseRef);
    } catch (error) {
        handleError(error, 'deleteExpense');
        throw error;
    }
};

/**
 * Get expenses by category
 * @param {string} tripId - Trip ID
 * @param {string} category - Category name
 * @returns {Promise<Array>} Expenses
 */
export const getExpensesByCategory = async (tripId, category) => {
    try {
        const expensesRef = collection(db, 'trips', tripId, 'expenses');
        const q = query(
            expensesRef,
            where('category', '==', category),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const expenses = [];
        querySnapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });

        return expenses;
    } catch (error) {
        handleError(error, 'getExpensesByCategory');
        throw error;
    }
};

/**
 * Calculate total expenses
 * @param {Array} expenses - Array of expenses
 * @returns {number} Total amount
 */
export const calculateTotal = (expenses) => {
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
};

/**
 * Calculate expenses by category
 * @param {Array} expenses - Array of expenses
 * @returns {Object} Category totals
 */
export const calculateByCategory = (expenses) => {
    const categoryTotals = {};

    expenses.forEach((expense) => {
        const category = expense.category || 'Other';
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += expense.amount || 0;
    });

    return categoryTotals;
};
