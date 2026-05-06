import React, { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
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
  const [activeTab, setActiveTab]           = useState('dashboard');
  const [modalVisible, setModalVisible]     = useState(false);
  const [activeVocab, setActiveVocab]       = useState(null);
  const [pendingTab, setPendingTab]         = useState(null);
  const [showLearning, setShowLearning]     = useState(false);
  const [showChat, setShowChat]             = useState(false);
  const [learningSceneId, setLearningSceneId] = useState('office');

  const openModalAlways = () => setModalVisible(true);

  const SCENE_IDS = ['office', 'contract', 'travel'];
  const randomScene = () => SCENE_IDS[Math.floor(Math.random() * SCENE_IDS.length)];

  const goToLearning = (sceneId) => {
    const id = sceneId || randomScene();
    if (activeVocab) {
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
    setModalVisible(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  // 直接开始 → 进入 Chat
  const handleStart = () => {
    setShowLearning(false);
    setShowChat(true);
  };

  // Chat 返回 → 回到 Dashboard
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
          <Chat onBack={handleChatBack} />
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
