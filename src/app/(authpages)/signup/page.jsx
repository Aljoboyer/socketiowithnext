"use client"

import Link from 'next/link';
import { useState } from 'react';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup form submitted:', form);
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          Signup
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-green-600 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default Signup;
