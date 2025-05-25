"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ResultsChart from "@/components/ResultsChart";

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  options: Option[];
}

export default function ResultsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolls() {
      setLoading(true);
      setError(null);

      try {
        // Fetch polls with options and vote counts
        const { data, error } = await supabase
          .from("polls")
          .select(`
            id,
            title,
            options (
              id,
              text,
              votes (
                id
              )
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          setError(error.message);
          setPolls([]);
        } else if (data) {
          // Format options to include votes count
          const formatted = data.map((poll) => ({
            id: poll.id,
            title: poll.title,
            options: poll.options.map((opt) => ({
              id: opt.id,
              text: opt.text,
              votes: opt.votes?.length ?? 0,
            })),
          }));

          setPolls(formatted);
        }
      } catch (err) {
        setError("Failed to fetch poll results.");
        setPolls([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, []);

  if (loading) return <p className="p-4">Loading results...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  if (!polls.length) return <p className="p-4">No polls found.</p>;

  return (
    <main className="max-w-xl mx-auto mt-12 p-6 border rounded space-y-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Poll Results</h1>

      {polls.map((poll) => (
        <section key={poll.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">{poll.title}</h2>
          <ResultsChart options={poll.options} />
        </section>
      ))}
    </main>
  );
}
