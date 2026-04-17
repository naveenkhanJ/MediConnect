import { AppContext } from '@/context/AppContext';
import { useContext, useState } from 'react';



export default function AppointmentView({
  docInfo,
  docSlot,
  selectedDate,
  setSelectedDate,
  slotTime,
  setSlotTime,
}) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Determine consultation type based on doctor's setting
  // If BOTH → user selects; if ONLINE/PHYSICAL only → auto-set, no UI shown
  const getInitialConsultType = () => {
    if (docInfo?.consultationType === 'ONLINE') return 'ONLINE';
    if (docInfo?.consultationType === 'PHYSICAL') return 'PHYSICAL';
    return 'ONLINE'; // default for BOTH
  };
  const [consultationType, setConsultationType] = useState(getInitialConsultType);

const handleBookAppointment = async () => {
  if (!user) {
    window.location.href = '/Auth/login';
    return;
  }

  if (!slotTime) {
    alert('Please select a time slot');
    return;
  }

  // Get the selected date object from the slot
  const selectedDateObj = docSlot[selectedDate]?.slots[0]?.datetime;
  if (!selectedDateObj) {
    alert('Please select a date');
    return;
  }

  // Format date as YYYY-MM-DD
  const year = selectedDateObj.getFullYear();
  const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDateObj.getDate()).padStart(2, '0');
  const appointmentDate = `${year}-${month}-${day}`;

  setLoading(true);
  setMessage('');

  try {
    const response = await fetch('http://localhost:4000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: user.id,
        doctorId: docInfo.id,
        appointmentDate: appointmentDate,
        timeSlot: slotTime,
        consultationType: consultationType
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || 'Booking failed');
      return;
    }

    // Save payment info to localStorage so the payment page can read it
    localStorage.setItem('pendingPayment', JSON.stringify(data.payment));
    localStorage.setItem('pendingAppointment', JSON.stringify(data.appointment));

    // Redirect to payment page
    window.location.href = `/payment/${data.appointment.id}`;

  } catch (error) {
    setMessage('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};


  if (!docInfo) return <p>Loading...</p>;

  return (
    <div className="p-6 mt-20 bg-gray-50 min-h-screen">
      {/* Doctor Info */}
      <div className="flex gap-6 bg-white p-6 rounded-lg shadow">
        <img
          src={docInfo.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(docInfo.fullName)}&background=5F6FFF&color=fff&size=200&rounded=true`}
          alt={docInfo.fullName}
          className="bg-[#5F6FFF] w-full sm:max-w-72 rounded-lg object-cover"
          style={{ width: 180, height: 160 }}
        />

        <div className="flex-1 border border-gray-200 py-7 p-8 bg-white rounded-lg">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.fullName}
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Verified</span>
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.category}</p>
            <span>·</span>
            <p>{docInfo.speciality}</p>
            <span>·</span>
            <p>{docInfo.experience}</p>
          </div>
          <p className="text-sm text-gray-600 max-w-[700px] mt-2">{docInfo.bio}</p>
          <p className="mt-3 text-gray-800 font-semibold">
            Appointment fee: <span className="text-[#5F6FFF]">Rs. {docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Slots */}
      <div className="bg-white rounded-lg shadow mt-6 p-6">
        <p className="text-base font-bold text-gray-800 mb-4">Booking Slot</p>

        {docSlot.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-3">📅</div>
            <p className="font-medium text-gray-500">No availability scheduled</p>
            <p className="text-sm mt-1">This doctor has not set up their availability yet. Please check back later.</p>
          </div>
        ) : (
          <>
            {/* Date Pills */}
            <div className="flex gap-3 overflow-x-scroll items-center pb-2">
              {docSlot.map((item, index) => {
                const isToday = item.dateStr === new Date().toISOString().split("T")[0];
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    className={`min-w-[70px] text-center cursor-pointer py-4 px-3 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                      selectedDate === index
                        ? "bg-[#5F6FFF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <p className="font-bold text-xs uppercase">
                      {isToday ? "Today" : daysOfWeek[item.date.getDay()]}
                    </p>
                    <p className="text-base mt-1">{item.date.getDate()}</p>
                    <p className="text-[10px] opacity-70">{item.date.toLocaleString("default", { month: "short" })}</p>
                  </div>
                );
              })}
            </div>

            {/* Time Slot Pills */}
            {docSlot[selectedDate]?.slots.length === 0 ? (
              <div className="mt-4 py-6 text-center text-gray-400 text-sm bg-gray-50 rounded-lg">
                No more available slots for this day.
              </div>
            ) : (
              <div className="flex items-center py-2 max-w-[800px] gap-3 mt-4 overflow-x-scroll">
                {docSlot[selectedDate]?.slots.map((slot, i) => (
                  <p
                    key={i}
                    onClick={() => setSlotTime(slot.time)}
                    className={`px-5 py-2 cursor-pointer text-sm font-medium flex-shrink-0 rounded-full transition-colors ${
                      slotTime === slot.time
                        ? "bg-[#5F6FFF] text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {slot.time}
                  </p>
                ))}
              </div>
            )}
          </>
        )}

        {/* Consultation Type Selector */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Consultation Type</p>

          {/* BOTH — show toggle so user can choose */}
          {docInfo.consultationType === 'BOTH' && (
            <div className="flex gap-3">
              <button
                onClick={() => setConsultationType('ONLINE')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  consultationType === 'ONLINE'
                    ? 'bg-[#5F6FFF] text-white border-[#5F6FFF]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#5F6FFF]'
                }`}
              >
                💻 Online
              </button>
              <button
                onClick={() => setConsultationType('PHYSICAL')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  consultationType === 'PHYSICAL'
                    ? 'bg-[#5F6FFF] text-white border-[#5F6FFF]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#5F6FFF]'
                }`}
              >
                🏥 In-Person
              </button>
            </div>
          )}

          {/* ONLINE only — fixed, no selection */}
          {docInfo.consultationType === 'ONLINE' && (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium w-fit">
              💻 Online Consultation Only
            </div>
          )}

          {/* PHYSICAL only — fixed, no selection */}
          {docInfo.consultationType === 'PHYSICAL' && (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium w-fit">
              🏥 In-Person Only
            </div>
          )}
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookAppointment}
          disabled={loading}
          className="mt-6 px-10 py-3 bg-[#5F6FFF] text-white rounded-full text-sm font-medium hover:bg-[#4a5ce6] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>

        {message && (
          <p className="mt-3 text-red-500 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}