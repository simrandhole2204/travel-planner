import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../src/store/authStore';
import { logout } from '../../src/services/authService';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, clearUser } = useAuthStore();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                            clearUser();
                            router.replace('/(auth)/login');
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color={COLORS.primary[600]} />
                </View>
                <Text style={styles.name}>
                    {user?.displayName || user?.email || 'Guest User'}
                </Text>
                {user?.email && (
                    <Text style={styles.email}>{user.email}</Text>
                )}
                {user?.isAnonymous && (
                    <View style={styles.guestBadge}>
                        <Text style={styles.guestBadgeText}>Guest Account</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <Card>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="person-outline" size={24} color={COLORS.gray[700]} />
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                </Card>

                <Card>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.gray[700]} />
                        <Text style={styles.menuText}>Notifications</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                </Card>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <Card>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="globe-outline" size={24} color={COLORS.gray[700]} />
                        <Text style={styles.menuText}>Language</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                </Card>

                <Card>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="moon-outline" size={24} color={COLORS.gray[700]} />
                        <Text style={styles.menuText}>Dark Mode</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                </Card>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>

                <Card>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={24} color={COLORS.gray[700]} />
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                </Card>

                <Card>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="document-text-outline" size={24} color={COLORS.gray[700]} />
                        <Text style={styles.menuText}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                </Card>

                <Card>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="information-circle-outline" size={24} color={COLORS.gray[700]} />
                        <Text style={styles.menuText}>About</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                </Card>
            </View>

            <Button
                title="Logout"
                onPress={handleLogout}
                variant="outline"
                style={styles.logoutButton}
            />

            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    header: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    avatarContainer: {
        marginBottom: SPACING.md,
    },
    name: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.gray[900],
        marginBottom: SPACING.xs,
    },
    email: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
    },
    guestBadge: {
        backgroundColor: COLORS.warning,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 16,
        marginTop: SPACING.sm,
    },
    guestBadgeText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    section: {
        marginTop: SPACING.lg,
        paddingHorizontal: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: SPACING.sm,
        paddingHorizontal: SPACING.xs,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    menuText: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[900],
        marginLeft: SPACING.md,
    },
    logoutButton: {
        marginHorizontal: SPACING.md,
        marginTop: SPACING.xl,
        marginBottom: SPACING.md,
    },
    version: {
        textAlign: 'center',
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
        marginVertical: SPACING.lg,
    },
});
