import React from "react";
import { ActivityIndicator, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { EventsProvider } from "./src/context/EventsContext";
import BottomNav from "./src/components/BottomNav";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

import EventDetailsScreen from "./src/screens/EventDetailsScreen";
import EventFormScreen from "./src/screens/EventFormScreen";

import colors from "./src/theme/colors";

import EditProfileScreen from "./src/screens/EditProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AboutScreen from "./src/screens/AboutScreen";

const Stack = createNativeStackNavigator();

function MainNavigation() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: colors.background,
				}}
			>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				{user ? (
					<>
						<Stack.Screen name="MainTabs" component={BottomNav} />

						<Stack.Screen
							name="EventDetails"
							options={{
								headerShown: true,
								title: "Détails de l'événement",
							}}
						>
							{(props) => <EventDetailsScreen {...props} user={user} />}
						</Stack.Screen>

						<Stack.Screen
							name="EventForm"
							options={{
								headerShown: true,
								title: "Événement",
							}}
						>
							{(props) => <EventFormScreen {...props} user={user} />}
						</Stack.Screen>

						<Stack.Screen
							name="EditProfile"
							component={EditProfileScreen}
							options={{
								headerShown: true,
								title: "Mes informations",
							}}
						/>

						<Stack.Screen
							name="Settings"
							component={SettingsScreen}
							options={{
								headerShown: true,
								title: "Paramètres",
							}}
						/>

						<Stack.Screen
							name="About"
							component={AboutScreen}
							options={{
								headerShown: true,
								title: "À propos d'EventEase",
							}}
						/>
					</>
				) : (
					<>
						<Stack.Screen name="Welcome" component={WelcomeScreen} />

						<Stack.Screen name="Login" component={LoginScreen} />

						<Stack.Screen name="Register" component={RegisterScreen} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<EventsProvider>
				<MainNavigation />
			</EventsProvider>
		</AuthProvider>
	);
}
