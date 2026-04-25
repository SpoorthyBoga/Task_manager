import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  ActivityIndicator, Alert, TextInput, ScrollView, RefreshControl,
  StatusBar, Dimensions, Platform
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { router, Redirect, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// ─── Design Tokens ──────────────────────────────────────────────────────────
const T = {
  bg: '#F7F6F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F0EEE8',
  border: '#E4E1D8',
  borderLight: '#EDEBE5',
  text: '#1C1A17',
  textMuted: '#7A7669',
  textLight: '#B0ADA4',
  accent: '#2D5BE3',
  accentSoft: '#EBF0FD',
  accentText: '#1E42B0',
  green: '#1A9B6C',
  greenSoft: '#E6F7F1',
  amber: '#C07C1A',
  amberSoft: '#FDF3E0',
  red: '#C23B3B',
  redSoft: '#FCEAEA',
  radius: { sm: 8, md: 12, lg: 18, xl: 24 },
  font: {
    xs: 11, sm: 13, base: 15, md: 16, lg: 20, xl: 26, xxl: 34
  }
};

const STATUS_CONFIG = {
  'Done': { color: T.green, bg: T.greenSoft, icon: 'checkmark-circle' },
  'In Progress': { color: T.amber, bg: T.amberSoft, icon: 'time' },
  'Not Started': { color: T.textMuted, bg: T.surfaceAlt, icon: 'ellipse-outline' },
};

export default function DashboardScreen() {
  const { user, logout, isLoading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filterTabs = ['All', 'Not Started', 'In Progress', 'Done'];

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && user) fetchTasks();
    }, [user, isLoading])
  );

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch {
      Alert.alert('Error', 'Could not load tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  const displayedTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || task.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, activeFilter]);

  const taskCounts = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
  }), [tasks]);

  if (isLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={T.accent} />
    </View>
  );
  if (!user) return <Redirect href="/" />;

  const renderTask = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Not Started'];
    return (
      <View style={styles.taskCard}>
        <View style={styles.cardTop}>
          <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
          <Text style={styles.taskTitle} numberOfLines={2}>{item.title}</Text>
        </View>

        {item.description ? (
          <Text style={styles.taskDesc} numberOfLines={3}>{item.description}</Text>
        ) : null}

        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={13} color={cfg.color} />
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={item.status}
              onValueChange={(val) =>
                api.patch(`/tasks/${item._id}`, { status: val }).then(fetchTasks)
              }
              style={[styles.picker, { color: cfg.color }]}
              dropdownIconColor={cfg.color}
            >
              <Picker.Item label="Not Started" value="Not Started" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Done" value="Done" />
            </Picker>
          </View>
        </View>

        {user.role === 'Admin' && (
          <View style={styles.adminRow}>
            <View style={styles.assigneePill}>
              <Ionicons name="person-outline" size={12} color={T.textMuted} />
              <Text style={styles.assigneeText}>{item.assignedTo?.name || 'Unassigned'}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.push({ pathname: '/edit-task', params: { id: item._id, title: item.title, description: item.description, assignedTo: item.assignedTo?._id } })}
              >
                <Ionicons name="pencil" size={15} color={T.accent} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, styles.iconBtnDanger]}
                onPress={() => Alert.alert('Delete Task', 'Remove this task permanently?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => api.delete(`/tasks/${item._id}`).then(fetchTasks) }
                ])}
              >
                <Ionicons name="trash" size={15} color={T.red} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Workspace</Text>
          <Text style={styles.subheading}>{user.name} · {user.role}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color={T.red} />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      {!loadingTasks && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{taskCounts.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, { borderColor: T.amber, borderWidth: 1 }]}>
            <Text style={[styles.statNum, { color: T.amber }]}>{taskCounts.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={[styles.statCard, { borderColor: T.green, borderWidth: 1 }]}>
            <Text style={[styles.statNum, { color: T.green }]}>{taskCounts.done}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={17} color={T.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks…"
          placeholderTextColor={T.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={17} color={T.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filterTabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.chip, activeFilter === tab && styles.chipActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.chipText, activeFilter === tab && styles.chipTextActive]}>
              {tab}
            </Text>
            {activeFilter === tab && <View style={styles.chipUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks */}
      {loadingTasks ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={T.accent} />
        </View>
      ) : (
        <FlatList
          data={displayedTasks}
          keyExtractor={item => item._id}
          renderItem={renderTask}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={T.accent} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={isWeb ? 2 : 1}
          key={isWeb ? 'web' : 'mobile'}
          columnWrapperStyle={isWeb ? styles.webRow : undefined}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={40} color={T.textLight} />
              <Text style={styles.emptyTitle}>No tasks found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filter</Text>
            </View>
          }
        />
      )}

      {/* FABs */}
      {user.role === 'Admin' && (
        <View style={styles.fabContainer}>
          <TouchableOpacity style={[styles.fab, styles.fabSm]} onPress={() => router.push('/create-user')}>
            <Ionicons name="person-add" size={18} color={T.surface} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.fab, styles.fabLg]} onPress={() => router.push('/create-task')}>
            <Ionicons name="add" size={26} color={T.surface} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg, paddingTop: Platform.OS === 'ios' ? 56 : 36 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 20,
  },
  heading: { fontSize: T.font.xl, fontWeight: '800', color: T.text, letterSpacing: -0.8 },
  subheading: { fontSize: T.font.sm, color: T.textMuted, marginTop: 2, fontWeight: '500' },
  logoutBtn: {
    width: 40, height: 40, borderRadius: T.radius.md,
    backgroundColor: T.redSoft,
    justifyContent: 'center', alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 18,
  },
  statCard: {
    flex: 1, backgroundColor: T.surface, borderRadius: T.radius.md,
    paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: T.border,
  },
  statNum: { fontSize: T.font.xl, fontWeight: '800', color: T.text },
  statLabel: { fontSize: T.font.xs, color: T.textMuted, marginTop: 2, fontWeight: '500' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: T.radius.lg,
    paddingHorizontal: 14, height: 48, marginHorizontal: 20, marginBottom: 14,
    borderWidth: 1, borderColor: T.border,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: T.font.base, color: T.text },

  filterRow: {
    flexDirection: 'row', paddingHorizontal: 20,
    marginBottom: 14, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  chip: {
    paddingHorizontal: 12, paddingVertical: 9,
    position: 'relative', marginRight: 4,
  },
  chipActive: {},
  chipText: { fontSize: T.font.sm, color: T.textMuted, fontWeight: '600' },
  chipTextActive: { color: T.text },
  chipUnderline: {
    position: 'absolute', bottom: -1, left: 12, right: 12,
    height: 2, backgroundColor: T.text, borderRadius: 2,
  },

  listContent: { paddingHorizontal: 14, paddingBottom: 120, paddingTop: 6 },
  webRow: { gap: 10, marginBottom: 10 },

  taskCard: {
    flex: 1,
    backgroundColor: T.surface, borderRadius: T.radius.lg,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: T.borderLight,
    marginHorizontal: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginTop: 6, marginRight: 9, flexShrink: 0 },
  taskTitle: { fontSize: T.font.base, fontWeight: '700', color: T.text, flex: 1, lineHeight: 21 },
  taskDesc: { fontSize: T.font.sm, color: T.textMuted, lineHeight: 19, marginBottom: 10 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: T.radius.md, paddingLeft: 10,
    overflow: 'hidden', marginBottom: 4,
  },
  pickerWrap: { flex: 1 },
  picker: { height: 42, fontSize: T.font.sm, fontWeight: '600' },

  adminRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: T.borderLight,
  },
  assigneePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: T.surfaceAlt, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: T.radius.sm,
  },
  assigneeText: { fontSize: T.font.xs, color: T.textMuted, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 34, height: 34, borderRadius: T.radius.sm,
    backgroundColor: T.accentSoft, justifyContent: 'center', alignItems: 'center',
  },
  iconBtnDanger: { backgroundColor: T.redSoft },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: T.font.md, fontWeight: '700', color: T.textMuted },
  emptySubtitle: { fontSize: T.font.sm, color: T.textLight },

  fabContainer: { position: 'absolute', bottom: 32, right: 22, gap: 12, alignItems: 'center' },
  fab: { justifyContent: 'center', alignItems: 'center', shadowColor: T.text, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  fabLg: { width: 60, height: 60, borderRadius: 20, backgroundColor: T.accent },
  fabSm: { width: 46, height: 46, borderRadius: 15, backgroundColor: T.textMuted },
});