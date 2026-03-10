import Announcements from '@/components/Announcements';
import BigCalendar from '@/components/BigCalender';
import EventCalender from '@/components/EventCalender';
import React from 'react';

const ParentPage = () => {
  return (
    <div className="p-4 flex flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (Jhone Doe)</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
