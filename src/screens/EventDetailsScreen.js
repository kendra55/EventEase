import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import { useEvents } from "../context/EventsContext";
import colors, { categoryColors } from "../theme/colors";
import EventWeather from "../components/EventWeather";
import EventLocation from "../components/EventLocation";
import { getEventIllustration } from "../utils/EventIllustrations";

export default function EventDetailsScreen({ navigation, route, user }) {
	const { events, participations, toggleParticipation, deleteEvent } =
		useEvents();
	const event = events.find((e) => e.id === route.params?.id);
	const userId = String(user?.id || user?.email || "");
	if (!event)
		return (
			<ScreenLayout>
				<View style={styles.wrap}>
					<Text>Événement introuvable.</Text>
				</View>
			</ScreenLayout>
		);
	const members = participations[event.id] || [];
	const joined = members.includes(userId);
	const isOwner = Boolean(event.ownerId && event.ownerId === userId);
	const full = members.length >= Number(event.capacity);
	const color = categoryColors[event.category] || colors.primary;
	const onDelete = () =>
		Alert.alert("Supprimer cet événement ?", "Cette action est définitive.", [
			{ text: "Annuler", style: "cancel" },
			{
				text: "Supprimer",
				style: "destructive",
				onPress: () => {
					if (deleteEvent(event.id, userId)) navigation.goBack();
				},
			},
		]);
	return (
		<ScreenLayout>
			<ScrollView contentContainerStyle={styles.wrap}>
			<View style={styles.cover}>
  <Image
    source={getEventIllustration(event.category)}
    style={styles.coverImage}
    resizeMode="cover"
  />

  <View style={[styles.categoryBadge, { backgroundColor: color }]}>
    <Text style={styles.categoryBadgeText}>
      {event.category}
    </Text>
  </View>
</View>
				<Text style={[styles.tag, { color }]}>
					{event.category.toUpperCase()}
				</Text>
				<Text style={styles.title}>{event.title}</Text>
				<View style={styles.info}>
					<Ionicons name="calendar-outline" size={20} color={colors.primary} />
					<Text style={styles.infoText}>
						{event.date} à {event.time}
					</Text>
				</View>
				<View style={styles.info}>
					<Ionicons name="location-outline" size={20} color={colors.primary} />
					<Text style={styles.infoText}>{event.location}</Text>
				</View>
				<View style={styles.info}>
					<Ionicons name="people-outline" size={20} color={colors.primary} />
					<Text style={styles.infoText}>
						{members.length}/{event.capacity} participant(s)
					</Text>
				</View>
				<Text style={styles.section}>À propos</Text>
				<Text style={styles.description}>{event.description}</Text>
				<Text style={styles.organizer}>
					Organisé par {event.organizer || "EventEase"}
				</Text>

        <EventLocation event={event} />
        <EventWeather event={event} />
				
        <PrimaryButton
					title={
						joined
							? "Annuler ma participation"
							: full
								? "Événement complet"
								: "Participer à cet événement"
					}
					disabled={!joined && full}
					outline={joined}
					onPress={() => {
						if (!userId) {
							Alert.alert(
								"Connexion requise",
								"Reconnecte-toi pour participer.",
							);
							return;
						}
						if (!toggleParticipation(event.id, userId))
							Alert.alert("Indisponible", "Aucune place disponible.");
					}}
				/>
				{isOwner && (
					<>
						<PrimaryButton
							title="Modifier l’événement"
							outline
							onPress={() => navigation.navigate("EventForm", { id: event.id })}
						/>
						<PrimaryButton
							title="Supprimer l’événement"
							danger
							onPress={onDelete}
						/>
					</>
				)}
			</ScrollView>
		</ScreenLayout>
	);
}
const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 45,
  },
	cover: {
    width: "100%",
    height: 230,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: colors.lavender,
  },
	tag: { fontSize: 12, fontWeight: "900", letterSpacing: 1 },
	title: {
		fontSize: 27,
		fontWeight: "900",
		color: colors.text,
		marginTop: 7,
		marginBottom: 20,
	},
	info: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		padding: 14,
		backgroundColor: "white",
		borderRadius: 14,
		marginBottom: 9,
	},
	infoText: { flex: 1, color: colors.text, fontWeight: "600" },
	section: {
		fontSize: 20,
		fontWeight: "900",
		color: colors.text,
		marginTop: 20,
		marginBottom: 8,
	},
	description: { color: colors.muted, fontSize: 15, lineHeight: 24 },
	organizer: {
		marginTop: 17,
		marginBottom: 10,
		color: colors.primary,
		fontWeight: "700",
	},
  coverImage: {
    width: "100%",
    height: "100%",
  },
  
  categoryBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
