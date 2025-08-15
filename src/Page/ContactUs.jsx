import React, { useContext, useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const ContactUs = () => {
  const { user } = useContext(AuthContext);
  const form = useRef();

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        user_name: user.displayName || "",
        user_email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_0rhqewi",
        "template_4mtvt7o",
        form.current,
        "6kw1e-y7X9PseBPf4"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Message sent successfully!");
          setFormData({
            user_name: user?.displayName || "",
            user_email: user?.email || "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send message. Check your EmailJS settings.");
        }
      );
  };

  return (
    <div className="bg-gray-50 mt-10 rounded-2xl dark:bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-blue-600 mb-12">
          Contact Us
        </h1>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 space-y-4"
          >
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows="6"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Get in Touch
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Office:</strong> Asulia, Savar, Dhaka
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Support:</strong> shawon505214@gmail.com
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Helpline:</strong> +880 1883717078
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Follow Us
              </h3>
              <div className="flex gap-5 text-white">
                <a
                  href="https://www.facebook.com/MD1Shawon" target="_blank"
                  className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.linkedin.com/login" target="_blank"
                  className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="https://youtu.be/zczxy4Ck7Ik?si=UhLjI8JpTSBgaUmZ" target="_blank"
                  className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
