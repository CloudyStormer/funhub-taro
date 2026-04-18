import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const tasks = [
  { word: 'deadline',   rating: 3, percentage: '60%' },
  { word: 'prioritize', rating: 2, percentage: '40%' },
  { word: 'milestone',  rating: 4, percentage: '85%' },
];

const renderStars = (rating) =>
  Array.from({ length: 5 }).map((_, index) => (
    <Text
      key={index}
      style={{ color: index < rating ? 'rgb(250,204,21)' : 'rgb(226,232,240)', fontSize: '14px' }}
    >
      ⭐
    </Text>
  ));

const ReviewSection = () => {
  return (
    <View className={styles.reviewSection}>
      <View className={styles.sectionTitleRow}>
        <Text style={{ color: 'rgb(59,130,246)' }}>🕐</Text>
        <Text className={styles.sectionTitle}>
          今日复习 <Text className={styles.reviewCount}>(3)</Text>
        </Text>
      </View>
      <View className={styles.reviewList}>
        {tasks.map((task, index) => (
          <View key={index} className={styles.reviewItem}>
            <Text className={styles.reviewWord}>{task.word}</Text>
            <View className={styles.reviewStats}>
              <View className={styles.starRow}>{renderStars(task.rating)}</View>
              <Text className={styles.reviewPercentage}>{task.percentage}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ReviewSection;
