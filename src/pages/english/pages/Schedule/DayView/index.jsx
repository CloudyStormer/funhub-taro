import React from 'react';
import { View, Text } from '@tarojs/components';
import MonthNav from '../MonthNav';
import DayDot from '../DayDot';
import DaySummary from '../DaySummary';
import TaskCard from '../TaskCard';
import { fmt, today, getRecord, scheduleItems, weekDayLabels } from '../scheduleData';
import styles from './index.module.scss';

const todayStr = fmt(today);

const DayView = ({ selectedDate, onDateChange }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setMonth(month - 1);
    onDateChange(d);
  };
  const goNext = () => {
    const d = new Date(selectedDate);
    d.setMonth(month + 1);
    onDateChange(d);
  };

  const dayOfWeek = selectedDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() + mondayOffset);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const selectedStr = fmt(selectedDate);
  const record = getRecord(selectedStr);

  return (
    <View>
      <MonthNav year={year} month={month} onPrev={goPrev} onNext={goNext} />

      <View className={styles.weekStrip}>
        {weekDates.map((d, i) => {
          const dStr = fmt(d);
          const isSelected = dStr === selectedStr;
          const isToday = dStr === todayStr;
          const rec = getRecord(dStr);
          return (
            <View
              key={i}
              className={styles.dayBtn}
              onClick={() => onDateChange(new Date(d))}
            >
              <Text className={styles.dayLabel}>{weekDayLabels[i]}</Text>
              <View
                className={`${styles.dateCircle} ${isSelected ? styles.selected : isToday ? styles.today : ''}`}
              >
                {d.getDate()}
              </View>
              <DayDot record={rec} small />
            </View>
          );
        })}
      </View>

      <DaySummary record={record} />

      <View className={styles.tasksArea}>
        <Text className={styles.tasksHeading}>
          {month + 1}月{selectedDate.getDate()}日 · {scheduleItems.length} 个安排
        </Text>
        <View className={styles.taskList}>
          {scheduleItems.map((item, i) => <TaskCard key={i} item={item} />)}
        </View>
      </View>
    </View>
  );
};

export default DayView;
