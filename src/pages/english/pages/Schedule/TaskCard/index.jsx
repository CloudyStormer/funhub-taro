import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const TaskCard = ({ item }) => (
  <View className={styles.card}>
    <View className={styles.timeCol}>
      <Text className={styles.timeText}>{item.time}</Text>
      <View className={styles.timeLine} />
    </View>

    <View className={styles.content}>
      <Text className={`${styles.taskTitle} ${item.done ? styles.done : ''}`}>
        {item.title}
      </Text>
      <View className={styles.metaRow}>
        <Text className={styles.metaIcon}>🕐</Text>
        <Text className={styles.duration}>{item.duration}</Text>
        <Text className={`${styles.tag} ${styles[item.tagClass]}`}>{item.tag}</Text>
      </View>
    </View>

    <View className={styles.status}>
      {item.done
        ? <Text className={styles.checkIcon}>✅</Text>
        : <View className={styles.emptyCircle} />
      }
    </View>
  </View>
);

export default TaskCard;
