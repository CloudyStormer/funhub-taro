import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const tabs = [
  { id: 'schedule',      label: '日程', emoji: '📅' },
  { id: 'dashboard',     label: '看板', emoji: '⊞'  },
  { id: 'retrospective', label: '复盘', emoji: '📖' },
];

const BottomTabBar = ({ activeTab, onTabChange, onOpenModal }) => {
  return (
    <View className={styles.tabBar}>
      {tabs.map(({ id, label, emoji }) => {
        const isActive = activeTab === id;
        return (
          <View
            key={id}
            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
            onClick={() => {
              onTabChange(id);
              // onOpenModal();
            }}
          >
            <View className={styles.iconWrap}>
              <Text className={styles.iconEmoji}>{emoji}</Text>
            </View>
            <Text className={styles.tabLabel}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
