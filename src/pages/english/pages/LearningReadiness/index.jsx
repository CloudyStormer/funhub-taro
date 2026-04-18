import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import WordChip from './WordChip';
import styles from './index.module.scss';

// ── 情景数据（含词性、例句） ──
const sceneConfigs = {
  contract: {
    id: 'contract',
    title: '客户谈判情景',
    icon: '🤝',
    color: 'rgba(255,140,60,1)',
    bgColor: 'rgba(255,237,220,1)',
    words: [
      { word: 'negotiate', phonetic: '/nɪˈɡoʊʃieɪt/', partOfSpeech: 'v. 动词', meaning: '谈判；协商', tag: '高频', example: 'We need to negotiate the terms before signing.', exampleTranslation: '我们需要在签约前协商条款。' },
      { word: 'terms', phonetic: '/tɜːrmz/', partOfSpeech: 'n. 名词', meaning: '条款；条件', tag: '核心', example: 'Please review the terms of the contract carefully.', exampleTranslation: '请仔细阅读合同条款。' },
      { word: 'agreement', phonetic: '/əˈɡriːmənt/', partOfSpeech: 'n. 名词', meaning: '协议；合同', example: 'Both parties reached an agreement on the price.', exampleTranslation: '双方就价格达成了协议。' },
      { word: 'concession', phonetic: '/kənˈseʃən/', partOfSpeech: 'n. 名词', meaning: '让步；妥协', tag: '高频', example: 'Making a small concession can break the deadlock.', exampleTranslation: '小小的让步可以打破僵局。' },
      { word: 'leverage', phonetic: '/ˈlevərɪdʒ/', partOfSpeech: 'n. 名词', meaning: '筹码；杠杆优势', example: 'Our patent gives us significant leverage in the deal.', exampleTranslation: '我们的专利在这笔交易中给了我们很大的筹码。' },
      { word: 'deadline', phonetic: '/ˈdedlaɪn/', partOfSpeech: 'n. 名词', meaning: '截止日期', tag: '核心', example: 'The deadline for submission is next Friday.', exampleTranslation: '提交截止日期是下周五。' },
      { word: 'proposal', phonetic: '/prəˈpoʊzəl/', partOfSpeech: 'n. 名词', meaning: '提案；建议书', example: 'They rejected our initial proposal.', exampleTranslation: '他们拒绝了我们最初的提案。' },
      { word: 'counteroffer', phonetic: '/ˈkaʊntərɒfər/', partOfSpeech: 'n. 名词', meaning: '还价；反要约', tag: '高频', example: 'We made a counteroffer of $50,000.', exampleTranslation: '我们还价50,000美元。' },
    ],
  },
  office: {
    id: 'office',
    title: '会议主持情景',
    icon: '📋',
    color: 'rgba(99,82,230,1)',
    bgColor: 'rgba(236,233,255,1)',
    words: [
      { word: 'agenda', phonetic: '/əˈdʒendə/', partOfSpeech: 'n. 名词', meaning: '议程；日程', tag: '高频', example: 'Let\'s go through today\'s agenda first.', exampleTranslation: '我们先过一下今天的议程。' },
      { word: 'facilitate', phonetic: '/fəˈsɪlɪteɪt/', partOfSpeech: 'v. 动词', meaning: '主持；促进', tag: '核心', example: 'She will facilitate the discussion today.', exampleTranslation: '她今天将主持讨论。' },
      { word: 'consensus', phonetic: '/kənˈsensəs/', partOfSpeech: 'n. 名词', meaning: '共识；一致意见', example: 'We need to reach a consensus by end of day.', exampleTranslation: '我们需要在今天结束前达成共识。' },
      { word: 'adjourn', phonetic: '/əˈdʒɜːrn/', partOfSpeech: 'v. 动词', meaning: '休会；延期', tag: '高频', example: 'The meeting was adjourned until next Monday.', exampleTranslation: '会议推迟到下周一继续。' },
      { word: 'minutes', phonetic: '/ˈmɪnɪts/', partOfSpeech: 'n. 名词', meaning: '会议记录', tag: '核心', example: 'Can you take the minutes for today\'s meeting?', exampleTranslation: '你能记录今天会议的纪要吗？' },
      { word: 'motion', phonetic: '/ˈmoʊʃən/', partOfSpeech: 'n. 名词', meaning: '动议；提议', example: 'A motion was put forward to delay the vote.', exampleTranslation: '有人提议推迟投票。' },
      { word: 'quorum', phonetic: '/ˈkwɔːrəm/', partOfSpeech: 'n. 名词', meaning: '法定人数', example: 'We don\'t have a quorum, so we can\'t vote yet.', exampleTranslation: '我们还没有达到法定人数，所以还不能投票。' },
      { word: 'resolution', phonetic: '/ˌrezəˈluːʃən/', partOfSpeech: 'n. 名词', meaning: '决议；解决方案', tag: '高频', example: 'The board passed a resolution on the budget.', exampleTranslation: '董事会通过了一项关于预算的决议。' },
    ],
  },
  travel: {
    id: 'travel',
    title: '商务拜访情景',
    icon: '✈️',
    color: 'rgba(34,180,100,1)',
    bgColor: 'rgba(220,255,238,1)',
    words: [
      { word: 'itinerary', phonetic: '/aɪˈtɪnəreri/', partOfSpeech: 'n. 名词', meaning: '行程；旅游路线', tag: '高频', example: 'Please send me the final itinerary.', exampleTranslation: '请把最终行程发给我。' },
      { word: 'liaison', phonetic: '/liˈeɪzɒn/', partOfSpeech: 'n. 名词', meaning: '联络；联系人', tag: '核心', example: 'John will act as our liaison with the client.', exampleTranslation: 'John将担任我们与客户之间的联络人。' },
      { word: 'briefing', phonetic: '/ˈbriːfɪŋ/', partOfSpeech: 'n. 名词', meaning: '简报；情况介绍', example: 'There will be a briefing before the visit.', exampleTranslation: '拜访前会有一个情况简报。' },
      { word: 'hospitality', phonetic: '/ˌhɒspɪˈtæləti/', partOfSpeech: 'n. 名词', meaning: '款待；招待', example: 'Thank you for your warm hospitality.', exampleTranslation: '感谢您的热情款待。' },
      { word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', partOfSpeech: 'v. 动词', meaning: '容纳；安排住宿', tag: '核心', example: 'The hotel can accommodate up to 200 guests.', exampleTranslation: '这家酒店最多可容纳200位客人。' },
      { word: 'reception', phonetic: '/rɪˈsepʃən/', partOfSpeech: 'n. 名词', meaning: '接待；招待会', tag: '高频', example: 'A reception will be held at 6 PM.', exampleTranslation: '晚上6点将举行接待会。' },
      { word: 'protocol', phonetic: '/ˈproʊtəkɒl/', partOfSpeech: 'n. 名词', meaning: '礼仪；规程', example: 'We must follow the correct protocol.', exampleTranslation: '我们必须遵守正确的礼仪规程。' },
      { word: 'delegation', phonetic: '/ˌdelɪˈɡeɪʃən/', partOfSpeech: 'n. 名词', meaning: '代表团；授权', tag: '高频', example: 'A delegation from China will arrive tomorrow.', exampleTranslation: '来自中国的代表团明天将抵达。' },
    ],
  },
};

// 所有单词池，用于随机换词
const allWordPool = Object.values(sceneConfigs).flatMap((s) => s.words);

const pickRandom = (pool, count = 8) =>
  [...pool].sort(() => Math.random() - 0.5).slice(0, count);

const LearningReadiness = ({ sceneId = 'office', onBack, onStart }) => {
  const scene = sceneConfigs[sceneId] || sceneConfigs.office;
  const [currentWords, setCurrentWords] = useState(scene.words);
  const [revealedWords, setRevealedWords] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const total = currentWords.length;
  const revealedCount = revealedWords.size;

  const revealWord = (i) =>
    setRevealedWords((prev) => new Set([...prev, i]));

  const revealAll = () =>
    setRevealedWords(new Set(currentWords.map((_, i) => i)));

  const refresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentWords(pickRandom(allWordPool));
      setRevealedWords(new Set());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <View className={styles.page}>
      {/* 顶部栏 */}
      <View className={styles.topBar}>
        <View className={styles.backBtn} onClick={onBack}>
          <Text>←</Text>
          <Text>返回</Text>
        </View>
        <Text className={styles.sceneTitle}>{scene.title}</Text>
        <View
          className={`${styles.refreshBtn} ${isRefreshing ? styles.spinning : ''}`}
          onClick={refresh}
        >
          <Text>🔃</Text>
        </View>
      </View>

      {/* 可滚动内容区 */}
      <View className={styles.scrollBody}>
        {/* 词汇概览横幅 */}
        <View className={styles.banner}>
          <View className={styles.bannerTitle}>
            <Text className={styles.bannerIcon}>💡</Text>
            <Text>
              本对话将重点练习以下{' '}
              <Text className={styles.bannerCount}>{total}</Text>{' '}
              个核心词汇
            </Text>
          </View>
          <View className={styles.wordTags}>
            {currentWords.map((w, i) => (
              <Text key={i} className={styles.wordTag}>{w.word}</Text>
            ))}
          </View>
          {revealedCount > 0 && (
            <View className={styles.progressArea}>
              <View className={styles.progressLabels}>
                <Text>已预览 {revealedCount}/{total}</Text>
                <Text>{Math.round((revealedCount / total) * 100)}%</Text>
              </View>
              <View className={styles.progressTrack}>
                <View
                  className={styles.progressFill}
                  style={{ '--pct': `${(revealedCount / total) * 100}%` }}
                />
              </View>
            </View>
          )}
        </View>

        {/* 步骤卡 */}
        <View className={styles.stepCard}>
          <View className={styles.stepTitle}>
            <Text className={styles.zapIcon}>⚡</Text>
            <Text>第一步：预览本场景核心词汇</Text>
          </View>
          <Text className={styles.stepDesc}>
            点击词卡查看释义、词性和例句，也可跳过直接开始对话
          </Text>
        </View>

        {/* 词卡列表头 */}
        <View className={styles.listHeader}>
          <Text>📖 点击预览词汇</Text>
          {revealedCount < total && (
            <View className={styles.revealAllBtn} onClick={revealAll}>
              全部展开
            </View>
          )}
        </View>

        {/* 词卡列表 */}
        <View className={styles.chipList}>
          {currentWords.map((word, i) => (
            <WordChip
              key={`${word.word}-${i}`}
              word={word}
              index={i}
              revealed={revealedWords.has(i)}
              onReveal={() => revealWord(i)}
            />
          ))}
        </View>

        {/* 提示 */}
        <View className={styles.hintCard}>
          <Text>💡 若选「提前学习」，则进入词汇闪卡练习；若选「直接开始」，则进入对话情景</Text>
        </View>
      </View>

      {/* 底部按钮 */}
      <View className={styles.bottomBar}>
        <View className={styles.btnRow}>
          <View className={styles.btnSecondary} onClick={revealAll}>
            提前学习这些词
          </View>
          <View className={styles.btnPrimary} onClick={onStart}>
            直接开始 →
          </View>
        </View>
      </View>
    </View>
  );
};

export default LearningReadiness;
