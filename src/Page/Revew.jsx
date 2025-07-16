import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Rating from "react-rating";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Revew = () => {
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/teaching-evaluations/all")
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to load reviews", err));
  }, [axiosSecure]);
  
if (reviews.length === 0) return null;
  return (
    <div className="bg-base-200 py-10 px-4">
      <h2 className="text-center text-4xl font-bold text-blue-600 mb-6">
        User Reviews
      </h2>

      <Marquee speed={50} pauseOnHover gradient={false}>
        {reviews.length === 0 && (
          <p className="text-center text-gray-500 w-full">No reviews found.</p>
        )}

        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white shadow-md border border-gray-200 rounded-lg px-6 py-4 mx-3 min-w-[320px] flex items-start gap-4"
          >
            <img
              src={review.photo|| "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}

              alt={review.name || "User Photo"}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <h3 className="text-lg text-black font-bold  mb-1">
                {review.name || "Anonymous"}
              </h3>
              <div className="mb-2">
                <Rating
                  readonly
                  initialRating={review.rating}
                  emptySymbol={<span className="text-lg text-gray-300">☆</span>}
                  fullSymbol={<span className="text-lg text-yellow-400">★</span>}
                />
              </div>
              <p className="text-gray-700 text-sm max-w-xs">{review.description}</p>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Revew;
