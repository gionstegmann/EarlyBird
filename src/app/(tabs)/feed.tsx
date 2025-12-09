import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Post {
    id: string;
    image_url: string;
    caption: string;
    created_at: string;
    user_id: string;
    profiles: {
        username: string;
        avatar_url: string | null;
    }
}

export default function FeedScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const renderItem = ({ item }: { item: Post }) => (
        <View className="mb-8">
            <View className="flex-row items-center px-4 mb-3">
                <View className="w-8 h-8 rounded-full bg-zinc-800 mr-3 overflow-hidden">
                    {item.profiles.avatar_url && (
                        <Image
                            source={{ uri: item.profiles.avatar_url }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    )}
                </View>
                <Text className="text-white font-bold">{item.profiles.username || 'Anonymous'}</Text>
                <Text className="text-zinc-500 text-xs ml-auto">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </Text>
            </View>

            <View className="aspect-square bg-zinc-900 w-full mb-3">
                <Image
                    source={{ uri: item.image_url }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={500}
                />
            </View>

            {item.caption && (
                <Text className="text-zinc-300 px-4 leading-5">
                    <Text className="text-white font-bold">{item.profiles.username} </Text>
                    {item.caption}
                </Text>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-black pt-12">
            <Text className="text-white text-2xl font-bold px-4 mb-4">Feed</Text>
            {loading ? (
                <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
            ) : (
                <FlashList
                    data={posts}
                    renderItem={renderItem}
                    estimatedItemSize={400}
                    onRefresh={fetchPosts}
                    refreshing={loading}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </View>
    );
}
