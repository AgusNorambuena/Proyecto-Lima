import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type CategoriaGasto = {
  value: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

interface GastoFormModalsProps {
  modalVisible: boolean;
  isDarkMode: boolean;
  colors: { textSecondary: string; searchBorder: string };
  fechaActual: string;
  nombre: string;
  precio: string;
  fecha: string;
  categoria: string;
  categorias: readonly CategoriaGasto[];
  onChangeNombre: (value: string) => void;
  onChangePrecio: (value: string) => void;
  onChangeFecha: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
  onOpenCategorias: () => void;
}

export default function GastoFormModals({
  modalVisible,
  isDarkMode,
  colors,
  fechaActual,
  nombre,
  precio,
  fecha,
  categoria,
  categorias,
  onChangeNombre,
  onChangePrecio,
  onChangeFecha,
  onSave,
  onClose,
  onOpenCategorias,
}: GastoFormModalsProps) {
  return (
    <>
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={onClose}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
            <Text style={[styles.modalTitulo, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Registrar Nuevo Gasto</Text>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Concepto / Nombre:</Text>
            <TextInput
              style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', borderColor: colors.searchBorder }]}
              placeholder="Ej: Luz, Internet, Compra..."
              placeholderTextColor={isDarkMode ? '#94a3b8' : '#64748b'}
              value={nombre}
              onChangeText={onChangeNombre}
            />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Precio ($):</Text>
            <TextInput
              style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', borderColor: colors.searchBorder }]}
              placeholder="0.00"
              placeholderTextColor={isDarkMode ? '#94a3b8' : '#64748b'}
              keyboardType="numeric"
              value={precio}
              onChangeText={onChangePrecio}
            />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Fecha (YYYY-MM-DD):</Text>
            <TextInput
              style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', borderColor: colors.searchBorder }]}
              placeholder={fechaActual}
              placeholderTextColor={isDarkMode ? '#94a3b8' : '#64748b'}
              value={fecha}
              onChangeText={onChangeFecha}
            />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Categoría:</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onOpenCategorias}
              style={[styles.categorySelector, { borderColor: colors.searchBorder, backgroundColor: isDarkMode ? '#111827' : '#ffffff' }]}
            >
              <Text style={{ color: isDarkMode ? '#f8fafc' : '#17211a', fontSize: 15 }}>
                {categorias.find((item) => item.value === categoria)?.label}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </Pressable>
            <View style={styles.modalAcciones}>
              <Pressable style={[styles.btnModal, { backgroundColor: isDarkMode ? '#334155' : '#e5e7eb' }]} onPress={onClose}>
                <Text style={{ color: isDarkMode ? '#f8fafc' : '#374151', fontWeight: '600' }}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.btnModal, { backgroundColor: '#4f46e5' }]} onPress={onSave}>
                <Text style={{ color: '#ffffff', fontWeight: '600' }}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalCard: { borderRadius: 12, padding: 20, elevation: 5 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '500', marginTop: 10, marginBottom: 4 },
  modalInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  categorySelector: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  modalAcciones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 15 },
  btnModal: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
});
