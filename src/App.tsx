import { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Code2, 
  Mail, 
  FileText,
  Award,
  Layers,
  Server,
  Cpu,
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
import { ObservabilitySandbox } from './components/ObservabilitySandbox';
import { Testimonials } from './components/Testimonials';

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
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
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
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--accent)';
      e.currentTarget.style.transform = 'translateY(-1.5px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--card-border)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
    }}
  >
    {text}
  </span>
);

function App() {
  const [theme, setTheme] = useState<'sunny' | 'noir'>('noir');
  // State machine for rain animation loading/switch sequence
  const [rainState, setRainState] = useState<'active' | 'fading' | 'stopped'>('active');
  // Sunny intro effect state
  const [sunshineState, setSunshineState] = useState<'active' | 'fading' | 'stopped'>('stopped');
  // Mobile menu control state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Skill category filter state
  const [activeSkillCategory, setActiveSkillCategory] = useState<'all' | 'ai' | 'backend' | 'frontend' | 'devops'>('all');
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
    if (rainState === 'stopped') return;

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
    if (sunshineState === 'stopped') return;

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
      title: 'AI & ML Systems',
      icon: <Cpu size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Developing LLM agents, dynamic orchestrations, and context architectures.',
      skills: ['LangChain', 'LangSmith', 'MCP', 'OpenAI APIs', 'A2A', 'Model Inference']
    },
    {
      id: 'backend',
      title: 'Backend & Microservices',
      icon: <Server size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Architecting distributed APIs, database schemas, and caching layers.',
      skills: ['Python', 'FastAPI', 'Spring Boot', 'Java', 'Node.js', 'Redis', 'MongoDB', 'Memgraph', 'MySQL']
    },
    {
      id: 'frontend',
      title: 'Frontend Engineering',
      icon: <Code2 size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Crafting responsive client structures with high-fidelity interactions.',
      skills: ['React', 'TypeScript', 'JavaScript', 'Vite', 'HTML5 / CSS3', 'Figma']
    },
    {
      id: 'devops',
      title: 'DevOps & Infrastructure',
      icon: <Layers size={18} style={{ color: 'var(--accent)' }} />,
      description: 'Automating logs, deployment pipelines, and environment configuration.',
      skills: ['Docker', 'Jenkins', 'Nginx', 'OpenShift', 'Kafka', 'Ansible', 'Git', 'Linux', 'CCNA', 'DevNet']
    }
  ];

  const filterTabs = [
    { id: 'all', label: 'All Fields' },
    { id: 'ai', label: 'AI & ML' },
    { id: 'backend', label: 'Backend' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'devops', label: 'DevOps' }
  ];

  return (
    <CursorTrajectoryProvider>
      {/* Background Canvas weather animation: Renders during active/fading states on load or theme switch */}
      {rainState !== 'stopped' && (
        <CanvasRain isFading={rainState === 'fading'} />
      )}

      {/* Persistent thunder effect in Noir mode (independent of rain intro) */}
      {theme === 'noir' && rainState === 'stopped' && (
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

      <div className="app-container">
        {/* Core Layout filter wrapper */}
        <div className="noir-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
          
          {/* Global Header Navigation */}
          <header 
            style={{
              borderBottom: '1px solid var(--card-border)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
              {/* Creative Minimal wordmark logo */}
              <a 
                href="#" 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em'
                }}
              >
                sreshtha<span style={{ color: 'var(--accent)' }}>.</span>
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
                  href="#playground" 
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Playground
                </a>
                <a 
                  href="#testimonials" 
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Testimonials
                </a>
                <a 
                  href="#education" 
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Education
                </a>

                <div style={{ width: '1px', height: '20px', background: 'var(--card-border)' }} />

                {/* Theme Switcher Toggle */}
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '9999px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: 'var(--card-shadow)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                  }}
                >
                  {theme === 'sunny' ? (
                    <>
                      <Sun size={14} style={{ color: '#FF9800' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Sunny</span>
                    </>
                  ) : (
                    <>
                      <Moon size={14} style={{ color: '#E0E0E0' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Noir</span>
                    </>
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
                  href="#playground" 
                  style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Playground
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
                    borderRadius: '9999px',
                    padding: '10px 24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: 'var(--card-shadow)',
                    marginTop: '16px'
                  }}
                >
                  {theme === 'sunny' ? (
                    <>
                      <Sun size={15} style={{ color: '#FF9800' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Switch to Noir</span>
                    </>
                  ) : (
                    <>
                      <Moon size={15} style={{ color: '#E0E0E0' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Switch to Sunny</span>
                    </>
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
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'var(--card-bg)', 
                    border: '1px solid var(--card-border)',
                    borderRadius: '9999px',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '24px',
                    boxShadow: 'var(--card-shadow)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: theme === 'sunny' ? '#4f46e5' : '#fff', boxShadow: theme === 'sunny' ? '0 0 8px #4f46e5' : '0 0 8px #fff' }} />
                  <span>Software Engineer II @ Cisco</span>
                </div>
                
                <h1 className="hero-heading" style={{ marginBottom: '20px', letterSpacing: '-0.02em' }}>
                  Hi, I'm <span style={{ color: 'var(--accent)', textDecoration: 'underline', textDecorationColor: 'var(--accent-secondary)' }}>Sreshtha Mehrotra</span>.
                  <br />I design and engineer intelligent microservices.
                </h1>
                
                <p 
                  style={{ 
                    fontSize: '1.05rem', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '40px',
                    maxWidth: '600px',
                    lineHeight: '1.7'
                  }}
                >
                  Detail-oriented Software Engineer focused on crafting high-concurrency backend services, microservices architectures, and observability networks. Combining structured telemetry, predictive risk assessments, and zero-lag clients.
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
                  className="glass-panel" 
                  style={{ 
                    width: '320px', 
                    height: '320px', 
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '3px solid var(--accent)',
                    boxShadow: 'var(--card-shadow)',
                    padding: 0
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

            {/* Technical Skills Section with Interactive Category Filter Dashboard */}
            <section id="skills" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Technical Expertise</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Core technology architectures, frameworks, and programming competencies.</p>
              </div>

              {/* Interactive Skill Dashboard Filters */}
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  flexWrap: 'wrap', 
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  padding: '6px',
                  borderRadius: '12px',
                  alignSelf: 'flex-start',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSkillCategory(tab.id as any)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: activeSkillCategory === tab.id ? 'var(--accent)' : 'transparent',
                      color: activeSkillCategory === tab.id ? 'var(--bg-solid)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Responsive Skills grid layout */}
              <div className="skills-grid">
                {skillCategories.map((cat, idx) => {
                  const isMatch = activeSkillCategory === 'all' || activeSkillCategory === cat.id;

                  return (
                    <div 
                      key={idx} 
                      className="glass-panel skill-category-card" 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '16px', 
                        height: '100%', 
                        justifyContent: 'space-between',
                        opacity: isMatch ? 1 : 0.3,
                        transform: isMatch ? 'scale(1)' : 'scale(0.97)',
                        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        pointerEvents: isMatch ? 'auto' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {cat.icon}
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{cat.title}</h3>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          {cat.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                        {cat.skills.map((skill, sIdx) => (
                          <SkillBadge key={sIdx} text={skill} />
                        ))}
                      </div>
                    </div>
                  );
                })}
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
                  <div style={{ display: 'inline-flex', background: 'rgba(13, 148, 136, 0.08)', border: '1px solid rgba(13, 148, 136, 0.2)', padding: '4px 12px', borderRadius: '9999px', color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px' }}>
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
                    href="https://github.com/sreshtha-mehrotra/FIRE" 
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

            {/* Interactive Playground Section */}
            <section id="playground" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Interactive Playground</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Distributed systems telemetry diagnostics and chaos controls.</p>
              </div>

              {/* Chaos & Observability Simulator */}
              <ObservabilitySandbox />
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
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: '6px' }}>
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

          </main>

          {/* Page Footer */}
          <footer 
            style={{ 
              borderTop: '1px solid var(--card-border)', 
              backgroundColor: 'var(--bg-solid)', 
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Sreshtha Mehrotra
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Systems & Microservices Engineering • sreshtha.mehrotra@gmail.com
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  © {new Date().getFullYear()} All rights reserved.
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a 
                    href="https://github.com/sreshtha-mehrotra" 
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
