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

const ACTIVITY_TYPES = [
    { id: 'sightseeing', label: 'Sightseeing', icon: 'camera-outline', color: '#3b82f6' },
    { id: 'food', label: 'Food & Dining', icon: 'restaurant-outline', color: '#f59e0b' },
    { id: 'activity', label: 'Activity', icon: 'bicycle-outline', color: '#10b981' },
    { id: 'rest', label: 'Rest', icon: 'bed-outline', color: '#8b5cf6' },
];

const ActivityModal = ({ visible, onClose, onSave, activity, dayNumber }) => {
    const [formData, setFormData] = useState({
        time: activity?.time || '09:00 AM',
        title: activity?.title || '',
        location: activity?.location || '',
        description: activity?.description || '',
        type: activity?.type || 'sightseeing',
    });

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert('Please enter activity title');
            return;
        }
        onSave(formData);
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
                            {activity ? 'Edit Activity' : 'Add Activity'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.gray[600]} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Day Info */}
                        <View style={styles.dayInfo}>
                            <Text style={styles.dayText}>Day {dayNumber}</Text>
                        </View>

                        {/* Time */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Time</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.time}
                                onChangeText={(text) => setFormData({ ...formData, time: text })}
                                placeholder="09:00 AM"
                            />
                        </View>

                        {/* Title */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Activity Title *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.title}
                                onChangeText={(text) => setFormData({ ...formData, title: text })}
                                placeholder="e.g., Visit Eiffel Tower"
                            />
                        </View>

                        {/* Location */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.location}
                                onChangeText={(text) => setFormData({ ...formData, location: text })}
                                placeholder="e.g., Champ de Mars, Paris"
                            />
                        </View>

                        {/* Type */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Activity Type</Text>
                            <View style={styles.typeGrid}>
                                {ACTIVITY_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type.id}
                                        style={[
                                            styles.typeButton,
                                            formData.type === type.id && styles.typeButtonActive,
                                            { borderColor: type.color },
                                        ]}
                                        onPress={() => setFormData({ ...formData, type: type.id })}
                                    >
                                        <Ionicons
                                            name={type.icon}
                                            size={24}
                                            color={formData.type === type.id ? type.color : COLORS.gray[400]}
                                        />
                                        <Text
                                            style={[
                                                styles.typeLabel,
                                                formData.type === type.id && { color: type.color },
                                            ]}
                                        >
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Description */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Notes (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="Add any notes or details..."
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
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
                            title="Save Activity"
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
    dayInfo: {
        backgroundColor: COLORS.primary[50],
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        alignSelf: 'flex-start',
        marginBottom: SPACING.lg,
    },
    dayText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.primary[700],
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
    textArea: {
        minHeight: 100,
        paddingTop: SPACING.md,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    typeButton: {
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
    typeButtonActive: {
        backgroundColor: COLORS.gray[50],
    },
    typeLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[600],
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

export default ActivityModal;
