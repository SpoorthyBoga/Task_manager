import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { router, Redirect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { formStyles as styles } from '../styles/forms.styles';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // --- THE BOUNCER ---
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
      if (response.data.length > 0) setAssignedTo(response.data[0]._id);
    } catch { Alert.alert('Error', 'Could not load users for assignment.'); }
  };

  const handleCreateTask = async () => {
    if (!title.trim() || !assignedTo) return Alert.alert('Missing Fields', 'Title and Assignee are required.');
    setIsLoading(true);
    try {
      await api.post('/tasks', { title: title.trim(), description: description.trim(), assignedTo });
      router.replace('/dashboard');
    } catch (error) { Alert.alert('Error', error.response?.data?.message || 'Failed to create task.'); } 
    finally { setIsLoading(false); }
  };

  // --- SECURITY CHECKS ---
  if (isAuthLoading) return <View style={styles.container}><ActivityIndicator size="large" color={THEME.accent} /></View>;
  if (!user || user.role !== 'Admin') return <Redirect href="/dashboard" />;

  const isValid = title.trim().length > 0 && assignedTo;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.bg} />
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={THEME.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.heading}>New Task.</Text>
            <Text style={styles.subheading}>Assign a deliverable</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Task Title *</Text>
            <View style={[styles.inputBox, focusedField === 'title' && styles.inputBoxFocused]}>
              <TextInput style={styles.inputInner} placeholder="e.g. Update landing page copy" placeholderTextColor={THEME.textMuted} value={title} onChangeText={setTitle} onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField('')} returnKeyType="next" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputBox, styles.textareaBox, focusedField === 'desc' && styles.inputBoxFocused]}>
              <TextInput style={[styles.inputInner, styles.textareaInner]} placeholder="Add any context or notes…" placeholderTextColor={THEME.textMuted} value={description} onChangeText={setDescription} onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField('')} multiline numberOfLines={5} textAlignVertical="top" />
            </View>
          </View>

          {/* --- UPDATED: iOS Picker Fix --- */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Assign To *</Text>
            <View style={[styles.inputBox, Platform.OS === 'ios' && { height: 120 }]}>
              <Ionicons name="person-circle-outline" size={20} color={THEME.textMuted} />
              <Picker 
                selectedValue={assignedTo} 
                onValueChange={setAssignedTo} 
                style={styles.picker} 
                dropdownIconColor={THEME.text}
                itemStyle={Platform.OS === 'ios' ? { height: 120, fontSize: 16, color: THEME.text } : {}}
              >
                {users.map(u => <Picker.Item key={u._id} label={`${u.name} (${u.role})`} value={u._id} />)}
              </Picker>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.primaryBtn, !isValid && styles.primaryBtnDisabled]} onPress={handleCreateTask} disabled={isLoading || !isValid}>
              {isLoading ? <ActivityIndicator color={THEME.surface} /> : <><Ionicons name="add" size={24} color={THEME.surface} style={{ marginRight: 6 }} /><Text style={styles.primaryBtnText}>Create Task</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}