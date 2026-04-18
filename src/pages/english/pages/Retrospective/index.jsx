import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const stats = [
  { label: '本周学习天数', value: '5 天', trend: '+1' },
  { label: '掌握单词数',   value: '128',  trend: '+12' },
  { label: '平均正确率',   value: '76%',  trend: '+3%' },
];

const reviews = [
  { label: '做得好的地方', emoji: '✅', color: 'rgb(22, 163, 74)',  items: ['坚持每日打卡', '情景对话完成率高'] },
  { label: '需要改进',     emoji: '✕',  color: 'rgb(239, 68, 68)', items: ['发音练习频率不足', '生词复习间隔过长'] },
];

const RetrospectivePage = () => {
  return (
    <View className={styles.page}>
      <View className={styles.titleRow}>
        <Text style={{ color: 'rgb(44, 108, 255)' }}>📖</Text>
        <Text className={styles.title}>本周复盘</Text>
      </View>

      <View className={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} className={styles.statCard}>
            <Text className={styles.statValue}>{s.value}</Text>
            <Text className={styles.statLabel}>{s.label}</Text>
            <Text className={styles.statTrend}>
              <Text>📈</Text>
              {s.trend}
            </Text>
          </View>
        ))}
      </View>

      {reviews.map((group, i) => (
        <View key={i} className={styles.reviewGroup}>
          <View className={styles.groupHeader}>
            <Text style={{ color: group.color }}>{group.emoji}</Text>
            <Text className={styles.groupLabel}>{group.label}</Text>
          </View>
          <View className={styles.itemList}>
            {group.items.map((item, j) => (
              <View key={j} className={styles.item}>{item}</View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default RetrospectivePage;
