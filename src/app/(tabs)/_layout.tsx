import { Tabs } from "expo-router";
import { Home, List } from "lucide-react-native";
import { View } from "react-native";
import "../../global.css";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#000",
                    borderTopColor: "#333",
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#666",
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="feed"
                options={{
                    tabBarIcon: ({ color }) => <List color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
