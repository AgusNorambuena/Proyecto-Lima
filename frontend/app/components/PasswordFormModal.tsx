import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface PasswordFormModalProps {
  visible: boolean;
  isDarkMode: boolean;
  colors: {
    textSecondary: string;
    searchBorder: string;
  };
  nombre: string;
  usuario: string;
  password: string;
  categoria: string;
  onChangeNombre: (value: string) => void;
  onChangeUsuario: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeCategoria: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const categorias = ['Contraseñas Personales', 'Trabajo y Servidores', 'Redes Sociales'];

export default function PasswordFormModal({
  visible,
  isDarkMode,
  colors,
  nombre,
  usuario,
  password,
  categoria,
  onChangeNombre,
  onChangeUsuario,
  onChangePassword,
  onChangeCategoria,
  onClose,
  onSave,
}: PasswordFormModalProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBg}>
        <View style={[styles.modalCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.modalTitulo, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Nueva Contraseña</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Aplicación / Servicio:</Text>
          <TextInput
            style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', borderColor: colors.searchBorder }]}
            placeholder="Ej: Spotify, Facebook..."
            placeholderTextColor={isDarkMode ? '#94a3b8' : '#64748b'}
            value={nombre}
            onChangeText={onChangeNombre}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Email / Usuario:</Text>
          <TextInput
            style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', borderColor: colors.searchBorder }]}
            placeholder="Ej: usuario@gmail.com"
            placeholderTextColor={isDarkMode ? '#94a3b8' : '#64748b'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={usuario}
            onChangeText={onChangeUsuario}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Contraseña:</Text>
          <TextInput
            style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', borderColor: colors.searchBorder }]}
            placeholder="••••••••••••"
            placeholderTextColor={isDarkMode ? '#94a3b8' : '#64748b'}
            secureTextEntry
            value={password}
            onChangeText={onChangePassword}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Categoría:</Text>
          <View style={styles.opcionesCategorias}>
            {categorias.map((opcion) => (
              <Pressable
                key={opcion}
                style={[styles.chipCategoria, categoria === opcion && styles.chipCategoriaActivo]}
                onPress={() => onChangeCategoria(opcion)}
              >
                <Text style={[styles.chipTexto, categoria === opcion && styles.chipTextoActivo]}>
                  {opcion}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.modalAcciones}>
            <Pressable
              style={[styles.btnModal, { backgroundColor: isDarkMode ? '#334155' : '#e5e7eb' }]}
              onPress={onClose}
            >
              <Text style={{ color: isDarkMode ? '#f8fafc' : '#374151', fontWeight: '600' }}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.btnModal, { backgroundColor: '#4f46e5' }]} onPress={onSave}>
              <Text style={{ color: '#ffffff', fontWeight: '600' }}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
    color: '#6b7280',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  opcionesCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 15,
  },
  chipCategoria: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9ca3af',
  },
  chipCategoriaActivo: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  chipTexto: {
    fontSize: 12,
    color: '#6b7280',
  },
  chipTextoActivo: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  btnModal: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});