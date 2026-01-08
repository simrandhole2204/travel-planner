import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../../src/constants/theme';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Map View</Text>
            <Text style={styles.subtitle}>
                View your trip on the map
            </Text>
            <Text style={styles.comingSoon}>Coming Soon!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray[50],
        padding: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: 'bold',
        color: COLORS.gray[900],
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    comingSoon: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.primary[600],
        fontWeight: '600',
    },
});
