import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StatusBar } from 'react-native';
import { router, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { formStyles as styles } from '../styles/forms.styles';

const ROLE_OPTIONS = [
  { value: 'User',  label: 'User',  icon: 'person-outline', desc: 'Can view and update assigned tasks' },
  { value: 'Admin', label: 'Admin', icon: 'shield-checkmark-outline', desc: 'Full access to all tasks and users' },
];

export default function CreateUserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  // --- THE BOUNCER ---
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);

  const handleCreateUser = async () => {
    if (!name.trim() || !email.trim() || !password) return Alert.alert('Missing Fields', 'All fields are required.');
    setLoading(true);
    try {
      await api.post('/auth/admin/create-user', { name: name.trim(), email: email.trim(), password, role });
      router.replace('/dashboard');
    } catch (error) { Alert.alert('Error', error.response?.data?.message || 'Failed to create user.'); } 
    finally { setLoading(false); }
  };

  // --- SECURITY CHECKS ---
  if (isAuthLoading) return <View style={styles.container}><ActivityIndicator size="large" color={THEME.accent} /></View>;
  if (!user || user.role !== 'Admin') return <Redirect href="/dashboard" />;

  const isValid = name.trim() && email.trim() && password.length >= 1;
  const initials = name ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.bg} />
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={THEME.text} /></TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.heading}>Add User.</Text>
            <Text style={styles.subheading}>Team expansion</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.avatarPreview}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            <View><Text style={styles.avatarName}>{name || 'New Member'}</Text><Text style={styles.avatarRole}>{role}</Text></View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={[styles.inputBox, focused === 'name' && styles.inputBoxFocused]}>
              <Ionicons name="person-outline" size={18} color={THEME.textMuted} />
              <TextInput style={styles.inputInner} placeholder="e.g. Priya Sharma" placeholderTextColor={THEME.textMuted} value={name} onChangeText={setName} onFocus={() => setFocused('name')} onBlur={() => setFocused('')} returnKeyType="next" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={[styles.inputBox, focused === 'email' && styles.inputBoxFocused]}>
              <Ionicons name="mail-outline" size={18} color={THEME.textMuted} />
              <TextInput style={styles.inputInner} placeholder="name@company.com" placeholderTextColor={THEME.textMuted} value={email} onChangeText={setEmail} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} autoCapitalize="none" keyboardType="email-address" returnKeyType="next" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={[styles.inputBox, focused === 'pw' && styles.inputBoxFocused]}>
              <Ionicons name="lock-closed-outline" size={18} color={THEME.textMuted} />
              <TextInput style={styles.inputInner} placeholder="Set a strong password" placeholderTextColor={THEME.textMuted} value={password} onChangeText={setPassword} onFocus={() => setFocused('pw')} onBlur={() => setFocused('')} secureTextEntry={!showPassword} returnKeyType="done" />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={{ padding: 5 }}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={THEME.textMuted} /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Role *</Text>
            <View style={styles.roleGrid}>
              {ROLE_OPTIONS.map(opt => (
                <TouchableOpacity key={opt.value} style={[styles.roleCard, role === opt.value && styles.roleCardActive]} onPress={() => setRole(opt.value)}>
                  <View style={[styles.roleIcon, role === opt.value && styles.roleIconActive]}><Ionicons name={opt.icon} size={20} color={role === opt.value ? THEME.surface : THEME.text} /></View>
                  <Text style={styles.roleLabel}>{opt.label}</Text>
                  <Text style={styles.roleDesc}>{opt.desc}</Text>
                  {role === opt.value && <View style={styles.roleCheck}><Ionicons name="checkmark-circle" size={20} color={THEME.text} /></View>}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.primaryBtn, !isValid && styles.primaryBtnDisabled]} onPress={handleCreateUser} disabled={loading || !isValid}>
              {loading ? <ActivityIndicator color={THEME.surface} /> : <><Ionicons name="person-add" size={20} color={THEME.surface} style={{ marginRight: 8 }} /><Text style={styles.primaryBtnText}>Create User</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}