import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const DaySummary = ({ record }) => {
  if (!record || !record.done) return null;

  return (
    <View className={styles.summary}>
      <View className={styles.item}>
        <Text className={styles.fireIcon}>🔥</Text>
        <Text className={styles.label}>已打卡</Text>
      </View>
      <View className={styles.item}>
        <Text className={styles.purpleIcon}>🕐</Text>
        <Text className={styles.value}>{record.minutes} 分钟</Text>
      </View>
      <View className={styles.item}>
        <Text className={styles.purpleIcon}>📖</Text>
        <Text className={styles.value}>{record.tasks} 个任务</Text>
      </View>
    </View>
  );
};

export default DaySummary;
