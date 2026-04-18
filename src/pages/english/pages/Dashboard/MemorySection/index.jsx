import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const MemorySection = () => (
  <View className={styles.memorySection}>
    <View className={styles.sectionTitleRow}>
      <Text style={{ color: 'rgb(99,82,230)' }}>🧠</Text>
      <Text className={styles.sectionTitle}>遗忘曲线</Text>
      <Text className={styles.aiTag}>AI 估算至半年</Text>
    </View>
    <View className={styles.chartWrapper}>
      <View style={{ padding: '16px', background: 'rgba(99,82,230,0.05)', borderRadius: '12px' }}>
        <Text style={{ display: 'block', fontSize: '13px', color: 'rgb(99,82,230)', fontWeight: 'bold', marginBottom: '8px' }}>
          📈 遗忘曲线说明
        </Text>
        <Text style={{ display: 'block', fontSize: '12px', color: 'rgb(100,116,139)', lineHeight: '1.8' }}>
          艾宾浩斯遗忘曲线显示，学习后记忆迅速衰减。{'\n'}
          通过间隔重复复习，可将记忆保留率显著提升。{'\n'}
          本应用基于你的学习数据进行 AI 估算。
        </Text>
      </View>
    </View>
  </View>
);

export default MemorySection;
