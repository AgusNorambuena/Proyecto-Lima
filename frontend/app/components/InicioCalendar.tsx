import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface InicioCalendarProps {
  isDarkMode: boolean;
  selectedDate: string;
  eventosPorFecha: Record<string, string[]>;
  onSelectDate: (date: string) => void;
}

export default function InicioCalendar({
  isDarkMode,
  selectedDate,
  eventosPorFecha,
  onSelectDate,
}: InicioCalendarProps) {
  const styles = createStyles(isDarkMode);

  return (
    <Calendar
      key={isDarkMode ? 'calendar-dark' : 'calendar-light'}
      onDayPress={(day) => onSelectDate(day.dateString)}
      markedDates={{
        [selectedDate]: { selected: true, selectedColor: '#4f46e5' },
      }}
      dayComponent={({ date, state, marking, onPress }) => {
        const fechaDia = date?.dateString ?? '';
        const nombresEventos = eventosPorFecha[fechaDia] ?? [];
        const seleccionado = Boolean(marking?.selected);
        const inactivo = state === 'disabled' || state === 'inactive';

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${fechaDia}${nombresEventos.length ? `: ${nombresEventos.join(', ')}` : ''}`}
            onPress={() => date && onPress?.(date)}
            style={styles.diaCalendario}
          >
            <Text style={[
              styles.numeroDia,
              seleccionado && styles.numeroDiaSeleccionado,
              !seleccionado && inactivo && styles.numeroDiaInactivo,
              !seleccionado && state === 'today' && styles.numeroDiaHoy,
            ]}>
              {date?.day}
            </Text>
            {nombresEventos.length > 0 && (
              <Text
                style={[styles.nombreEventoDia, seleccionado && styles.nombreEventoDiaSeleccionado]}
                numberOfLines={1}
              >
                {nombresEventos[0]}{nombresEventos.length > 1 ? ` +${nombresEventos.length - 1}` : ''}
              </Text>
            )}
          </Pressable>
        );
      }}
      theme={{
        backgroundColor: 'transparent',
        calendarBackground: isDarkMode ? '#000000' : '#ffffff',
        textSectionTitleColor: isDarkMode ? '#e2e8f0' : '#374151',
        selectedDayBackgroundColor: '#4f46e5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: isDarkMode ? '#ffffff' : '#3b6812',
        dayTextColor: isDarkMode ? '#f8fafc' : '#111827',
        textDisabledColor: isDarkMode ? '#808080' : '#6b7280',
        textInactiveColor: isDarkMode ? '#808080' : '#6b7280',
        textDayStyle: { color: isDarkMode ? '#f8fafc' : '#111827' },
        arrowColor: isDarkMode ? 'hsl(83, 69%, 48%)' : '#4f46e5',
        monthTextColor: isDarkMode ? '#f8fafc' : '#111827',
        indicatorColor: '#4f46e5',
        textDayFontWeight: '500',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '600',
        textDayFontSize: 13,
        textMonthFontSize: 15,
        textDayHeaderFontSize: 11,
      }}
    />
  );
}

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  diaCalendario: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minHeight: 38,
  },
  numeroDia: {
    fontSize: 13,
    fontWeight: '500',
    color: isDarkMode ? '#f8fafc' : '#111827',
  },
  numeroDiaSeleccionado: {
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  numeroDiaInactivo: {
    color: isDarkMode ? '#808080' : '#6b7280',
  },
  numeroDiaHoy: {
    color: isDarkMode ? '#ffffff' : '#3b6812',
    fontWeight: 'bold',
  },
  nombreEventoDia: {
    fontSize: 9,
    color: isDarkMode ? '#93c5fd' : '#1d4ed8',
    marginTop: 1,
    maxWidth: 40,
  },
  nombreEventoDiaSeleccionado: {
    color: '#ffffff',
  },
});