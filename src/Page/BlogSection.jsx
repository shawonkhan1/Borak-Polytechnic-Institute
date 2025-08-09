import React, { useEffect, useState } from "react";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("Blog.json")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <section className="px-4 py-12 rounded-2xl mt-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-4xl text-blue-600 font-bold text-center mb-12">
          Latest Blog Posts
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4">{blog.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{blog.author}</span>
                  <span>{blog.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
