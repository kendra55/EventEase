
import React, { useEffect,useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import ScreenLayout from "../components/ScreenLayout";
import EventCard from "../components/EventCard";
import { useEvents } from "../context/EventsContext";
import colors from "../theme/colors";

export default function MyActivitiesScreen({
  navigation,
  route,
  user,
}) {
  const { events, participations } = useEvents();

  
  const [activeTab, setActiveTab] = useState("participations");

  useEffect(() => {
    const requestedTab = route?.params?.tab;
  
    if (
      requestedTab === "created" ||
      requestedTab === "participations"
    ) {
      setActiveTab(requestedTab);
    }
  }, [route?.params?.tab]);
  
  const userId = String(user?.id || user?.email || "");

  // événements auxquels l'utilisateur participe
  const joined = events.filter((event) =>
    (participations[event.id] || []).includes(userId)
  );

  // événements créés par l'utilisateur
  const created = events.filter(
    (event) => String(event.ownerId) === userId
  );

  const displayedEvents =
    activeTab === "participations" ? joined : created;

  const openEvent = (id) => {
    navigation.navigate("EventDetails", { id });
  };

  const openEventsList = () => {
    navigation.navigate("EvenementsTab");
  };

  const openCreateEvent = () => {
    navigation.navigate("EventForm");
  };

  return (
    <ScreenLayout>
      <View style={styles.wrap}>
       
        <Text style={styles.heading}>
          Mes activités
        </Text>

        <Text style={styles.sub}>
          Retrouve tes participations et les événements
          que tu as créés.
        </Text>

      
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Ionicons
              name="heart-outline"
              size={24}
              color={colors.primary}
            />

            <Text style={styles.statNumber}>
              {joined.length}
            </Text>

            <Text style={styles.statLabel}>
              Participations
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.primary}
            />

            <Text style={styles.statNumber}>
              {created.length}
            </Text>

            <Text style={styles.statLabel}>
              Événements créés
            </Text>
          </View>
        </View>

      
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setActiveTab("participations")}
            style={[
              styles.tab,
              activeTab === "participations" &&
                styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "participations" &&
                  styles.activeTabText,
              ]}
            >
              Mes participations
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("created")}
            style={[
              styles.tab,
              activeTab === "created" &&
                styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "created" &&
                  styles.activeTabText,
              ]}
            >
              Mes créations
            </Text>
          </Pressable>
        </View>

        {/* liste des événements */}
        <FlatList
          data={displayedEvents}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => openEvent(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons
                name={
                  activeTab === "participations"
                    ? "heart-outline"
                    : "calendar-outline"
                }
                size={42}
                color={colors.primary}
              />

              <Text style={styles.emptyTitle}>
                {activeTab === "participations"
                  ? "Aucune participation"
                  : "Aucun événement créé"}
              </Text>

              <Text style={styles.emptyText}>
                {activeTab === "participations"
                  ? "Explore les événements et inscris-toi à ceux qui t'intéressent."
                  : "Crée ton premier événement pour le retrouver ici."}
              </Text>

              <Pressable
                style={styles.emptyButton}
                onPress={
                  activeTab === "participations"
                    ? openEventsList
                    : openCreateEvent
                }
              >
                <Text style={styles.emptyButtonText}>
                  {activeTab === "participations"
                    ? "Explorer les événements"
                    : "Créer un événement"}
                </Text>
              </Pressable>
            </View>
          }
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },

  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },

  sub: {
    color: colors.muted,
    marginTop: 5,
    marginBottom: 20,
    lineHeight: 21,
  },

  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: "center",
    gap: 5,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.text,
  },

  statLabel: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: colors.lavender,
    borderRadius: 15,
    padding: 5,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 11,
  },

  activeTab: {
    backgroundColor: colors.primary,
  },

  tabText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },

  activeTabText: {
    color: colors.white,
  },

  list: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  emptyBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 25,
    marginTop: 18,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
    textAlign: "center",
  },

  emptyText: {
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 13,
  },

  emptyButtonText: {
    color: colors.white,
    fontWeight: "800",
    textAlign: "center",
  },
});
