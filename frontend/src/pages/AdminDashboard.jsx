import { useState, useEffect, useCallback } from 'react';
import { BookingCard, Loading, ErrorMessage } from '../components';
import { loadBookings, cancelBooking, updateBooking } from '../services/api';
import socketService from '../socket';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  const syncAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await loadBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync all bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncAllBookings();
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
  }, [syncAllBookings]);

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

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage all expert session bookings</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {['All', 'Pending', 'Confirmed', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  filter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={syncAllBookings} />
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No bookings found for filter: {filter}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onDelete={onCancelBooking}
                onUpdate={onUpdateBooking}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
