import React from 'react'

export default function BlogItem({
    blog,
    comments, handleSubmit,
    setNewComment, newComment}) {
  return (
    
    <div className="w-[500px] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
    {/* Blog Post */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">{blog?.title}</h1>
      <p className="text-gray-700">
        {blog?.description}
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
          onChange={(e) => setNewComment({commentText: e.target.value, blog_id: blog?.blog_id})}
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
  )
}
