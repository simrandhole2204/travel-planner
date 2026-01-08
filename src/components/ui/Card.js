import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const Card = ({ children, style, variant = 'default' }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'elevated':
                return SHADOWS.lg;
            case 'outlined':
                return {
                    borderWidth: 1,
                    borderColor: COLORS.gray[200],
                };
            default:
                return SHADOWS.md;
        }
    };

    return (
        <View style={[styles.card, getVariantStyles(), style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
});

export default Card;
