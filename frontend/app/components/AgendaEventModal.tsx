import React from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AgendaEventModalProps {
  visible: boolean;
  isDarkMode: boolean;
  colors: {
    text: string;
    muted: string;
    surface: string;
    input: string;
    border: string;
    accent: string;
  };
  evento: string;
  fecha: string;
  hora: string;
  guardando: boolean;
  onChangeEvento: (value: string) => void;
  onChangeFecha: (value: string) => void;
  onChangeHora: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function AgendaEventModal({
  visible,
  isDarkMode,
  colors,
  evento,
  fecha,
  hora,
  guardando,
  onChangeEvento,
  onChangeFecha,
  onChangeHora,
  onClose,
  onSave,
}: AgendaEventModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContenido, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitulo, { color: colors.text }]}>Nueva anotación</Text>
              <Text style={[styles.modalSubtitulo, { color: colors.muted }]}>Guarda algo para recordar</Text>
            </View>
            <Pressable onPress={onClose} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={24} color={colors.muted} />
            </Pressable>
          </View>
          <TextInput
            autoFocus
            accessibilityLabel="Recuerdo o evento"
            style={[styles.inputEvento, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
            placeholder="¿Qué quieres recordar?"
            placeholderTextColor={colors.muted}
            value={evento}
            onChangeText={onChangeEvento}
            returnKeyType="done"
            onSubmitEditing={onSave}
          />
          <View style={styles.camposFechaHora}>
            <View style={styles.campoSecundario}>
              <Text style={[styles.labelCampo, { color: colors.muted }]}>FECHA</Text>
              <TextInput
                style={[styles.inputSecundario, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                value={fecha}
                onChangeText={onChangeFecha}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colors.muted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={styles.campoSecundario}>
              <Text style={[styles.labelCampo, { color: colors.muted }]}>HORA · OPCIONAL</Text>
              <TextInput
                style={[styles.inputSecundario, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                value={hora}
                onChangeText={onChangeHora}
                placeholder="HH:MM"
                placeholderTextColor={colors.muted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
          <Pressable
            style={[styles.btnGuardarEvento, { backgroundColor: colors.accent }, guardando && styles.botonDeshabilitado]}
            onPress={onSave}
            disabled={guardando}
          >
            {guardando ? <ActivityIndicator color={isDarkMode ? '#17210c' : '#ffffff'} /> : (
              <>
                <Ionicons name="checkmark" size={20} color={isDarkMode ? '#17210c' : '#ffffff'} />
                <Text style={[styles.btnGuardarTexto, { color: isDarkMode ? '#17210c' : '#ffffff' }]}>Guardar anotación</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputEvento: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  btnGuardarEvento: {
    marginTop: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  btnGuardarTexto: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(11, 18, 28, 0.62)',
  },
  modalContenido: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitulo: {
    marginTop: 4,
    fontSize: 13,
  },
  camposFechaHora: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  campoSecundario: {
    flex: 1,
  },
  labelCampo: {
    marginBottom: 6,
    fontSize: 10,
    fontWeight: '700',
  },
  inputSecundario: {
    minHeight: 46,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 13,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
});