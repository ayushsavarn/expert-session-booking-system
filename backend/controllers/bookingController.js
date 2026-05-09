import Booking from '../models/Booking.js';
import Expert from '../models/Expert.js';

export const createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    const dateSlots = expert.availableSlots.find(s => s.date === date);
    if (!dateSlots) {
      return res.status(400).json({
        success: false,
        message: 'No slots available for this date'
      });
    }

    const slot = dateSlots.slots.find(s => s.time === timeSlot);
    if (!slot) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot'
      });
    }

    if (slot.isBooked) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked'
      });
    }

    const booking = new Booking({
      expertId,
      name,
      email,
      phone,
      date,
      timeSlot,
      notes
    });

    await booking.save();

    await Expert.updateOne(
      { _id: expertId, 'availableSlots.date': date },
      { $set: { 'availableSlots.$.slots.$[slot].isBooked': true } },
      { arrayFilters: [{ 'slot.time': timeSlot }] }
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('slotBooked', {
        expertId,
        date,
        timeSlot,
        bookingId: booking._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked'
      });
    }
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, Confirmed, or Completed'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('expertId', 'name category');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('bookingStatusUpdated', {
        bookingId: booking._id,
        status: booking.status
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { name, phone, notes } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { name, phone, notes },
      { new: true, runValidators: true }
    ).populate('expertId', 'name category');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Free up the slot in the Expert model
    await Expert.updateOne(
      { _id: booking.expertId, 'availableSlots.date': booking.date },
      { $set: { 'availableSlots.$.slots.$[slot].isBooked': false } },
      { arrayFilters: [{ 'slot.time': booking.timeSlot }] }
    );

    await booking.deleteOne();

    const io = req.app.get('io');
    if (io) {
      io.emit('slotFreed', {
        expertId: booking.expertId,
        date: booking.date,
        timeSlot: booking.timeSlot
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const { email } = req.query;

    const query = {};
    if (email) {
      query.email = email;
    }

    const bookings = await Booking.find(query)
      .populate('expertId', 'name category experience rating')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    next(error);
  }
};