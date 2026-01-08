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
import { getItinerary, saveItinerary, updateDay } from '../../../src/services/itineraryService';
import { generateItinerary, generateFallbackItinerary } from '../../../src/services/aiService';
import DayCard from '../../../src/components/itinerary/DayCard';
import ActivityModal from '../../../src/components/itinerary/ActivityModal';
import Button from '../../../src/components/ui/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../../src/constants/theme';

export default function ItineraryScreen() {
    const { id } = useLocalSearchParams();
    const { currentTrip, fetchTripById } = useTripStore();

    const [itinerary, setItinerary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);

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

            // Load existing itinerary
            const existingItinerary = await getItinerary(id);
            setItinerary(existingItinerary);
        } catch (error) {
            console.error('Error loading itinerary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateItinerary = async () => {
        if (!currentTrip) return;

        Alert.alert(
            'Generate Itinerary',
            'This will create an AI-generated itinerary for your trip. Any existing itinerary will be replaced.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Generate',
                    onPress: async () => {
                        setGenerating(true);
                        try {
                            let generatedItinerary;

                            try {
                                // Try AI generation
                                generatedItinerary = await generateItinerary(currentTrip);
                            } catch (error) {
                                console.log('AI generation failed, using fallback');
                                // Use fallback if AI fails
                                generatedItinerary = generateFallbackItinerary(currentTrip);
                            }

                            // Save to Firestore
                            await saveItinerary(id, generatedItinerary);
                            setItinerary(generatedItinerary);

                            Alert.alert('Success', 'Itinerary generated successfully!');
                        } catch (error) {
                            console.error('Error generating itinerary:', error);
                            Alert.alert('Error', 'Failed to generate itinerary. Please try again.');
                        } finally {
                            setGenerating(false);
                        }
                    },
                },
            ]
        );
    };

    const handleAddActivity = (dayNumber) => {
        setSelectedDay(dayNumber);
        setSelectedActivity(null);
        setSelectedActivityIndex(null);
        setModalVisible(true);
    };

    const handleEditActivity = (dayNumber, activityIndex, activity) => {
        setSelectedDay(dayNumber);
        setSelectedActivity(activity);
        setSelectedActivityIndex(activityIndex);
        setModalVisible(true);
    };

    const handleSaveActivity = async (activityData) => {
        try {
            const dayIndex = itinerary.findIndex(d => d.day === selectedDay);
            if (dayIndex === -1) return;

            const updatedDay = { ...itinerary[dayIndex] };

            if (selectedActivityIndex !== null) {
                // Edit existing activity
                updatedDay.activities[selectedActivityIndex] = activityData;
            } else {
                // Add new activity
                if (!updatedDay.activities) {
                    updatedDay.activities = [];
                }
                updatedDay.activities.push(activityData);
                // Sort by time
                updatedDay.activities.sort((a, b) => a.time.localeCompare(b.time));
            }

            // Update in Firestore
            await updateDay(id, `day-${selectedDay}`, updatedDay);

            // Update local state
            const newItinerary = [...itinerary];
            newItinerary[dayIndex] = updatedDay;
            setItinerary(newItinerary);
        } catch (error) {
            console.error('Error saving activity:', error);
            Alert.alert('Error', 'Failed to save activity');
        }
    };

    const handleDeleteActivity = async (dayNumber, activityIndex) => {
        Alert.alert(
            'Delete Activity',
            'Are you sure you want to delete this activity?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const dayIndex = itinerary.findIndex(d => d.day === dayNumber);
                            if (dayIndex === -1) return;

                            const updatedDay = { ...itinerary[dayIndex] };
                            updatedDay.activities.splice(activityIndex, 1);

                            // Update in Firestore
                            await updateDay(id, `day-${dayNumber}`, updatedDay);

                            // Update local state
                            const newItinerary = [...itinerary];
                            newItinerary[dayIndex] = updatedDay;
                            setItinerary(newItinerary);
                        } catch (error) {
                            console.error('Error deleting activity:', error);
                            Alert.alert('Error', 'Failed to delete activity');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary[600]} />
                <Text style={styles.loadingText}>Loading itinerary...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Trip Itinerary</Text>
                    {currentTrip && (
                        <Text style={styles.subtitle}>
                            {currentTrip.destination} • {currentTrip.title}
                        </Text>
                    )}
                </View>

                {/* Generate Button */}
                {itinerary.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={64} color={COLORS.gray[300]} />
                        <Text style={styles.emptyTitle}>No Itinerary Yet</Text>
                        <Text style={styles.emptyText}>
                            Generate an AI-powered itinerary or start adding activities manually
                        </Text>
                        <Button
                            title={generating ? 'Generating...' : 'Generate with AI'}
                            onPress={handleGenerateItinerary}
                            loading={generating}
                            style={styles.generateButton}
                        />
                    </View>
                ) : (
                    <>
                        {/* Regenerate Button */}
                        <TouchableOpacity
                            style={styles.regenerateButton}
                            onPress={handleGenerateItinerary}
                            disabled={generating}
                        >
                            <Ionicons name="sparkles-outline" size={20} color={COLORS.primary[600]} />
                            <Text style={styles.regenerateText}>
                                {generating ? 'Generating...' : 'Regenerate with AI'}
                            </Text>
                        </TouchableOpacity>

                        {/* Itinerary Days */}
                        {itinerary.map((day) => (
                            <DayCard
                                key={day.day}
                                day={day}
                                onAddActivity={handleAddActivity}
                                onEditActivity={handleEditActivity}
                                onDeleteActivity={handleDeleteActivity}
                            />
                        ))}
                    </>
                )}
            </ScrollView>

            {/* Activity Modal */}
            <ActivityModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveActivity}
                activity={selectedActivity}
                dayNumber={selectedDay}
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
        marginBottom: SPACING.xl,
        paddingHorizontal: SPACING.xl,
    },
    generateButton: {
        minWidth: 200,
    },
    regenerateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        backgroundColor: COLORS.primary[50],
        borderRadius: 12,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.primary[200],
    },
    regenerateText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.primary[600],
    },
});
