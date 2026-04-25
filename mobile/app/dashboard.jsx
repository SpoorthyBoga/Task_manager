import React, { useContext, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { router, Redirect, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function DashboardScreen() {
  const { user, logout, isLoading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Automatically refetch tasks whenever you navigate back to this screen
  useFocusEffect(
    useCallback(() => {
      if (!isLoading && user) {
        fetchTasks();
      }
    }, [user, isLoading])
  );

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not load tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Triggers when the user changes the dropdown value
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks(); // Refresh list to ensure it matches the database
    } catch (error) {
      Alert.alert("Error", "Could not update task status");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/" />;
  }

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDesc}>{item.description}</Text>
      
      <Text style={styles.label}>Stage:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={item.status}
          onValueChange={(value) => updateTaskStatus(item._id, value)}
          style={styles.smallPicker}
        >
          <Picker.Item label="Not Started" value="Not Started" />
          <Picker.Item label="In Progress" value="In Progress" />
          <Picker.Item label="Done" value="Done" />
        </Picker>
      </View>

      {user.role === 'Admin' && item.assignedTo && (
        <Text style={styles.assignedText}>Assigned to: {item.assignedTo.name}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name}</Text>
          <Text style={styles.roleText}>Role: {user.role}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Admin specific Action Buttons */}
      {user.role === 'Admin' && (
        <View style={styles.adminActionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#28a745' }]} 
            onPress={() => router.push('/create-task')}
          >
            <Text style={styles.actionBtnText}>+ New Task</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#6c757d' }]} 
            onPress={() => router.push('/create-user')}
          >
            <Text style={styles.actionBtnText}>+ Add User</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Your Tasks</Text>

      {loadingTasks ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderTask}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  roleText: { fontSize: 14, color: '#666', marginTop: 2 },
  logoutBtn: { backgroundColor: '#ff4d4d', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  logoutText: { color: 'white', fontWeight: 'bold' },
  
  // Admin Button Row
  adminActionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#444' },
  
  // Task Card
  taskCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  taskDesc: { fontSize: 14, color: '#666', marginVertical: 8 },
  
  // Picker Styles
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 10, marginBottom: 4 },
  pickerWrapper: { backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' },
  smallPicker: { height: 50, width: '100%' },
  
  assignedText: { marginTop: 15, fontSize: 12, color: '#888', fontStyle: 'italic', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 30, fontSize: 16 }
});