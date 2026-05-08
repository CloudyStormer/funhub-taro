import React, { useState, useEffect } from 'react';
import { View, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';
import RetrospectivePage from '../Retrospective';
import Dashboard from '../Dashboard';
import SchedulePage from '../Schedule';
import VocabPickerModal from '../Dashboard/VocabPickerModal';
import LearningReadiness from '../LearningReadiness';
import Chat from '../Chat';
import styles from './index.module.scss';

const Frame = () => {
  // 从 Storage 恢复已选词库，避免每次都弹窗
  const [activeVocab, setActiveVocab]       = useState(() => Taro.getStorageSync('active_vocab') || null);
  const [activeTab, setActiveTab]           = useState('dashboard');
  const [modalVisible, setModalVisible]     = useState(false);
  const [pendingTab, setPendingTab]         = useState(null);
  const [showLearning, setShowLearning]     = useState(false);
  const [showChat, setShowChat]             = useState(false);
  const [learningSceneId, setLearningSceneId] = useState('office');
  // 进入 Chat 时携带的情景信息
  const [chatConfig, setChatConfig]         = useState({ sceneTitle: '', words: [] });

  const openModalAlways = () => setModalVisible(true);

  const SCENE_IDS = ['office', 'contract', 'travel'];
  const randomScene = () => SCENE_IDS[Math.floor(Math.random() * SCENE_IDS.length)];

  const goToLearning = (sceneId) => {
    const id = sceneId || randomScene();
    if (activeVocab) {
      // 已选过词库，直接进入准备页，不再弹窗
      setLearningSceneId(id);
      setShowLearning(true);
    } else {
      setModalVisible(true);
    }
  };

  const handleTabChange = (id) => {
    if (activeVocab) {
      setShowLearning(false);
      setShowChat(false);
      setActiveTab(id);
    } else {
      setPendingTab(id);
      setModalVisible(true);
    }
  };

  const handleVocabSelect = (id) => {
    setActiveVocab(id);
    Taro.setStorageSync('active_vocab', id);  // 持久化，下次不再弹窗
    setModalVisible(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  // 直接开始 → LearningReadiness 传来 { words, sceneTitle }
  const handleStart = ({ words, sceneTitle }) => {
    setChatConfig({ words, sceneTitle });
    setShowLearning(false);
    setShowChat(true);
  };

  const handleChatBack = () => {
    setShowChat(false);
  };

  const renderMain = () => {
    switch (activeTab) {
      case 'schedule':      return <SchedulePage />;
      case 'retrospective': return <RetrospectivePage />;
      default:
        return (
          <Dashboard
            onOpenModal={() => goToLearning('office')}
            onSelectScenario={(id) => goToLearning(id)}
          />
        );
    }
  };

  return (
    <View className={styles.appContainer}>
      <View className={styles.mobileWrapper}>

        {/* ── Chat 页（最高优先级，全屏覆盖） ── */}
        {showChat ? (
          <Chat
            onBack={handleChatBack}
            sceneTitle={chatConfig.sceneTitle}
            words={chatConfig.words}
          />
        ) : showLearning ? (
          /* ── 学习准备页 ── */
          <LearningReadiness
            sceneId={learningSceneId}
            onBack={() => setShowLearning(false)}
            onStart={handleStart}
          />
        ) : (
          /* ── 常规 Tab 内容 ── */
          <>
            <Header activeVocab={activeVocab} onOpenModal={openModalAlways} />
            <ScrollView scrollY style={{ flex: 1, height: 0 }}>
              <View className={styles.scrollInner}>
                {renderMain()}
              </View>
            </ScrollView>
            <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        )}

        <VocabPickerModal
          visible={modalVisible}
          activeVocab={activeVocab}
          onClose={() => { setModalVisible(false); setPendingTab(null); }}
          onSelect={handleVocabSelect}
        />
      </View>
    </View>
  );
};

export default Frame;
