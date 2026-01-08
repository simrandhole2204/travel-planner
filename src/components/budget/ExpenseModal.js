import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

const CATEGORIES = [
    { id: 'accommodation', label: 'Accommodation', icon: 'bed-outline', color: '#8b5cf6' },
    { id: 'food', label: 'Food & Dining', icon: 'restaurant-outline', color: '#f59e0b' },
    { id: 'transport', label: 'Transportation', icon: 'car-outline', color: '#3b82f6' },
    { id: 'activities', label: 'Activities', icon: 'bicycle-outline', color: '#10b981' },
    { id: 'shopping', label: 'Shopping', icon: 'cart-outline', color: '#ec4899' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#6b7280' },
];

const ExpenseModal = ({ visible, onClose, onSave, expense }) => {
    const [formData, setFormData] = useState({
        amount: expense?.amount?.toString() || '',
        description: expense?.description || '',
        category: expense?.category || 'food',
        date: expense?.date || new Date().toISOString().split('T')[0],
    });

    const handleSave = () => {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (!formData.description.trim()) {
            alert('Please enter a description');
            return;
        }

        onSave({
            ...formData,
            amount: parseFloat(formData.amount),
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {expense ? 'Edit Expense' : 'Add Expense'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.gray[600]} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Amount */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Amount *</Text>
                            <View style={styles.amountInput}>
                                <Text style={styles.currency}>$</Text>
                                <TextInput
                                    style={styles.amountValue}
                                    value={formData.amount}
                                    onChangeText={(text) => setFormData({ ...formData, amount: text })}
                                    placeholder="0.00"
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        {/* Description */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Description *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="e.g., Lunch at cafe"
                            />
                        </View>

                        {/* Category */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.categoryGrid}>
                                {CATEGORIES.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.categoryButton,
                                            formData.category === category.id && styles.categoryButtonActive,
                                            { borderColor: category.color },
                                        ]}
                                        onPress={() => setFormData({ ...formData, category: category.id })}
                                    >
                                        <Ionicons
                                            name={category.icon}
                                            size={24}
                                            color={formData.category === category.id ? category.color : COLORS.gray[400]}
                                        />
                                        <Text
                                            style={[
                                                styles.categoryLabel,
                                                formData.category === category.id && { color: category.color },
                                            ]}
                                        >
                                            {category.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Date</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.date}
                                onChangeText={(text) => setFormData({ ...formData, date: text })}
                                placeholder="YYYY-MM-DD"
                            />
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Button
                            title="Cancel"
                            onPress={onClose}
                            variant="outline"
                            style={styles.button}
                        />
                        <Button
                            title="Save Expense"
                            onPress={handleSave}
                            style={styles.button}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.gray[900],
    },
    content: {
        padding: SPACING.lg,
    },
    field: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: SPACING.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[900],
    },
    amountInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
    },
    currency: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.gray[600],
        marginRight: SPACING.sm,
    },
    amountValue: {
        flex: 1,
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.gray[900],
        paddingVertical: SPACING.md,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    categoryButton: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        borderWidth: 2,
        borderRadius: BORDER_RADIUS.md,
        borderColor: COLORS.gray[200],
    },
    categoryButtonActive: {
        backgroundColor: COLORS.gray[50],
    },
    categoryLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[600],
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        gap: SPACING.md,
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
    },
    button: {
        flex: 1,
    },
});

export default ExpenseModal;
