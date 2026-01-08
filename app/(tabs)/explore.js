import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchNearbyPlaces } from '../../src/services/placesService';
import PlaceCard from '../../src/components/explore/PlaceCard';
import PlaceDetailsModal from '../../src/components/explore/PlaceDetailsModal';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/constants/theme';

const CATEGORIES = [
    { id: 'tourist_attraction', label: 'Attractions', icon: 'camera' },
    { id: 'restaurant', label: 'Restaurants', icon: 'restaurant' },
    { id: 'cafe', label: 'Cafes', icon: 'cafe' },
    { id: 'lodging', label: 'Hotels', icon: 'bed' },
    { id: 'museum', label: 'Museums', icon: 'business' },
    { id: 'park', label: 'Parks', icon: 'leaf' },
];

export default function ExploreScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('tourist_attraction');
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            Alert.alert('Enter Location', 'Please enter a city or destination to search');
            return;
        }

        setLoading(true);
        try {
            const results = await searchNearbyPlaces(searchQuery, selectedCategory);
            setPlaces(results);
        } catch (error) {
            console.error('Error searching places:', error);
            Alert.alert('Error', 'Failed to search places. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlacePress = (place) => {
        setSelectedPlace(place);
        setDetailsModalVisible(true);
    };

    const handleAddToItinerary = (place) => {
        setDetailsModalVisible(false);
        Alert.alert(
            'Add to Itinerary',
            `Would you like to add "${place.name}" to your trip itinerary?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add',
                    onPress: () => {
                        // TODO: Implement add to itinerary functionality
                        Alert.alert('Success', 'Place added to itinerary!');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Explore</Text>
                <Text style={styles.subtitle}>Discover amazing places</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.gray[400]} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter city or destination..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category.id && styles.categoryButtonActive,
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Ionicons
                            name={category.icon}
                            size={20}
                            color={selectedCategory === category.id ? COLORS.white : COLORS.gray[600]}
                        />
                        <Text
                            style={[
                                styles.categoryLabel,
                                selectedCategory === category.id && styles.categoryLabelActive,
                            ]}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Results */}
            <ScrollView
                style={styles.resultsContainer}
                contentContainerStyle={styles.resultsContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary[600]} />
                        <Text style={styles.loadingText}>Searching places...</Text>
                    </View>
                ) : places.length > 0 ? (
                    <>
                        <Text style={styles.resultsCount}>
                            {places.length} places found
                        </Text>
                        {places.map((place) => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                onPress={() => handlePlacePress(place)}
                            />
                        ))}
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="compass-outline" size={64} color={COLORS.gray[300]} />
                        <Text style={styles.emptyTitle}>Start Exploring</Text>
                        <Text style={styles.emptyText}>
                            Search for a destination to discover amazing places
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Place Details Modal */}
            <PlaceDetailsModal
                visible={detailsModalVisible}
                onClose={() => setDetailsModalVisible(false)}
                placeId={selectedPlace?.id}
                onAddToItinerary={handleAddToItinerary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    header: {
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.white,
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
    searchContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        gap: SPACING.sm,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.gray[100],
        borderRadius: BORDER_RADIUS.full,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[900],
    },
    searchButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriesContainer: {
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    categoriesContent: {
        padding: SPACING.md,
        gap: SPACING.sm,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.gray[100],
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    categoryButtonActive: {
        backgroundColor: COLORS.primary[600],
        borderColor: COLORS.primary[600],
    },
    categoryLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[600],
    },
    categoryLabelActive: {
        color: COLORS.white,
    },
    resultsContainer: {
        flex: 1,
    },
    resultsContent: {
        padding: SPACING.md,
    },
    resultsCount: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[600],
        marginBottom: SPACING.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        paddingHorizontal: SPACING.xl,
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
});
