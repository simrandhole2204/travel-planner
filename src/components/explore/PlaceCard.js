import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPhotoUrl } from '../../services/placesService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

const PlaceCard = ({ place, onPress }) => {
    const getPriceLevel = (level) => {
        return '$'.repeat(level || 1);
    };

    const getCategoryIcon = (types) => {
        if (types.includes('restaurant') || types.includes('food')) return 'restaurant';
        if (types.includes('lodging') || types.includes('hotel')) return 'bed';
        if (types.includes('museum')) return 'business';
        if (types.includes('park')) return 'leaf';
        return 'location';
    };

    const photoUrl = place.photoReference
        ? getPhotoUrl(place.photoReference, 300)
        : 'https://via.placeholder.com/300x200?text=No+Image';

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Image */}
            <Image
                source={{ uri: photoUrl }}
                style={styles.image}
                resizeMode="cover"
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={getCategoryIcon(place.types)}
                            size={20}
                            color={COLORS.primary[600]}
                        />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.name} numberOfLines={1}>
                            {place.name}
                        </Text>
                        <Text style={styles.address} numberOfLines={1}>
                            {place.address}
                        </Text>
                    </View>
                </View>

                {/* Rating & Price */}
                <View style={styles.footer}>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={16} color={COLORS.warning} />
                        <Text style={styles.ratingText}>
                            {place.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.reviewCount}>
                            ({place.userRatingsTotal})
                        </Text>
                    </View>

                    {place.priceLevel > 0 && (
                        <Text style={styles.price}>
                            {getPriceLevel(place.priceLevel)}
                        </Text>
                    )}
                </View>

                {/* Open Status */}
                {place.isOpen !== undefined && (
                    <View style={[styles.statusBadge, place.isOpen ? styles.openBadge : styles.closedBadge]}>
                        <Text style={[styles.statusText, place.isOpen ? styles.openText : styles.closedText]}>
                            {place.isOpen ? 'Open Now' : 'Closed'}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: COLORS.gray[200],
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.gray[900],
        marginBottom: 4,
    },
    address: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[900],
    },
    reviewCount: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    price: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.success,
    },
    statusBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    openBadge: {
        backgroundColor: COLORS.success + '20',
    },
    closedBadge: {
        backgroundColor: COLORS.error + '20',
    },
    statusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    openText: {
        color: COLORS.success,
    },
    closedText: {
        color: COLORS.error,
    },
});

export default PlaceCard;
