import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { loginStyles as styles } from '../styles/login.styles';

const isWeb = Platform.OS === 'web';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, isLoading } = useContext(AuthContext);

  if (isLoading) return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={THEME.accent} />
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
        {/* Brand Header */}
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Ionicons name="checkmark-done" size={28} color={THEME.text} />
          </View>
          <Text style={styles.wordmark}>Task Manager</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to your workspace</Text>

          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputBox, focused === 'email' && styles.inputBoxFocused]}>
              <Ionicons name="mail-outline" size={18} color={focused === 'email' ? THEME.text : THEME.textMuted} />
              <TextInput
                style={styles.inputInner}
                placeholder="your@email.com"
                placeholderTextColor={THEME.textMuted}
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

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputBox, focused === 'pw' && styles.inputBoxFocused]}>
              <Ionicons name="lock-closed-outline" size={18} color={focused === 'pw' ? THEME.text : THEME.textMuted} />
              <TextInput
                style={styles.inputInner}
                placeholder="••••••••"
                placeholderTextColor={THEME.textMuted}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused('')}
                secureTextEntry={!showPassword}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={THEME.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, !isValid && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <ActivityIndicator color={THEME.surface} />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={20} color={THEME.surface} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Task management built for modern teams.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
