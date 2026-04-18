import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const WordChip = ({ word, index, revealed, onReveal }) => (
  <View
    className={`${styles.chip} ${revealed ? styles.revealed : ''}`}
    onClick={onReveal}
  >
    <View className={styles.topRow}>
      <View className={styles.wordMeta}>
        <Text className={styles.index}>{String(index + 1).padStart(2, '0')}</Text>
        <Text className={styles.word}>{word.word}</Text>
        {word.tag && <Text className={styles.tag}>{word.tag}</Text>}
      </View>
      {!revealed && <Text className={styles.chevron}>›</Text>}
    </View>

    {revealed ? (
      <View className={styles.detail}>
        <View className={styles.phoneticRow}>
          <Text className={styles.phonetic}>{word.phonetic}</Text>
          <Text className={styles.pos}>{word.partOfSpeech}</Text>
        </View>
        <Text className={styles.meaning}>{word.meaning}</Text>
        <View className={styles.exampleBlock}>
          <Text className={styles.exampleEn}>"{word.example}"</Text>
          <Text className={styles.exampleZh}>{word.exampleTranslation}</Text>
        </View>
      </View>
    ) : (
      <Text className={styles.hint}>点击查看释义 · 词性 · 例句</Text>
    )}
  </View>
);

export default WordChip;
