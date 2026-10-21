import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import GastoForm, { CategoriaGasto, Gasto } from './components/gastosForm';

const screenWidth = Dimensions.get('window').width;

export default function GastosScreen() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [vista, setVista] = useState<'dia' | 'mes'>('dia');

  const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const mesActualDefecto = fechaActual.slice(0, 7); // YYYY-MM
  const [mesSeleccionado, setMesSeleccionado] = useState<string>(mesActualDefecto);

  // Obtener lista única de meses disponibles a partir de los gastos registrados
  const mesesDisponibles = Array.from(
    new Set([mesActualDefecto, ...gastos.map((g) => g.fecha.slice(0, 7))])
  ).sort().reverse();

  // Filtrado según la vista seleccionada (Día actual o Mes seleccionado)
  const gastosFiltrados = gastos.filter((g) => {
    if (vista === 'dia') {
      return g.fecha === fechaActual;
    } else {
      return g.fecha.startsWith(mesSeleccionado);
    }
  });

  const totalGastos = gastosFiltrados.reduce((acc, curr) => acc + curr.precio, 0);

  const totalServicios = gastosFiltrados
    .filter((g) => g.categoria === 'SERVICIOS')
    .reduce((acc, curr) => acc + curr.precio, 0);

  const totalInsumos = gastosFiltrados
    .filter((g) => g.categoria === 'INSUMOS')
    .reduce((acc, curr) => acc + curr.precio, 0);

  const totalExtras = gastosFiltrados
    .filter((g) => g.categoria === 'EXTRAS')
    .reduce((acc, curr) => acc + curr.precio, 0);

  const handleAgregarGasto = (nombre: string, precio: number, fecha: string, categoria: CategoriaGasto) => {
    const nuevaFecha = fecha || fechaActual;
    const nuevoGasto: Gasto = {
      id: Date.now().toString(),
      nombre,
      precio,
      fecha: nuevaFecha,
      categoria,
    };
    setGastos([nuevoGasto, ...gastos]);
    // Ajustar el selector al mes del gasto recién agregado si se añade en modo mes
    setMesSeleccionado(nuevaFecha.slice(0, 7));
  };

  // Agrupar gastos por fecha para la vista mensual
  const gastosAgrupadosPorFecha = gastosFiltrados.reduce((acc: { [key: string]: { gastos: Gasto[]; totalDia: number; servicios: number; insumos: number; extras: number } }, gasto) => {
    if (!acc[gasto.fecha]) {
      acc[gasto.fecha] = { gastos: [], totalDia: 0, servicios: 0, insumos: 0, extras: 0 };
    }
    acc[gasto.fecha].gastos.push(gasto);
    acc[gasto.fecha].totalDia += gasto.precio;
    if (gasto.categoria === 'SERVICIOS') acc[gasto.fecha].servicios += gasto.precio;
    if (gasto.categoria === 'INSUMOS') acc[gasto.fecha].insumos += gasto.precio;
    if (gasto.categoria === 'EXTRAS') acc[gasto.fecha].extras += gasto.precio;
    return acc;
  }, {});

  const listaFechas = Object.keys(gastosAgrupadosPorFecha).sort().reverse();

  const dataPie = [
    {
      name: 'Servicios',
      population: totalServicios,
      color: '#4C82EF',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Insumos',
      population: totalInsumos,
      color: '#9B7ED9',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Extras',
      population: totalExtras,
      color: '#F9B775',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  return (
    <ImageBackground
      source={require('../assets/images/FondoLima.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>GASTOS</Text>

        {/* Formulario */}
        <GastoForm totalGastos={totalGastos} onAgregarGasto={handleAgregarGasto} />

        {/* Selector de Vista Día / Mes */}
        <View style={styles.selectorVista}>
          <TouchableOpacity
            style={[styles.btnVista, vista === 'dia' && styles.btnVistaActiva]}
            onPress={() => setVista('dia')}
          >
            <Text style={[styles.txtVista, vista === 'dia' && styles.txtVistaActiva]}>Día</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnVista, vista === 'mes' && styles.btnVistaActiva]}
            onPress={() => setVista('mes')}
          >
            <Text style={[styles.txtVista, vista === 'mes' && styles.txtVistaActiva]}>Mes</Text>
          </TouchableOpacity>
        </View>

        {/* Selector de Filtro por Mes (Solo visible en Vista Mes) */}
        {vista === 'mes' && (
          <View style={styles.filtroMesContainer}>
            <Text style={styles.filtroMesLabel}>Filtrar Mes:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={mesSeleccionado}
                onValueChange={(itemValue) => setMesSeleccionado(itemValue)}
                style={styles.pickerMes}
              >
                {mesesDisponibles.map((m) => (
                  <Picker.Item key={m} label={m} value={m} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Caja de Lista de Registros */}
        <View style={styles.listaBox}>
          <Text style={styles.listaBoxTitle}>
            {vista === 'dia' ? 'Últimos Registros (Día)' : `Gastos de ${mesSeleccionado}`}
          </Text>
          {gastosFiltrados.length === 0 ? (
            <Text style={styles.emptyText}>No hay gastos registrados en este período.</Text>
          ) : vista === 'dia' ? (
            <FlatList
              data={gastosFiltrados}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.gastoItem}>
                  <View>
                    <Text style={styles.gastoNombre}>{item.nombre}</Text>
                    <Text style={styles.gastoCategoria}>{item.categoria}</Text>
                  </View>
                  <Text style={styles.gastoPrecio}>{item.precio}$</Text>
                </View>
              )}
            />
          ) : (
            <FlatList
              data={listaFechas}
              keyExtractor={(fecha) => fecha}
              scrollEnabled={false}
              renderItem={({ item: fecha }) => {
                const grupo = gastosAgrupadosPorFecha[fecha];
                return (
                  <View style={styles.grupoFechaContainer}>
                    <View style={styles.fechaHeaderRow}>
                      <Text style={styles.fechaHeaderTxt}>{fecha}</Text>
                      <Text style={styles.totalFechaTxt}>Total Día: ${grupo.totalDia}</Text>
                    </View>
                    {grupo.gastos.map((gasto) => (
                      <View key={gasto.id} style={styles.gastoItemSub}>
                        <View>
                          <Text style={styles.gastoNombre}>{gasto.nombre}</Text>
                          <Text style={styles.gastoCategoria}>{gasto.categoria}</Text>
                        </View>
                        <Text style={styles.gastoPrecio}>{gasto.precio}$</Text>
                      </View>
                    ))}
                  </View>
                );
              }}
            />
          )}
        </View>

        {/* Resumen Estadístico Numérico y Desglosado */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>
            Estadísticas ({vista === 'dia' ? 'Diarias' : `Mes: ${mesSeleccionado}`})
          </Text>
          <Text style={styles.statsTextTotal}>
            Total {vista === 'dia' ? 'del Día' : 'del Mes'}: ${totalGastos}
          </Text>
          
          {vista === 'dia' ? (
            <>
              <Text style={styles.statsText}>Servicios: ${totalServicios} ({totalGastos > 0 ? ((totalServicios / totalGastos) * 100).toFixed(1) : 0}%)</Text>
              <Text style={styles.statsText}>Insumos: ${totalInsumos} ({totalGastos > 0 ? ((totalInsumos / totalGastos) * 100).toFixed(1) : 0}%)</Text>
              <Text style={styles.statsText}>Extras: ${totalExtras} ({totalGastos > 0 ? ((totalExtras / totalGastos) * 100).toFixed(1) : 0}%)</Text>
            </>
          ) : (
            <View style={{ marginTop: 5 }}>
              {listaFechas.map((fecha) => {
                const grupo = gastosAgrupadosPorFecha[fecha];
                const tDia = grupo.totalDia;
                const pServicios = tDia > 0 ? ((grupo.servicios / tDia) * 100).toFixed(1) : '0.0';
                const pInsumos = tDia > 0 ? ((grupo.insumos / tDia) * 100).toFixed(1) : '0.0';
                const pExtras = tDia > 0 ? ((grupo.extras / tDia) * 100).toFixed(1) : '0.0';

                return (
                  <View key={fecha} style={styles.statsDayBlock}>
                    <Text style={styles.statsDayHeader}>📅 {fecha} — Total Día: ${tDia}</Text>
                    <Text style={styles.statsSubText}>• Servicios: ${grupo.servicios} ({pServicios}%)</Text>
                    <Text style={styles.statsSubText}>• Insumos: ${grupo.insumos} ({pInsumos}%)</Text>
                    <Text style={styles.statsSubText}>• Extras: ${grupo.extras} ({pExtras}%)</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Gráfico de Torta */}
        {totalGastos > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={dataPie}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5d188b',
    marginBottom: 15,
    letterSpacing: 2,
  },
  selectorVista: {
    flexDirection: 'row',
    backgroundColor: 'rgba(209, 216, 224, 0.95)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
  },
  btnVista: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  btnVistaActiva: {
    backgroundColor: '#8A2BE2',
  },
  txtVista: {
    color: '#333',
    fontWeight: 'bold',
  },
  txtVistaActiva: {
    color: '#FFF',
  },
  filtroMesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(209, 216, 224, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  filtroMesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerMes: {
    width: '100%',
    height: 55,
  },
  listaBox: {
    width: '90%',
    backgroundColor: 'rgba(209, 216, 224, 0.95)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    maxHeight: 280,
  },
  listaBoxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  gastoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BEC3C9',
  },
  grupoFechaContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ABB2BC',
    paddingBottom: 6,
  },
  fechaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#C5CBD3',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  fechaHeaderTxt: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 13,
  },
  totalFechaTxt: {
    fontWeight: 'bold',
    color: '#8A2BE2',
    fontSize: 13,
  },
  gastoItemSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 10,
  },
  gastoNombre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  gastoCategoria: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },
  gastoPrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  statsContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statsTextTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  statsDayBlock: {
    backgroundColor: '#F1F3F6',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statsDayHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statsSubText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 6,
    marginBottom: 2,
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
});