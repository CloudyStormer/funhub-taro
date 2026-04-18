import React from 'react';
import { View } from '@tarojs/components';
import ProgressSection from './ProgressSection';
import ScenarioSection from './ScenarioSection';
import MemorySection from './MemorySection';
import ReviewSection from './ReviewSection';

const Dashboard = ({ onOpenModal, onSelectScenario }) => (
  <View>
    <ProgressSection onOpenModal={onOpenModal} />
    <ScenarioSection onOpenModal={onOpenModal} onSelectScenario={onSelectScenario} />
    <MemorySection />
    <ReviewSection />
  </View>
);

export default Dashboard;
