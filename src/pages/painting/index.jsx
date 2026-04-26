import React, { useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import HeroSection from './components/HeroSection'
import ServiceBadges from './components/ServiceBadges'
import DesignGallery from './components/DesignGallery'
// import ReviewSection from './components/ReviewSection'
// import BookingForm from './components/BookingForm'
import ContactCard from './components/ContactCard'
import ContactFooter from './components/ContactFooter'
import HomeBottomNav from './components/HomeBottomNav'

const NAV_H = '68px'

export default function Painting() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <View>
      <ScrollView
        scrollY
        style={{ height: `calc(100vh - ${NAV_H})` }}
      >
        <View style={{
          background: 'linear-gradient(160deg, rgba(255,240,255,0.8) 0%, rgba(255,250,255,1) 60%)',
        }}>
          <HeroSection onBooking={() => setActiveTab('booking')} />
          <DesignGallery />
          <ServiceBadges />
          {/* <ReviewSection /> */}
          {/* <BookingForm /> */}
          <ContactCard />
          <ContactFooter />
        </View>
      </ScrollView>
      <HomeBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  )
}
