
import React from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CTA } from '@/components/CTA';

const teamMembers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "CEO & Founder",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "CTO",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
  }
];

const highlights = [
  {
    id: 1,
    icon: "fa-robot",
    title: "Advanced AI",
    description: "State-of-the-art algorithms for optimal trading strategies"
  },
  {
    id: 2,
    icon: "fa-shield-halved",
    title: "SEBI Compliant",
    description: "Fully regulated and secure trading infrastructure"
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        <section className="pt-16">
          <div className="relative h-[400px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/06648f16e6-1dfe86fc0181ffab6567.png" 
              alt="modern trading dashboard with charts and data visualization, dark theme, futuristic" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-gray-900"></div>
            <div className="relative h-full flex flex-col justify-end p-6">
              <h1 className="text-3xl font-bold mb-2">About us</h1>
              <p className="text-gray-300">Empowering Indian traders with AI-driven algorithmic trading solutions</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-8">
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-3">Our Mission</h2>
              <p className="text-gray-300">
                Democratizing algorithmic trading for Indian retail investors through cutting-edge AI technology and user-friendly solutions.
              </p>
            </div>

            <div className="space-y-4">
              {highlights.map((highlight) => (
                <div 
                  key={highlight.id}
                  className="bg-gradient-to-r from-cyan/10 to-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <i className={`fa-solid ${highlight.icon} text-cyan text-2xl mb-3`}></i>
                  <h3 className="font-bold mb-2">{highlight.title}</h3>
                  <p className="text-sm text-gray-300">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 bg-gray-800/30">
          <h2 className="text-xl font-bold mb-6">Leadership Team</h2>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="flex items-center space-x-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700"
              >
                <img 
                  src={member.image} 
                  className="w-16 h-16 rounded-full object-cover"
                  alt={member.name}
                />
                <div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-cyan">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <CTA />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default AboutPage;
