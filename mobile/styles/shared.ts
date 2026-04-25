/**
 * Shared StyleSheet fragments reused across screens.
 */
import { StyleSheet, Platform } from 'react-native';
import { T } from '../constants/theme';

export const sharedStyles = StyleSheet.create({
  // Screen root
  container: {
    flex: 1,
    backgroundColor: T.bg,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Screen header row
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: T.radius.md,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: T.font.lg,
    fontWeight: '800',
    color: T.text,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: T.font.sm,
    color: T.textMuted,
    marginTop: 1,
  },

  // Scrollable form content
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    maxWidth: 640,
    ...(Platform.OS === 'web' ? { alignSelf: 'center' as const, width: '100%' } : {}),
  },

  // Form field
  fieldGroup: { marginBottom: 20 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 8,
  },
  label: {
    fontSize: T.font.xs,
    fontWeight: '700',
    color: T.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  required: {
    fontSize: T.font.sm,
    color: T.accent,
    fontWeight: '700',
  },

  // Text inputs
  input: {
    backgroundColor: T.surface,
    padding: 14,
    borderRadius: T.radius.md,
    borderWidth: 1.5,
    borderColor: T.border,
    fontSize: T.font.base,
    color: T.text,
  },
  inputFocused: { borderColor: T.borderFocus },
  textarea: {
    height: 110,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  // Input box with icon prefix
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: T.surface,
    borderRadius: T.radius.md,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputBoxFocused: { borderColor: T.borderFocus },
  inputInner: {
    flex: 1,
    fontSize: T.font.base,
    color: T.text,
  },

  // Picker wrapper
  pickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: T.radius.md,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingLeft: 12,
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    height: 52,
    color: T.text,
  },

  // Action buttons
  actions: { marginTop: 12, gap: 12 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: T.accent,
    borderRadius: T.radius.md,
    paddingVertical: 16,
  },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: {
    color: T.surface,
    fontSize: T.font.md,
    fontWeight: '700',
  },
  cancelBtn: { alignItems: 'center', paddingVertical: 14 },
  cancelBtnText: {
    color: T.textMuted,
    fontSize: T.font.base,
    fontWeight: '600',
  },
});
