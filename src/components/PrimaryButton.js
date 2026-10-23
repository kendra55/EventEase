import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../theme/colors';
export default function PrimaryButton({ title, onPress, danger = false, outline = false, disabled = false }) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, outline && styles.outline, danger && { backgroundColor: colors.danger }, disabled && { opacity: 0.5 }, pressed && { opacity: 0.8 }]}>
    <Text style={[styles.text, outline && { color: colors.primary }]}>{title}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({ button: { backgroundColor: colors.primary, padding: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 12 }, outline: { backgroundColor: 'white', borderColor: colors.primary, borderWidth: 1.5 }, text: { color: 'white', fontWeight: '800', fontSize: 15 } });
