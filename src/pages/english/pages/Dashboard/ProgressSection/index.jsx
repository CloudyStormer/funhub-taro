import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const ProgressSection = ({ days = 12, progress = 85, onOpenModal }) => {
  return (
    <View className={styles.section}>
      <View className={styles.greetingBox}>
        <View className={styles.greetingRow}>
          <Text className={styles.greetingTitle}>嗨, Alex!</Text>
          <View className={styles.proBadge}>
            <Text className={styles.pulseDot}></Text>
            成人职场版 PRO
          </View>
        </View>
        <Text className={styles.streakText}>
          已连续学习 <Text className={styles.streakHighlight}>{days}</Text> 天
        </Text>
      </View>
      <View className={styles.progressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressLabel}>今日学习进度</Text>
          <Text className={styles.progressValue}>{progress}%</Text>
        </View>
        <View className={styles.progressBarWrapper}>
          <View
            className={styles.progressBarFill}
            style={{ '--progress': `${progress}%` }}
          />
        </View>
        <View className={styles.primaryBtn} onClick={onOpenModal}>
          <Text>▶</Text>
          快速开始学习
        </View>
      </View>
    </View>
  );
};

export default ProgressSection;
