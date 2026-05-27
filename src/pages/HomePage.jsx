import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import CTASection from '../components/layout/CTASection';
import Portfolio from '../components/layout/Portfolio';
import Footer from '../components/layout/Footer';

import Stats from '../components/layout/Stats';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Portfolio />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
