import React, { useState } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import HeroSection from './components/HeroSection'
import ServiceBadges from './components/ServiceBadges'
import DesignGallery from './components/DesignGallery'
import ReviewSection from './components/ReviewSection'
import BookingForm from './components/BookingForm'
import ContactCard from './components/ContactCard'
import ContactFooter from './components/ContactFooter'
import HomeBottomNav from './components/HomeBottomNav'

const Divider = () => (
  <View style={{ margin: '0 5.3vw', height: '1px', background: 'rgba(220,200,230,0.5)' }} />
)

export default function Painting() {
  const [activeTab, setActiveTab] = useState('home')

  const handleBooking = () => {
    setActiveTab('booking')
    Taro.pageScrollTo({ selector: '#booking-section', duration: 400 })
  }

  return (
    <View style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, rgba(255,240,255,0.8) 0%, rgba(255,250,255,1) 60%)',
      paddingBottom: '78px',
    }}>
      <HeroSection onBooking={handleBooking} />
      <ServiceBadges />
      <Divider />
      <DesignGallery />
      <Divider />
      <ReviewSection />
      <Divider />
      <BookingForm />
      <Divider />
      <ContactCard />
      <ContactFooter />
      <HomeBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  )
}
