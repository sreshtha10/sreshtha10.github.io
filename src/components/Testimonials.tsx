import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    title: "Founder's Office @ The Souled Store | Ex - Pilgrim | Ex - Co-founder @ Neoperk",
    relationship: 'Managed Sreshtha at Neoperk',
    date: 'December 10, 2021',
    text: `During his internship, Sreshtha worked on developing an Android Application from scratch and implementing various features within the same. His eagerness to learn and to broaden his skill set is commendable. He has portrayed out of the box thinking abilities and his work is admired by the entire team.`,
    linkedinUrl: 'https://www.linkedin.com/in/vama-sethia/',
  }
];

const QuoteIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" opacity={0.08}>
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
    }, 150);
  };

  // Auto-rotate every 8 seconds
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 150);
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
      }, 150);
    }, 8000);
  };

  const current = testimonials[activeIndex];

  return (
    <div>
      <div
        className="card testimonial-card"
        style={{ padding: '32px' }}
      >
        {/* Background quote icon */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '20px',
          color: 'var(--text-primary)',
        }}>
          <QuoteIcon size={40} />
        </div>

        {/* Testimonial body */}
        <div
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 0.15s ease, transform 0.15s ease',
          }}
        >
          <p className="testimonial-text">
            "{current.text}"
          </p>

          <div className="testimonial-author">
            <div className="testimonial-name">{current.name}</div>
            <div className="testimonial-title">{current.title}</div>
            <div className="testimonial-meta">
              {current.relationship} · {current.date}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="testimonial-nav">
        <button
          onClick={() => handleManualSwitch((activeIndex - 1 + testimonials.length) % testimonials.length)}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="testimonial-dots">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleManualSwitch(idx)}
              aria-label={`View testimonial ${idx + 1}`}
              className={`testimonial-dot ${activeIndex === idx ? 'active' : ''}`}
            />
          ))}
        </div>

        <button
          onClick={() => handleManualSwitch((activeIndex + 1) % testimonials.length)}
          aria-label="Next testimonial"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
