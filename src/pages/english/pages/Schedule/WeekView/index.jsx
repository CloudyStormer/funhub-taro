import React from 'react';
import { View, Text } from '@tarojs/components';
import DaySummary from '../DaySummary';
import TaskCard from '../TaskCard';
import { fmt, today, getRecord, scheduleItems, weekDayLabels } from '../scheduleData';
import styles from './index.module.scss';

const todayStr = fmt(today);

const WeekView = ({ selectedDate, onDateChange }) => {
  const dayOfWeek = selectedDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() + mondayOffset);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    onDateChange(d);
  };
  const goNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    onDateChange(d);
  };

  const selectedStr = fmt(selectedDate);
  const weekLabel = `${weekDates[0].getMonth() + 1}月${weekDates[0].getDate()}日 - ${weekDates[6].getMonth() + 1}月${weekDates[6].getDate()}日`;

  const doneCount = weekDates.filter((d) => getRecord(fmt(d))?.done).length;
  const totalMinutes = weekDates.reduce((sum, d) => sum + (getRecord(fmt(d))?.minutes || 0), 0);

  return (
    <View>
      <View className={styles.weekNav}>
        <View className={styles.navBtn} onClick={goPrev}>
          <Text>‹</Text>
        </View>
        <Text className={styles.navLabel}>{weekLabel}</Text>
        <View className={styles.navBtn} onClick={goNext}>
          <Text>›</Text>
        </View>
      </View>

      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{doneCount}/7</Text>
          <Text className={styles.statLabel}>打卡天数</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{totalMinutes}</Text>
          <Text className={styles.statLabel}>学习分钟</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>
            {doneCount > 0 ? Math.round((doneCount / 7) * 100) : 0}%
          </Text>
          <Text className={styles.statLabel}>完成率</Text>
        </View>
      </View>

      <View className={styles.dayColumns}>
        <View className={styles.daysRow}>
          {weekDates.map((d, i) => {
            const dStr = fmt(d);
            const isSelected = dStr === selectedStr;
            const isToday = dStr === todayStr;
            const rec = getRecord(dStr);
            const barHeight = rec?.done ? Math.max(20, (rec.minutes / 60) * 60) : 0;
            return (
              <View
                key={i}
                className={styles.dayCol}
                onClick={() => onDateChange(new Date(d))}
              >
                <Text className={styles.dayLabel}>{weekDayLabels[i]}</Text>
                <View className={styles.barContainer}>
                  <View
                    className={`${styles.bar} ${
                      rec?.done
                        ? isSelected ? styles.barSelected : styles.barDone
                        : styles.barEmpty
                    }`}
                    style={rec?.done ? { '--bar-height': `${barHeight}px` } : undefined}
                  />
                </View>
                <View
                  className={`${styles.dateCircle} ${isSelected ? styles.selected : isToday ? styles.today : ''}`}
                >
                  {d.getDate()}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.tasksArea}>
        <DaySummary record={getRecord(selectedStr)} />
        <Text className={styles.tasksHeading}>
          {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日课程安排
        </Text>
        <View className={styles.taskList}>
          {scheduleItems.slice(0, 3).map((item, i) => <TaskCard key={i} item={item} />)}
        </View>
      </View>
    </View>
  );
};

export default WeekView;
