import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Linking,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPlaceDetails, getPhotoUrl } from '../../services/placesService';
import Button from '../ui/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

const PlaceDetailsModal = ({ visible, onClose, placeId, onAddToItinerary }) => {
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    useEffect(() => {
        if (visible && placeId) {
            loadPlaceDetails();
        }
    }, [visible, placeId]);

    const loadPlaceDetails = async () => {
        setLoading(true);
        try {
            const details = await getPlaceDetails(placeId);
            setPlace(details);
        } catch (error) {
            console.error('Error loading place details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriceLevel = (level) => {
        return '$'.repeat(level || 1);
    };

    const handleCall = () => {
        if (place?.phone) {
            Linking.openURL(`tel:${place.phone}`);
        }
    };

    const handleWebsite = () => {
        if (place?.website) {
            Linking.openURL(place.website);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={COLORS.gray[900]} />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary[600]} />
                    </View>
                ) : place ? (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Photos */}
                        {place.photos && place.photos.length > 0 ? (
                            <View style={styles.photosSection}>
                                <Image
                                    source={{ uri: getPhotoUrl(place.photos[selectedPhotoIndex], 800) }}
                                    style={styles.mainPhoto}
                                    resizeMode="cover"
                                />
                                {place.photos.length > 1 && (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.photoThumbnails}
                                    >
                                        {place.photos.map((photo, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => setSelectedPhotoIndex(index)}
                                            >
                                                <Image
                                                    source={{ uri: getPhotoUrl(photo, 200) }}
                                                    style={[
                                                        styles.thumbnail,
                                                        selectedPhotoIndex === index && styles.selectedThumbnail,
                                                    ]}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        ) : (
                            <View style={styles.noPhotoContainer}>
                                <Ionicons name="image-outline" size={64} color={COLORS.gray[300]} />
                            </View>
                        )}

                        {/* Basic Info */}
                        <View style={styles.infoSection}>
                            <Text style={styles.placeName}>{place.name}</Text>

                            {/* Rating */}
                            <View style={styles.ratingRow}>
                                <View style={styles.rating}>
                                    <Ionicons name="star" size={20} color={COLORS.warning} />
                                    <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
                                    <Text style={styles.reviewCount}>
                                        ({place.userRatingsTotal} reviews)
                                    </Text>
                                </View>
                                {place.priceLevel > 0 && (
                                    <Text style={styles.priceLevel}>
                                        {getPriceLevel(place.priceLevel)}
                                    </Text>
                                )}
                            </View>

                            {/* Address */}
                            <View style={styles.detailRow}>
                                <Ionicons name="location" size={20} color={COLORS.gray[600]} />
                                <Text style={styles.detailText}>{place.address}</Text>
                            </View>

                            {/* Phone */}
                            {place.phone && (
                                <TouchableOpacity style={styles.detailRow} onPress={handleCall}>
                                    <Ionicons name="call" size={20} color={COLORS.primary[600]} />
                                    <Text style={[styles.detailText, styles.linkText]}>{place.phone}</Text>
                                </TouchableOpacity>
                            )}

                            {/* Website */}
                            {place.website && (
                                <TouchableOpacity style={styles.detailRow} onPress={handleWebsite}>
                                    <Ionicons name="globe" size={20} color={COLORS.primary[600]} />
                                    <Text style={[styles.detailText, styles.linkText]} numberOfLines={1}>
                                        Visit Website
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Open Status */}
                            {place.isOpen !== undefined && (
                                <View style={styles.detailRow}>
                                    <Ionicons
                                        name="time"
                                        size={20}
                                        color={place.isOpen ? COLORS.success : COLORS.error}
                                    />
                                    <Text style={[styles.detailText, { color: place.isOpen ? COLORS.success : COLORS.error }]}>
                                        {place.isOpen ? 'Open Now' : 'Closed'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Opening Hours */}
                        {place.openingHours && place.openingHours.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Opening Hours</Text>
                                {place.openingHours.map((hours, index) => (
                                    <Text key={index} style={styles.hoursText}>{hours}</Text>
                                ))}
                            </View>
                        )}

                        {/* Reviews */}
                        {place.reviews && place.reviews.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Reviews</Text>
                                {place.reviews.map((review, index) => (
                                    <View key={index} style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <Text style={styles.reviewAuthor}>{review.author}</Text>
                                            <View style={styles.reviewRating}>
                                                <Ionicons name="star" size={14} color={COLORS.warning} />
                                                <Text style={styles.reviewRatingText}>{review.rating}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.reviewText}>{review.text}</Text>
                                        <Text style={styles.reviewTime}>{review.time}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                ) : null}

                {/* Footer Actions */}
                {!loading && place && (
                    <View style={styles.footer}>
                        <Button
                            title="Add to Itinerary"
                            onPress={() => onAddToItinerary(place)}
                            icon="add-circle-outline"
                        />
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: SPACING.md,
        paddingTop: SPACING.xl,
    },
    closeButton: {
        padding: SPACING.sm,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    photosSection: {
        marginBottom: SPACING.md,
    },
    mainPhoto: {
        width: '100%',
        height: 300,
        backgroundColor: COLORS.gray[200],
    },
    photoThumbnails: {
        padding: SPACING.md,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.md,
        marginRight: SPACING.sm,
        opacity: 0.6,
    },
    selectedThumbnail: {
        opacity: 1,
        borderWidth: 2,
        borderColor: COLORS.primary[600],
    },
    noPhotoContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
    },
    infoSection: {
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    placeName: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.gray[900],
        marginBottom: SPACING.sm,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.gray[900],
    },
    reviewCount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    priceLevel: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.success,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    detailText: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[700],
    },
    linkText: {
        color: COLORS.primary[600],
    },
    section: {
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.gray[900],
        marginBottom: SPACING.md,
    },
    hoursText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[700],
        marginBottom: 4,
    },
    reviewCard: {
        backgroundColor: COLORS.gray[50],
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    reviewAuthor: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[900],
    },
    reviewRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reviewRatingText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[900],
    },
    reviewText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[700],
        lineHeight: 20,
        marginBottom: SPACING.xs,
    },
    reviewTime: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    footer: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
    },
});

export default PlaceDetailsModal;
