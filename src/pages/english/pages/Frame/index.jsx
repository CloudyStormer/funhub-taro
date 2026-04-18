import React, { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';
import RetrospectivePage from '../Retrospective';
import Dashboard from '../Dashboard';
import SchedulePage from '../Schedule';
import VocabPickerModal from '../Dashboard/VocabPickerModal';
import LearningReadiness from '../LearningReadiness';
import styles from './index.module.scss';

const Frame = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeVocab, setActiveVocab] = useState(null);
  const [pendingTab, setPendingTab] = useState(null);
  const [showLearning, setShowLearning] = useState(false);
  const [learningSceneId, setLearningSceneId] = useState('office');

  // Header 始终可弹窗换词库
  const openModalAlways = () => setModalVisible(true);

  const SCENE_IDS = ['office', 'contract', 'travel'];
  const randomScene = () => SCENE_IDS[Math.floor(Math.random() * SCENE_IDS.length)];

  // 进入学习准备页（已选词库直接跳；未选先弹窗）
  const goToLearning = (sceneId) => {
    const id = sceneId || randomScene();
    if (activeVocab) {
      setLearningSceneId(id);
      setShowLearning(true);
    } else {
      setModalVisible(true);
    }
  };

  // Tab 切换：未选词库先弹窗
  const handleTabChange = (id) => {
    if (activeVocab) {
      setShowLearning(false);
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

  const renderContent = () => {
    if (showLearning) {
      return (
        <LearningReadiness
          sceneId={learningSceneId}
          onBack={() => setShowLearning(false)}
          onStart={() => setShowLearning(false)}
        />
      );
    }
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
        {!showLearning && (
          <Header activeVocab={activeVocab} onOpenModal={openModalAlways} />
        )}
        <ScrollView scrollY className={styles.mainContent}>
          {renderContent()}
        </ScrollView>
        {!showLearning && (
          <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
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
