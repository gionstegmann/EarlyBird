import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { X, Camera, RefreshCcw, Check } from 'lucide-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export default function CaptureScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraType>('front');
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    if (!permission) {
        return <View className="flex-1 bg-black" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-black justify-center items-center px-6">
                <Text className="text-white text-center mb-4 text-lg">We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} className="bg-white px-6 py-3 rounded-full">
                    <Text className="font-bold">Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const result = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    skipProcessing: false, // Ensure image is processed for better orientation
                });

                if (result && result.uri) {
                    // Optimization: Resize to 1080px width
                    const manipulated = await ImageManipulator.manipulateAsync(
                        result.uri,
                        [{ resize: { width: 1080 } }],
                        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    setPhoto(manipulated.uri);
                }
            } catch (e) {
                console.error("Failed to take picture", e);
            }
        }
    };

    const uploadPost = async () => {
        if (!photo || !user) return;
        setUploading(true);

        try {
            // 1. Upload Image
            const filename = `${user.id}/${Date.now()}.jpg`;
            const method = 'POST';
            const formData = new FormData();

            // React Native way to append file
            // @ts-ignore
            formData.append('file', {
                uri: photo,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('posts') // Ensure this bucket exists!
                .upload(filename, formData, {
                    contentType: 'image/jpeg',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // 2. Insert Post Record
            const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(filename);

            const { error: dbError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    image_url: publicUrl,
                    caption: 'Good morning!', // Placeholder caption
                });

            if (dbError) throw dbError;

            Alert.alert("Success", "Daily commit unlocked!");
            router.replace('/(tabs)/feed');

        } catch (e) {
            Alert.alert("Error", (e as Error).message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            {photo ? (
                // Preview Mode
                <View className="flex-1 relative">
                    <Image
                        source={{ uri: photo }}
                        style={{ flex: 1 }}
                        contentFit="cover"
                    />
                    {/* Overlay Controls */}
                    <View className="absolute bottom-12 w-full flex-row justify-around px-8">
                        <TouchableOpacity
                            disabled={uploading}
                            onPress={() => setPhoto(null)}
                            className="w-16 h-16 bg-zinc-800 rounded-full items-center justify-center border border-zinc-700"
                        >
                            <X color="#fff" size={32} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={uploading}
                            onPress={uploadPost}
                            className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg shadow-white/20"
                        >
                            {uploading ? <ActivityIndicator color="#000" /> : <Check color="#000" size={32} strokeWidth={3} />}
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                // Camera Mode
                <CameraView
                    ref={cameraRef}
                    style={{ flex: 1 }}
                    facing={facing}
                >
                    <View className="flex-1 justify-between py-12 px-6">
                        <TouchableOpacity onPress={() => router.back()} className="self-start bg-black/40 p-2 rounded-full">
                            <X color="#fff" size={24} />
                        </TouchableOpacity>

                        <View className="flex-row justify-between items-center px-4">
                            <TouchableOpacity
                                onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                                className="bg-black/40 p-4 rounded-full"
                            >
                                <RefreshCcw color="#fff" size={24} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={takePicture} className="bg-white/20 p-2 rounded-full border-4 border-white">
                                <View className="w-16 h-16 bg-white rounded-full" />
                            </TouchableOpacity>

                            <View style={{ width: 50 }} />
                        </View>
                    </View>
                </CameraView>
            )}
        </View>
    );
}
