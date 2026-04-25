import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  ActivityIndicator, Alert, TextInput, RefreshControl,
  StatusBar, Platform
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { router, Redirect, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, STATUS_CONFIG } from '../constants/theme';
import { dashboardStyles as styles } from '../styles/dashboard.styles';

const isWeb = Platform.OS === 'web';

export default function DashboardScreen() {
  const { user, logout, isLoading } = useContext(AuthContext);
  
  // Dashboard State
  const [currentView, setCurrentView] = useState('Tasks'); // 'Tasks' | 'Users'
  const [expandedUserId, setExpandedUserId] = useState(null); // Tracks which user card is open
  
  // Task State
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filterTabs = ['All', 'Not Started', 'In Progress', 'Done'];

  // User State (Admin Only)
  const [teamUsers, setTeamUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && user) {
        fetchTasks();
        if (user.role === 'Admin') fetchUsers();
      }
    }, [user, isLoading])
  );

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch {
      Alert.alert('Error', 'Could not load tasks');
    } finally { setLoadingTasks(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/auth/users');
      setTeamUsers(response.data);
    } catch {
      Alert.alert('Error', 'Could not load team members');
    } finally { setLoadingUsers(false); }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (currentView === 'Tasks') await fetchTasks();
    else await fetchUsers();
    setRefreshing(false);
  }, [currentView]);

  const displayedTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || task.status === activeFilter;
    return matchesSearch && matchesFilter;
  }), [tasks, searchQuery, activeFilter]);

  const taskCounts = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
  }), [tasks]);

  // --- NEW: Tap-to-Cycle Status Handler ---
  const handleStatusToggle = (task) => {
    const nextStatus = {
      'Not Started': 'In Progress',
      'In Progress': 'Done',
      'Done': 'Not Started'
    }[task.status] || 'Not Started';

    api.patch(`/tasks/${task._id}`, { status: nextStatus }).then(fetchTasks);
  };

  const handleDeleteTask = async (taskId) => {
    const deleteApiCall = async () => {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(prev => prev.filter(t => t._id !== taskId));
      } catch (err) { Alert.alert('Error', 'Failed to delete task.'); }
    };
    if (isWeb) { if (window.confirm("Remove task permanently?")) deleteApiCall(); } 
    else { Alert.alert('Delete Task', 'Remove task permanently?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: deleteApiCall }]); }
  };

  const handleDeleteUser = async (userId) => {
    const deleteApiCall = async () => {
      try {
        await api.delete(`/auth/users/${userId}`);
        setTeamUsers(prev => prev.filter(u => u._id !== userId));
        fetchTasks();
      } catch (err) { Alert.alert('Error', 'Failed to delete user.'); }
    };
    if (isWeb) { if (window.confirm("Delete this user permanently?")) deleteApiCall(); } 
    else { Alert.alert('Delete User', 'Delete this user permanently?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: deleteApiCall }]); }
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={THEME.accent} /></View>;
  if (!user) return <Redirect href="/" />;

  // --- RENDERERS ---
  const renderTask = ({ item, index }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Not Started'];
    const cardBg = [THEME.cardBg1, THEME.cardBg2, THEME.cardBg3][index % 3];

    return (
      <View style={[styles.taskCard, { backgroundColor: cardBg }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.taskTitle} numberOfLines={2}>{item.title}</Text>
          <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
        </View>
        {item.description ? <Text style={styles.taskDesc} numberOfLines={3}>{item.description}</Text> : null}

        <View style={styles.cardFooter}>
          {/* UPDATED: Tap-to-Cycle Button instead of Picker */}
          <TouchableOpacity 
            style={[styles.statusPill, { borderColor: cfg.color, justifyContent: 'center' }]}
            onPress={() => handleStatusToggle(item)}
            activeOpacity={0.7}
          >
            <Ionicons name={cfg.icon} size={14} color={cfg.color} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 12, fontWeight: '800', color: THEME.text, textTransform: 'uppercase' }}>
              {item.status}
            </Text>
          </TouchableOpacity>

          {user.role === 'Admin' && (
            <View style={styles.actionRow}>
              <View style={styles.assigneeBox}><Text style={styles.assigneeText}>{item.assignedTo?.name?.charAt(0).toUpperCase() || '?'}</Text></View>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push({ pathname: '/edit-task', params: { id: item._id, title: item.title, description: item.description, assignedTo: item.assignedTo?._id } })}>
                <Ionicons name="pencil" size={14} color={THEME.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: THEME.red }]} onPress={() => handleDeleteTask(item._id)}>
                <Ionicons name="trash" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderUser = ({ item }) => {
    const isExpanded = expandedUserId === item._id;
    
    const userTasks = tasks.filter(t => {
      if (!t.assignedTo) return false;
      const assigneeId = typeof t.assignedTo === 'object' ? t.assignedTo._id : t.assignedTo;
      return assigneeId === item._id;
    });

    return (
      <View style={styles.userCardContainer}>
        <TouchableOpacity 
          style={styles.userCardMain} 
          activeOpacity={0.7} 
          onPress={() => setExpandedUserId(isExpanded ? null : item._id)}
        >
          <View style={styles.userAvatar}><Text style={styles.userAvatarText}>{item.name.charAt(0).toUpperCase()}</Text></View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
          <View style={styles.userRolePill}><Text style={styles.userRoleText}>{item.role}</Text></View>
          
          <TouchableOpacity 
            style={[styles.iconBtn, { backgroundColor: THEME.red }]} 
            onPress={(e) => { 
              if (Platform.OS === 'web') e.stopPropagation(); 
              handleDeleteUser(item._id); 
            }}
          >
            <Ionicons name="trash" size={14} color="#FFF" />
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.userTasksContainer}>
            <Text style={styles.userTasksHeader}>Assigned Tasks ({userTasks.length})</Text>
            
            {userTasks.length === 0 ? (
              <Text style={styles.noTasksText}>No tasks assigned yet.</Text>
            ) : (
              userTasks.map(t => {
                const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG['Not Started'];
                return (
                  <View key={t._id} style={styles.userTaskItem}>
                    <View style={[styles.statusDot, { backgroundColor: cfg.color, marginTop: 0 }]} />
                    <Text style={styles.userTaskTitle} numberOfLines={1}>{t.title}</Text>
                    <Text style={styles.userTaskStatus}>{t.status}</Text>
                  </View>
                );
              })
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.bg} />

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Workspace.</Text>
          <Text style={styles.subheading}>{user.name} / {user.role}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={THEME.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        {user.role === 'Admin' && (
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={[styles.toggleBtn, currentView === 'Tasks' && styles.toggleBtnActive]} onPress={() => setCurrentView('Tasks')}>
              <Text style={[styles.toggleText, currentView === 'Tasks' && styles.toggleTextActive]}>Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, currentView === 'Users' && styles.toggleBtnActive]} onPress={() => { setCurrentView('Users'); setExpandedUserId(null); }}>
              <Text style={[styles.toggleText, currentView === 'Users' && styles.toggleTextActive]}>Team Members</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentView === 'Tasks' && (
          <>
            {!loadingTasks && (
              <View style={styles.statsRow}>
                <View style={styles.statCard}><Text style={styles.statNum}>{taskCounts.total}</Text><Text style={styles.statLabel}>Total</Text></View>
                <View style={styles.statCard}><Text style={[styles.statNum, { color: THEME.amber }]}>{taskCounts.inProgress}</Text><Text style={styles.statLabel}>In Progress</Text></View>
                <View style={styles.statCard}><Text style={[styles.statNum, { color: THEME.green }]}>{taskCounts.done}</Text><Text style={styles.statLabel}>Done</Text></View>
              </View>
            )}

            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={THEME.textMuted} />
              <TextInput style={styles.searchInput} placeholder="Search tasks..." placeholderTextColor={THEME.textMuted} value={searchQuery} onChangeText={setSearchQuery} />
              {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={18} color={THEME.textMuted} /></TouchableOpacity>}
            </View>

            <View style={styles.filterRow}>
              {filterTabs.map(tab => (
                <TouchableOpacity key={tab} style={[styles.chip, activeFilter === tab && styles.chipActive]} onPress={() => setActiveFilter(tab)}>
                  <Text style={[styles.chipText, activeFilter === tab && styles.chipTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {loadingTasks ? <View style={styles.center}><ActivityIndicator size="large" color={THEME.accent} /></View> : (
              <FlatList
                data={displayedTasks}
                keyExtractor={item => item._id}
                renderItem={renderTask}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.accent} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                numColumns={isWeb ? 2 : 1}
                key={isWeb ? 'web' : 'mobile'}
                columnWrapperStyle={isWeb ? styles.webRow : undefined}
                ListEmptyComponent={<View style={styles.emptyState}><Ionicons name="layers-outline" size={48} color={THEME.border} /><Text style={styles.emptyTitle}>Nothing here.</Text></View>}
              />
            )}
          </>
        )}

        {currentView === 'Users' && (
          loadingUsers ? <View style={styles.center}><ActivityIndicator size="large" color={THEME.accent} /></View> : (
            <FlatList
              data={teamUsers}
              keyExtractor={item => item._id}
              renderItem={renderUser}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.accent} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )
        )}
      </View>

      {user.role === 'Admin' && (
        <View style={styles.fabContainer}>
          {currentView === 'Tasks' && (
            <TouchableOpacity style={[styles.fab, styles.fabSm]} onPress={() => router.push('/create-user')}>
              <Ionicons name="person-add" size={18} color={THEME.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.fab, styles.fabLg]} onPress={() => router.push(currentView === 'Tasks' ? '/create-task' : '/create-user')}>
            <Ionicons name={currentView === 'Tasks' ? "add" : "person-add"} size={28} color={THEME.surface} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}