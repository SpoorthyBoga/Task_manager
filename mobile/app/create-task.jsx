import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users when the screen opens so we can populate the dropdown
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
      // Automatically select the first user in the list to prevent empty submissions
      if (response.data.length > 0) {
        setAssignedTo(response.data[0]._id);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      Alert.alert("Error", "Could not load users for assignment.");
    }
  };

  const handleCreateTask = async () => {
    if (!title || !assignedTo) {
      Alert.alert('Error', 'Title and Assignee are required.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/tasks', {
        title,
        description,
        assignedTo
      });
      
      Alert.alert("Success", "Task created successfully!");
      router.back(); // Send the Admin back to the Dashboard
    } catch (error) {
      console.log("Create task error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to create task.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Task</Text>

      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Update Landing Page"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Add details here..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Assign To</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={assignedTo}
          onValueChange={(itemValue) => setAssignedTo(itemValue)}
        >
          {users.map((u) => (
            <Picker.Item key={u._id} label={`${u.name} (${u.role})`} value={u._id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity 
        style={styles.submitBtn} 
        onPress={handleCreateTask}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitBtnText}>Create Task</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 16, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerContainer: { backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 25, overflow: 'hidden' },
  submitBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  submitBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cancelBtn: { padding: 15, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#ff4d4d', fontSize: 16, fontWeight: 'bold' }
});