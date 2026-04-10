import { questions } from './questions';

// Stream metadata
export const STREAMS = {
  pcm: {
    key: 'pcm',
    name: 'Science – PCM',
    subtitle: 'Physics, Chemistry & Maths',
    icon: '⚛️',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    tagline: 'Engineering & Technology',
    careers: [
      'Software Engineer / Developer',
      'Data Scientist & AI/ML Engineer',
      'Civil / Mechanical Engineer',
      'Aerospace Engineer',
      'Electronics & Communication Engineer',
      'Architect',
      'Research Scientist (Physics/Chemistry)',
      'Defence & ISRO / Space Technology',
    ],
    colleges: ['IITs, NITs, IIITs', 'BITS Pilani', 'VIT, Manipal', 'State Engineering Colleges'],
    description:
      'Science with PCM opens the door to India\'s most sought-after engineering and technology careers. From building apps to designing bridges — this stream is for logical thinkers who love numbers and systems.',
  },
  pcb: {
    key: 'pcb',
    name: 'Science – PCB',
    subtitle: 'Physics, Chemistry & Biology',
    icon: '🧬',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    tagline: 'Medicine & Life Sciences',
    careers: [
      'Doctor (MBBS / MD)',
      'Dentist (BDS)',
      'Pharmacist',
      'Nurse / Healthcare Professional',
      'Biotechnologist',
      'Veterinary Doctor',
      'Physiotherapist',
      'Medical Researcher',
    ],
    colleges: ['AIIMS, JIPMER', 'Government Medical Colleges', 'CMC Vellore', 'Kasturba Medical College'],
    description:
      'Science with PCB is the path to healing and biological discovery. If you\'re drawn to understanding life — from cells to human health — this stream will set you on a deeply rewarding medical or research career.',
  },
  commerce: {
    key: 'commerce',
    name: 'Commerce',
    subtitle: 'Business, Economics & Accountancy',
    icon: '📈',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    tagline: 'Business & Finance',
    careers: [
      'Chartered Accountant (CA)',
      'Company Secretary (CS)',
      'Investment Banker',
      'Entrepreneur / Business Owner',
      'Financial Analyst',
      'Marketing Manager',
      'Human Resources (HR) Manager',
      'E-Commerce & Digital Marketing',
    ],
    colleges: ['SRCC, LSR Delhi', 'Symbiosis, Pune', 'Christ University', 'NMIMS, Mumbai'],
    description:
      'Commerce gives you the tools to understand how the economy, money, and businesses operate. It\'s perfect for those who love numbers in the context of real-world finance and who dream of leading teams or starting ventures.',
  },
  humanities: {
    key: 'humanities',
    name: 'Humanities',
    subtitle: 'History, Political Science & Literature',
    icon: '⚖️',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    tagline: 'Law, Arts & Social Sciences',
    careers: [
      'Lawyer / Advocate',
      'Civil Services Officer (IAS/IPS)',
      'Journalist & Media Professional',
      'Psychologist / Counselor',
      'Teacher / Professor',
      'Author / Content Creator',
      'Social Worker & NGO Leader',
      'Diplomat / Foreign Services',
    ],
    colleges: ['DU, JNU, BHU', 'Ashoka University', 'Symbiosis Law School', 'TISS Mumbai'],
    description:
      'Humanities lets you explore society, culture, language, and the human mind. It\'s the ideal stream for empathetic, curious, and communicative thinkers who want to create change through ideas, law, or public service.',
  },
  polytechnic: {
    key: 'polytechnic',
    name: 'Polytechnic',
    subtitle: 'Diploma in Technical Trades',
    icon: '🔧',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    tagline: 'Hands-on Technical Work',
    careers: [
      'Mechanical Technician / Fitter',
      'Electrical Engineer (Diploma)',
      'Civil Draughtsman',
      'Computer Hardware Engineer',
      'Automotive Technician',
      'HVAC Technician',
      'Welding & Fabrication Expert',
      'Government Technical Jobs (Railways, PSUs)',
    ],
    colleges: ['Government Polytechnic Colleges', 'ITI Institutes', 'NTTF, Bangalore', 'State Polytechnics'],
    description:
      'Polytechnic / Diploma programs are the fastest route to a stable, skilled technical career. If you love working with your hands, fixing real things, and learning practical skills — this path offers early employment and great growth.',
  },
};

/**
 * Calculate stream scores from answers array
 * @param {number[]} answers - Array of 25 ratings (1-5), index 0 = question 1
 * @returns {{ scores: Object, recommended: string, percentages: Object }}
 */
export function calculateScores(answers) {
  // Raw weighted sum per stream
  const rawScores = { pcm: 0, pcb: 0, commerce: 0, humanities: 0, polytechnic: 0 };

  questions.forEach((q, index) => {
    const rating = answers[index] || 0;
    Object.keys(rawScores).forEach((stream) => {
      rawScores[stream] += rating * q.weights[stream];
    });
  });

  // Max possible score per stream (rating 5 × weight sum)
  const maxScores = { pcm: 0, pcb: 0, commerce: 0, humanities: 0, polytechnic: 0 };
  questions.forEach((q) => {
    Object.keys(maxScores).forEach((stream) => {
      maxScores[stream] += 5 * q.weights[stream];
    });
  });

  // Convert to percentages (0–100)
  const percentages = {};
  Object.keys(rawScores).forEach((stream) => {
    percentages[stream] = Math.round((rawScores[stream] / maxScores[stream]) * 100);
  });

  // Find highest scoring stream
  const recommended = Object.keys(percentages).reduce((a, b) =>
    percentages[a] >= percentages[b] ? a : b
  );

  return { rawScores, percentages, recommended };
}
