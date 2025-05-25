"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PollCard from "@/components/PollCard";
import Link from "next/link";

interface Poll {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await supabase.auth.getUser();
      setUser(userRes.data.user);

      const { data, error } = await supabase
        .from("polls")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setPolls(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recent Polls</h1>
        {user && (
          <Link
            href="/polls/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Create Poll
          </Link>
        )}
      </div>

      {loading ? (
        <p>Loading polls...</p>
      ) : polls.length === 0 ? (
        <p>No polls yet. Be the first to create one!</p>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </main>
  );
}
