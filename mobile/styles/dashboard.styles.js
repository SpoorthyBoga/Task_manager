import { StyleSheet, Platform } from 'react-native';
import { THEME } from '../constants/theme';

const isWeb = Platform.OS === 'web';

export const dashboardStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg, paddingTop: isWeb ? 20 : 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 30, marginBottom: 20, width: '100%' },
  heading: { fontSize: 36, fontWeight: '900', color: THEME.text, letterSpacing: -1.5 },
  subheading: { fontSize: 14, color: THEME.textMuted, marginTop: -2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  logoutBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: THEME.accent, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },

  contentWrapper: { flex: 1, width: '100%', maxWidth: 1300, alignSelf: 'center', paddingHorizontal: 24, paddingTop:30 },

  toggleContainer: { flexDirection: 'row', backgroundColor: '#E4E4E7', borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  toggleBtnActive: { backgroundColor: THEME.surface, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
  toggleText: { fontSize: 14, fontWeight: '700', color: THEME.textMuted },
  toggleTextActive: { color: THEME.text, fontWeight: '900' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: THEME.surface, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  statNum: { fontSize: 24, fontWeight: '900', color: THEME.text },
  statLabel: { fontSize: 11, color: THEME.textMuted, marginTop: 2, fontWeight: '700', textTransform: 'uppercase' },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 20, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: THEME.text, fontWeight: '500', outlineStyle: 'none' },

  filterRow: { flexDirection: 'row', marginBottom: 15 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: 'transparent', marginRight: 8 },
  chipActive: { backgroundColor: THEME.surface, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
  chipText: { fontSize: 14, color: THEME.textMuted, fontWeight: '700' },
  chipTextActive: { color: THEME.text },

  listContent: { paddingBottom: 140 },
  webRow: { gap: 16, marginBottom: 16 },

  taskCard: { flex: 1, borderRadius: 16, padding: 22, minHeight: 180, justifyContent: 'space-between', marginBottom: 16, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, marginHorizontal: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: THEME.border, marginTop: 4 },
  taskTitle: { fontSize: 18, fontWeight: '800', color: THEME.text, flex: 1, marginRight: 10, lineHeight: 24 },
  taskDesc: { fontSize: 14, color: THEME.textMuted, lineHeight: 20, marginBottom: 16, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.1)', paddingTop: 14 },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, borderRadius: 20, borderWidth: 2, overflow: 'hidden', height: 36, width: 140 },
  picker: { flex: 1, height: '100%', backgroundColor: 'transparent', color: THEME.text, fontWeight: '700', fontSize: 12, borderWidth: 0, outlineStyle: 'none' },

  // --- UPDATED: User Card Styles (Accordion Support) ---
  userCardContainer: { backgroundColor: THEME.surface, borderRadius: 16, marginBottom: 16, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, overflow: 'hidden' },
  userCardMain: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  userAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: THEME.brandYellow, borderWidth: 2, borderColor: THEME.border, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  userAvatarText: { fontSize: 18, fontWeight: '900', color: THEME.text },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '800', color: THEME.text },
  userEmail: { fontSize: 13, color: THEME.textMuted, fontWeight: '500', marginTop: 2 },
  userRolePill: { backgroundColor: THEME.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 2, borderColor: THEME.border, marginRight: 10 },
  userRoleText: { fontSize: 11, fontWeight: '800', color: THEME.text, textTransform: 'uppercase' },

  // --- NEW: Expanded User Tasks List ---
  userTasksContainer: { borderTopWidth: 2, borderTopColor: THEME.border, padding: 16, backgroundColor: THEME.bg },
  userTasksHeader: { fontSize: 13, fontWeight: '800', color: THEME.textMuted, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  noTasksText: { fontSize: 14, color: THEME.textMuted, fontStyle: 'italic', fontWeight: '500' },
  userTaskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, padding: 12, borderRadius: 10, borderWidth: 2, borderColor: THEME.border, marginBottom: 8 },
  userTaskTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: THEME.text, marginLeft: 10, marginRight: 10 },
  userTaskStatus: { fontSize: 11, fontWeight: '800', color: THEME.textMuted, textTransform: 'uppercase' },

  actionRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  assigneeBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: THEME.surface, borderWidth: 2, borderColor: THEME.border, justifyContent: 'center', alignItems: 'center' },
  assigneeText: { fontSize: 12, fontWeight: '900', color: THEME.text },
  iconBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: THEME.surface, borderWidth: 2, borderColor: THEME.border, justifyContent: 'center', alignItems: 'center' },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: THEME.border },

  fabContainer: { position: 'absolute', bottom: 40, right: 25, gap: 16, alignItems: 'flex-end' },
  fab: { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  fabLg: { width: 64, height: 64, borderRadius: 32, backgroundColor: THEME.accent },
  fabSm: { width: 48, height: 48, borderRadius: 24, backgroundColor: THEME.surface },
});