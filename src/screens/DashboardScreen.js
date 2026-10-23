import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from "../context/EventsContext";
import EventCard from "../components/EventCard";
import ScreenLayout from "../components/ScreenLayout";
import colors from "../theme/colors";

export default function DashboardScreen({ navigation, user }) {
	const { events, participations } = useEvents();
	const userId = String(user?.id || user?.email || "");
	const joined = events.filter((e) =>
		(participations[e.id] || []).includes(userId),
	);
	const upcoming = events
		.filter((e) => e.date >= new Date().toISOString().slice(0, 10))
		.slice(0, 4);
	const name = user?.name || user?.fullName || user?.prenom || "Bienvenue";
	return (
		<ScreenLayout>
			<FlatList
				data={upcoming}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.container}
				ListHeaderComponent={
					<>
						<Text style={styles.hello}>Bonjour, {name} 👋</Text>
						<Text style={styles.subtitle}>
							Découvre, participe et crée des moments qui rassemblent.
						</Text>
						<View style={styles.hero}>
							<View style={{ flex: 1 }}>
								<Text style={styles.heroSmall}>EVENTEASE</Text>
								<Text style={styles.heroTitle}>Chaque événement compte.</Text>
								<Text style={styles.heroDesc}>Fais vivre ta communauté.</Text>
							</View>
							<Ionicons name="sparkles-outline" size={52} color="#E6DFFF" />
						</View>
						<View style={styles.stats}>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>{events.length}</Text>
								<Text style={styles.statLabel}>Événements</Text>
							</View>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>{joined.length}</Text>
								<Text style={styles.statLabel}>Inscriptions</Text>
							</View>
						</View>
						<View style={styles.row}>
							<Text style={styles.heading}>À venir</Text>
							<Pressable onPress={() => navigation.navigate("EvenementsTab")}>
								<Text style={styles.link}>Voir tout →</Text>
							</Pressable>
						</View>
					</>
				}
				renderItem={({ item }) => (
					<EventCard
						event={item}
						onPress={() => navigation.navigate("EventDetails", { id: item.id })}
					/>
				)}
				ListEmptyComponent={
					<Text style={styles.empty}>
						Aucun événement à venir pour le moment.
					</Text>
				}
				ListFooterComponent={
					<Pressable
						style={styles.create}
						onPress={() => navigation.navigate("EventForm")}
					>
						<Ionicons
							name="add-circle-outline"
							size={20}
							color={colors.primary}
						/>
						<Text style={styles.createText}>Créer un événement</Text>
					</Pressable>
				}
			/>
		</ScreenLayout>
	);
}
const styles = StyleSheet.create({
	container: {  paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40, },
	hello: { fontSize: 27, fontWeight: "900", color: colors.text, marginTop: 10 },
	subtitle: {
		color: colors.muted,
		fontSize: 14,
		lineHeight: 21,
		marginTop: 7,
		marginBottom: 20,
	},
	hero: {
		backgroundColor: colors.primary,
		padding: 23,
		borderRadius: 25,
		flexDirection: "row",
		alignItems: "center",
	},
	heroSmall: {
		color: "#DED2FF",
		fontSize: 11,
		fontWeight: "900",
		letterSpacing: 2,
	},
	heroTitle: { color: "white", fontSize: 24, fontWeight: "900", marginTop: 8 },
	heroDesc: { color: "#E5DCFF", marginTop: 7 },
	stats: { flexDirection: "row", gap: 12, marginTop: 18 },
	stat: {
		flex: 1,
		backgroundColor: "white",
		padding: 19,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: colors.border,
	},
	statNumber: { fontSize: 27, color: colors.primary, fontWeight: "900" },
	statLabel: { color: colors.muted, marginTop: 4 },
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 26,
		marginBottom: 15,
	},
	heading: { fontSize: 21, color: colors.text, fontWeight: "900" },
	link: { color: colors.primary, fontWeight: "800" },
	empty: { color: colors.muted, paddingVertical: 25 },
	create: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		backgroundColor: colors.lavender,
		borderRadius: 16,
	},
	createText: { color: colors.primary, fontWeight: "800" },
});
