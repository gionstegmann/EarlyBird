import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Camera, Moon, Sun } from 'lucide-react-native';
import { differenceInMinutes, addHours, format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';

const TARGET_WAKE_TIME_HOUR = 6; // 6:00 AM
const WAKE_WINDOW_MINUTES = 15;

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [debugOffset, setDebugOffset] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    // Calculate "Effective Time" with debug offset
    const effectiveTime = addHours(currentTime, debugOffset);

    // Logic: Check if within window
    // For MVP, we compare against today's target time
    const targetTime = new Date(effectiveTime);
    targetTime.setHours(TARGET_WAKE_TIME_HOUR, 0, 0, 0);

    const diff = differenceInMinutes(effectiveTime, targetTime);
    const isWithinWindow = diff >= 0 && diff <= WAKE_WINDOW_MINUTES;
    const isBefore = diff < 0;
    const isLate = diff > WAKE_WINDOW_MINUTES;

    const handleCameraPress = () => {
        router.push('/camera/capture');
    };

    return (
        <View className="flex-1 bg-black pt-12 px-6">
            {/* Debug Section */}
            <View className="bg-zinc-900 p-4 rounded-xl mb-8 border border-zinc-800">
                <Text className="text-zinc-400 text-xs mb-2 font-bold uppercase tracking-widest">Debug Time Travel</Text>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={-12}
                    maximumValue={12}
                    step={1}
                    value={debugOffset}
                    onValueChange={setDebugOffset}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="#333"
                    thumbTintColor="#fff"
                />
                <View className="flex-row justify-between mt-1">
                    <Text className="text-zinc-500">Real: {format(currentTime, 'HH:mm')}</Text>
                    <Text className="text-white font-bold">Simulated: {format(effectiveTime, 'HH:mm')}</Text>
                </View>
            </View>

            {/* Main Content */}
            <View className="flex-1 justify-center items-center">
                {isBefore && (
                    <View className="items-center">
                        <Moon size={64} color="#52525b" strokeWidth={1} />
                        <Text className="text-zinc-500 text-2xl font-medium mt-6 text-center">
                            Go back to sleep. {'\n'}
                            Target: {TARGET_WAKE_TIME_HOUR}:00 AM
                        </Text>
                    </View>
                )}

                {isWithinWindow && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleCameraPress}
                        className="items-center justify-center"
                    >
                        <View className="w-64 h-64 bg-white rounded-full items-center justify-center shadow-2xl shadow-white/20">
                            <Camera size={80} color="#000" strokeWidth={1.5} />
                        </View>
                        <Text className="text-white text-3xl font-bold mt-8 tracking-tighter">It's Time.</Text>
                        <Text className="text-zinc-400 text-lg mt-2">Post within {WAKE_WINDOW_MINUTES - diff} min to unlock.</Text>
                    </TouchableOpacity>
                )}

                {isLate && (
                    <View className="items-center">
                        <Sun size={64} color="#ef4444" strokeWidth={1} />
                        <Text className="text-red-500 text-2xl font-bold mt-6 text-center">
                            You missed it.
                        </Text>
                        <Text className="text-zinc-500 text-lg mt-2 text-center">
                            Streak lost. See you tomorrow.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}
