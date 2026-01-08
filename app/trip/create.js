import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import useAuthStore from '../../src/store/authStore';
import useTripStore from '../../src/store/tripStore';
import { createTrip } from '../../src/services/tripService';
import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';
import Card from '../../src/components/ui/Card';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';
import { formatDate } from '../../src/utils/dateHelpers';

const TRAVEL_TYPES = ['Solo', 'Couple', 'Family', 'Friends', 'Business'];

export default function CreateTripScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const addTrip = useTripStore((state) => state.addTrip);

    const [title, setTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [budget, setBudget] = useState('');
    const [travelType, setTravelType] = useState(TRAVEL_TYPES[0]);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Trip title is required';
        }

        if (!destination.trim()) {
            newErrors.destination = 'Destination is required';
        }

        if (endDate < startDate) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (budget && isNaN(parseFloat(budget))) {
            newErrors.budget = 'Budget must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const tripData = {
                userId: user.uid,
                title: title.trim(),
                destination: destination.trim(),
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                budget: budget ? parseFloat(budget) : null,
                travelType,
            };

            const tripId = await createTrip(tripData);
            const newTrip = { id: tripId, ...tripData };
            addTrip(newTrip);

            Alert.alert('Success', 'Trip created successfully!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error) {
            console.error('Error creating trip:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card>
                    <Text style={styles.sectionTitle}>Trip Details</Text>

                    <Input
                        label="Trip Title"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g., Summer Vacation 2024"
                        error={errors.title}
                    />

                    <Input
                        label="Destination"
                        value={destination}
                        onChangeText={setDestination}
                        placeholder="e.g., Paris, France"
                        error={errors.destination}
                    />

                    <View style={styles.dateContainer}>
                        <Text style={styles.label}>Start Date</Text>
                        <Button
                            title={formatDate(startDate)}
                            onPress={() => setShowStartPicker(true)}
                            variant="outline"
                        />
                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowStartPicker(false);
                                    if (selectedDate) setStartDate(selectedDate);
                                }}
                            />
                        )}
                    </View>

                    <View style={styles.dateContainer}>
                        <Text style={styles.label}>End Date</Text>
                        <Button
                            title={formatDate(endDate)}
                            onPress={() => setShowEndPicker(true)}
                            variant="outline"
                        />
                        {errors.endDate && (
                            <Text style={styles.errorText}>{errors.endDate}</Text>
                        )}
                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                minimumDate={startDate}
                                onChange={(event, selectedDate) => {
                                    setShowEndPicker(false);
                                    if (selectedDate) setEndDate(selectedDate);
                                }}
                            />
                        )}
                    </View>

                    <Input
                        label="Budget (Optional)"
                        value={budget}
                        onChangeText={setBudget}
                        placeholder="e.g., 2000"
                        keyboardType="numeric"
                        error={errors.budget}
                    />

                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Travel Type</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={travelType}
                                onValueChange={setTravelType}
                                style={styles.picker}
                            >
                                {TRAVEL_TYPES.map((type) => (
                                    <Picker.Item key={type} label={type} value={type} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Card>

                <Button
                    title="Create Trip"
                    onPress={handleCreate}
                    loading={loading}
                    style={styles.createButton}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    scrollContent: {
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.gray[900],
        marginBottom: SPACING.md,
    },
    dateContainer: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: SPACING.xs,
    },
    errorText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
    pickerContainer: {
        marginBottom: SPACING.md,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        backgroundColor: COLORS.white,
    },
    picker: {
        height: 50,
    },
    createButton: {
        marginTop: SPACING.md,
    },
});
