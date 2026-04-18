import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const allScenarios = [
  { id: 'office',   title: '会议主持',   emoji: '👥',  colorClass: 'purple' },
  { id: 'contract', title: '客户谈判',   emoji: '💼',  colorClass: 'green'  },
  { id: 'travel',   title: '商务拜访',   emoji: '📊',  colorClass: 'orange' },
  { id: 'office',   title: '团队协作',   emoji: '👥',  colorClass: 'green'  },
  { id: 'contract', title: '商务洽谈',   emoji: '💼',  colorClass: 'purple' },
  { id: 'travel',   title: '成果展示',   emoji: '📊',  colorClass: 'orange' },
  { id: 'office',   title: '面试对话',   emoji: '👥',  colorClass: 'orange' },
  { id: 'contract', title: '跨部门沟通', emoji: '💼',  colorClass: 'purple' },
  { id: 'travel',   title: '培训演讲',   emoji: '📊',  colorClass: 'green'  },
];

const pickThree = (exclude) => {
  const pool = allScenarios.filter((s) => !exclude.includes(s.title));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

const ScenarioSection = ({ onOpenModal, onSelectScenario }) => {
  const [current, setCurrent] = useState(allScenarios.slice(0, 3));
  const [spinning, setSpinning] = useState(false);

  const refresh = () => {
    if (spinning) return;
    setSpinning(true);
    const next = pickThree(current.map((s) => s.title));
    setTimeout(() => {
      setCurrent(next);
      setSpinning(false);
    }, 500);
  };

  return (
    <View className={styles.section}>
      <View className={styles.sectionTitleRow}>
        <Text>⭐</Text>
        <Text className={styles.sectionTitle}>推荐情景</Text>
        <View
          className={`${styles.refreshBtn} ${spinning ? styles.spinning : ''}`}
          onClick={refresh}
        >
          <Text>🔄</Text>
        </View>
      </View>
      <View className={styles.scenarioGrid}>
        {current.map((item, index) => (
          <View key={item.title + index} className={styles.scenarioCard} onClick={() => onSelectScenario ? onSelectScenario(item.id) : onOpenModal?.()}>
            <View className={`${styles.scenarioIconWrapper} ${styles[item.colorClass]}`}>
              <Text>{item.emoji}</Text>
            </View>
            <Text className={styles.scenarioCardTitle}>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ScenarioSection;
