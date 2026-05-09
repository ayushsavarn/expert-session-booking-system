import { useState, useEffect } from 'react';

const SlotSelector = ({ availableSlots, selectedDate, selectedTime, onSelectSlot, bookedSlots = [] }) => {
  const [activeDate, setActiveDate] = useState('');

  useEffect(() => {
    if (availableSlots?.length > 0 && !activeDate) {
      setActiveDate(availableSlots[0].date);
    }
  }, [availableSlots]);

  useEffect(() => {
    if (selectedDate) {
      setActiveDate(selectedDate);
    }
  }, [selectedDate]);

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available slots at the moment
      </div>
    );
  }

  const currentSlots = availableSlots.find((s) => s.date === activeDate);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const isSlotBooked = (time) => {
    return bookedSlots.some(
      (b) => b.date === activeDate && b.timeSlot === time
    );
  };

  const isSlotSelected = (time) => {
    return selectedDate === activeDate && selectedTime === time;
  };

  return (
    <div>
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-4">
        {availableSlots.map((slot) => (
          <button
            key={slot.date}
            onClick={() => setActiveDate(slot.date)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeDate === slot.date
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formatDate(slot.date)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {currentSlots?.slots?.map((slot) => {
          const booked = slot.isBooked || isSlotBooked(slot.time);

          return (
            <button
              key={slot.time}
              onClick={() => !booked && onSelectSlot(activeDate, slot.time)}
              disabled={booked}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                isSlotSelected(slot.time)
                  ? 'bg-indigo-600 text-white cursor-default'
                  : booked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>

      {currentSlots?.slots?.length > 0 && currentSlots.slots.every((s) => s.isBooked) && (
        <p className="text-center text-gray-500 mt-4">All slots booked for this date</p>
      )}
    </div>
  );
};

export default SlotSelector;