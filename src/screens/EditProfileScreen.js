
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import colors from "../theme/colors";

const PROFILE_FOLDER =
  FileSystem.documentDirectory + "eventease_profiles/";

function ProfileField({ label, value, onChangeText, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.muted}
        {...props}
      />
    </View>
  );
}

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const parts = (user?.name || "").trim().split(/\s+/);

  const [firstName, setFirstName] = useState(
    user?.firstName || parts[0] || ""
  );
  const [lastName, setLastName] = useState(
    user?.lastName || parts.slice(1).join(" ")
  );
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");
  const [photoUri, setPhotoUri] = useState(user?.photoUri || null);
  const [saving, setSaving] = useState(false);

  const choosePhoto = () => {
    Alert.alert("Photo de profil", "Choisis une option", [
      {
        text: "Prendre une photo",
        onPress: () => selectPhoto("camera"),
      },
      {
        text: "Choisir dans la galerie",
        onPress: () => selectPhoto("gallery"),
      },
      {
        text: "Supprimer la photo",
        onPress: () => setPhotoUri(null),
      },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const selectPhoto = async (source) => {
    try {
      const isCamera = source === "camera";
  
      // l'autorisation camera
      let permission = isCamera
        ? await ImagePicker.getCameraPermissionsAsync()
        : await ImagePicker.getMediaLibraryPermissionsAsync();
  
     
      if (!permission.granted && permission.canAskAgain) {
        permission = isCamera
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
  
     
      if (!permission.granted) {
        Alert.alert(
          "Autorisation nécessaire",
          isCamera
            ? "EventEase a besoin d'accéder à la caméra pour prendre ta photo de profil."
            : "EventEase a besoin d'accéder à tes photos pour personnaliser ton profil.",
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Ouvrir les paramètres",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      const options = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      };

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      const sourceUri = result.assets[0].uri;

      await FileSystem.makeDirectoryAsync(PROFILE_FOLDER, {
        intermediates: true,
      });

      const destination =
        PROFILE_FOLDER +
        `profile_${user.id}_${Date.now()}.jpg`;

      await FileSystem.copyAsync({
        from: sourceUri,
        to: destination,
      });

      setPhotoUri(destination);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de sélectionner la photo."
      );
    }
  };

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert(
        "Champs obligatoires",
        "Renseigne ton prénom et ton nom."
      );
      return;
    }

    try {
      setSaving(true);

      await updateProfile({
        firstName,
        lastName,
        phone,
        city,
        photoUri,
      });

      Alert.alert("Succès", "Ton profil a été mis à jour.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Mes informations</Text>
        <Text style={styles.subtitle}>
          Personnalise ton profil EventEase.
        </Text>

        <View style={styles.photoSection}>
          <Pressable onPress={choosePhoto} style={styles.avatar}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons
                name="person"
                size={42}
                color={colors.white}
              />
            )}

            <View style={styles.cameraBadge}>
              <Ionicons
                name="camera"
                size={18}
                color={colors.white}
              />
            </View>
          </Pressable>

          <Pressable onPress={choosePhoto}>
            <Text style={styles.changePhoto}>
              Modifier ma photo
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <ProfileField
            label="Prénom"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Ton prénom"
          />

          <ProfileField
            label="Nom"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Ton nom"
          />

          <ProfileField
            label="Téléphone (facultatif)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Ex : 077 00 00 00"
          />

          <ProfileField
            label="Ville (facultatif)"
            value={city}
            onChangeText={setCity}
            placeholder="Ex : Libreville"
          />

          <Text style={styles.label}>Adresse e-mail</Text>
          <View style={styles.readOnly}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={colors.muted}
            />
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <Text style={styles.note}>
            L'adresse e-mail n'est pas modifiable dans
            cette version.
          </Text>
        </View>

        <Pressable
          onPress={save}
          disabled={saving}
          style={[
            styles.saveButton,
            saving && { opacity: 0.6 },
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={21}
            color="white"
          />
          <Text style={styles.saveText}>
            {saving
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </Text>
        </Pressable>
      </ScrollView>
      </KeyboardAvoidingView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 45,
  },

  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 5,
    marginBottom: 24,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhoto: {
    color: colors.primary,
    fontWeight: "800",
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  field: {
    marginBottom: 17,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  readOnly: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.lavender,
  },
  email: {
    color: colors.muted,
    flex: 1,
  },
  note: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 17,
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },
  saveText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
  },
});
