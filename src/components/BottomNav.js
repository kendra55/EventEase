import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

import DashboardScreen from "../screens/DashboardScreen";
import EventsListScreen from "../screens/EventsListScreen";
import MyActivitiesScreen from "../screens/MyActivitiesScreen";
import ProfileScreen from "../screens/ProfileScreen";

import colors from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function BottomNav() {
	const { user, logout } = useAuth();

	const icons = {
		AccueilTab: "home",
		EvenementsTab: "calendar",
		ActivitesTab: "heart",
		ProfilTab: "person",
	};

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,

				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.muted,

				tabBarStyle: {
					height: 65,
					paddingTop: 7,
					paddingBottom: 8,
					backgroundColor: "#FFFFFF",
					borderTopColor: colors.border,
				},

				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "600",
				},

				tabBarIcon: ({ color, size, focused }) => (
					<Ionicons
						name={focused ? icons[route.name] : `${icons[route.name]}-outline`}
						size={size}
						color={color}
					/>
				),
			})}
		>
			<Tab.Screen name="AccueilTab" options={{ title: "Accueil" }}>
				{(props) => <DashboardScreen {...props} user={user} />}
			</Tab.Screen>

			<Tab.Screen name="EvenementsTab" options={{ title: "Événements" }}>
				{(props) => <EventsListScreen {...props} />}
			</Tab.Screen>

			<Tab.Screen name="ActivitesTab" options={{ title: "Mes activités" }}>
				{(props) => <MyActivitiesScreen {...props} user={user} />}
			</Tab.Screen>

			<Tab.Screen name="ProfilTab" options={{ title: "Profil" }}>
				{(props) => <ProfileScreen {...props} user={user} onLogout={logout} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
