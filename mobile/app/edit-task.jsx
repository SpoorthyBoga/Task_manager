import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView, Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
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
  amber: '#C07C1A',
  amberSoft: '#FDF3E0',
  radius: { sm: 8, md: 12, lg: 18, xl: 24 },
  font: { xs: 11, sm: 13, base: 15, md: 16, lg: 20, xl: 26 },
};

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

export default function EditTaskScreen() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState(params.title || '');
  const [description, setDescription] = useState(params.description || '');
  const [assignedTo, setAssignedTo] = useState(params.assignedTo || '');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const originalTitle = params.title || '';
  const originalDesc = params.description || '';
  const originalAssignee = params.assignedTo || '';

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setHasChanges(
      title !== originalTitle ||
      description !== originalDesc ||
      assignedTo !== originalAssignee
    );
  }, [title, description, assignedTo]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch {
      Alert.alert('Error', 'Could not load users.');
    }
  };

  const handleUpdateTask = async () => {
    if (!title.trim() || !assignedTo) {
      Alert.alert('Missing Fields', 'Title and Assignee are required.');
      return;
    }
    setIsLoading(true);
    try {
      await api.patch(`/tasks/${params.id}`, {
        title: title.trim(),
        description: description.trim(),
        assignedTo
      });
      Alert.alert('Task Updated', 'Changes saved successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update task.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      Alert.alert('Discard Changes', 'Your edits will be lost.', [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() }
      ]);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleDiscard}>
          <Ionicons name="arrow-back" size={20} color={T.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Edit Task</Text>
          <Text style={styles.subheading} numberOfLines={1}>{originalTitle}</Text>
        </View>
        {hasChanges && (
          <View style={styles.changedBadge}>
            <Text style={styles.changedText}>Unsaved</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FieldRow label="Task Title" required>
          <TextInput
            style={[styles.input, focused === 'title' && styles.inputFocused]}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={T.textLight}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused('')}
            returnKeyType="next"
          />
        </FieldRow>

        <FieldRow label="Description">
          <TextInput
            style={[styles.input, styles.textarea, focused === 'desc' && styles.inputFocused]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add context or notes…"
            placeholderTextColor={T.textLight}
            onFocus={() => setFocused('desc')}
            onBlur={() => setFocused('')}
            multiline
            textAlignVertical="top"
          />
        </FieldRow>

        <FieldRow label="Assign To" required>
          <View style={styles.pickerBox}>
            <Ionicons name="person-circle-outline" size={18} color={T.textMuted} />
            <Picker
              selectedValue={assignedTo}
              onValueChange={setAssignedTo}
              style={styles.picker}
            >
              {users.map(u => (
                <Picker.Item
                  key={u._id}
                  label={`${u.name}  (${u.role})`}
                  value={u._id}
                />
              ))}
            </Picker>
          </View>
        </FieldRow>

        {/* Change Summary */}
        {hasChanges && (
          <View style={styles.diffHint}>
            <Ionicons name="information-circle-outline" size={15} color={T.amber} />
            <Text style={styles.diffHintText}>You have unsaved changes</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryBtn, (!hasChanges || !title.trim()) && styles.primaryBtnDisabled]}
            onPress={handleUpdateTask}
            disabled={isLoading || !hasChanges || !title.trim()}
          >
            {isLoading
              ? <ActivityIndicator color={T.surface} />
              : <>
                  <Ionicons name="save-outline" size={17} color={T.surface} />
                  <Text style={styles.primaryBtnText}>Save Changes</Text>
                </>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={handleDiscard}>
            <Text style={styles.cancelBtnText}>
              {hasChanges ? 'Discard Changes' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg, paddingTop: Platform.OS === 'ios' ? 56 : 36 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, marginBottom: 28,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: T.radius.md, flexShrink: 0,
    backgroundColor: T.surface, borderWidth: 1, borderColor: T.border,
    justifyContent: 'center', alignItems: 'center',
  },
  heading: { fontSize: T.font.lg, fontWeight: '800', color: T.text, letterSpacing: -0.5 },
  subheading: { fontSize: T.font.sm, color: T.textMuted, marginTop: 1 },
  changedBadge: {
    backgroundColor: T.amberSoft, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, borderWidth: 1, borderColor: T.amber + '55',
  },
  changedText: { fontSize: T.font.xs, fontWeight: '700', color: T.amber },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20, paddingBottom: 48,
    maxWidth: 640,
    ...(Platform.OS === 'web' ? { alignSelf: 'center', width: '100%' } : {}),
  },

  fieldGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 },
  label: { fontSize: T.font.xs, fontWeight: '700', color: T.text, textTransform: 'uppercase', letterSpacing: 0.6 },
  required: { fontSize: T.font.sm, color: T.accent, fontWeight: '700' },

  input: {
    backgroundColor: T.surface, padding: 14,
    borderRadius: T.radius.md, borderWidth: 1.5, borderColor: T.border,
    fontSize: T.font.base, color: T.text,
  },
  inputFocused: { borderColor: T.borderFocus },
  textarea: { height: 110, textAlignVertical: 'top', paddingTop: 14 },

  pickerBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: T.radius.md,
    borderWidth: 1.5, borderColor: T.border, paddingLeft: 12,
    overflow: 'hidden',
  },
  picker: { flex: 1, height: 52, color: T.text },

  diffHint: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: T.amberSoft, borderRadius: T.radius.md,
    padding: 12, marginBottom: 8, borderWidth: 1, borderColor: T.amber + '40',
  },
  diffHintText: { fontSize: T.font.sm, color: T.amber, fontWeight: '600' },

  actions: { marginTop: 8, gap: 12 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: T.accent, borderRadius: T.radius.md, paddingVertical: 16,
  },
  primaryBtnDisabled: { opacity: 0.4 },
  primaryBtnText: { color: T.surface, fontSize: T.font.md, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: 14 },
  cancelBtnText: { color: T.textMuted, fontSize: T.font.base, fontWeight: '600' },
});