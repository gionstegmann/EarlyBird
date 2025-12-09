import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    async function handleAuth() {
        setLoading(true);
        try {
            if (isSignUp) {
                const { error, data: { user } } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Navigation is handled by the root layout listener
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-black justify-center px-8"
        >
            <View className="items-center mb-12">
                <Text className="text-white text-4xl font-bold tracking-tighter">EarlyBird.</Text>
                <Text className="text-zinc-500 font-medium mt-2">Wake up or pay the price.</Text>
            </View>

            <View className="space-y-4 gap-4">
                <View className="flex-row items-center bg-zinc-900 rounded-2xl px-4 h-14 border border-zinc-800">
                    <Mail color="#71717a" size={20} />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#71717a"
                        className="flex-1 text-white ml-3 font-medium text-lg"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View className="flex-row items-center bg-zinc-900 rounded-2xl px-4 h-14 border border-zinc-800">
                    <Lock color="#71717a" size={20} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#71717a"
                        className="flex-1 text-white ml-3 font-medium text-lg"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleAuth}
                    disabled={loading}
                    className="bg-white h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-white/10"
                >
                    {loading ? (
                        <Loader2 color="#000" size={24} className="animate-spin" />
                    ) : (
                        <>
                            <Text className="text-black font-bold text-lg mr-2">
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </Text>
                            <ArrowRight color="#000" size={20} strokeWidth={3} />
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsSignUp(!isSignUp)}
                    className="items-center py-4"
                >
                    <Text className="text-zinc-500 font-medium">
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
