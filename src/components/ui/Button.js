import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon = null,
    style,
    textStyle,
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: COLORS.primary[600],
                    borderColor: COLORS.primary[600],
                };
            case 'secondary':
                return {
                    backgroundColor: COLORS.secondary[600],
                    borderColor: COLORS.secondary[600],
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: COLORS.primary[600],
                    borderWidth: 1,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                };
            default:
                return {
                    backgroundColor: COLORS.primary[600],
                    borderColor: COLORS.primary[600],
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: SPACING.sm,
                    paddingHorizontal: SPACING.md,
                };
            case 'medium':
                return {
                    paddingVertical: SPACING.md,
                    paddingHorizontal: SPACING.lg,
                };
            case 'large':
                return {
                    paddingVertical: SPACING.lg,
                    paddingHorizontal: SPACING.xl,
                };
            default:
                return {
                    paddingVertical: SPACING.md,
                    paddingHorizontal: SPACING.lg,
                };
        }
    };

    const getTextColor = () => {
        if (variant === 'outline' || variant === 'ghost') {
            return COLORS.primary[600];
        }
        return COLORS.white;
    };

    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.button,
                getVariantStyles(),
                getSizeStyles(),
                isDisabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        ...SHADOWS.sm,
    },
    text: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Button;
