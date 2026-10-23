
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventsContext";
import colors from "../theme/colors";

export default function SettingsScreen() {
  const { user, deleteAccount } = useAuth();
  const { events, ready, removeUserData } = useEvents();
  const [deleting, setDeleting] = useState(false);

  const userId = String(user?.id || "");
  const createdCount = events.filter(
    (event) => String(event.ownerId) === userId
  ).length;

  const confirmDeletion = () => {
    if (deleting) return;
  
    if (!ready) {
      Alert.alert(
        "Chargement en cours",
        "Patiente quelques instants avant de supprimer ton compte."
      );
      return;
    }
  
    Alert.alert(
      "Supprimer définitivement mon compte",
      `Cette action supprimera ton compte local, ` +
        `tes ${createdCount} événement(s) créés et ` +
        `toutes tes participations.\n\n` +
        `Cette opération est irréversible.`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer mon compte",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
  
              // nettoyer les événements et participations
              await removeUserData(userId);
  
              // supprimer le compte 
              await deleteAccount();
            } catch (error) {
              Alert.alert(
                "Erreur",
                error.message ||
                  "Impossible de supprimer le compte."
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Paramètres</Text>
      <Text style={styles.subtitle}>
        Gère les informations et la confidentialité de ton compte.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons
            name="shield-checkmark-outline"
            size={25}
            color={colors.primary}
          />

          <View style={styles.textBlock}>
            <Text style={styles.title}>
              Données personnelles
            </Text>
            <Text style={styles.description}>
              Cette version d'EventEase conserve les comptes
              et les événements localement sur l'appareil.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.section}>ZONE SENSIBLE</Text>

      <View style={styles.card}>
        <Pressable
          style={styles.row}
          disabled={deleting}
          onPress={confirmDeletion}
        >
          <Ionicons
            name="trash-outline"
            size={25}
            color="#D83B50"
          />

          <View style={styles.textBlock}>
            <Text style={styles.danger}>
              Supprimer mon compte
            </Text>
            <Text style={styles.description}>
              Effacer mon compte enregistré sur cet appareil.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.muted}
          />
        </Pressable>
      </View>

      <Text style={styles.warning}>
      Attention : la suppression de ton compte est définitive.
      Tes événements et tes inscriptions seront également
      effacés de cet appareil.
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
    paddingBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 22,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 15,
  },
  description: {
    color: colors.muted,
    lineHeight: 19,
    fontSize: 12,
    marginTop: 5,
  },
  section: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.muted,
    marginTop: 28,
    marginBottom: 12,
  },
  danger: {
    fontWeight: "800",
    color: "#D83B50",
    fontSize: 15,
  },
  warning: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 15,
  },
});
