import { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Code2,
  Mail,
  FileText,
  Award,
  Layers,
  Cpu,
  Database,
  Menu,
  X,
  MessageSquareQuote
} from 'lucide-react';

import resumePdf from './assets/resume.pdf';
import heroDp from './assets/hero_dp.png';
import ciscoLogo from './assets/cisco.svg';

// Import custom components
import { CursorTrajectoryProvider } from './context/CursorTrajectoryContext';
import { MagneticButton } from './components/MagneticButton';
import { CanvasRain } from './components/CanvasRain';
import { CanvasSunshine } from './components/CanvasSunshine';
import { ThunderFlash } from './components/ThunderFlash';
import { SunshineAmbient } from './components/SunshineAmbient';

import { Testimonials } from './components/Testimonials';
import { ScrollSpy } from './components/ScrollSpy';

// Inline Custom SVG Logos representing organizations
const ManipalLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ArmySchoolLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SkillBadge = ({ text }: { text: string }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '8px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      fontSize: '0.8rem',
      fontWeight: 500,
      color: 'var(--text-primary)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}
  >
    {text}
  </span>
);

function App() {
  const [theme, setTheme] = useState<'sunny' | 'noir'>('sunny');
  // Rain is for Noir theme, Sunshine is for Sunny theme
  const [rainState, setRainState] = useState<'active' | 'fading' | 'stopped'>('stopped');
  // Track sunshine animation (intro fade effect)
  const [sunshineState, setSunshineState] = useState<'active' | 'fading' | 'stopped'>('active');
  // Mobile menu control state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Track previous theme to determine transition direction
  const prevThemeRef = useRef<'sunny' | 'noir'>(theme);

  // Sync theme changes with DOM node attributes for styling selectors
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    // Rain only triggers when switching TO noir, or on initial noir load
    const isInitialLoad = prevThemeRef.current === theme;
    const isSwitchingToNoir = prevThemeRef.current === 'sunny' && theme === 'noir';
    const isSwitchingToSunny = prevThemeRef.current === 'noir' && theme === 'sunny';

    if ((theme === 'noir' && isInitialLoad) || isSwitchingToNoir) {
      setRainState('active');
      setSunshineState('stopped');
    }

    if (isSwitchingToSunny) {
      setSunshineState('active');
      setRainState('stopped');
    }

    prevThemeRef.current = theme;
  }, [theme]);

  // Rain sequence timers: 2.5s active rain, then 1.5s fading
  useEffect(() => {
    if (rainState !== 'active') return;

    const fadeTimer = setTimeout(() => {
      setRainState('fading');
    }, 2500);

    const stopTimer = setTimeout(() => {
      setRainState('stopped');
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(stopTimer);
    };
  }, [rainState]);

  // Sunshine intro: 3s active, then 1.5s fading
  useEffect(() => {
    if (sunshineState !== 'active') return;

    const fadeTimer = setTimeout(() => {
      setSunshineState('fading');
    }, 3000);

    const stopTimer = setTimeout(() => {
      setSunshineState('stopped');
    }, 4500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(stopTimer);
    };
  }, [sunshineState]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'sunny' ? 'noir' : 'sunny'));
  };

  const skillCategories = [
    {
      id: 'ai',
      title: 'AI & Machine Learning',
      icon: <Cpu size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Developing LLM agents, dynamic orchestrations, and context architectures.',
      skills: ['LangChain', 'LangGraph', 'LangSmith', 'MCP', 'OpenAI APIs', 'A2A', 'Model Inference']
    },
    {
      id: 'fullstack',
      title: 'Full Stack Architecture',
      icon: <Code2 size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Architecting distributed APIs, database schemas, and responsive client structures.',
      skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Node.js', 'React', 'TypeScript', 'JavaScript']
    },
    {
      id: 'data',
      title: 'Data & Observability',
      icon: <Database size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Building scalable telemetry, real-time search platforms, and high-volume data layers.',
      skills: ['ElasticSearch', 'OpenSearch', 'Postgres', 'MongoDB', 'Kafka', 'Redis', 'Splunk', 'Grafana', 'Kibana']
    },
    {
      id: 'cloud',
      title: 'Cloud & Infrastructure',
      icon: <Layers size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Automating deployment pipelines, container orchestration, and environment configuration.',
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'Linux', 'Nginx', 'Ansible', 'Git', 'CCNA']
    }
  ];



  return (
    <CursorTrajectoryProvider>
      {/* Background Canvas weather animation: Renders during active/fading states on load or theme switch */}
      {rainState !== 'stopped' && (
        <CanvasRain isFading={rainState === 'fading'} />
      )}

      {/* Thunder effect triggers only during Noir theme switch (when rain is active) */}
      {theme === 'noir' && rainState !== 'stopped' && (
        <ThunderFlash />
      )}

      {/* Sunny intro ambient effect */}
      {sunshineState !== 'stopped' && (
        <CanvasSunshine isFading={sunshineState === 'fading'} />
      )}

      {/* Persistent sunny ambient effect (like ThunderFlash for noir) */}
      {theme === 'sunny' && sunshineState === 'stopped' && (
        <SunshineAmbient />
      )}

      {/* Floating Scrollspy Navigation */}
      <ScrollSpy />

      <div className="app-container">
        {/* Core Layout filter wrapper */}
        <div className="noir-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>

          {/* Global Header Navigation */}
          <header
            style={{
              borderBottom: '1px solid var(--card-border)',
              backgroundColor: 'var(--card-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              position: 'sticky',
              top: 0,
              zIndex: 40,
            }}
          >
            <div
              className="content-container"
              style={{
                height: '72px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Creative Minimal SaaS logo */}
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  lineHeight: 1
                }}
              >
                Sreshtha.
              </a>

              {/* Navigation Links (Desktop) */}
              <nav className="desktop-nav">
                <a
                  href="#skills"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Skills
                </a>
                <a
                  href="#experience"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Experience
                </a>
                <a
                  href="#projects"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Projects
                </a>
                <a
                  href="#education"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Education
                </a>
                <a
                  href="#testimonials"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Testimonials
                </a>

                <div style={{ width: '1px', height: '20px', background: 'var(--card-border)', margin: '0 8px' }} />

                {/* Social Icons & Theme Toggles */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginRight: '8px' }}>
                  <a
                    href="https://github.com/sreshtha10"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon size={18} />
                  </a>
                  <a
                    href="https://linkedin.com/in/sreshtha-mehrotra"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                </div>

                {/* Theme Switcher Toggle */}
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--card-shadow)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                  }}
                >
                  {theme === 'sunny' ? (
                    <Sun size={18} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                  ) : (
                    <Moon size={18} style={{ color: '#E0E0E0' }} />
                  )}
                </button>
              </nav>

              {/* Hamburger Menu Toggle (Mobile) */}
              <button
                className="mobile-nav-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Navigation Dropdown Drawer */}
            {mobileMenuOpen && (
              <div className="mobile-menu-overlay">
                <a
                  href="#skills"
                  style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Skills
                </a>
                <a
                  href="#experience"
                  style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Experience
                </a>
                <a
                  href="#projects"
                  style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Projects
                </a>
                <a
                  href="#testimonials"
                  style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#education"
                  style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Education
                </a>

                {/* Theme Switcher in Mobile Drawer */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '50%',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--card-shadow)',
                    marginTop: '16px'
                  }}
                >
                  {theme === 'sunny' ? (
                    <Sun size={20} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                  ) : (
                    <Moon size={20} style={{ color: '#E0E0E0' }} />
                  )}
                </button>
              </div>
            )}
          </header>

          {/* Main Portfolio Sections */}
          <main className="content-container" style={{ gap: '96px', paddingBottom: '120px', paddingTop: '48px' }}>

            {/* Hero Greeting Section */}
            <section
              style={{
                alignItems: 'center',
              }}
              className="hero-grid"
            >
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <span style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    Software Engineer II @ Cisco
                  </span>
                </div>

                <h1 className="hero-heading" style={{ marginBottom: '16px', letterSpacing: '-0.02em', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '2.5rem' }}>Hi, I'm</span>
                  <span style={{
                    fontFamily: 'var(--font-signature)',
                    fontSize: 'clamp(4rem, 8vw, 6rem)',
                    color: 'var(--accent)',
                    lineHeight: '1.1',
                    fontWeight: 'normal',
                    textShadow: '0 4px 20px rgba(0,0,0,0.05)'
                  }}>Sreshtha Mehrotra</span>
                </h1>

                <p
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                  }}
                >
                  I design and engineer intelligent microservices.
                </p>

                <p
                  style={{
                    fontSize: '1.05rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '40px',
                    maxWidth: '600px',
                    lineHeight: '1.7'
                  }}
                >
                  I design and engineer scalable, AI-driven microservices. Detail-oriented Software Engineer focused on crafting high-concurrency backend architectures, intelligent observability platforms, and predictive ML pipelines. Combining automated log management, proactive risk assessments, and RESTful APIs supporting 10,000+ users with 99.9% uptime.
                </p>

                {/* Call-to-Action Buttons */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'inherit' }}>
                  <MagneticButton
                    id="btn-download-cv"
                    variant="primary"
                    style={{ padding: '14px 32px' }}
                    href={resumePdf}
                    target="_blank"
                    download="Sreshtha_Mehrotra_Resume.pdf"
                  >
                    <FileText size={16} />
                    <span>Download CV</span>
                  </MagneticButton>
                  <MagneticButton
                    id="btn-contact-me"
                    variant="secondary"
                    style={{ padding: '14px 32px' }}
                    href="mailto:sreshtha.mehrotra@gmail.com"
                  >
                    <Mail size={16} />
                    <span>Contact Me</span>
                  </MagneticButton>
                </div>
              </div>

              {/* Graphical Avatar Card (Zoom image on hover) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '360px',
                    height: '360px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'var(--card-bg)',
                    boxShadow: '0 20px 60px -15px rgba(0,0,0,0.1)'
                  }}
                >
                  <img
                    src={heroDp}
                    alt="Sreshtha Mehrotra Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              </div>
            </section>

            {/* Technical Skills Section: Modern Bento Grid */}
            <section id="skills" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Technical Expertise</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Core technology architectures, frameworks, and programming competencies.</p>
              </div>

              <div className="bento-grid">
                {/* Tile 1: AI & ML Systems (Large) */}
                <div className="bento-card bento-item-ai">
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.05, transform: 'scale(1.5)' }}>
                    <Cpu size={240} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1 }}>
                    <div style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Cpu size={24} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>AI & ML Systems</h3>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '85%' }}>
                      Developing LLM agents, dynamic orchestrations, and context architectures. Building robust pipelines for machine learning models and predictive analytics.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', zIndex: 1 }}>
                    {skillCategories.find(c => c.id === 'ai')?.skills.map((skill, sIdx) => (
                      <SkillBadge key={sIdx} text={skill} />
                    ))}
                  </div>
                </div>

                {/* Tile 2: Backend & Microservices (Wide) */}
                <div className="bento-card bento-item-backend">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1 }}>
                    <div style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Code2 size={20} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Full Stack Architecture</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Architecting distributed APIs, database schemas, and responsive client structures.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', zIndex: 1 }}>
                    {skillCategories.find(c => c.id === 'fullstack')?.skills.map((skill, sIdx) => (
                      <SkillBadge key={sIdx} text={skill} />
                    ))}
                  </div>
                </div>

                {/* Tile 3: Data & Observability (Square) */}
                <div className="bento-card bento-item-frontend">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1 }}>
                    <div style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Database size={20} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Data & Observability</h3>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', zIndex: 1, marginTop: 'auto' }}>
                    {skillCategories.find(c => c.id === 'data')?.skills.map((skill, sIdx) => (
                      <SkillBadge key={sIdx} text={skill} />
                    ))}
                  </div>
                </div>

                {/* Tile 4: Cloud & Infra (Square) */}
                <div className="bento-card bento-item-devops">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1 }}>
                    <div style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Layers size={20} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Cloud & Infra</h3>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', zIndex: 1, marginTop: 'auto' }}>
                    {skillCategories.find(c => c.id === 'cloud')?.skills.map((skill, sIdx) => (
                      <SkillBadge key={sIdx} text={skill} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Career Timeline Section */}
            <section id="experience" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Career History</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Work progression and key engineering milestones.</p>
              </div>

              {/* Unified Cisco Systems Timeline card */}
              <div className="glass-panel" style={{ width: '100%', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px', flexWrap: 'wrap' }}>
                  <div style={{
                    background: '#18181B',
                    color: 'var(--bg-solid)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '48px',
                    width: '64px'
                  }}>
                    <img src={ciscoLogo} alt="Cisco Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Cisco Systems</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Software Engineering Progression • Aug 2023 - Present
                    </div>
                  </div>
                </div>

                {/* Timeline Container */}
                <div style={{ position: 'relative', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {/* Vertical Timeline Line */}
                  <div style={{
                    position: 'absolute',
                    left: '7px',
                    top: '8px',
                    bottom: '8px',
                    width: '2px',
                    background: 'linear-gradient(to bottom, var(--accent) 0%, var(--accent-secondary) 100%)',
                    borderRadius: '1px'
                  }} />

                  {/* Milestone 1: SE2 */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'var(--bg-solid)',
                      border: '3.5px solid var(--accent)',
                      boxShadow: '0 0 10px var(--accent)'
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Software Engineer 2</h4>
                      <span style={{ fontSize: '0.8rem', background: 'var(--card-border)', padding: '4px 12px', borderRadius: '9999px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Sept 2025 - Present
                      </span>
                    </div>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      <li>Led software development of an intelligent infrastructure observability platform enabling natural language queries about health status, providing real-time telemetry integration.</li>
                      <li>Developed predictive analytics platform using Machine Learning models on deployment data to forecast incident risks and future alerts, improving change success rates by 25%.</li>
                      <li>Architected scalable microservices architecture using Python and FastAPI for full-stack deployment, supporting 10,000+ concurrent users with 99.9% uptime.</li>
                    </ul>
                  </div>

                  {/* Milestone 2: SE */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'var(--bg-solid)',
                      border: '3.5px solid var(--accent-secondary)',
                      boxShadow: '0 0 10px var(--accent-secondary)'
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Software Engineer</h4>
                      <span style={{ fontSize: '0.8rem', background: 'var(--card-border)', padding: '4px 12px', borderRadius: '9999px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Sept 2024 - Aug 2025
                      </span>
                    </div>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      <li>Led full-stack development to refactor and modularize large-scale incident management platform UI, implementing microservices architecture to streamline deployment and enable independent scaling.</li>
                      <li>Automated log management and enhanced access controls on centralized systems, deploying RBAC and Python/Ansible pipelines with DevOps practices to boost platform stability by 35%.</li>
                      <li>Implemented CI/CD pipelines using Jenkins and Docker for software development workflows, reducing deployment time from 2 hours to 15 minutes through performance optimization.</li>
                    </ul>
                  </div>

                  {/* Milestone 3: Consulting Engineer */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'var(--bg-solid)',
                      border: '3.5px solid var(--text-secondary)'
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Consulting Engineer</h4>
                      <span style={{ fontSize: '0.8rem', background: 'var(--card-border)', padding: '4px 12px', borderRadius: '9999px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Aug 2023 - Aug 2024
                      </span>
                    </div>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      <li>Automated hardware device migrations using Python and Ansible playbooks integrated with system architectures, eliminating 75% of manual steps and reducing delivery time by 40%.</li>
                      <li>Built full-stack Resource Allocation Manager web application using React, FastAPI, and MongoDB, aligning 100+ engineers with projects.</li>
                      <li>Designed and implemented RESTful APIs serving 500+ daily requests with average response time under 200ms, incorporating unit testing and version control best practices.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Projects Section */}
            <section id="projects" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Featured Projects</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Showcasing intelligent automated code agents.</p>
              </div>

              {/* Project Card: FIRE */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px' }}>
                <div>
                  <div style={{ display: 'inline-flex', background: 'rgba(13, 148, 136, 0.08)', border: '1px solid rgba(13, 148, 136, 0.2)', padding: '4px 12px', borderRadius: '9999px', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px' }}>
                    AI-powered agent
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Fix and Review (FIRE)</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '800px' }}>
                    Developed an AI-powered code agent that automates reviews and generates corrective pull request proposals. Built a machine-learning review pipeline integrating static code analysis and runtime testing with model inference to detect issues, suggest optimizations, and generate review logs, reducing manual review times by 60%.
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '16px', alignItems: 'center' }}>
                  <SkillBadge text="Python" />
                  <SkillBadge text="Machine Learning" />
                  <SkillBadge text="GitHub API" />
                  <SkillBadge text="FastAPI" />
                </div>

                {/* Embedded GitHub Link */}
                <div style={{ marginTop: '8px' }}>
                  <a
                    href="https://github.com/sreshtha10/FIRE"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      border: '1px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--card-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <GithubIcon size={16} />
                    <span>View Repository on GitHub</span>
                  </a>
                </div>
              </div>

              {/* Project Card: Blink */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px' }}>
                <div>
                  <div style={{ display: 'inline-flex', background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.2)', padding: '4px 12px', borderRadius: '9999px', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px' }}>
                    macOS Native App
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Blink</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '800px' }}>
                    A native macOS productivity application built with Swift and SwiftUI. Designed to streamline daily workflows with intelligent automation, keyboard-first navigation, and seamless system integration. Features a minimal, distraction-free interface optimized for developer efficiency.
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '16px', alignItems: 'center' }}>
                  <SkillBadge text="Swift" />
                  <SkillBadge text="SwiftUI" />
                  <SkillBadge text="macOS" />
                  <SkillBadge text="AppKit" />
                </div>

                {/* Embedded GitHub Link */}
                <div style={{ marginTop: '8px' }}>
                  <a
                    href="https://github.com/sreshtha10/blink"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      border: '1px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--card-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <GithubIcon size={16} />
                    <span>View Repository on GitHub</span>
                  </a>
                </div>
              </div>
            </section>


            {/* Education & Academic Section */}
            <section id="education" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Education</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Academic achievements and merit records.</p>
              </div>

              <div className="education-grid">
                {/* Manipal University */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{
                      background: 'var(--text-primary)',
                      color: 'var(--bg-solid)',
                      padding: '10px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '44px',
                      width: '44px',
                      flexShrink: 0
                    }}>
                      <ManipalLogo size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Manipal University Jaipur</h3>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        Bachelor of Technology in Computer Science Engineering
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: '6px' }}>
                        CGPA: 9.7 / 10
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Award size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>TMA Pai Merit Scholarship (2019 – 2023)</strong>
                      <div style={{ marginTop: '2px' }}>Awarded for Academic Excellence for consistent high performance throughout the undergraduate program.</div>
                    </div>
                  </div>
                </div>

                {/* Army Public School */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{
                      background: 'var(--text-primary)',
                      color: 'var(--bg-solid)',
                      padding: '10px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '44px',
                      width: '44px',
                      flexShrink: 0
                    }}>
                      <ArmySchoolLogo size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Army Public School</h3>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        Intermediate PCM (CBSE)
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: '6px' }}>
                        Percentage: 96.4%
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Graduated with distinction under CBSE curriculum, specializing in Physics, Chemistry, and Mathematics (PCM).
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                    <MessageSquareQuote size={28} style={{ color: 'var(--accent)' }} />
                    Testimonials
                  </span>
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>What colleagues and peers say about working together.</p>
              </div>

              <Testimonials />
            </section>

          </main>

          {/* Page Footer */}
          <footer
            style={{
              borderTop: '1px solid var(--card-border)',
              backgroundColor: 'var(--card-bg)',
              backdropFilter: 'blur(12px)',
              padding: '32px 0',
              marginTop: 'auto',
              transition: 'background-color 0.5s ease'
            }}
          >
            <div
              className="content-container"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  AI/ML and Full Stack Engineer
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  © {new Date().getFullYear()} All rights reserved.
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <a
                    href="https://github.com/sreshtha10"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <GithubIcon size={18} />
                  </a>
                  <a
                    href="https://linkedin.com/in/sreshtha-mehrotra"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <LinkedinIcon size={18} />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>

      </div>
    </CursorTrajectoryProvider>
  );
}

export default App;
