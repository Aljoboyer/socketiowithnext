"use client"; // (if you use Next.js 13+ app directory, otherwise ignore this)

import { useState } from "react";

export default function BlogWithComments() {
  const [comments, setComments] = useState([
    "This is a comment! Very insightful blog.",
    "Loved reading this. Keep it up!",
  ]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    // Add the new comment at the top
    setComments([newComment, ...comments]);
    setNewComment(""); // clear input
  };

  return (
    <div className="max-w-1/2 mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      {/* Blog Post */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">My Amazing Blog Post</h1>
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae sagittis elit. Integer id orci nec nulla elementum ultrices.
        </p>
      </div>

      {/* Comment Section */}
      <div className="space-y-6">
        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-800">{comment}</p>
            </div>
          ))}
        </div>

        {/* Add Comment Box */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="self-end px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}
