"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Social Polls
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hello, {user.email}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
                Login
              </Link>
              <Link href="/auth/signup" className="text-blue-600 hover:underline text-sm">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
