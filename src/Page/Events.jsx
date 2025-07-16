import React, { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure"; // তোমার axios instance

const Events = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosSecure.get("/events");  // API থেকে GET কল
        const allEvents = res.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // আজকের দিন বা পরের দিনগুলোর ইভেন্ট ফিল্টার করছি
        const upcomingEvents = allEvents.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [axiosSecure]);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;
  if (events.length === 0) return "";

  return (
    <section className="py-16 bg-white rounded-2xl">
      <div className="max-w-full mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-primary mb-12">
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {events.map(({ _id, title, date, description }) => (
            <div
              key={_id}
              className="bg-primary/10 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 min-w-[220px]"
            >
              <h3 className="text-2xl font-semibold mb-2 text-primary">{title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
