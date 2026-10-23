
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import ScreenLayout from '../components/ScreenLayout';
import colors from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (busy) return;

    setBusy(true);

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Connexion impossible', error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logo}>
            <Ionicons
              name="calendar"
              size={28}
              color={colors.primary}
            />
            <Text style={styles.brand}>EventEase</Text>
          </View>

          <Text style={styles.title}>Connexion</Text>

          <Text style={styles.subtitle}>
            Connectez-vous pour retrouver vos événements.
          </Text>

          <Text style={styles.label}>Adresse e-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="exemple@email.com"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Mot de passe</Text>

          <TextInput
            style={styles.input}
            placeholder="Votre mot de passe"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.button, busy && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={busy}
          >
            <Text style={styles.buttonText}>
              {busy ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.link}>
              Pas encore de compte ?{' '}
              <Text style={styles.linkBold}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 30,
  },

  logo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 55,
  },

  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 10,
    marginBottom: 35,
  },

  label: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 9,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    height: 55,
    paddingHorizontal: 16,
    marginBottom: 23,
    color: colors.text,
  },

  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },

  link: {
    textAlign: 'center',
    marginTop: 30,
    color: colors.muted,
  },

  linkBold: {
    color: colors.primary,
    fontWeight: '700',
  },
});
