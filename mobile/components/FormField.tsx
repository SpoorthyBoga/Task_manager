import { View, Text } from 'react-native';
import { sharedStyles } from '../styles/shared';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <View style={sharedStyles.fieldGroup}>
      <View style={sharedStyles.labelRow}>
        <Text style={sharedStyles.label}>{label}</Text>
        {required && <Text style={sharedStyles.required}>*</Text>}
      </View>
      {children}
    </View>
  );
}
