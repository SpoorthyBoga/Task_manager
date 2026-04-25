import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const T = {
  bg: '#F7F6F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F0EEE8',
  border: '#E4E1D8',
  borderFocus: '#2D5BE3',
  text: '#1C1A17',
  textMuted: '#7A7669',
  textLight: '#B0ADA4',
  accent: '#2D5BE3',
  accentSoft: '#EBF0FD',
  accentDark: '#1E42B0',
  red: '#C23B3B',
  redSoft: '#FCEAEA',
  radius: { sm: 8, md: 12, lg: 18, xl: 24 },
  font: { xs: 11, sm: 13, base: 15, md: 16, lg: 20, xl: 26, xxl: 34 },
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, isLoading } = useContext(AuthContext);

  if (isLoading) return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={T.accent} />
    </View>
  );
  if (user) return <Redirect href="/dashboard" />;

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Missing Fields', 'Please enter your email and password.');
    }
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch {
      Alert.alert('Login Failed', 'Check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = email.trim().length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Mark */}
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Ionicons name="checkmark-done" size={26} color={T.accent} />
          </View>
          <Text style={styles.wordmark}>TaskFlow</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to your workspace</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputBox, focused === 'email' && styles.inputBoxFocused]}>
              <Ionicons name="mail-outline" size={16} color={focused === 'email' ? T.accent : T.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={T.textLight}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputBox, focused === 'pw' && styles.inputBoxFocused]}>
              <Ionicons name="lock-closed-outline" size={16} color={focused === 'pw' ? T.accent : T.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={T.textLight}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused('')}
                secureTextEntry={!showPassword}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                autoComplete="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={16}
                  color={T.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.loginBtn, !isValid && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting
              ? <ActivityIndicator color={T.surface} />
              : <>
                  <Text style={styles.loginBtnText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={17} color={T.surface} />
                </>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Task management built for modern teams
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    ...(Platform.OS === 'web' ? { maxWidth: 440, alignSelf: 'center', width: '100%' } : {}),
  },

  brand: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 40, justifyContent: 'center',
  },
  logoBox: {
    width: 48, height: 48, borderRadius: T.radius.md,
    backgroundColor: T.accentSoft, justifyContent: 'center', alignItems: 'center',
  },
  wordmark: {
    fontSize: T.font.xl, fontWeight: '800', color: T.text, letterSpacing: -1,
  },

  card: {
    backgroundColor: T.surface, borderRadius: T.radius.xl,
    padding: 28, borderWidth: 1, borderColor: T.border,
    marginBottom: 24,
  },
  heading: { fontSize: T.font.lg, fontWeight: '800', color: T.text, marginBottom: 4, letterSpacing: -0.5 },
  subheading: { fontSize: T.font.sm, color: T.textMuted, marginBottom: 28 },

  fieldGroup: { marginBottom: 18 },
  label: { fontSize: T.font.xs, fontWeight: '700', color: T.text, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: T.bg, borderRadius: T.radius.md,
    borderWidth: 1.5, borderColor: T.border,
    paddingHorizontal: 14, height: 52,
  },
  inputBoxFocused: { borderColor: T.borderFocus, backgroundColor: T.surface },
  input: { flex: 1, fontSize: T.font.base, color: T.text },

  loginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: T.accent, borderRadius: T.radius.md, height: 54, marginTop: 8,
  },
  loginBtnDisabled: { opacity: 0.4 },
  loginBtnText: { color: T.surface, fontSize: T.font.md, fontWeight: '700', letterSpacing: 0.2 },

  footer: {
    textAlign: 'center', fontSize: T.font.xs,
    color: T.textLight, lineHeight: 18,
  },
});