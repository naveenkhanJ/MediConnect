import { AppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useContext } from 'react';

export default function AppointmentView({
  docInfo,
  docSlot,
  selectedDate,
  setSelectedDate,
  slotTime,
  setSlotTime,
}) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const {doctors, currencySymbol}=useContext(AppContext);

  if (!docInfo) return <p>Loading...</p>;

  return (
    <div className="p-6 mt-20">
      {/* Doctor Info */}
      <div className="flex gap-6 bg-white p-6 rounded-lg shadow">
        <Image src={docInfo.image} alt={docInfo.name}  width={180} height={160} className="bg-[#5F6FFF] w-full sm:max-w-72 rounded-lg" />

        <div className="flex-1 border border-gray-400 py-7 p-8 bg-white rounded-lg ">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name} 
            <Image src={docInfo.verified_icon} alt="Badge" width={5} height={5} /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
          <p>{docInfo.degree}</p>
          <p>{docInfo.speciality}</p>
          <p>{docInfo.experience}</p>
          </div>
          
          <p className=' text-sm font-medium max-w-[700px] mt-1'>{docInfo.about}</p>
          <p className='mt-2 font-bold'>Appointment fee: <span>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/* Slots */}
      <div className=" sm:ml-78 sm:pl-4 mt-6 font-medium  ">
          <p className='text-md font-bold  text-gray-900'>Booking Slot </p>
        <div className="flex gap-3 overflow-x-scroll items-center mt-4">
          {docSlot.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedDate(index)}
              className={`px-4 cursor-pointer py-6 rounded-full  ${
                selectedDate === index ? "bg-[#5F6FFF] text-white" : "bg-gray-200"
              }`}
            >
              {daysOfWeek[item.slots[0]?.datetime.getDay()]}
            </div>
          ))}
        </div>

        <div className="flex items-center py-2 max-w-[800px] cursor-pointer gap-3 mt-4 overflow-x-scroll ">
          {docSlot[selectedDate]?.slots.map((slot, i) => (
            <p
              key={i}
              onClick={() => setSlotTime(slot.time)}
              className={`px-5 py-2  cursor-pointer text-sm items-center font-light flex-shrink-0 rounded-full  ${
                slotTime === slot.time ? "bg-[#5F6FFF] text-white" : " border border-gray-300"
              }`}
            >
              {slot.time}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}