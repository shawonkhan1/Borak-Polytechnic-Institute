import React, { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Loading from "../Share/Loading";

const Events = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosSecure.get("/events"); 
        const allEvents = res.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

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

  if (loading) return <Loading></Loading>;
  if (events.length === 0) return "";

  return (
    <section className="py-16 bg-white rounded-2xl">
      <div className="max-w-full mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-12">
          Upcoming Events
        </h2>

        <div className="grid  grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {events.map(({ _id, title, date, description }) => (
            <div
              key={_id}
              className="bg-gray-100 rounded-lg p-6  shadow-md hover:shadow-xl transition-shadow duration-300 min-w-[220px]"
            >
              <h3 className="text-2xl font-semibold mb-2 text-blue-600">{title}</h3>
              <p className="text-sm text-black mb-4">
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
