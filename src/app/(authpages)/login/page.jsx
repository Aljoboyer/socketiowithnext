"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted:', form);
    router.push('/home')
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
      </>
  );
};

export default Login;
