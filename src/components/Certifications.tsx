import React from 'react';

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

const certifications: Certification[] = [
  {
    name: 'Data Science @Cisco Generative AI Blue Belt',
    issuer: 'Cisco',
    date: 'Jul 2024',
  },
  {
    name: 'Cisco Certified DevNet Associate',
    issuer: 'Cisco',
    date: 'Jun 2023',
  },
  {
    name: 'CCNA — Routing & Switching',
    issuer: 'Cisco',
    date: '2023',
  },
  {
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2023',
  },
  {
    name: 'Python for Data Science',
    issuer: 'IBM',
    date: '2022',
  },
  {
    name: 'Machine Learning Specialization',
    issuer: 'Stanford / Coursera',
    date: '2022',
  },
];

export const Certifications: React.FC = () => {
  return (
    <div className="certs-grid">
      {certifications.map((cert, idx) => (
        <div key={idx} className="card cert-card">
          <div className="cert-name">{cert.name}</div>
          <div className="cert-issuer">{cert.issuer}</div>
          <div className="cert-date">{cert.date}</div>
        </div>
      ))}
    </div>
  );
};
