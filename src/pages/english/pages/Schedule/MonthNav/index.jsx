import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const MonthNav = ({ year, month, onPrev, onNext }) => (
  <View className={styles.nav}>
    <View className={styles.navBtn} onClick={onPrev}>
      <Text>‹</Text>
    </View>
    <Text className={styles.navTitle}>{year}年{month + 1}月</Text>
    <View className={styles.navBtn} onClick={onNext}>
      <Text>›</Text>
    </View>
  </View>
);

export default MonthNav;
