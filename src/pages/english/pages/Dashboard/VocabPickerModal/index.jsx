import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const coreOptions = [
  {
    id: 'office',
    emoji: '💼',
    colorClass: 'purple',
    title: '我主要在办公室沟通',
    subtitle: '（会议、邮件、日常汇报）',
    tag: '职场通用核心词库',
  },
  {
    id: 'travel',
    emoji: '✈️',
    colorClass: 'green',
    title: '我经常短期出差/见客户',
    subtitle: '（机场、酒店、商务拜访）',
    tag: '商务差旅应急词库',
  },
  {
    id: 'contract',
    emoji: '📖',
    colorClass: 'orange',
    title: '我需要处理合同/谈判',
    subtitle: '（法律条款、谈判技巧）',
    tag: '商务谈判精英词库',
  },
  {
    id: 'remote',
    emoji: '🌐',
    colorClass: 'blue',
    title: '我需要跨文化/远程协作',
    subtitle: '（视频会议、全球团队沟通）',
    tag: '跨文化远程协作词库',
  },
];

const extraOptions = [
  {
    id: 'leader',
    emoji: '👥',
    colorClass: 'red',
    title: '我是团队管理者',
    subtitle: '（绩效沟通、激励团队、1-on-1）',
    tag: '领导力管理词库',
  },
  {
    id: 'present',
    emoji: '📊',
    colorClass: 'yellow',
    title: '我需要演讲/公众表达',
    subtitle: '（路演、TED式演讲、年会分享）',
    tag: '演讲表达词库',
  },
  {
    id: 'hr',
    emoji: '✔',
    colorClass: 'teal',
    title: '我从事 HR / 招聘',
    subtitle: '（面试、入职、薪资谈判）',
    tag: 'HR 招聘面试词库',
  },
  {
    id: 'finance',
    emoji: '📈',
    colorClass: 'indigo',
    title: '我处理财务/数据汇报',
    subtitle: '（财报解读、预算会议、ROI分析）',
    tag: '财务数据词库',
  },
];

const OptionCard = ({ opt, activeVocab, onSelect, onClose }) => {
  const isSelected = activeVocab === opt.id;
  return (
    <View
      className={`${styles.optionCard} ${isSelected ? styles.highlight : ''}`}
      onClick={() => { onSelect(opt.id); onClose(); }}
    >
      <View className={`${styles.iconBox} ${styles[opt.colorClass]}`}>
        <Text>{opt.emoji}</Text>
      </View>
      <View className={styles.optionBody}>
        <Text className={styles.optionTitle}>{opt.title}</Text>
        <Text className={styles.optionSubtitle}>{opt.subtitle}</Text>
        <View className={styles.tagRow}>
          <Text className={styles.arrow}>→</Text>
          <Text className={`${styles.tag} ${styles[opt.colorClass]}`}>
            使用【{opt.tag}】
          </Text>
        </View>
      </View>
      {isSelected
        ? <Text className={styles.checkIcon}>✓</Text>
        : <Text className={styles.chevron}>›</Text>
      }
    </View>
  );
};

const VocabPickerModal = ({ visible = false, activeVocab = null, onClose = () => {}, onSelect = () => {} }) => {
  const [mode, setMode] = useState('pick');

  useEffect(() => {
    if (!visible) setMode('pick');
  }, [visible]);

  return (
    <View
      className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`}
      onClick={onClose}
    >
      <View className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <View className={`${styles.sheetInner} ${visible ? styles.sheetVisible : ''} ${mode === 'all' ? styles.sheetFull : ''}`}>
          <View className={styles.handleRow}>
            <View className={styles.handle} />
          </View>

          {mode === 'pick' ? (
            <>
              <View className={styles.header}>
                <View className={styles.headerLeft}>
                  <View className={styles.headerTitle}>
                    <Text className={styles.sparkle}>✨</Text>
                    <Text className={styles.titleText}>
                      选择<Text className={styles.titleHighlight}>词库</Text>，开启职场之旅
                    </Text>
                  </View>
                  <Text className={styles.subtitle}>请花3秒，告诉我们你的主要场景：</Text>
                </View>
                <View className={styles.closeBtn} onClick={onClose}>
                  <Text>✕</Text>
                </View>
              </View>

              <View className={styles.optionList}>
                {coreOptions.map((opt) => (
                  <OptionCard key={opt.id} opt={opt} activeVocab={activeVocab} onSelect={onSelect} onClose={onClose} />
                ))}
              </View>

              <View className={styles.footer}>
                <View className={styles.moreLink} onClick={() => setMode('all')}>
                  了解更多词库选项 →
                </View>
              </View>
            </>
          ) : (
            <>
              <View className={styles.header}>
                <View className={styles.headerLeft}>
                  <View className={styles.headerTitle}>
                    <View className={styles.backBtn} onClick={() => setMode('pick')}>
                      <Text>←</Text>
                    </View>
                    <Text className={styles.titleText}>全部<Text className={styles.titleHighlight}>词库</Text></Text>
                  </View>
                  <Text className={styles.subtitle}>选择最适合你的场景词库</Text>
                </View>
                <View className={styles.closeBtn} onClick={onClose}>
                  <Text>✕</Text>
                </View>
              </View>

              <Text className={styles.groupLabel}>⚡ 常用场景</Text>
              <View className={styles.optionList}>
                {coreOptions.map((opt) => (
                  <OptionCard key={opt.id} opt={opt} activeVocab={activeVocab} onSelect={onSelect} onClose={onClose} />
                ))}
              </View>

              <Text className={styles.groupLabel}>🌟 更多场景</Text>
              <View className={styles.optionList}>
                {extraOptions.map((opt) => (
                  <OptionCard key={opt.id} opt={opt} activeVocab={activeVocab} onSelect={onSelect} onClose={onClose} />
                ))}
              </View>

              <View className={styles.footerSpace} />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default VocabPickerModal;
