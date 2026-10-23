
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";

import EventCard from "../components/EventCard";
import ScreenLayout from "../components/ScreenLayout";
import { useEvents } from "../context/EventsContext";
import colors, { categories } from "../theme/colors";


LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier", "Février", "Mars", "Avril",
    "Mai", "Juin", "Juillet", "Août",
    "Septembre", "Octobre", "Novembre", "Décembre",
  ],
  monthNamesShort: [
    "Janv.", "Févr.", "Mars", "Avr.",
    "Mai", "Juin", "Juil.", "Août",
    "Sept.", "Oct.", "Nov.", "Déc.",
  ],
  dayNames: [
    "Dimanche", "Lundi", "Mardi", "Mercredi",
    "Jeudi", "Vendredi", "Samedi",
  ],
  dayNamesShort: [
    "Dim.", "Lun.", "Mar.", "Mer.",
    "Jeu.", "Ven.", "Sam.",
  ],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";

export default function EventsListScreen({ navigation }) {
  const { events } = useEvents();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState("list");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  // filtrage commun à la liste et au calendrier
  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        category === "Tous" || event.category === category;

      const searchText = [
        event.title,
        event.location,
        event.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchText.includes(
        query.trim().toLowerCase()
      );

      return matchesCategory && matchesQuery;
    });
  }, [events, query, category]);

  // dates avec événement filtré
  const markedDates = useMemo(() => {
    const marks = {};

    filtered.forEach((event) => {
      if (event.date) {
        marks[event.date] = {
          marked: true,
          dotColor: colors.primary,
        };
      }
    });

    // mettre en évidence la date sélectionnée
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: colors.white,
    };

    return marks;
  }, [filtered, selectedDate]);

  // en mode calendrier : que les événements du jour choisi
  const displayedEvents =
    viewMode === "calendar"
      ? filtered.filter((event) => event.date === selectedDate)
      : filtered;

  const openEvent = (id) => {
    navigation.navigate("EventDetails", { id });
  };

  return (
    <ScreenLayout>
      <View style={styles.wrap}>
        <Text style={styles.heading}>Explorer les événements</Text>

        <Text style={styles.sub}>
          Trouve une activité qui te ressemble.
        </Text>

        {/* recherche */}
        <View style={styles.search}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.muted}
          />

          <TextInput
            placeholder="Rechercher un événement..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>

      
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.chips}
        >
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.chip,
                category === item && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  category === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

      
        <View style={styles.viewSwitcher}>
          <Pressable
            style={[
              styles.viewButton,
              viewMode === "list" && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="list-outline"
              size={19}
              color={
                viewMode === "list"
                  ? colors.white
                  : colors.primary
              }
            />
            <Text
              style={[
                styles.viewText,
                viewMode === "list" && styles.viewTextActive,
              ]}
            >
              Liste
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.viewButton,
              viewMode === "calendar" && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode("calendar")}
          >
            <Ionicons
              name="calendar-outline"
              size={19}
              color={
                viewMode === "calendar"
                  ? colors.white
                  : colors.primary
              }
            />
            <Text
              style={[
                styles.viewText,
                viewMode === "calendar" && styles.viewTextActive,
              ]}
            >
              Calendrier
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={displayedEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            viewMode === "calendar" ? (
              <View>
                <View style={styles.calendarBox}>
                  <Calendar
                    current={selectedDate}
                    firstDay={1}
                    onDayPress={(day) => {
                      setSelectedDate(day.dateString);
                    }}
                    markedDates={markedDates}
                    enableSwipeMonths
                    theme={{
                      calendarBackground: colors.white,
                      monthTextColor: colors.text,
                      dayTextColor: colors.text,
                      todayTextColor: colors.primary,
                      arrowColor: colors.primary,
                      textDisabledColor: colors.border,
                      textMonthFontWeight: "800",
                      textDayHeaderFontWeight: "700",
                    }}
                  />
                </View>

                <Text style={styles.sectionTitle}>
                  Événements du {selectedDate.split("-").reverse().join("/")}
                </Text>

                <Text style={styles.resultCount}>
                  {displayedEvents.length} événement(s) trouvé(s)
                </Text>
              </View>
            ) : (
              <Text style={styles.resultCount}>
                {displayedEvents.length} événement(s) trouvé(s)
              </Text>
            )
          }
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => openEvent(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons
                name="calendar-outline"
                size={36}
                color={colors.primary}
              />
              <Text style={styles.empty}>
                {viewMode === "calendar"
                  ? "Aucun événement pour cette date."
                  : "Aucun événement trouvé."}
              </Text>
            </View>
          }
        />

        {/* Bouton de création */}
        <Pressable
          accessibilityLabel="Créer un événement"
          onPress={() => navigation.navigate("EventForm")}
          style={styles.fab}
        >
          <Ionicons name="add" size={30} color={colors.white} />
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },

  sub: {
    color: colors.muted,
    marginTop: 5,
    marginBottom: 18,
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: colors.white,
    borderRadius: 17,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    flex: 1,
    paddingVertical: 13,
    color: colors.text,
  },

  categoriesScroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: 60,
  },

  chips: {
    gap: 8,
  paddingVertical: 10,
  alignItems: "center",
  paddingRight: 20,
  },

  chip: {
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: colors.lavender,
  },

  chipActive: {
    backgroundColor: colors.primary,
  },

  chipText: {
    color: colors.primary,
    fontWeight: "800",
  },

  chipTextActive: {
    color: colors.white,
  },

  viewSwitcher: {
    flexDirection: "row",
    backgroundColor: colors.lavender,
    borderRadius: 15,
    padding: 5,
    marginBottom: 12,
  },

  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: 11,
  },

  viewButtonActive: {
    backgroundColor: colors.primary,
  },

  viewText: {
    color: colors.primary,
    fontWeight: "800",
  },

  viewTextActive: {
    color: colors.white,
  },

  listContent: {
    paddingBottom: 100,
  },

  calendarBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 6,
    marginBottom: 18,
    overflow: "hidden",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 5,
  },

  resultCount: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 12,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: 20,
  },

  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 10,
    lineHeight: 22,
  },

  fab: {
    position: "absolute",
    bottom: 22,
    right: 23,
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
