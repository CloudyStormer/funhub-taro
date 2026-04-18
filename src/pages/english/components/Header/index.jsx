import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';

const vocabMap = {
  office:   { label: '职场通用词库',   emoji: '💼', colorClass: 'purple' },
  travel:   { label: '商务差旅词库',   emoji: '✈️', colorClass: 'green'  },
  contract: { label: '商务谈判词库',   emoji: '📖', colorClass: 'orange' },
  remote:   { label: '跨文化协作词库', emoji: '🌐', colorClass: 'blue'   },
  leader:   { label: '领导力管理词库', emoji: '👥', colorClass: 'red'    },
  present:  { label: '演讲表达词库',   emoji: '📊', colorClass: 'yellow' },
  hr:       { label: 'HR招聘词库',     emoji: '✔',  colorClass: 'teal'   },
  finance:  { label: '财务数据词库',   emoji: '📈', colorClass: 'indigo' },
};

const Header = ({ activeVocab = null, onOpenModal }) => {
  const vocab = activeVocab ? vocabMap[activeVocab] : null;

  return (
    <View className={styles.header}>
      <View className={styles.headerLeft}>
        <View className={styles.iconBtn}><Text>🔍</Text></View>
        <View className={styles.iconBtn}><Text>👓</Text></View>
      </View>

      {/* 中央词库选择器 */}
      <View
        className={`${styles.vocabPill} ${vocab ? styles[vocab.colorClass] : styles.unselected}`}
        onClick={onOpenModal}
      >
        {vocab ? <Text className={styles.vocabEmoji}>{vocab.emoji}</Text> : <Text>🔖</Text>}
        <Text className={styles.vocabLabel}>
          {vocab ? vocab.label : '选择词库'}
        </Text>
        <Text className={styles.vocabChevron}>▾</Text>
      </View>

      <View className={styles.headerRight}>
        <View className={styles.avatarWrapper}>
          <Image
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=f8fafc"
            className={styles.avatarImg}
          />
        </View>
      </View>
    </View>
  );
};

export default Header;
