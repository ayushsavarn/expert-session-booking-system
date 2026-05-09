import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loading, ErrorMessage, SlotSelector, BookingForm } from '../components';
import { loadExpert, bookSession, loadBookings } from '../services/api';
import socketService from '../socket';

const ExpertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const syncExpert = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await loadExpert(id);
      setExpert(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expert details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const syncUserBookings = useCallback(async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const response = await loadBookings(userEmail);
        const expertBookings = response.data.filter(
          (b) => b.expertId?._id === id || b.expertId === id
        );
        setBookedSlots(expertBookings);
      }
    } catch (err) {
      console.error('Failed to sync bookings:', err);
    }
  }, [id]);

  useEffect(() => {
    syncExpert();
    syncUserBookings();
    socketService.connect();
    socketService.joinExpertRoom(id);

    socketService.onSlotBooked((data) => {
      if (data.expertId === id) {
        setBookedSlots((prev) => [...prev, { date: data.date, timeSlot: data.timeSlot }]);
      }
    });

    socketService.onSlotFreed((data) => {
      if (data.expertId === id) {
        setBookedSlots((prev) =>
          prev.filter((slot) => !(slot.date === data.date && slot.timeSlot === data.timeSlot))
        );
      }
    });

    return () => {
      socketService.offSlotBooked();
      socketService.offSlotFreed();
    };
  }, [id, syncExpert, syncUserBookings]);

  const onSelectSlot = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingSuccess(null);
    setBookingError(null);
  };

  const onBookSession = async (bookingData) => {
    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(null);

      localStorage.setItem('userEmail', bookingData.email);

      await bookSession(bookingData);
      setBookingSuccess('Session booked successfully!');
      setSelectedDate('');
      setSelectedTime('');
      syncUserBookings();
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book session');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={error} onRetry={syncExpert} />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Expert not found</p>
      </div>
    );
  }

  const categoryColors = {
    Career: 'bg-blue-100 text-blue-800',
    Design: 'bg-pink-100 text-pink-800',
    Finance: 'bg-green-100 text-green-800',
    Fitness: 'bg-red-100 text-red-800',
    HR: 'bg-yellow-100 text-yellow-800',
    Legal: 'bg-gray-100 text-gray-800',
    Marketing: 'bg-orange-100 text-orange-800',
    'Mental Health': 'bg-teal-100 text-teal-800',
    Startup: 'bg-purple-100 text-purple-800',
    Tech: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Experts
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{expert.name}</h1>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      categoryColors[expert.category] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {expert.category}
                  </span>
                </div>
                <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-yellow-700">{expert.rating?.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{expert.experience} years of experience</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-gray-600 leading-relaxed">{expert.bio}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Slots</h2>
              <p className="text-sm text-gray-500 mb-4">
                Real-time updates enabled - slots booked by others appear instantly
              </p>
              <SlotSelector
                availableSlots={expert.availableSlots}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectSlot={onSelectSlot}
                bookedSlots={bookedSlots}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            {bookingSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-medium">{bookingSuccess}</p>
                </div>
              </div>
            )}

            {bookingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 font-medium">{bookingError}</p>
                </div>
              </div>
            )}

            <BookingForm
              expertId={id}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSubmit={onBookSession}
              loading={bookingLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailPage;