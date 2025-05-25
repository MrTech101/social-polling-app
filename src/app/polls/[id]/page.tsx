"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import VoteButton from "@/components/VoteButton";
import ResultsChart from "@/components/ResultsChart";

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  created_at: string;
  options: Option[];
}

export default function PollDetailPage() {
  const { id } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    };
    fetchUser();
  }, []);

  // Fetch poll details
const fetchPoll = async () => {
  setLoading(true);
  const res = await fetch(`/api/polls/${id}`);
  const data = await res.json();
  setPoll(data);
  setLoading(false);
};

useEffect(() => {
  fetchPoll();
}, [id]);

  // Check if user has already voted
  useEffect(() => {
    const checkUserVote = async () => {
      if (!userId || !id) return;

      const { data, error } = await supabase
        .from("votes")
        .select("id")
        .eq("poll_id", id)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching vote:", error);
      } else {
        setHasVoted(!!data);
      }
    };

    checkUserVote();
  }, [userId, id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!poll) return <p className="p-4">Poll not found.</p>;

  return (
    <main className="max-w-xl mx-auto mt-12 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">{poll.title}</h2>

      <div className="space-y-4">
        {poll.options.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <span>{option.text}</span>
            <VoteButton
              optionId={option.id}
              pollId={poll.id}
              userId={userId || ""}
              hasVoted={hasVoted}
              onVoteSuccess={() => {
                setHasVoted(true);
                fetchPoll(); // Refresh vote counts
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ResultsChart options={poll.options} />
      </div>
    </main>
  );
}
