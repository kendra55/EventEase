
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

const USERS_KEY = "@eventease_users";
const SESSION_KEY = "@eventease_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const saved = await AsyncStorage.getItem(SESSION_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (error) {
        console.warn("Restauration de session :", error);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const getUsers = async () => {
    const saved = await AsyncStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const makeSession = (account) => ({
    id: account.id,
    name: account.name || "",
    firstName: account.firstName || "",
    lastName: account.lastName || "",
    email: account.email,
    phone: account.phone || "",
    city: account.city || "",
    photoUri: account.photoUri || null,
    createdAt: account.createdAt || null,
  });

  const saveSession = async (account) => {
    const session = makeSession(account);
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );
    setUser(session);
  };

  const register = async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim() || !normalizedEmail || !password) {
      throw new Error("Veuillez remplir tous les champs.");
    }

    if (password.length < 6) {
      throw new Error(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
    }

    const users = await getUsers();

    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error("Cette adresse email est déjà utilisée.");
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      firstName: name.trim().split(/\s+/)[0] || "",
      lastName: name.trim().split(/\s+/).slice(1).join(" "),
      email: normalizedEmail,
      password,
      phone: "",
      city: "",
      photoUri: null,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify([...users, newUser])
    );

    await saveSession(newUser);
  };

  const login = async (email, password) => {
    const users = await getUsers();

    const found = users.find(
      (u) =>
        u.email === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!found) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    await saveSession(found);
  };

  const updateProfile = async (changes) => {
    if (!user?.id) {
      throw new Error("Aucun utilisateur connecté.");
    }

    const users = await getUsers();
    const index = users.findIndex(
      (u) => String(u.id) === String(user.id)
    );

    if (index === -1) {
      throw new Error("Compte introuvable.");
    }

    const firstName = String(changes.firstName || "").trim();
    const lastName = String(changes.lastName || "").trim();

    if (!firstName || !lastName) {
      throw new Error("Le prénom et le nom sont obligatoires.");
    }

    const updated = {
      ...users[index],
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone: String(changes.phone || "").trim(),
      city: String(changes.city || "").trim(),
      photoUri: changes.photoUri || null,
    };

    users[index] = updated;

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );

    await saveSession(updated);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user?.id) {
      throw new Error("Aucun utilisateur connecté.");
    }

    const users = await getUsers();
    const remaining = users.filter(
      (u) => String(u.id) !== String(user.id)
    );

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(remaining)
    );

    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
