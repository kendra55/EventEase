
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';
import ScreenLayout from '../components/ScreenLayout';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    if (busy) return;

    if (password !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setBusy(true);
    try {
      await register(name, email, password);
    } catch (error) {
      Alert.alert('Inscription impossible', error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenLayout>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.brand}>▦ EventEase</Text>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>
        Rejoignez la communauté EventEase en quelques secondes.
      </Text>

      <Text style={styles.label}>Nom complet</Text>
      <TextInput
        style={styles.input}
        placeholder="Votre nom"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Adresse e-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="exemple@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Minimum 6 caractères"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmez votre mot de passe"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        style={[styles.button, busy && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={busy}
      >
        <Text style={styles.buttonText}>
          {busy ? 'Inscription...' : "S'inscrire"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          Vous avez déjà un compte ?{' '}
          <Text style={styles.linkBold}>Se connecter</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingVertical: 30, },
  brand: {
    fontSize: 23, fontWeight: '800', color: colors.primary,
    textAlign: 'center', marginBottom: 45,
  },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitle: {
    fontSize: 15, color: colors.muted,
    lineHeight: 23, marginTop: 10, marginBottom: 30,
  },
  label: { fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: {
    height: 53, backgroundColor: 'white',
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 15, marginBottom: 19,
  },
  button: {
    backgroundColor: colors.primary, height: 56,
    borderRadius: 14, justifyContent: 'center',
    alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 30, color: colors.muted },
  linkBold: { color: colors.primary, fontWeight: '700' },
});
