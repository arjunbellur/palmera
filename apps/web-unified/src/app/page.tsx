'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-midnight-blue' : 'bg-off-white'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-blue via-forest-green to-midnight-blue opacity-95" />
        
        {/* Gold Palm Fade-in Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[20rem] animate-fade-in">🌴</span>
        </div>

        {/* Header */}
        <header className="relative z-10 px-6 py-6">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">🌴</span>
              <span className="font-heading text-2xl font-bold text-gold tracking-wide">
                PALMERA
              </span>
            </div>

            <div className="flex items-center space-x-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-gold text-xl">{darkMode ? '☀️' : '🌙'}</span>
              </button>

              <Link
                href="/auth/login"
                className="px-6 py-2 text-sm font-semibold text-charcoal bg-gold rounded-button hover:bg-forest-green hover:text-off-white transition-all duration-300 shadow-gold"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="font-heading text-6xl md:text-7xl font-bold text-off-white mb-6 animate-slide-up">
            Escape. Indulge.
            <span className="block text-gold animate-gold-shimmer">Experience.</span>
          </h1>
          
          <p className="text-xl text-sand-beige mb-12 max-w-2xl mx-auto font-body">
            Discover exclusive luxury travel experiences crafted for those who seek the extraordinary.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-gold-xl border border-gold/20">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Where would you like to escape?"
                className="flex-1 px-6 py-4 bg-white/90 rounded-xl text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold font-body"
              />
              <input
                type="date"
                className="px-6 py-4 bg-white/90 rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-gold font-body"
              />
              <button className="px-8 py-4 bg-gold text-charcoal font-semibold rounded-xl hover:bg-forest-green hover:text-off-white transition-all duration-300 shadow-gold">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill={darkMode ? '#F9F7F4' : '#F9F7F4'}
            />
          </svg>
        </div>
      </div>

      {/* Featured Destinations */}
      <section className={`py-20 px-6 ${darkMode ? 'bg-dark-surface' : 'bg-off-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`font-heading text-4xl font-bold mb-4 ${darkMode ? 'text-gold' : 'text-forest-green'}`}>
              Featured Destinations
            </h2>
            <p className={`text-lg ${darkMode ? 'text-sand-beige' : 'text-charcoal'} font-body`}>
              Curated experiences for the discerning traveler
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {['Bali Luxury Villas', 'Maldives Overwater', 'Santorini Sunset'].map((destination, i) => (
              <div
                key={i}
                className={`group rounded-card overflow-hidden shadow-gold-lg hover:shadow-gold-xl transition-all duration-500 ${
                  darkMode ? 'bg-dark-surface-secondary border-2 border-gold/20' : 'bg-white border-2 border-sand-beige'
                } hover:border-gold cursor-pointer`}
              >
                <div className="h-64 bg-gradient-to-br from-forest-green to-midnight-blue relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                    🌴
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`font-heading text-2xl font-bold mb-2 ${darkMode ? 'text-gold' : 'text-forest-green'}`}>
                    {destination}
                  </h3>
                  <p className={`mb-4 ${darkMode ? 'text-sand-beige' : 'text-charcoal'} font-body`}>
                    Indulge in unparalleled luxury and serenity
                  </p>
                  <button className="w-full py-3 px-6 bg-gold text-charcoal font-semibold rounded-button hover:bg-forest-green hover:text-off-white transition-all duration-300">
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Reservations Teaser */}
      <section className={`py-20 px-6 ${darkMode ? 'bg-midnight-blue' : 'bg-forest-green'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-off-white mb-6">
            Your Escape, Your Circle, Your Way
          </h2>
          <p className="text-xl text-sand-beige mb-8 max-w-2xl mx-auto font-body">
            Experience exclusive group travel with our curated packages
          </p>
          <Link
            href="/groups"
            className="inline-block px-8 py-4 bg-gold text-charcoal font-semibold rounded-button hover:bg-white hover:text-forest-green transition-all duration-300 shadow-gold-lg"
          >
            Discover Group Experiences
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 ${darkMode ? 'bg-charcoal' : 'bg-charcoal'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-3xl">🌴</span>
            <span className="font-heading text-xl font-bold text-gold">PALMERA</span>
          </div>
          <p className="text-sand-beige font-body mb-4">
            Escape. Indulge. Experience.
          </p>
          <p className="text-sm text-gray-400">
            © 2025 Palmera. Premium luxury travel experiences.
          </p>
        </div>
      </footer>
    </div>
  );
}
