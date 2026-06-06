import React, { useState, useEffect, useRef } from 'react';

interface Testimonial {
  name: string;
  title: string;
  relationship: string;
  date: string;
  text: string;
  linkedinUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Anmol Gupta',
    title: 'ISB PGPYL Co\'27 | Top 1%iler in CAT, XAT, SNAP | Ex Consulting Engineer @Cisco',
    relationship: 'Worked with Sreshtha at Cisco',
    date: 'September 23, 2025',
    text: `I had the pleasure of working with Sreshtha when I was working at Cisco. He designed and shipped sophisticated automation that reduced project delivery time by 40% and enabled zero-downtime migrations across major customers like Bank of America. Sreshtha's deep technical expertise and innovative problem-solving enabled him to proactively eliminate single points of failure—such as automating critical maintenance workflows—improving overall system reliability and team stability. He regularly mentored junior engineers, sharing knowledge and raising the team's technical bar. His continuous strive to learn, improve, and adapt new technologies makes him a standout contributor. Professional, collaborative, and deeply dependable.`,
    linkedinUrl: 'https://www.linkedin.com/in/anmol-gupta-isb/',
  },
  {
    name: 'Vama Sethia',
    title: 'Strategy & Operations at Meesho | IIM Lucknow | NMIMS Mumbai',
    relationship: 'Worked with Sreshtha at Neoperk',
    date: 'September 23, 2025',
    text: `I had the pleasure of working closely with Sreshtha, and I can confidently say he is one of the most talented and driven software engineers I've come across. His technical expertise, combined with his ability to think strategically and deliver impactful solutions, truly sets him apart. What stands out most about Sreshtha is his ability to take ownership of complex problems, his attention to detail, and his unwavering commitment to delivering high-quality results. He is also an excellent collaborator who brings energy and positivity to any team he's part of. I highly recommend Sreshtha for any role that demands technical depth, creative problem-solving, and a strong sense of ownership.`,
    linkedinUrl: 'https://www.linkedin.com/in/vama-sethia/',
  }
];

const QuoteIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" opacity={0.15}>
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
  </svg>
);

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchTo = (idx: number) => {
    if (idx === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsAnimating(false);
    }, 300);
  };

  // Auto-rotate every 8 seconds
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  // Reset auto-play timer on manual switch
  const handleManualSwitch = (idx: number) => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    switchTo(idx);
    autoPlayRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);
  };

  const current = testimonials[activeIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Testimonial Card */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '40px 36px 36px',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Background decorative quote */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          opacity: 0.6,
          color: 'var(--accent)',
        }}>
          <QuoteIcon size={48} />
        </div>

        {/* Testimonial body */}
        <div
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          {/* Quote text */}
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.75',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            marginBottom: '28px',
            position: 'relative',
            zIndex: 1,
          }}>
            "{current.text}"
          </p>

          {/* Author info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderTop: '1px solid var(--card-border)',
            paddingTop: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                }}>
                  {current.name}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                  maxWidth: '400px',
                  lineHeight: '1.4',
                }}>
                  {current.title}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--accent-secondary)',
                  marginTop: '4px',
                  fontWeight: 500,
                }}>
                  {current.relationship} • {current.date}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        alignItems: 'center',
      }}>
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleManualSwitch(idx)}
            aria-label={`View testimonial ${idx + 1}`}
            style={{
              width: activeIndex === idx ? '28px' : '10px',
              height: '10px',
              borderRadius: '5px',
              border: 'none',
              background: activeIndex === idx ? 'var(--accent)' : 'var(--card-border)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};
