import mongoose from 'mongoose';

const availableSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  slots: [{
    time: String,
    isBooked: {
      type: Boolean,
      default: false
    }
  }]
}, { _id: false });

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Finance',
      'Career',
      'Fitness',
      'Mental Health',
      'Legal',
      'Marketing',
      'Tech',
      'Startup',
      'HR',
      'Design',
      'Technology',
      'Business',
      'Health',
      'Education'
    ]
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  availableSlots: [availableSlotSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

expertSchema.index({ name: 'text' });

export default mongoose.model('Expert', expertSchema);