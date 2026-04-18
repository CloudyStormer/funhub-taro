import React from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

const DayDot = ({ record, small }) => {
  const size = small ? 5 : 6;
  const wrapperHeight = small ? 6 : 8;

  if (!record) return <View style={{ height: `${wrapperHeight}px` }} />;

  return (
    <View className={styles.wrapper} style={{ height: `${wrapperHeight}px` }}>
      <View
        className={`${styles.dot} ${record.done ? styles.done : ''}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </View>
  );
};

export default DayDot;
