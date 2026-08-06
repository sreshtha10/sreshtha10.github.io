import { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Cpu,
  Code2,
  Database,
  Layers,
  FileText,
  Mail,
  Menu,
  X,
  ArrowUpRight,
  Award,
  Users,
  MessageSquareQuote,
} from 'lucide-react';

import resumePdf from './assets/resume.pdf';
import heroDp from './assets/hero.jpeg';
import ciscoLogo from './assets/cisco.svg';

import { CursorTrajectoryProvider } from './context/CursorTrajectoryContext';
import { MagneticButton } from './components/MagneticButton';
import { Testimonials } from './components/Testimonials';
import { Certifications } from './components/Certifications';
import { ScrollSpy } from './components/ScrollSpy';

// Inline SVG Icons
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

const SkillTag = ({ text }: { text: string }) => (
  <span className="skill-tag">{text}</span>
);

// Education SVG icons
const ManipalLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ArmySchoolLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSkillFilter, setActiveSkillFilter] = useState('all');

  // Scroll reveal
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // IntersectionObserver for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const skillCategories = [
    {
      id: 'ai',
      title: 'AI & ML Systems',
      icon: <Cpu size={18} />,
      description: 'LLM agents, orchestration pipelines, and predictive analytics.',
      skills: ['LangChain', 'LangGraph', 'LangSmith', 'MCP', 'OpenAI APIs', 'A2A', 'Model Inference'],
    },
    {
      id: 'fullstack',
      title: 'Full Stack',
      icon: <Code2 size={18} />,
      description: 'Distributed APIs, database schemas, and responsive clients.',
      skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Node.js', 'React', 'TypeScript', 'JavaScript'],
    },
    {
      id: 'data',
      title: 'Data & Observability',
      icon: <Database size={18} />,
      description: 'Scalable telemetry, search platforms, and data pipelines.',
      skills: ['ElasticSearch', 'OpenSearch', 'Postgres', 'MongoDB', 'Kafka', 'Redis', 'Splunk', 'Grafana', 'Kibana'],
    },
    {
      id: 'cloud',
      title: 'Cloud & Infrastructure',
      icon: <Layers size={18} />,
      description: 'Container orchestration, CI/CD pipelines, and config management.',
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'Linux', 'Nginx', 'Ansible', 'Git', 'CCNA'],
    },
  ];

  const filteredSkills = activeSkillFilter === 'all'
    ? skillCategories
    : skillCategories.filter((c) => c.id === activeSkillFilter);

  return (
    <CursorTrajectoryProvider>
      <ScrollSpy />

      <div className="app-container">
        {/* Navigation — Floating Pill */}
        <header className="nav-header">
          <div className="nav-inner">
            <a href="#" className="nav-brand">Sreshtha Mehrotra</a>

            <nav className="nav-pill">
              <a href="#experience">Experience</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#certifications">Certifications</a>
              <a href="#contact">Contact</a>
            </nav>

            <div className="nav-actions">
              <a href="https://github.com/sreshtha10" target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubIcon size={17} />
              </a>
              <a href="https://linkedin.com/in/sreshtha-mehrotra" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinIcon size={17} />
              </a>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            {/* Mobile hamburger */}
            <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href="#certifications" onClick={() => setMobileMenuOpen(false)}>Certifications</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <button className="theme-toggle" onClick={() => { toggleTheme(); setMobileMenuOpen(false); }} style={{ marginTop: '8px' }}>
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        )}

        <main className="content-container">

          {/* ============================================
              Hero Section — Felipe style + Cindy smiley
              ============================================ */}
          <section className="hero-section">
            <div className="hero-smiley">·͜·</div>

            <div className="hero-photo-wrapper">
              <img
                className="hero-photo"
                src={heroDp}
                alt="Sreshtha Mehrotra"
              />
            </div>

            <h1 className="hero-statement">
              <span className="light">I build scalable systems</span>
              <br />
              <span className="bold">that power observability at scale.</span>
            </h1>

            <div className="hero-role">
              Software Engineer II · currently at
              <span className="cisco-badge">
                <img src={ciscoLogo} alt="Cisco" />
                Cisco
              </span>
            </div>

            <div className="hero-buttons">
              <MagneticButton
                id="btn-resume"
                variant="primary"
                href={resumePdf}
                target="_blank"
                download="Sreshtha_Mehrotra_Resume.pdf"
              >
                <FileText size={15} />
                <span>Resume</span>
              </MagneticButton>
              <MagneticButton
                id="btn-contact"
                variant="secondary"
                href="mailto:sreshtha.mehrotra@gmail.com"
              >
                <Mail size={15} />
                <span>Contact</span>
              </MagneticButton>
            </div>

            <div className="hero-metrics">
              <div className="hero-metric">
                <div className="number">3+</div>
                <div className="label">Years at Cisco</div>
              </div>
              <div className="hero-metric">
                <div className="number">25</div>
                <div className="label">Certifications</div>
              </div>
              <div className="hero-metric">
                <div className="number">10K+</div>
                <div className="label">Users Served</div>
              </div>
              <div className="hero-metric">
                <div className="number">9.7</div>
                <div className="label">CGPA</div>
              </div>
            </div>
          </section>

          <hr className="section-divider" />

          {/* ============================================
              Experience
              ============================================ */}
          <section id="experience" className="section reveal" ref={addRevealRef}>
            <div className="section-header">
              <div className="section-label">Career</div>
              <h2 className="section-title">Experience</h2>
            </div>

            {/* Cisco */}
            <div className="experience-company">
              <div className="company-logo">
                <img src={ciscoLogo} alt="Cisco" />
              </div>
              <div className="company-info">
                <h3>Cisco Systems</h3>
                <div className="company-meta">Software Engineering Progression · Aug 2023 – Present</div>
              </div>
            </div>

            <div className="timeline">
              {/* SE2 */}
              <div className="timeline-entry">
                <div className="timeline-dot current" />
                <div className="timeline-role-header">
                  <h4 className="timeline-role-title">Software Engineer 2</h4>
                  <span className="timeline-date">Sep 2025 – Present</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Leading development of Cisco's Observability Agent with A2A integration and complex UI design. Creating supervisor agents and MCP servers for scalable backend services.</li>
                  <li>Architected a predictive analytics ML pipeline forecasting incident risks, improving change success rates by 25%.</li>
                  <li>Engineered scalable FastAPI microservices supporting 10,000+ concurrent users with 99.9% uptime.</li>
                </ul>
              </div>

              {/* SE */}
              <div className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-role-header">
                  <h4 className="timeline-role-title">Software Engineer</h4>
                  <span className="timeline-date">Sep 2024 – Sep 2025</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Developed core services for Cisco's Observability platform, enabling near real-time data processing and improved security with role-based access controls.</li>
                  <li>Migrated monolithic incident management UI to microservices architecture, streamlining deployment.</li>
                  <li>Overhauled CI/CD workflows — reduced deployment latency from 2 hours to 15 minutes.</li>
                </ul>
              </div>

              {/* Consulting Engineer */}
              <div className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-role-header">
                  <h4 className="timeline-role-title">Consulting Engineer</h4>
                  <span className="timeline-date">Aug 2023 – Sep 2024</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Automated VoIP device migrations using Python and Ansible, eliminating 75% of manual steps.</li>
                  <li>Built full-stack Resource Allocation Manager (React, FastAPI, MongoDB), aligning 100+ engineers.</li>
                  <li>Designed RESTful APIs serving 500+ daily requests with &lt;200ms response time.</li>
                </ul>
              </div>

              {/* Intern */}
              <div className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-role-header">
                  <h4 className="timeline-role-title">Technical Undergraduate Intern</h4>
                  <span className="timeline-date">Jan 2023 – Aug 2023</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Built automation tools using Python and Django for network device management workflows.</li>
                </ul>
              </div>
            </div>

            {/* Earlier Roles */}
            <div className="earlier-roles">
              <h4>Earlier Roles</h4>
              <div className="earlier-role-item">
                <div className="earlier-role-info">
                  <div className="earlier-role-title">Android Developer</div>
                  <div className="earlier-role-company">Neoperk Technologies · Freelance</div>
                </div>
                <div className="earlier-role-date">Sep – Dec 2022</div>
              </div>
              <div className="earlier-role-item">
                <div className="earlier-role-info">
                  <div className="earlier-role-title">Software Engineer Intern</div>
                  <div className="earlier-role-company">QuickGhy</div>
                </div>
                <div className="earlier-role-date">May – Aug 2022</div>
              </div>
              <div className="earlier-role-item">
                <div className="earlier-role-info">
                  <div className="earlier-role-title">Software Engineer Intern (Android)</div>
                  <div className="earlier-role-company">Atom EI</div>
                </div>
                <div className="earlier-role-date">Jan 2022</div>
              </div>
              <div className="earlier-role-item">
                <div className="earlier-role-info">
                  <div className="earlier-role-title">Android Developer Intern</div>
                  <div className="earlier-role-company">Neoperk Technologies</div>
                </div>
                <div className="earlier-role-date">Aug – Nov 2021</div>
              </div>
            </div>
          </section>

          <hr className="section-divider" />

          {/* ============================================
              Skills — Filter Pills + Cards
              ============================================ */}
          <section id="skills" className="section reveal" ref={addRevealRef}>
            <div className="section-header">
              <div className="section-label">Expertise</div>
              <h2 className="section-title">Skills</h2>
            </div>

            <div className="skills-filters">
              {[
                { id: 'all', label: 'All' },
                { id: 'ai', label: 'AI & ML' },
                { id: 'fullstack', label: 'Full Stack' },
                { id: 'data', label: 'Data' },
                { id: 'cloud', label: 'Cloud' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  className={`skill-filter-pill ${activeSkillFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setActiveSkillFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="skills-grid">
              {filteredSkills.map((cat) => (
                <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="skill-card-title">
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.icon}</span>
                    <h3>{cat.title}</h3>
                  </div>
                  <p className="skill-card-description">{cat.description}</p>
                  <div className="skill-tags" style={{ marginTop: 'auto' }}>
                    {cat.skills.map((skill, idx) => (
                      <SkillTag key={idx} text={skill} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="section-divider" />

          {/* ============================================
              Projects
              ============================================ */}
          <section id="projects" className="section reveal" ref={addRevealRef}>
            <div className="section-header">
              <div className="section-label">Work</div>
              <h2 className="section-title">Projects</h2>
            </div>

            <div className="projects-grid">
              {/* FIRE */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="project-label ai">AI Agent</span>
                <h3 className="project-title">Fix and Review (FIRE)</h3>
                <p className="project-description">
                  AI-powered code agent that automates reviews and generates corrective pull request proposals. Integrates static analysis and runtime testing with model inference, reducing manual review times by 60%.
                </p>
                <div className="skill-tags" style={{ marginBottom: '16px' }}>
                  <SkillTag text="Python" />
                  <SkillTag text="Machine Learning" />
                  <SkillTag text="GitHub API" />
                  <SkillTag text="FastAPI" />
                </div>
                <a href="https://github.com/sreshtha10/FIRE" target="_blank" rel="noreferrer" className="project-link">
                  <GithubIcon size={15} /> View on GitHub <ArrowUpRight size={13} />
                </a>
              </div>

              {/* Blink */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="project-label app">macOS App</span>
                <h3 className="project-title">Blink</h3>
                <p className="project-description">
                  Native macOS productivity app built with Swift and SwiftUI. Streamlines daily workflows with intelligent automation, keyboard-first navigation, and seamless system integration.
                </p>
                <div className="skill-tags" style={{ marginBottom: '16px' }}>
                  <SkillTag text="Swift" />
                  <SkillTag text="SwiftUI" />
                  <SkillTag text="macOS" />
                  <SkillTag text="AppKit" />
                </div>
                <a href="https://github.com/sreshtha10/blink" target="_blank" rel="noreferrer" className="project-link">
                  <GithubIcon size={15} /> View on GitHub <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </section>

          <hr className="section-divider" />

          {/* ============================================
              Certifications
              ============================================ */}
          <section id="certifications" className="section reveal" ref={addRevealRef}>
            <div className="section-header">
              <div className="section-label">Credentials</div>
              <h2 className="section-title">Certifications</h2>
            </div>
            <Certifications />
          </section>

          <hr className="section-divider" />

          {/* ============================================
              Mentorship
              ============================================ */}
          <section id="mentorship" className="section reveal" ref={addRevealRef}>
            <div className="section-header">
              <div className="section-label">Leadership</div>
              <h2 className="section-title">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={24} style={{ color: 'var(--text-secondary)' }} />
                  Mentorship
                </span>
              </h2>
            </div>

            <div className="card mentorship-content" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Engineering Mentor</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 500, marginTop: '2px' }}>
                    Cisco Women In Tech & Peer Mentorship
                  </div>
                </div>
              </div>
              <ul>
                <li>Mentored junior engineers and university students as part of the <strong>Cisco Women In Tech</strong> program, guiding them through technical challenges and career progression.</li>
                <li>Led technical design reviews and established CI/CD best practices, raising the engineering bar across the team.</li>
                <li>Conducted resume reviews and mock interviews, helping aspiring engineers break into tech.</li>
              </ul>
            </div>
          </section>

          <hr className="section-divider" />

          {/* ============================================
              Testimonials
              ============================================ */}
          <section id="testimonials" className="section reveal" ref={addRevealRef}>
            <div className="section-header">
              <div className="section-label">Feedback</div>
              <h2 className="section-title">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquareQuote size={24} style={{ color: 'var(--text-secondary)' }} />
                  Testimonials
                </span>
              </h2>
            </div>
            <Testimonials />
          </section>

          <hr className="section-divider" />

          {/* ============================================
              Education
              ============================================ */}
          <section id="education" className="section reveal" ref={addRevealRef}>
            <div className="section-header">
              <div className="section-label">Academic</div>
              <h2 className="section-title">Education</h2>
            </div>

            <div className="education-grid">
              <div className="card">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}><ManipalLogo /></span>
                  <div>
                    <div className="edu-institution">Manipal University Jaipur</div>
                    <div className="edu-degree">Bachelor of Technology — Computer Science</div>
                    <div className="edu-grade">9.7 / 10 CGPA</div>
                  </div>
                </div>
                <div className="edu-extra">
                  <Award size={14} style={{ color: 'var(--accent)', verticalAlign: 'middle', marginRight: '4px' }} />
                  <strong>TMA Pai Merit Scholarship (2019–2023)</strong> — Awarded for consistent academic excellence.
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', marginTop: '2px' }}><ArmySchoolLogo /></span>
                  <div>
                    <div className="edu-institution">Army Public School Varanasi</div>
                    <div className="edu-degree">Intermediate PCM (CBSE)</div>
                    <div className="edu-grade">96.4%</div>
                  </div>
                </div>
                <div className="edu-extra">
                  Graduated with distinction under CBSE curriculum, specializing in Physics, Chemistry, and Mathematics.
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* ============================================
            Contact — "Get in touch" footer (Cindy style)
            ============================================ */}
        <section id="contact" className="contact-section">
          <div className="content-container">
            <hr className="section-divider" style={{ marginBottom: '60px' }} />
            <div className="contact-inner">
              <div>
                <div className="section-label">Contact</div>
                <h2 className="contact-heading">Get in touch</h2>
                <p className="contact-subtitle">
                  Have a project in mind or just want to chat? Feel free to reach out.
                </p>
              </div>
              <div>
                <div className="contact-links-label">How to find me</div>
                <div className="contact-links">
                  <a href="mailto:sreshtha.mehrotra@gmail.com" className="contact-link">
                    Email Me <ArrowUpRight size={14} />
                  </a>
                  <a href="https://linkedin.com/in/sreshtha-mehrotra" target="_blank" rel="noreferrer" className="contact-link">
                    LinkedIn <ArrowUpRight size={14} />
                  </a>
                  <a href="https://github.com/sreshtha10" target="_blank" rel="noreferrer" className="contact-link">
                    GitHub <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="content-container">
            <div className="footer-inner">
              <div className="footer-copyright">
                Copyright {new Date().getFullYear()} © Sreshtha Mehrotra
              </div>
              <div className="footer-social">
                <a href="https://github.com/sreshtha10" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <GithubIcon size={16} />
                </a>
                <a href="https://linkedin.com/in/sreshtha-mehrotra" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon size={16} />
                </a>
                <a href="mailto:sreshtha.mehrotra@gmail.com" aria-label="Email">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CursorTrajectoryProvider>
  );
}

export default App;
