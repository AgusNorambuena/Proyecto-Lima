import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Definición de tipos integrada en el mismo archivo
export type CategoriaGasto = 'SERVICIOS' | 'INSUMOS' | 'EXTRAS';

export interface Gasto {
  id: string;
  nombre: string;
  precio: number;
  fecha: string;
  categoria: CategoriaGasto;
}

interface GastoFormProps {
  totalGastos: number;
  onAgregarGasto: (nombre: string, precio: number, fecha: string, categoria: CategoriaGasto) => void;
}

export default function GastoForm({ totalGastos, onAgregarGasto }: GastoFormProps) {
  const [nombre, setNombre] = useState('');
  const fechaActual = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(fechaActual);
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState<CategoriaGasto>('SERVICIOS');

  const handleAgregar = () => {
    const precioNum = parseFloat(precio);
    if (!nombre || !fecha || isNaN(precioNum) || precioNum <= 0) return;
    
    onAgregarGasto(nombre, precioNum, fecha, categoria);
    setNombre('');
    setFecha(fechaActual);
    setPrecio('');
  };

  return (
    <View style={styles.card}>

      <TextInput
        style={styles.input}
        placeholder="NOMBRE"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="PRECIO ($)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <TextInput
        style={styles.input}
        placeholder="FECHA (YYYY-MM-DD)"
        placeholderTextColor="#888"
        value={fecha}
        onChangeText={setFecha}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue as CategoriaGasto)}
          style={styles.picker}
        >
          <Picker.Item label="SERVICIOS" value="SERVICIOS" />
          <Picker.Item label="INSUMOS" value="INSUMOS" />
          <Picker.Item label="EXTRAS" value="EXTRAS" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.botonAgregar} onPress={handleAgregar}>
        <Text style={styles.botonTexto}>AÑADIR GASTO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: 'rgba(232, 236, 242, 0.95)',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  precioTotalText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#D1D8E0',
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#D1D8E0',
    borderRadius: 15,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 55,
  },
  botonAgregar: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});