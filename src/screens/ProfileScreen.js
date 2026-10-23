
import React from "react";
import {
  Alert,
  Image,
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

function MenuItem({ icon, title, subtitle, onPress, danger }) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={danger ? "#D83B50" : colors.primary}
        />
      </View>

      <View style={styles.menuText}>
        <Text
          style={[
            styles.menuTitle,
            danger && { color: "#D83B50" },
          ]}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.muted}
      />
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { events, participations } = useEvents();

  const userId = String(user?.id || user?.email || "");

  const created = events.filter(
    (event) => String(event.ownerId) === userId
  ).length;

  const joined = events.filter((event) =>
    (participations[event.id] || []).includes(userId)
  ).length;

  const confirmLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Souhaites-tu te déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", onPress: logout },
      ]
    );
  };

  const openActivities = (tab) => {
    navigation.navigate("ActivitesTab", { tab });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.wrap}
    >
      <Text style={styles.heading}>Mon profil</Text>

      <View style={styles.profileCard}>
        <Pressable
          style={styles.avatar}
          onPress={() => navigation.navigate("EditProfile")}
        >
          {user?.photoUri ? (
            <Image
              source={{ uri: user.photoUri }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons
              name="person"
              size={43}
              color={colors.white}
            />
          )}

          <View style={styles.cameraBadge}>
            <Ionicons
              name="camera"
              size={15}
              color={colors.white}
            />
          </View>
        </Pressable>

        <Text style={styles.name}>
          {user?.name || "Utilisateur"}
        </Text>

        <Text style={styles.email}>{user?.email}</Text>

        {user?.city ? (
          <Text style={styles.city}>
            <Ionicons name="location-outline" size={14} />
            {" "}{user.city}
          </Text>
        ) : null}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{created}</Text>
            <Text style={styles.statLabel}>Créations</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{joined}</Text>
            <Text style={styles.statLabel}>Participations</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>MON ESPACE</Text>

      <View style={styles.menuCard}>
        <MenuItem
          icon="person-outline"
          title="Mes informations"
          subtitle="Modifier mon profil et ma photo"
          onPress={() => navigation.navigate("EditProfile")}
        />

        <MenuItem
          icon="calendar-outline"
          title="Mes événements"
          subtitle="Retrouver mes créations"
          onPress={() => openActivities("created")}
        />

        <MenuItem
          icon="heart-outline"
          title="Mes participations"
          subtitle="Retrouver mes inscriptions"
          onPress={() => openActivities("participations")}
        />
      </View>

      <Text style={styles.sectionTitle}>APPLICATION</Text>

      <View style={styles.menuCard}>
        <MenuItem
          icon="settings-outline"
          title="Paramètres"
          subtitle="Gérer mon compte"
          onPress={() => navigation.navigate("Settings")}
        />

        <MenuItem
          icon="information-circle-outline"
          title="À propos"
          subtitle="Découvrir EventEase"
          onPress={() => navigation.navigate("About")}
        />
      </View>

      <Pressable
        style={styles.logout}
        onPress={confirmLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={21}
          color="#D83B50"
        />
        <Text style={styles.logoutText}>
          Se déconnecter
        </Text>
      </Pressable>

      <Text style={styles.version}>EventEase · Version 1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  email: {
    color: colors.muted,
    marginTop: 5,
  },
  city: {
    color: colors.muted,
    marginTop: 7,
  },
  stats: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.lavender,
    borderRadius: 17,
    padding: 15,
    marginTop: 20,
    alignItems: "center",
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.primary,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.muted,
    marginTop: 24,
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.lavender,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 14,
  },
  menuSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
  },
  logout: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F2A5AF",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },
  logoutText: {
    color: "#D83B50",
    fontWeight: "800",
  },
  version: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    marginTop: 20,
  },
});
