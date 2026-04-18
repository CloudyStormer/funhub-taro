import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import ViewToggle from './ViewToggle';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import styles from './index.module.scss';

const Schedule = () => {
  const [view, setView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderView = () => {
    switch (view) {
      case 'week':
        return <WeekView selectedDate={selectedDate} onDateChange={setSelectedDate} />;
      case 'month':
        return <MonthView selectedDate={selectedDate} onDateChange={setSelectedDate} />;
      default:
        return <DayView selectedDate={selectedDate} onDateChange={setSelectedDate} />;
    }
  };

  return (
    <View className={styles.schedulePage}>
      <View className={styles.pageHeader}>
        <View className={styles.titleBlock}>
          <Text className={styles.pageTitle}>学习日程</Text>
          <Text className={styles.pageSubtitle}>追踪你的每日打卡记录</Text>
        </View>
      </View>
      <View className={styles.toggleRow}>
        <ViewToggle view={view} onChange={setView} />
      </View>
      <View className={styles.content}>
        {renderView()}
      </View>
    </View>
  );
};

export default Schedule;
