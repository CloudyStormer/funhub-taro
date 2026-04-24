import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import ServiceBadges from '../components/ServiceBadges';
import DesignGallery from '../components/DesignGallery';
import ReviewSection from '../components/ReviewSection';
import BookingForm from '../components/BookingForm';
import ContactCard from '../components/ContactCard';
import ContactFooter from '../components/ContactFooter';
import HomeBottomNav from '../components/HomeBottomNav';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex justify-center font-sans" style={{ background: 'rgba(248,240,252,0.5)' }}>
      <div
        className="w-full max-w-[414px] bg-background relative overflow-hidden flex flex-col"
        style={{ minHeight: '100vh', boxShadow: '0 0 60px rgba(236,72,153,0.08)' }}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar pb-[78px]">
          <HeroSection />
          <ServiceBadges />
          <div className="px-5 mb-1">
            <div className="h-px bg-border" />
          </div>
          <DesignGallery />
          <div className="px-5 my-1">
            <div className="h-px bg-border" />
          </div>
          <ContactCard />
          <div className="px-5 my-1">
            <div className="h-px bg-border" />
          </div>
          <ReviewSection />
          <div className="px-5 my-1">
            <div className="h-px bg-border" />
          </div>
          <BookingForm />
          <ContactFooter />
        </div>
        <HomeBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Home;
