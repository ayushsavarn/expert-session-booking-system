import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Expert from '../models/Expert.js';


const categories = ['Technology', 'Business', 'Health', 'Education', 'Finance', 'Legal', 'Design', 'Marketing'];

const generateSlots = () => {
  const slots = [];
  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      isBooked: Math.random() < 0.3
    });
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:30`,
      isBooked: Math.random() < 0.3
    });
  }

  return slots;
};

const experts = [
  {
    name: 'Dr. Sarah Johnson',
    category: 'Technology',
    experience: 15,
    rating: 4.9,
    bio: 'Expert in software architecture and cloud computing with extensive experience in enterprise solutions.'
  },
  {
    name: 'Michael Chen',
    category: 'Finance',
    experience: 12,
    rating: 4.8,
    bio: 'Certified financial advisor specializing in investment strategies and wealth management.'
  },
  {
    name: 'Emily Williams',
    category: 'Health',
    experience: 10,
    rating: 4.7,
    bio: 'Registered dietitian and wellness coach focused on nutrition and preventive health.'
  },
  {
    name: 'James Anderson',
    category: 'Business',
    experience: 20,
    rating: 4.9,
    bio: 'Business consultant with expertise in strategic planning and organizational development.'
  },
  {
    name: 'Dr. Lisa Martinez',
    category: 'Education',
    experience: 8,
    rating: 4.6,
    bio: 'Educational specialist in curriculum design and learning methodologies.'
  },
  {
    name: 'Robert Taylor',
    category: 'Legal',
    experience: 18,
    rating: 4.8,
    bio: 'Corporate lawyer specializing in contracts, intellectual property, and business law.'
  },
  {
    name: 'Amanda Brown',
    category: 'Design',
    experience: 7,
    rating: 4.7,
    bio: 'UX/UI designer with expertise in user-centered design and brand identity.'
  },
  {
    name: 'David Wilson',
    category: 'Marketing',
    experience: 14,
    rating: 4.8,
    bio: 'Digital marketing strategist specializing in SEO, content marketing, and social media.'
  },
  {
    name: 'Jennifer Lee',
    category: 'Technology',
    experience: 11,
    rating: 4.6,
    bio: 'Full-stack developer and tech mentor specializing in JavaScript and React.'
  },
  {
    name: 'Christopher Davis',
    category: 'Finance',
    experience: 16,
    rating: 4.9,
    bio: 'Tax specialist and financial planner with expertise in personal and business taxation.'
  }
];

const generateAvailableSlots = () => {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    dates.push({
      date: dateStr,
      slots: generateSlots()
    });
  }

  return dates;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Expert.deleteMany({});
    console.log('Cleared existing experts');

    for (const expert of experts) {
      expert.availableSlots = generateAvailableSlots();
    }

    const createdExperts = await Expert.insertMany(experts);
    console.log(`Seeded ${createdExperts.length} experts successfully`);

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();