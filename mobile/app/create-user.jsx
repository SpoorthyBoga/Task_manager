import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, Platform
} from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

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
  red: '#C23B3B',
  redSoft: '#FCEAEA',
  radius: { sm: 8, md: 12, lg: 18, xl: 24 },
  font: { xs: 11, sm: 13, base: 15, md: 16, lg: 20, xl: 26 },
};

const ROLE_OPTIONS = [
  { value: 'User', label: 'User', icon: 'person-outline', desc: 'Can view and update assigned tasks' },
  { value: 'Admin', label: 'Admin', icon: 'shield-checkmark-outline', desc: 'Full access to all tasks and users' },
];

function FieldRow({ label, required, children }) {
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      {children}
    </View>
  );
}

export default function CreateUserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleCreateUser = async () => {
    if (!name.trim() || !email.trim() || !password) {
      return Alert.alert('Missing Fields', 'All fields are required.');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email address.');
    }
    setLoading(true);
    try {
      await api.post('/auth/admin/create-user', { name: name.trim(), email: email.trim(), password, role });
      Alert.alert('User Created', `${name} has been added as a ${role}.`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = name.trim() && email.trim() && password.length >= 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={T.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.heading}>Add User</Text>
          <Text style={styles.subheading}>Create a new team member</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Preview */}
        <View style={styles.avatarPreview}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.avatarName}>{name || 'New Member'}</Text>
            <Text style={styles.avatarRole}>{role}</Text>
          </View>
        </View>

        <FieldRow label="Full Name" required>
          <View style={[styles.inputBox, focused === 'name' && styles.inputBoxFocused]}>
            <Ionicons name="person-outline" size={16} color={T.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Priya Sharma"
              placeholderTextColor={T.textLight}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused('')}
              returnKeyType="next"
            />
          </View>
        </FieldRow>

        <FieldRow label="Email Address" required>
          <View style={[styles.inputBox, focused === 'email' && styles.inputBoxFocused]}>
            <Ionicons name="mail-outline" size={16} color={T.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="name@company.com"
              placeholderTextColor={T.textLight}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>
        </FieldRow>

        <FieldRow label="Password" required>
          <View style={[styles.inputBox, focused === 'pw' && styles.inputBoxFocused]}>
            <Ionicons name="lock-closed-outline" size={16} color={T.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Set a strong password"
              placeholderTextColor={T.textLight}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('pw')}
              onBlur={() => setFocused('')}
              secureTextEntry={!showPassword}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color={T.textMuted} />
            </TouchableOpacity>
          </View>
        </FieldRow>

        <FieldRow label="Role" required>
          <View style={styles.roleGrid}>
            {ROLE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.roleCard, role === opt.value && styles.roleCardActive]}
                onPress={() => setRole(opt.value)}
              >
                <View style={[styles.roleIcon, role === opt.value && styles.roleIconActive]}>
                  <Ionicons name={opt.icon} size={18} color={role === opt.value ? T.accent : T.textMuted} />
                </View>
                <Text style={[styles.roleLabel, role === opt.value && styles.roleLabelActive]}>{opt.label}</Text>
                <Text style={styles.roleDesc}>{opt.desc}</Text>
                {role === opt.value && (
                  <View style={styles.roleCheck}>
                    <Ionicons name="checkmark-circle" size={16} color={T.accent} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </FieldRow>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryBtn, !isValid && styles.primaryBtnDisabled]}
            onPress={handleCreateUser}
            disabled={loading || !isValid}
          >
            {loading
              ? <ActivityIndicator color={T.surface} />
              : <>
                  <Ionicons name="person-add" size={17} color={T.surface} />
                  <Text style={styles.primaryBtnText}>Create User</Text>
                </>
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg, paddingTop: Platform.OS === 'ios' ? 56 : 36 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, marginBottom: 24,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: T.radius.md,
    backgroundColor: T.surface, borderWidth: 1, borderColor: T.border,
    justifyContent: 'center', alignItems: 'center',
  },
  heading: { fontSize: T.font.lg, fontWeight: '800', color: T.text, letterSpacing: -0.5 },
  subheading: { fontSize: T.font.sm, color: T.textMuted, marginTop: 1 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20, paddingBottom: 48,
    maxWidth: 640,
    ...(Platform.OS === 'web' ? { alignSelf: 'center', width: '100%' } : {}),
  },

  avatarPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: T.surface, borderRadius: T.radius.lg,
    padding: 16, marginBottom: 28, borderWidth: 1, borderColor: T.border,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: T.accentSoft,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: T.font.md, fontWeight: '800', color: T.accent },
  avatarName: { fontSize: T.font.md, fontWeight: '700', color: T.text },
  avatarRole: { fontSize: T.font.sm, color: T.textMuted, marginTop: 2 },

  fieldGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 },
  label: { fontSize: T.font.xs, fontWeight: '700', color: T.text, textTransform: 'uppercase', letterSpacing: 0.6 },
  required: { fontSize: T.font.sm, color: T.accent, fontWeight: '700' },

  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: T.surface, borderRadius: T.radius.md,
    borderWidth: 1.5, borderColor: T.border, paddingHorizontal: 14, height: 52,
  },
  inputBoxFocused: { borderColor: T.borderFocus },
  input: { flex: 1, fontSize: T.font.base, color: T.text },

  roleGrid: { flexDirection: 'row', gap: 12 },
  roleCard: {
    flex: 1, backgroundColor: T.surface, borderRadius: T.radius.md,
    padding: 14, borderWidth: 1.5, borderColor: T.border,
  },
  roleCardActive: { borderColor: T.accent, backgroundColor: T.accentSoft },
  roleIcon: {
    width: 36, height: 36, borderRadius: T.radius.sm,
    backgroundColor: T.surfaceAlt,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  roleIconActive: { backgroundColor: T.surface },
  roleLabel: { fontSize: T.font.sm, fontWeight: '700', color: T.textMuted, marginBottom: 4 },
  roleLabelActive: { color: T.accent },
  roleDesc: { fontSize: T.font.xs, color: T.textLight, lineHeight: 16 },
  roleCheck: { position: 'absolute', top: 10, right: 10 },

  actions: { marginTop: 16, gap: 12 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: T.accent, borderRadius: T.radius.md, paddingVertical: 16,
  },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: { color: T.surface, fontSize: T.font.md, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: 14 },
  cancelBtnText: { color: T.textMuted, fontSize: T.font.base, fontWeight: '600' },
});