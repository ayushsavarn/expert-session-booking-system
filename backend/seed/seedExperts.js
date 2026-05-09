import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Expert from '../models/Expert.js';

const expertsData = [
  // Startup - Prioritized for Page 1
  {
    name: 'Naval Ravikant',
    category: 'Startup',
    experience: 15,
    rating: 5.0,
    bio: 'Angel investor and startup advisor focused on leverage and building wealth.',
  },
  {
    name: 'Peter Thiel',
    category: 'Startup',
    experience: 15,
    rating: 4.7,
    bio: 'Venture capitalist and contrarian thinker helping startups go from Zero to One.',
  },
  {
    name: 'Paul Graham',
    category: 'Startup',
    experience: 15,
    rating: 5.0,
    bio: 'Founder of Y Combinator, expert in early-stage startups and software engineering.',
  },
  {
    name: 'Reid Hoffman',
    category: 'Startup',
    experience: 15,
    rating: 4.8,
    bio: 'LinkedIn co-founder specializing in blitzscaling and network effects.',
  },
  // Finance
  {
    name: 'Warren Buffett',
    category: 'Finance',
    experience: 15,
    rating: 4.9,
    bio: 'Legendary value investor and chairman of Berkshire Hathaway, sharing insights on long-term wealth building.',
  },
  {
    name: 'Sarah Chen',
    category: 'Finance',
    experience: 8,
    rating: 4.7,
    bio: 'Specializing in cryptocurrency, blockchain assets, and modern portfolio theory.',
  },
  {
    name: 'James Wilson',
    category: 'Finance',
    experience: 12,
    rating: 4.5,
    bio: 'Tax consultant and corporate auditor helping businesses optimize their financial health.',
  },
  // Career
  {
    name: 'Emily Blunt',
    category: 'Career',
    experience: 10,
    rating: 4.8,
    bio: 'Executive coach helping professionals navigate career transitions and leadership roles.',
  },
  {
    name: 'David Goggins',
    category: 'Career',
    experience: 14,
    rating: 5.0,
    bio: 'Performance coach focused on mental toughness and career peak performance.',
  },
  {
    name: 'Linda Sun',
    category: 'Career',
    experience: 6,
    rating: 4.6,
    bio: 'Resume expert and interview coach with a background in Fortune 500 recruiting.',
  },
  // Fitness
  {
    name: 'Alex Johnson',
    category: 'Fitness',
    experience: 9,
    rating: 4.9,
    bio: 'Certified strength and conditioning specialist helping athletes reach their potential.',
  },
  {
    name: 'Chloe Ting',
    category: 'Fitness',
    experience: 5,
    rating: 4.7,
    bio: 'Bodyweight training expert and nutritionist specializing in sustainable fat loss.',
  },
  {
    name: 'Chris Heria',
    category: 'Fitness',
    experience: 11,
    rating: 4.8,
    bio: 'Calisthenics master teaching body control and functional strength.',
  },
  // Mental Health
  {
    name: 'Dr. Andrew Huberman',
    category: 'Mental Health',
    experience: 15,
    rating: 5.0,
    bio: 'Neuroscientist and psychologist specializing in stress management and focus.',
  },
  {
    name: 'Mel Robbins',
    category: 'Mental Health',
    experience: 13,
    rating: 4.9,
    bio: 'Anxiety specialist and motivational speaker focused on behavior change.',
  },
  {
    name: 'Jay Shetty',
    category: 'Mental Health',
    experience: 7,
    rating: 4.8,
    bio: 'Mindfulness coach and former monk teaching meditation and inner peace.',
  },
  // Legal
  {
    name: 'Harvey Specter',
    category: 'Legal',
    experience: 15,
    rating: 4.9,
    bio: 'Corporate law specialist expert in high-stakes negotiations and settlements.',
  },
  {
    name: 'Jessica Pearson',
    category: 'Legal',
    experience: 14,
    rating: 4.9,
    bio: 'Managing partner specializing in complex litigation and business ethics.',
  },
  {
    name: 'Mike Ross',
    category: 'Legal',
    experience: 4,
    rating: 4.7,
    bio: 'Legal consultant with an eidetic memory for case law and procedures.',
  },
  // Marketing
  {
    name: 'Gary Vaynerchuk',
    category: 'Marketing',
    experience: 15,
    rating: 4.8,
    bio: 'Social media marketing pioneer and brand building expert.',
  },
  {
    name: 'Neil Patel',
    category: 'Marketing',
    experience: 13,
    rating: 4.7,
    bio: 'SEO guru and digital marketing consultant for Fortune 500 companies.',
  },
  {
    name: 'Seth Godin',
    category: 'Marketing',
    experience: 15,
    rating: 4.9,
    bio: 'Strategic marketing expert focused on permission marketing and leadership.',
  },
  // Tech
  {
    name: 'Marques Brownlee',
    category: 'Tech',
    experience: 11,
    rating: 4.9,
    bio: 'Consumer electronics expert and tech industry analyst.',
  },
  {
    name: 'Grace Hopper',
    category: 'Tech',
    experience: 15,
    rating: 5.0,
    bio: 'Software engineering specialist and computer architecture expert.',
  },
  {
    name: 'Linus Torvalds',
    category: 'Tech',
    experience: 15,
    rating: 4.8,
    bio: 'Open source specialist and operating systems architect.',
  },
  // Startup (extra)
  {
    name: 'Naval Ravikant',
    category: 'Startup',
    experience: 15,
    rating: 5.0,
    bio: 'Angel investor and startup advisor focused on leverage and building wealth.',
  },
  {
    name: 'Peter Thiel',
    category: 'Startup',
    experience: 15,
    rating: 4.7,
    bio: 'Venture capitalist and contrarian thinker helping startups go from Zero to One.',
  },
  {
    name: 'Reid Hoffman',
    category: 'Startup',
    experience: 15,
    rating: 4.8,
    bio: 'LinkedIn co-founder specializing in blitzscaling and network effects.',
  },
  // HR
  {
    name: 'Simon Sinek',
    category: 'HR',
    experience: 15,
    rating: 4.9,
    bio: 'Leadership expert and organizational culture consultant.',
  },
  {
    name: 'Brene Brown',
    category: 'HR',
    experience: 15,
    rating: 4.9,
    bio: 'Vulnerability and leadership researcher helping teams build trust.',
  },
  {
    name: 'Adam Grant',
    category: 'HR',
    experience: 12,
    rating: 4.8,
    bio: 'Organizational psychologist focused on motivation and original thinking.',
  },
  // Design
  {
    name: 'Jony Ive',
    category: 'Design',
    experience: 15,
    rating: 5.0,
    bio: 'Industrial design legend focused on minimalism and material honesty.',
  },
  {
    name: 'Tobias van Schneider',
    category: 'Design',
    experience: 11,
    rating: 4.7,
    bio: 'Digital product designer and creative director.',
  },
  {
    name: 'Paula Scher',
    category: 'Design',
    experience: 15,
    rating: 4.9,
    bio: 'Graphic designer and partner at Pentagram, expert in typography and identity.',
  }
];

const generateSlots = () => {
  const slots = [];
  const times = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  times.forEach(time => {
    slots.push({
      time,
      isBooked: false
    });
  });

  return slots;
};

const generateAvailableSlots = () => {
  const availableSlots = [];
  const today = new Date();

  // Generate slots for the next 10 days
  for (let i = 1; i <= 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    availableSlots.push({
      date: dateStr,
      slots: generateSlots()
    });
  }

  return availableSlots;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://user:pass@cluster.mongodb.net/expertbook');
    console.log('Connected to MongoDB');

    // 1. Clear existing experts
    await Expert.deleteMany({});
    console.log('Cleared existing experts');

    // 2. Prepare experts with slots
    const finalExperts = expertsData.map(expert => ({
      ...expert,
      availableSlots: generateAvailableSlots()
    }));

    // 3. Insert experts
    const createdExperts = await Expert.insertMany(finalExperts);
    console.log(`Successfully seeded ${createdExperts.length} experts!`);

    console.log('Seeding process completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();