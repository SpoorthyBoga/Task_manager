import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform, StatusBar } from 'react-native';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { formStyles as styles } from '../styles/forms.styles';

const isWeb = Platform.OS === 'web';

export default function EditTaskScreen() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState(params.title || '');
  const [description, setDescription] = useState(params.description || '');
  const [assignedTo, setAssignedTo] = useState(params.assignedTo || '');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const originalTitle = params.title || '';
  const originalDesc = params.description || '';
  const originalAssignee = params.assignedTo || '';

  // --- THE BOUNCER ---
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    setHasChanges(
      title.trim() !== originalTitle.trim() ||
      description.trim() !== originalDesc.trim() ||
      assignedTo !== originalAssignee
    );
  }, [title, description, assignedTo]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch { Alert.alert('Error', 'Could not load users.'); }
  };

  const handleUpdateTask = async () => {
    if (!title.trim() || !assignedTo) return Alert.alert('Missing Fields', 'Title and Assignee are required.');
    setIsLoading(true);
    try {
      await api.patch(`/tasks/${params.id}`, { title: title.trim(), description: description.trim(), assignedTo });
      router.replace('/dashboard');
    } catch { Alert.alert('Error', 'Failed to update task.'); } 
    finally { setIsLoading(false); }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      if (isWeb) {
        if (window.confirm("Your edits will be lost. Discard changes?")) router.back();
      } else {
        Alert.alert('Discard Changes', 'Your edits will be lost.', [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]);
      }
    } else {
      router.back();
    }
  };

  // --- SECURITY CHECKS ---
  if (isAuthLoading) return <View style={styles.container}><ActivityIndicator size="large" color={THEME.accent} /></View>;
  if (!user || user.role !== 'Admin') return <Redirect href="/dashboard" />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.bg} />
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleDiscard}>
            <Ionicons name="arrow-back" size={24} color={THEME.text} />
          </TouchableOpacity>
          
          <View style={styles.headerText}>
            <Text style={styles.heading}>Edit Task.</Text>
            <Text style={styles.subheading} numberOfLines={1}>{originalTitle}</Text>
          </View>

          {hasChanges && (
            <View style={styles.unsavedBadge}>
              <Text style={styles.unsavedText}>UNSAVED</Text>
            </View>
          )}
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Task Title *</Text>
            <View style={[styles.inputBox, focusedField === 'title' && styles.inputBoxFocused]}>
              <TextInput style={styles.inputInner} value={title} onChangeText={setTitle} placeholder="Task title" placeholderTextColor={THEME.textMuted} onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField('')} returnKeyType="next" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputBox, styles.textareaBox, focusedField === 'desc' && styles.inputBoxFocused]}>
              <TextInput style={[styles.inputInner, styles.textareaInner]} value={description} onChangeText={setDescription} placeholder="Add context or notes…" placeholderTextColor={THEME.textMuted} onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField('')} multiline textAlignVertical="top" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Assign To *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-circle-outline" size={20} color={THEME.textMuted} />
              <Picker selectedValue={assignedTo} onValueChange={setAssignedTo} style={styles.picker} dropdownIconColor={THEME.text}>
                {users.map(u => <Picker.Item key={u._id} label={`${u.name} (${u.role})`} value={u._id} />)}
              </Picker>
            </View>
          </View>

          {hasChanges && (
            <View style={styles.diffHint}>
              <Ionicons name="warning" size={18} color={THEME.amber} />
              <Text style={styles.diffHintText}>You have unsaved changes</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.primaryBtn, (!hasChanges || !title.trim()) && styles.primaryBtnDisabled]} onPress={handleUpdateTask} disabled={isLoading || !hasChanges || !title.trim()}>
              {isLoading ? <ActivityIndicator color={THEME.surface} /> : <><Ionicons name="save" size={20} color={THEME.surface} style={{ marginRight: 8 }} /><Text style={styles.primaryBtnText}>Save Changes</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleDiscard}><Text style={styles.cancelBtnText}>{hasChanges ? 'Discard Changes' : 'Cancel'}</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}