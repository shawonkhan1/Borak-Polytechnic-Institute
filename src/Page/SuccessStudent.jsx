import { useEffect, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import Loading from "../Share/Loading";

const SuccessStudent = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/SuccessStudent.json") // ❗ No need to include `/public/`
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading testimonials:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading></Loading>
  }

  return (
    <section className=" px-4 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10 text-blue-600">
          🎓 Student Success Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition duration-300 p-6 flex flex-col items-center text-center border border-gray-200"
            >
              <div className="w-24 h-24 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover rounded-full border-4 border-blue-400 shadow-md"
                />
              </div>

              <FaQuoteLeft className="text-blue-500 text-xl mb-2" />
              <p className="text-gray-600 italic mb-4">"{testimonial.comment}"</p>
              <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
              <p className="text-sm text-blue-500 font-medium">{testimonial.course}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStudent;
