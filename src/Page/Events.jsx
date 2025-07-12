import React from "react";

const events = [
  {
    id: 1,
    title: "Summer Semester Registration",
    date: "2025-08-01",
    description: "Registration for the new summer semester has started. Register now!",
  },
  {
    id: 2,
    title: "Industrial Visit - Borak Industries",
    date: "2025-08-15",
    description: "An industrial visit has been arranged for students. Fill out the form to participate.",
  },
  {
    id: 3,
    title: "Mid-Term Exams",
    date: "2025-09-10",
    description: "Mid-term exams will commence soon. Be prepared and check the schedule carefully.",
  },
  {
    id: 4,
    title: "Annual Sports Meet",
    date: "2025-10-05",
    description: "Join us for the annual sports meet and showcase your talents!",
  },
  {
    id: 5,
    title: "Project Submission Deadline",
    date: "2025-10-20",
    description: "Final date for submitting semester projects. Make sure to submit on time.",
  },
];

const Events = () => {
  return (
    <section className="py-16 bg-white rounded-2xl">
      <div className="max-w-full mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-primary mb-12">
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {events.map(({ id, title, date, description }) => (
            <div
              key={id}
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
