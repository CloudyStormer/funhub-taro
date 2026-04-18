import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const columns = [
  {
    id: 'todo',
    label: '待完成',
    color: 'rgb(148, 163, 184)',
    cards: ['学习 deadline 用法', '练习邮件写作'],
  },
  {
    id: 'doing',
    label: '进行中',
    color: 'rgb(44, 108, 255)',
    cards: ['情景对话：会议主持'],
  },
  {
    id: 'done',
    label: '已完成',
    color: 'rgb(22, 163, 74)',
    cards: ['单词记忆：milestone', '发音练习'],
  },
];

const KanbanPage = () => {
  return (
    <View className={styles.page}>
      <View className={styles.titleRow}>
        <Text style={{ color: 'rgb(44, 108, 255)' }}>⊞</Text>
        <Text className={styles.title}>学习看板</Text>
      </View>
      <View className={styles.board}>
        {columns.map((col) => (
          <View key={col.id} className={styles.column}>
            <View className={styles.colHeader}>
              <Text style={{ color: col.color }}>○</Text>
              <Text className={styles.colLabel}>{col.label}</Text>
              <Text className={styles.colCount}>{col.cards.length}</Text>
            </View>
            <View className={styles.cardList}>
              {col.cards.map((card, i) => (
                <View key={i} className={styles.card}>
                  {card}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default KanbanPage;
