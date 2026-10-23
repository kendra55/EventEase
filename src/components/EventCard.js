
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import colors, { categoryColors } from "../theme/colors";
import { getEventIllustration } from "../utils/EventIllustrations";

export default function EventCard({
  event,
  onPress,
  compact = false,
}) {
  const [year, month, day] = (event.date || "").split("-");

  const color =
    categoryColors[event.category] || colors.primary;

  const illustration = getEventIllustration(event.category);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      
      {/* illustration selon la catégorie */}
      <View
        style={[
          styles.visual,
          compact && styles.visualCompact,
          { backgroundColor: color + "24" },
        ]}
      >
        <Image
          source={illustration}
          style={styles.image}
          resizeMode="cover"
        />

        {/* date de l'événement */}
        <View style={styles.datePill}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={colors.primary}
          />

          <Text style={styles.dateText}>
            {day && month && year
              ? `${day}/${month}/${year}`
              : "Date à confirmer"}
          </Text>
        </View>
      </View>

      {/* informations de l'événement */}
      <View
        style={[
          styles.content,
          compact && styles.contentCompact,
        ]}
      >
        <Text style={[styles.category, { color }]}>
          {(event.category || "Autre").toUpperCase()}
        </Text>

        <Text
          style={[
            styles.title,
            compact && styles.titleCompact,
          ]}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        <View style={styles.line}>
          <Ionicons
            name="time-outline"
            size={15}
            color={colors.muted}
          />

          <Text style={styles.meta}>
            {event.time || "Heure à confirmer"}
          </Text>
        </View>

        <View style={styles.line}>
          <Ionicons
            name="location-outline"
            size={15}
            color={colors.muted}
          />

          <Text style={styles.meta} numberOfLines={1}>
            {event.location || "Lieu à confirmer"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pressed: {
    opacity: 0.85,
  },

  visual: {
    height: 160,
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },

  visualCompact: {
    height: 105,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  datePill: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  dateText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 12,
  },

  content: {
    padding: 16,
  },

  contentCompact: {
    padding: 12,
  },

  category: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 9,
  },

  titleCompact: {
    fontSize: 16,
  },

  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },

  meta: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
  },
});
