export const validateBooking = (req, res, next) => {
  const { expertId, name, email, phone, date, timeSlot } = req.body;
  const errors = [];

  if (!expertId) {
    errors.push('Expert ID is required');
  }

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!phone || phone.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!date) {
    errors.push('Date is required');
  }

  if (!timeSlot) {
    errors.push('Time slot is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Completed'];

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be Pending, Confirmed, or Completed'
    });
  }

  next();
};