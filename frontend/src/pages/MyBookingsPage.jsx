import { useState, useEffect, useCallback } from 'react';
import { BookingCard, Loading, ErrorMessage } from '../components';
import { loadBookings, cancelBooking, updateBooking } from '../services/api';
import socketService from '../socket';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [searchedEmail, setSearchedEmail] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setSearchedEmail(savedEmail);
    }
  }, []);

  const syncBookings = useCallback(async (emailToSearch) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loadBookings(emailToSearch);
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const onCancelBooking = async (id) => {
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const onUpdateBooking = async (id, data) => {
    try {
      const response = await updateBooking(id, data);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...response.data } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking');
      throw err;
    }
  };

  useEffect(() => {
    if (searchedEmail) {
      syncBookings(searchedEmail);
      socketService.connect();

      socketService.onBookingStatusUpdated((data) => {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === data.bookingId ? { ...b, status: data.status } : b
          )
        );
      });

      return () => {
        socketService.offBookingStatusUpdated();
      };
    }
  }, [searchedEmail, syncBookings]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('userEmail', email);
      setSearchedEmail(email);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

        <form onSubmit={onSubmitSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email to view bookings"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
            >
              Search
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your email is saved locally to easily find your bookings
          </p>
        </form>

        {!searchedEmail ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 text-lg">Enter your email to view your bookings</p>
          </div>
        ) : loading ? (
          <div className="py-20">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => syncBookings(searchedEmail)} />
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found for {searchedEmail}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''} for{' '}
              <span className="font-medium">{searchedEmail}</span>
            </p>
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onDelete={onCancelBooking}
                onUpdate={onUpdateBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;