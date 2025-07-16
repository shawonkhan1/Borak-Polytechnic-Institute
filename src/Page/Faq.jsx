import React, { useState } from "react";

const faqData = [
  {
    question: "What courses do you offer?",
    answer:
      "We offer a wide range of courses including programming, web development, data science, and more.",
  },
  {
    question: "How can I enroll in a course?",
    answer:
      "You can enroll by signing up on our platform and selecting the course you want to join.",
  },
  {
    question: "Are there any fees?",
    answer:
      "Some courses are free, while others require payment. Check individual course pages for details.",
  },
  {
    question: "Can I get a certificate?",
    answer:
      "Yes, after successful completion of certain courses, you will receive a certificate.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close if same clicked
    } else {
      setActiveIndex(index); // Open clicked one
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow mt-10">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-300 rounded-lg overflow-hidden text-black">
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
              onClick={() => toggleIndex(index)}
            >
              <span className="text-lg font-medium text-black">{item.question}</span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {activeIndex === index && (
              <div className="px-6 py-4 border-t border-gray-300 text-gray-700 bg-gray-50">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
