"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface VoteButtonProps {
  pollId: string;
  optionId: string;
  userId: string;
  hasVoted: boolean;
  onVoteSuccess?: () => void;
}

export default function VoteButton({
  pollId,
  optionId,
  userId,
  hasVoted,
  onVoteSuccess,
}: VoteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(hasVoted);

  const handleVote = async () => {
    if (loading || voted) return;
    setLoading(true);

    const { error } = await supabase.from("votes").insert([
      { poll_id: pollId, option_id: optionId, user_id: userId },
    ]);

    if (error) {
      alert("Failed to vote: " + error.message);
    } else {
      setVoted(true);
      onVoteSuccess?.(); // Call the parent callback to update hasVoted + refresh
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading || voted}
      className={`px-4 py-2 rounded w-full transition ${
        voted
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      {loading ? "Voting..." : voted ? "Voted" : "Vote"}
    </button>
  );
}
