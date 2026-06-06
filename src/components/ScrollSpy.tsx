import React, { useEffect, useState } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'education', label: 'Education' }
];

export const ScrollSpy: React.FC = () => {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Track the most visible section
        let maxIntersectionRatio = 0;
        let mostVisibleId = '';
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
            maxIntersectionRatio = entry.intersectionRatio;
            mostVisibleId = entry.target.id;
          }
        });

        if (mostVisibleId) {
          setActiveId(mostVisibleId);
        }
      },
      { 
        rootMargin: '-20% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1] 
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="scroll-spy-container">
      {sections.map(({ id, label }) => (
        <a 
          key={id}
          href={`#${id}`}
          className={`scroll-spy-dot ${activeId === id ? 'active' : ''}`}
          aria-label={`Scroll to ${label}`}
        >
          <div className="scroll-spy-tooltip">{label}</div>
        </a>
      ))}
    </div>
  );
};
