
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";

import {
  getCurrentPosition,
  calculateDistance,
  hasCoordinates,
} from "../services/locationService";

export default function EventLocation({ event }) {
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);

  const available = hasCoordinates(event);

  const fullAddress = event?.location
    ? event.location
    : [event?.address, event?.city]
        .filter(Boolean)
        .join(", ");

  useEffect(() => {
    setDistance(null);
  }, [
    event?.id,
    event?.latitude,
    event?.longitude,
    event?.location,
  ]);

  const calculateMyDistance = async () => {
    if (!available || loading) return;

    setLoading(true);

    try {
      const position = await getCurrentPosition();

      const result = calculateDistance(
        position.latitude,
        position.longitude,
        Number(event.latitude),
        Number(event.longitude)
      );

      setDistance(result);
    } catch (error) {
      Alert.alert(
        "Localisation impossible",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const openDirections = async () => {
    const destination = available
      ? `${event.latitude},${event.longitude}`
      : fullAddress;

    if (!destination) {
      Alert.alert(
        "Adresse indisponible",
        "Le lieu de cet événement n'est pas renseigné."
      );
      return;
    }

    const url =
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(destination);

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'ouvrir Google Maps."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="location-outline"
          size={23}
          color={colors.primary}
        />

        <Text style={styles.heading}>
          Localisation
        </Text>
      </View>

      <Text style={styles.place}>
        {fullAddress || "Lieu non renseigné"}
      </Text>

      {available ? (
        <>
          <View style={styles.distanceBox}>
            <Ionicons
              name="navigate-outline"
              size={27}
              color={colors.primary}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.distanceLabel}>
                Distance depuis ma position
              </Text>

              <Text style={styles.distanceValue}>
                {distance === null
                  ? "Non calculée"
                  : `${distance.toFixed(1)} km`}
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.secondaryButton}
            onPress={calculateMyDistance}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons
                name="locate-outline"
                size={20}
                color={colors.primary}
              />
            )}

            <Text style={styles.secondaryButtonText}>
              {loading
                ? "Localisation en cours..."
                : distance === null
                ? "Calculer ma distance"
                : "Actualiser ma distance"}
            </Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.unavailable}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.muted}
          />

          <Text style={styles.infoText}>
            L'adresse est disponible sur Google Maps.
            Le calcul de distance nécessite des
            coordonnées GPS vérifiées.
          </Text>
        </View>
      )}

      {Boolean(fullAddress || available) && (
        <Pressable
          style={styles.primaryButton}
          onPress={openDirections}
        >
          <Ionicons
            name="navigate"
            size={20}
            color={colors.white}
          />

          <Text style={styles.primaryButtonText}>
            Ouvrir l'itinéraire
          </Text>
        </Pressable>
      )}

      {available && (
        <Text style={styles.note}>
          Distance approximative à vol d'oiseau.
          L'itinéraire réel peut être plus long.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginTop: 16,
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  heading: {
    fontSize: 19,
    fontWeight: "900",
    color: colors.text,
  },

  place: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 21,
  },

  distanceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 15,
    borderRadius: 15,
    backgroundColor: colors.lavender,
    marginBottom: 14,
  },

  distanceLabel: {
    color: colors.muted,
    fontSize: 12,
  },

  distanceValue: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
    marginTop: 4,
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 14,
    marginBottom: 10,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 12,
  },

  primaryButtonText: {
    color: colors.white,
    fontWeight: "800",
  },

  note: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 12,
  },

  unavailable: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.lavender,
  },

  infoText: {
    flex: 1,
    color: colors.muted,
    lineHeight: 20,
    fontSize: 13,
  },
});
