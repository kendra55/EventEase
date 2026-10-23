import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@eventease/events/v1';
const JOIN_KEY = '@eventease/participations/v1';
const EventsContext = createContext(null);

const initialEvents = [
  { id: 'demo-1', title: 'Collecte solidaire', category: 'Solidarité', date: '2026-11-07', time: '09:00', location: 'Libreville, Centre-ville', description: 'Une matinée de collecte de vêtements et de produits essentiels au profit des familles.', capacity: 35, organizer: 'Association Ensemble' },
  { id: 'demo-2', title: 'Atelier prise de parole', category: 'Formation', date: '2026-11-14', time: '14:00', location: 'Libreville, Louis', description: 'Développez votre confiance et apprenez à présenter vos idées devant un public.', capacity: 20, organizer: 'EventEase' },
  { id: 'demo-3', title: 'Tournoi de quartier', category: 'Sport', date: '2026-11-21', time: '10:00', location: 'Owendo', description: 'Une journée conviviale autour du sport et de la cohésion.', capacity: 60, organizer: 'Club Jeunesse' },
];
const sortEvents = (items) => [...items].sort((a,b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [participations, setParticipations] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedEvents, savedJoins] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(JOIN_KEY),
        ]);
        setEvents(savedEvents === null ? initialEvents : JSON.parse(savedEvents));
        setParticipations(savedJoins ? JSON.parse(savedJoins) : {});
      } catch (error) {
        console.warn('Chargement des événements impossible', error);
        setEvents(initialEvents);
      } finally { setReady(true); }
    })();
  }, []);

  useEffect(() => { if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events)).catch(console.warn); }, [events, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(JOIN_KEY, JSON.stringify(participations)).catch(console.warn); }, [participations, ready]);

  const addEvent = (payload, ownerId) => {
    const id = `event-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    setEvents(current => [{ ...payload, id, ownerId: String(ownerId) }, ...current]);
    return id;
  };
  const updateEvent = (id, payload, ownerId) => {
    if (!events.some(e => e.id === id && e.ownerId === String(ownerId))) return false;
    setEvents(current => current.map(e => e.id === id ? { ...e, ...payload } : e));
    return true;
  };
  const deleteEvent = (id, ownerId) => {
    if (!events.some(e => e.id === id && e.ownerId === String(ownerId))) return false;
    setEvents(current => current.filter(e => e.id !== id));
    setParticipations(current => {
      const copy = { ...current }; delete copy[id]; return copy;
    });
    return true;
  };
  const toggleParticipation = (id, userId) => {
    const event = events.find(e => e.id === id);
    if (!event || !userId) return false;
    const key = String(userId);
    const attendees = participations[id] || [];
    if (!attendees.includes(key) && attendees.length >= Number(event.capacity)) return false;
    setParticipations(current => {
      const members = current[id] || [];
      return { ...current, [id]: members.includes(key) ? members.filter(u => u !== key) : [...members, key] };
    });
    return true;
  };

  const removeUserData = async (userId) => {
    if (!ready) {
      throw new Error(
        "Les événements ne sont pas encore chargés."
      );
    }
  
    const key = String(userId || "");
  
    if (!key) {
      throw new Error("Identifiant utilisateur manquant.");
    }
  
    // suppression des événements créés par l'utilisateur
    const ownedEventIds = new Set(
      events
        .filter((event) => String(event.ownerId) === key)
        .map((event) => event.id)
    );
  
    const remainingEvents = events.filter(
      (event) => !ownedEventIds.has(event.id)
    );
  
    // suppression des participations au événements
    const remainingParticipations = {};
  
    Object.entries(participations).forEach(
      ([eventId, members]) => {
        if (ownedEventIds.has(eventId)) {
          return;
        }
  
        const remainingMembers = (
          Array.isArray(members) ? members : []
        ).filter((memberId) => String(memberId) !== key);
  
        if (remainingMembers.length > 0) {
          remainingParticipations[eventId] =
            remainingMembers;
        }
      }
    );
  
    // données nettoyées avant la déconnexion.
    await AsyncStorage.multiSet([
      [STORAGE_KEY, JSON.stringify(remainingEvents)],
      [
        JOIN_KEY,
        JSON.stringify(remainingParticipations),
      ],
    ]);
  
    setEvents(remainingEvents);
    setParticipations(remainingParticipations);
  
    return true;
  };

  const value = useMemo(() => ({ events: sortEvents(events), participations, ready, addEvent, updateEvent, deleteEvent, toggleParticipation, removeUserData, }), [events, participations, ready]);
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}


export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents doit être utilisé dans EventsProvider');
  return context;
}
