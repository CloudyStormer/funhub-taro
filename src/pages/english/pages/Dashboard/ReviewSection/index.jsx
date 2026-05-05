import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const tasks = [
  { title: '商务邮件写作', count: 12, status: 'done'       },
  { title: '会议英语口语', count: 8,  status: 'ongoing'    },
  { title: '合同术语精读', count: 15, status: 'notStarted' },
];

const STATUS_MAP = {
  done:       { label: '已完成', cls: 'tagDone'       },
  ongoing:    { label: '进行中', cls: 'tagOngoing'    },
  notStarted: { label: '未开始', cls: 'tagNotStarted' },
};

const ReviewSection = () => (
  <View className={styles.reviewSection}>
    <View className={styles.sectionTitleRow}>
      <Text className={styles.titleIcon}>🗂️</Text>
      <Text className={styles.sectionTitle}>今日任务</Text>
    </View>

    <View className={styles.card}>
      {tasks.map((task, i) => {
        const { label, cls } = STATUS_MAP[task.status];
        const isDone = task.status === 'done';
        return (
          <View key={i} className={`${styles.taskRow} ${i < tasks.length - 1 ? styles.divider : ''}`}>
            {/* 左侧圆形勾选 */}
            <View className={`${styles.circle} ${isDone ? styles.circleDone : ''}`}>
              {isDone && <Text className={styles.checkMark}>✓</Text>}
            </View>

            {/* 任务名 */}
            <Text className={`${styles.taskTitle} ${isDone ? styles.taskDone : ''}`}>
              {task.title}
            </Text>

            {/* 词数 */}
            <Text className={styles.wordCount}>{task.count}词</Text>

            {/* 状态标签 */}
            <View className={`${styles.statusTag} ${styles[cls]}`}>
              <Text className={`${styles.statusText} ${styles[cls + 'Text']}`}>{label}</Text>
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

export default ReviewSection;
