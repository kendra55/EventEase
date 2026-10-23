
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons
            name="calendar"
            size={36}
            color={colors.white}
          />
        </View>

        <Text style={styles.appName}>EventEase</Text>
        <Text style={styles.tagline}>
          Vivez des moments qui comptent.
        </Text>
        <Text style={styles.version}>Version 1.0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Notre mission</Text>
        <Text style={styles.paragraph}>
          EventEase facilite la découverte, la création et
          la participation à des événements.
        </Text>

        <Text style={styles.paragraph}>
          Culture, sport, solidarité, formation, ateliers,
          sorties, pop-up : chacun peut trouver
          une activité qui lui ressemble.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          Comment ça fonctionne ?
        </Text>

        <Text style={styles.paragraph}>
          1. Explore les événements disponibles.
        </Text>
        <Text style={styles.paragraph}>
          2. Consulte les informations et participe.
        </Text>
        <Text style={styles.paragraph}>
          3. Crée tes propres événements.
        </Text>
        <Text style={styles.paragraph}>
          4. Retrouve tes activités dans ton espace personnel.
        </Text>
      </View>

      <Text style={styles.footer}>
        Application développée dans le cadre d'un projet
        académique React Native.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 45,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 30,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
  },
  tagline: {
    color: colors.primary,
    fontWeight: "700",
    marginTop: 7,
  },
  version: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 9,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },
  paragraph: {
    color: colors.muted,
    lineHeight: 23,
    marginBottom: 9,
  },
  footer: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    marginTop: 15,
    lineHeight: 20,
  },
});
