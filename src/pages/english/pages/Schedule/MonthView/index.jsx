import React from 'react';
import { View, Text } from '@tarojs/components';
import MonthNav from '../MonthNav';
import DaySummary from '../DaySummary';
import TaskCard from '../TaskCard';
import { fmt, today, getRecord, scheduleItems, weekDayLabels } from '../scheduleData';
import styles from './index.module.scss';

const todayStr = fmt(today);

const MonthView = ({ selectedDate, onDateChange }) => {
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

  const firstDay = new Date(year, month, 1);
  const firstDayWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayWeek - 1 + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - (firstDayWeek - 1) + 1;
    cells.push(dayNum < 1 || dayNum > daysInMonth ? null : new Date(year, month, dayNum));
  }

  const selectedStr = fmt(selectedDate);
  const monthDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const doneDays = monthDates.filter((d) => getRecord(fmt(d))?.done).length;
  const totalMinutes = monthDates.reduce((sum, d) => sum + (getRecord(fmt(d))?.minutes || 0), 0);

  return (
    <View>
      <MonthNav year={year} month={month} onPrev={goPrev} onNext={goNext} />

      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{doneDays}</Text>
          <Text className={styles.statLabel}>打卡天数</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{totalMinutes}</Text>
          <Text className={styles.statLabel}>总分钟数</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>
            {doneDays > 0 ? Math.round((doneDays / daysInMonth) * 100) : 0}%
          </Text>
          <Text className={styles.statLabel}>月完成率</Text>
        </View>
      </View>

      <View className={styles.weekHeader}>
        {weekDayLabels.map((d) => (
          <View key={d} className={styles.weekHeaderCell}>{d}</View>
        ))}
      </View>

      <View className={styles.grid}>
        {Array.from({ length: cells.length / 7 }, (_, row) => (
          <View key={row} className={styles.gridRow}>
            {cells.slice(row * 7, row * 7 + 7).map((d, col) => {
              if (!d) return <View key={col} className={styles.gridCellEmpty} />;
              const dStr = fmt(d);
              const isSelected = dStr === selectedStr;
              const isToday = dStr === todayStr;
              const rec = getRecord(dStr);
              const isFuture = d > today;
              return (
                <View
                  key={col}
                  className={styles.gridCell}
                  onClick={() => onDateChange(new Date(d))}
                >
                  <View
                    className={`${styles.dateCircle} ${
                      isSelected ? styles.selected
                      : isToday   ? styles.today
                      : rec?.done ? styles.done
                      : isFuture  ? styles.future
                      : ''
                    }`}
                  >
                    {d.getDate()}
                  </View>
                  <View className={styles.dotArea}>
                    {rec?.done && (
                      <View className={`${styles.dot} ${isSelected ? styles.selectedDot : ''}`} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View className={styles.tasksArea}>
        <DaySummary record={getRecord(selectedStr)} />
        <Text className={styles.tasksHeading}>
          {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日课程安排
        </Text>
        <View className={styles.taskList}>
          {scheduleItems.slice(0, 2).map((item, i) => <TaskCard key={i} item={item} />)}
        </View>
      </View>
    </View>
  );
};

export default MonthView;
