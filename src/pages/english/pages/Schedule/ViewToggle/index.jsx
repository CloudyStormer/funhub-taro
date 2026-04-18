import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const options = [
  { key: 'day',   label: '日' },
  { key: 'week',  label: '周' },
  { key: 'month', label: '月' },
];

const ViewToggle = ({ view, onChange }) => (
  <View className={styles.wrapper}>
    {options.map((o) => (
      <View
        key={o.key}
        className={`${styles.option} ${view === o.key ? styles.active : ''}`}
        onClick={() => onChange(o.key)}
      >
        {o.label}
      </View>
    ))}
  </View>
);

export default ViewToggle;
