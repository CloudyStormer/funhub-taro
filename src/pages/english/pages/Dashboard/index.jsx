import React from 'react';
import { View } from '@tarojs/components';
import ProgressSection from './ProgressSection';
import ScenarioSection from './ScenarioSection';
import MemorySection from './MemorySection';
import ReviewSection from './ReviewSection';

const Dashboard = ({ onOpenModal, onSelectScenario, modalOpen = false }) => (
  <View>
    <ProgressSection onOpenModal={onOpenModal} />
    <ScenarioSection onOpenModal={onOpenModal} onSelectScenario={onSelectScenario} />
    {/* 弹窗打开时卸载整个 MemorySection（原生 Canvas 必须完全卸载才能被弹窗遮挡） */}
    {modalOpen
      ? <View style={{ height: '260px' }} />
      : <MemorySection />
    }
    <ReviewSection />
  </View>
);

export default Dashboard;
