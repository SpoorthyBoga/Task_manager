import { StyleSheet, Platform } from 'react-native';
import { THEME } from '../constants/theme';

const isWeb = Platform.OS === 'web';

export const loginStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.bg },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.bg },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    ...(isWeb ? { maxWidth: 460, alignSelf: 'center', width: '100%' } : {}),
  },

  brand: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 40, justifyContent: 'center' },
  logoBox: { width: 54, height: 54, borderRadius: 16, backgroundColor: THEME.brandYellow, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  wordmark: { fontSize: 36, fontWeight: '900', color: THEME.text, letterSpacing: -1.5 },

  card: { backgroundColor: THEME.surface, borderRadius: 20, padding: 30, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, marginBottom: 30 },
  heading: { fontSize: 28, fontWeight: '900', color: THEME.text, marginBottom: 4, letterSpacing: -0.5 },
  subheading: { fontSize: 15, color: THEME.textMuted, marginBottom: 30, fontWeight: '600' },

  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '800', color: THEME.text, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.bg, borderRadius: 12, paddingHorizontal: 14, height: 55, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  inputBoxFocused: { shadowOffset: { width: 5, height: 5 }, transform: [{ translateY: -2 }], backgroundColor: THEME.surface },
  inputInner: { flex: 1, marginLeft: 10, fontSize: 16, color: THEME.text, fontWeight: '600', outlineStyle: 'none' },

  loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: THEME.accent, borderRadius: 14, height: 60, marginTop: 10, borderWidth: 2, borderColor: THEME.border, shadowColor: THEME.border, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  loginBtnDisabled: { opacity: 0.5, shadowOffset: { width: 0, height: 0 }, transform: [{ translateY: 4 }] },
  loginBtnText: { color: THEME.surface, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },

  footer: { textAlign: 'center', fontSize: 13, color: THEME.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});