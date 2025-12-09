import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { session, setSession } = useAuthStore();
    const [isReady, setIsReady] = useState(false);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsReady(true);
            SplashScreen.hideAsync();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (session && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!session && segments[0] !== '(auth)' && segments[0] !== 'index') {
            // Protect other routes, but allow index (landing) and (auth)
            // router.replace('/(auth)/login'); 
        }
    }, [session, segments, isReady]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="index" />
        </Stack>
    );
}
