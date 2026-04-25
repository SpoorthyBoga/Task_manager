import { StyleSheet, Platform } from 'react-native';
import { THEME } from '../constants/theme';

const isWeb = Platform.OS === 'web';

export const formStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg, paddingTop: isWeb ? 20 : 50 },
  
  // Constrain the width on wide screens
  contentWrapper: { 
    flex: 1, 
    width: '100%', 
    maxWidth: 700, 
    alignSelf: 'center' 
  },

  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, marginBottom: 30 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, marginRight: 15, marginTop: 4 },
  headerText: { flex: 1, marginRight: 10 },
  heading: { fontSize: 36, fontWeight: '900', color: THEME.text, letterSpacing: -1.5 },
  subheading: { fontSize: 14, color: THEME.textMuted, marginTop: -2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },

  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

  // Forms General
  formGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '800', color: THEME.text, marginBottom: 8, textTransform: 'uppercase' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, borderRadius: 12, paddingHorizontal: 14, height: 55, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  inputBoxFocused: { shadowOffset: { width: 5, height: 5 }, transform: [{ translateY: -2 }] },
  inputInner: { flex: 1, fontSize: 16, color: THEME.text, fontWeight: '600', outlineStyle: 'none', marginLeft: 8 },
  textareaBox: { height: 120, alignItems: 'flex-start', paddingVertical: 14 },
  textareaInner: { height: '100%', width: '100%', marginLeft: 0 },
  picker: { flex: 1, height: '100%', backgroundColor: 'transparent', color: THEME.text, fontWeight: '600', fontSize: 16, borderWidth: 0, outlineStyle: 'none', marginLeft: 8 },

  // Actions
  actions: { marginTop: 10, gap: 15 },
  primaryBtn: { flexDirection: 'row', backgroundColor: THEME.accent, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  primaryBtnDisabled: { opacity: 0.5, shadowOffset: { width: 0, height: 0 }, transform: [{ translateY: 4 }] },
  primaryBtnText: { color: THEME.surface, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  cancelBtn: { height: 50, justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: THEME.textMuted, fontSize: 16, fontWeight: '700' },

  // User Specific Styles
  avatarPreview: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: THEME.cardBg2, borderRadius: 16, padding: 16, marginBottom: 30, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: THEME.surface, borderWidth: 2, borderColor: THEME.border, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: '900', color: THEME.text },
  avatarName: { fontSize: 18, fontWeight: '800', color: THEME.text, marginBottom: 2 },
  avatarRole: { fontSize: 14, fontWeight: '600', color: THEME.textMuted, textTransform: 'uppercase' },
  roleGrid: { flexDirection: 'row', gap: 12 },
  roleCard: { flex: 1, backgroundColor: THEME.surface, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  roleCardActive: { backgroundColor: THEME.cardBg3 },
  roleIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: THEME.bg, borderWidth: 2, borderColor: THEME.border, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  roleIconActive: { backgroundColor: THEME.accent },
  roleLabel: { fontSize: 16, fontWeight: '800', color: THEME.text, marginBottom: 4 },
  roleDesc: { fontSize: 13, color: THEME.textMuted, lineHeight: 18, fontWeight: '500' },
  roleCheck: { position: 'absolute', top: 12, right: 12 },

  // Edit Task Specific Styles
  unsavedBadge: { backgroundColor: THEME.amberSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 2, borderColor: THEME.border, marginTop: 10 },
  unsavedText: { fontSize: 10, fontWeight: '900', color: THEME.text },
  diffHint: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: THEME.amberSoft, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  diffHintText: { fontSize: 15, color: THEME.text, fontWeight: '800' },
});