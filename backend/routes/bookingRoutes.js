import express from 'express';
import { createBooking, updateBookingStatus, getBookings, updateBooking, deleteBooking } from '../controllers/bookingController.js';
import { validateBooking, validateStatusUpdate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', validateBooking, createBooking);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.patch('/:id/status', validateStatusUpdate, updateBookingStatus);

export default router;