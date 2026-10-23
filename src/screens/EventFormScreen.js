
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import { useEvents } from "../context/EventsContext";
import colors, { categories } from "../theme/colors";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialAddress(event) {
  if (!event) {
    return { city: "", address: "" };
  }

  if (event.city || event.address) {
    return {
      city: event.city || "",
      address: event.address || "",
    };
  }

  const oldLocation = String(event.location || "").trim();

  if (!oldLocation) {
    return { city: "", address: "" };
  }

  
  return {
    city: "",
    address: oldLocation,
  };
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
      />
    </View>
  );
}

export default function EventFormScreen({
  navigation,
  route,
  user,
}) {
  const { events, addEvent, updateEvent } = useEvents();

  const existing = events.find(
    (event) => event.id === route?.params?.id
  );

  const userId = String(user?.id || user?.email || "");

  const initialAddress = getInitialAddress(existing);

  const [title, setTitle] = useState(existing?.title || "");
  const [category, setCategory] = useState(
    existing?.category || "Culture"
  );
  const [date, setDate] = useState(existing?.date || "");
  const [time, setTime] = useState(existing?.time || "");
  const [city, setCity] = useState(initialAddress.city);
  const [address, setAddress] = useState(initialAddress.address);
  const [description, setDescription] = useState(
    existing?.description || ""
  );
  const [capacity, setCapacity] = useState(
    existing?.capacity != null
      ? String(existing.capacity)
      : ""
  );

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const fullAddress = [
    address.trim(),
    city.trim(),
    "Gabon",
  ].join(", ");

  const verifyAddress = async () => {
    if (!city.trim() || !address.trim()) {
      Alert.alert(
        "Adresse manquante",
        "Renseigne d'abord la ville et l'adresse précise."
      );
      return;
    }

    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(fullAddress);

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'ouvrir Google Maps."
      );
    }
  };

  const save = async () => {
    if (saving) return;

    if (!userId) {
      Alert.alert(
        "Connexion requise",
        "Reconnecte-toi pour créer ou modifier un événement."
      );
      return;
    }

    if (
      ![
        title,
        date,
        time,
        city,
        address,
        description,
        capacity,
      ].every((value) => value.trim())
    ) {
      Alert.alert(
        "Champs manquants",
        "Complète tous les champs du formulaire."
      );
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert(
        "Date incorrecte",
        "Choisis une date dans le calendrier."
      );
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(time)) {
      Alert.alert(
        "Heure incorrecte",
        "Utilise le format HH:MM, par exemple 14:30."
      );
      return;
    }

    const eventDate = new Date(`${date}T${time}:00`);

    if (
      Number.isNaN(eventDate.getTime()) ||
      eventDate.getFullYear() !== Number(date.slice(0, 4)) ||
      eventDate.getMonth() + 1 !== Number(date.slice(5, 7)) ||
      eventDate.getDate() !== Number(date.slice(8, 10)) ||
      eventDate.getHours() !== Number(time.slice(0, 2)) ||
      eventDate.getMinutes() !== Number(time.slice(3, 5))
    ) {
      Alert.alert(
        "Date ou heure invalide",
        "Vérifie la date et l'heure de l'événement."
      );
      return;
    }

    if (eventDate.getTime() < Date.now()) {
      Alert.alert(
        "Date dépassée",
        "Choisis une date et une heure futures."
      );
      return;
    }

    const count = Number(capacity);

    if (!Number.isInteger(count) || count < 1) {
      Alert.alert(
        "Capacité invalide",
        "Entre un nombre entier supérieur à zéro."
      );
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      date,
      time,

      city: city.trim(),
      address: address.trim(),
      location: fullAddress,

      description: description.trim(),
      capacity: count,
      organizer:
        user?.name || user?.fullName || "Organisateur",

      // Les coordonnées seront ajoutées plus tard
      // après confirmation de l'emplacement.
      latitude: null,
      longitude: null,
    };

    setSaving(true);

    try {
      if (existing) {
        const result = await updateEvent(
          existing.id,
          payload,
          userId
        );

        if (result === false) {
          Alert.alert(
            "Accès refusé",
            "Seul le créateur peut modifier cet événement."
          );
          return;
        }

        navigation.replace("EventDetails", {
          id: existing.id,
        });
      } else {
        const id = await addEvent(payload, userId);

        if (!id) {
          throw new Error(
            "L'événement n'a pas pu être créé."
          );
        }

        navigation.replace("EventDetails", { id });
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        error?.message ||
          "Impossible d'enregistrer l'événement."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.wrap}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>
            {existing
              ? "Modifier l'événement"
              : "Créer un événement"}
          </Text>

          <Text style={styles.sub}>
            Partage un moment avec ta communauté.
          </Text>

          <Field
            label="Nom de l'événement"
            value={title}
            onChangeText={setTitle}
            placeholder="Ex. Atelier créatif"
          />

          <Text style={styles.label}>Catégorie</Text>

          <View style={styles.categories}>
            {categories
              .filter((item) => item !== "Tous")
              .map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.chip,
                    category === item && styles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      category === item &&
                        styles.activeChipText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
          </View>

          {/* Date avec calendrier */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Date de l'événement
            </Text>

            <Pressable
              style={styles.dateButton}
              onPress={() => setCalendarVisible(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={23}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.dateText,
                  !date && styles.placeholderText,
                ]}
              >
                {date
                  ? date.split("-").reverse().join("/")
                  : "Choisir une date"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.muted}
              />
            </Pressable>
          </View>

          <Field
            label="Heure (HH:MM)"
            value={time}
            onChangeText={setTime}
            placeholder="14:30"
          />

          {/* Adresse */}
          <Text style={styles.sectionTitle}>
            <Ionicons
              name="location-outline"
              size={19}
              color={colors.primary}
            />{" "}
            Lieu de l'événement
          </Text>

          <Field
            label="Ville"
            value={city}
            onChangeText={setCity}
            placeholder="Ex. Libreville"
          />

          <Field
            label="Adresse précise / Point de repère"
            value={address}
            onChangeText={setAddress}
            placeholder="Ex. Université Omar Bongo, entrée principale"
          />

          <Pressable
            style={styles.mapsButton}
            onPress={verifyAddress}
          >
            <Ionicons
              name="map-outline"
              size={21}
              color={colors.primary}
            />

            <Text style={styles.mapsButtonText}>
              Vérifier l'adresse sur Maps
            </Text>
          </Pressable>

          <Text style={styles.addressHint}>
            Vérifie que Google Maps reconnaît le bon lieu
            avant de publier ton événement.
          </Text>

          <Field
            label="Nombre de places"
            value={capacity}
            onChangeText={setCapacity}
            placeholder="30"
            keyboardType="number-pad"
          />

          <Field
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Décris ton événement..."
            multiline
          />

          <PrimaryButton
            title={
              saving
                ? "Enregistrement..."
                : existing
                ? "Enregistrer les modifications"
                : "Publier l'événement"
            }
            onPress={save}
            disabled={saving}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* calendrier d"événement */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Choisir une date
              </Text>

              <Pressable
                onPress={() => setCalendarVisible(false)}
                accessibilityLabel="Fermer le calendrier"
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={colors.text}
                />
              </Pressable>
            </View>

            <Calendar
              current={date || getToday()}
              minDate={getToday()}
              firstDay={1}
              onDayPress={(day) => {
                setDate(day.dateString);
                setCalendarVisible(false);
              }}
              markedDates={
                date
                  ? {
                      [date]: {
                        selected: true,
                        selectedColor: colors.primary,
                      },
                    }
                  : {}
              }
              theme={{
                calendarBackground: colors.white,
                monthTextColor: colors.text,
                dayTextColor: colors.text,
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                textMonthFontWeight: "800",
                textDayHeaderFontWeight: "700",
              }}
            />

            <Pressable
              style={styles.cancelButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.text,
  },

  sub: {
    color: colors.muted,
    marginTop: 5,
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },

  field: {
    marginBottom: 17,
  },

  label: {
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 14,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.text,
  },

  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  chip: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: colors.lavender,
  },

  activeChip: {
    backgroundColor: colors.primary,
  },

  chipText: {
    color: colors.primary,
    fontWeight: "700",
  },

  activeChipText: {
    color: colors.white,
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 55,
  },

  dateText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  placeholderText: {
    color: colors.muted,
  },

  mapsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.lavender,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  mapsButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },

  addressHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 14,
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: colors.text,
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 8,
  },

  cancelText: {
    color: colors.primary,
    fontWeight: "800",
  },
});
