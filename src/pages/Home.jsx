import React from 'react';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import Portfolio from '../components/layout/Portfolio';
import Achievements from '../components/layout/Achievements';
import Stats from '../components/layout/Stats';
import CTASection from '../components/layout/CTASection';

import About from '../components/layout/About';
import Contact from '../components/layout/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Portfolio />
      <Achievements />
      <Stats />
      <CTASection />
      <Contact />
    </>
  );
};

export default Home;
