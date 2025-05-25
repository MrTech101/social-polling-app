'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="p-2 border rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          className="p-2 border rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
