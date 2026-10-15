import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeProvider';

export type PopupTone = 'success' | 'error' | 'info' | 'confirm';
export type PopupActionVariant = 'primary' | 'secondary' | 'danger';

export interface PopupAction {
  label: string;
  onPress?: () => void | Promise<void>;
  variant?: PopupActionVariant;
}

export interface PopupOptions {
  title: string;
  message: string;
  tone?: PopupTone;
  actions?: PopupAction[];
}

interface AppPopupProps {
  popup: PopupOptions | null;
  onDismiss: () => void;
}

export function useAppPopup() {
  const [popup, setPopup] = useState<PopupOptions | null>(null);

  return {
    popup,
    showPopup: setPopup,
    dismissPopup: () => setPopup(null),
  };
}

const toneStyles: Record<PopupTone, { color: string; backgroundColor: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  success: { color: '#477b18', backgroundColor: '#edf7dc', icon: 'checkmark-circle' },
  error: { color: '#b42318', backgroundColor: '#fff0ed', icon: 'close-circle' },
  info: { color: '#253c9b', backgroundColor: '#edf1ff', icon: 'information-circle' },
  confirm: { color: '#253c9b', backgroundColor: '#edf1ff', icon: 'help-circle' },
};

export default function AppPopup({ popup, onDismiss }: AppPopupProps) {
  const { isDarkMode } = useTheme();
  if (!popup) return null;

  const tone = toneStyles[popup.tone ?? 'info'];
  const actions = popup.actions ?? [{ label: 'Entendido', variant: 'primary' as const }];
  const dismiss = popup.tone === 'confirm' ? () => {} : onDismiss;

  const runAction = (action: PopupAction) => {
    onDismiss();
    void action.onPress?.();
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={dismiss} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel="Cerrar mensaje" />
        <View style={[styles.dialog, isDarkMode && styles.dialogDark]} accessibilityViewIsModal>
          <View style={[styles.iconWrap, { backgroundColor: tone.backgroundColor }]}>
            <Ionicons name={tone.icon} size={30} color={tone.color} />
          </View>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>{popup.title}</Text>
          <Text style={[styles.message, isDarkMode && styles.messageDark]}>{popup.message}</Text>
          <View style={[styles.actions, actions.length === 1 && styles.singleAction]}>
            {actions.map((action) => {
              const variant = action.variant ?? 'primary';
              return (
                <Pressable
                  key={action.label}
                  accessibilityRole="button"
                  onPress={() => runAction(action)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    actions.length === 1 && styles.singleActionButton,
                    variant === 'primary' && styles.primaryButton,
                    variant === 'secondary' && styles.secondaryButton,
                    variant === 'danger' && styles.dangerButton,
                    pressed && styles.pressedButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.actionText,
                      variant === 'primary' && styles.primaryText,
                      variant === 'secondary' && styles.secondaryText,
                      variant === 'danger' && styles.dangerText,
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(11, 18, 28, 0.62)',
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6ebdc',
    backgroundColor: '#ffffff',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
  dialogDark: {
    borderColor: '#475569',
    backgroundColor: '#1e293b',
  },
  iconWrap: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderRadius: 29,
  },
  title: {
    width: '100%',
    color: '#17211a',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleDark: {
    color: '#f8fafc',
  },
  message: {
    width: '100%',
    marginTop: 8,
    color: '#58635a',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  messageDark: {
    color: '#cbd5e1',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  singleAction: {
    flexDirection: 'column',
  },
  actionButton: {
    minHeight: 46,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  singleActionButton: {
    flex: 0,
    alignSelf: 'stretch',
  },
  primaryButton: {
    backgroundColor: '#a8d52a',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d8dfd1',
    backgroundColor: '#ffffff',
  },
  dangerButton: {
    backgroundColor: '#b42318',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryText: {
    color: '#17210c',
  },
  secondaryText: {
    color: '#354039',
  },
  dangerText: {
    color: '#ffffff',
  },
  pressedButton: {
    opacity: 0.78,
  },
});