
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";
import { getEventWeather } from "../services/weatherService";

export default function EventWeather({ event }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadWeather = async () => {
      setLoading(true);
      setError("");
      setWeather(null);

      try {
        const result = await getEventWeather(event);

        if (active) {
          setWeather(result);
        }
      } catch (err) {
        if (active) {
          setError(
            "Impossible de charger la météo. Vérifie ta connexion Internet."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      active = false;
    };
  }, [
    event?.id,
    event?.date,
    event?.location,
    event?.latitude,
    event?.longitude,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="partly-sunny-outline"
          size={23}
          color={colors.primary}
        />
        <Text style={styles.heading}>Météo prévue</Text>
      </View>

      {loading ? (
        <View style={styles.messageRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.message}>
            Chargement des prévisions...
          </Text>
        </View>
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : weather?.status !== "success" ? (
        <Text style={styles.message}>
          {weather?.message || "Météo indisponible."}
        </Text>
      ) : (
        <>
          <Text style={styles.location}>
            Prévisions pour {weather.locationName}
          </Text>

          <View style={styles.mainWeather}>
            <Ionicons
              name={weather.description.icon}
              size={45}
              color={colors.primary}
            />

            <View style={styles.temperatureBox}>
              <Text style={styles.temperature}>
                {Math.round(weather.maxTemperature)} °C
              </Text>

              <Text style={styles.condition}>
                {weather.description.label}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detail}>
              <Ionicons
                name="thermometer-outline"
                size={19}
                color={colors.primary}
              />
              <Text style={styles.detailText}>
                Min. {Math.round(weather.minTemperature)} °C
              </Text>
            </View>

            <View style={styles.detail}>
              <Ionicons
                name="rainy-outline"
                size={19}
                color={colors.primary}
              />
              <Text style={styles.detailText}>
                Pluie : {weather.rainProbability ?? "—"} %
              </Text>
            </View>

            <View style={styles.detail}>
              <Ionicons
                name="flag-outline"
                size={19}
                color={colors.primary}
              />
              <Text style={styles.detailText}>
                Vent : {Math.round(weather.windSpeed)} km/h
              </Text>
            </View>
          </View>

          <Text style={styles.source}>
            Prévisions journalières · Données Open-Meteo
          </Text>
        </>
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
    marginTop: 20,
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  heading: {
    fontSize: 19,
    fontWeight: "900",
    color: colors.text,
  },

  location: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 14,
  },

  mainWeather: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 18,
  },

  temperatureBox: {
    flex: 1,
  },

  temperature: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.text,
  },

  condition: {
    color: colors.muted,
    marginTop: 3,
  },

  details: {
    backgroundColor: colors.lavender,
    borderRadius: 15,
    padding: 14,
    gap: 12,
  },

  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  detailText: {
    color: colors.text,
    fontWeight: "600",
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  message: {
    color: colors.muted,
    lineHeight: 22,
  },

  source: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "right",
    marginTop: 14,
  },
});
