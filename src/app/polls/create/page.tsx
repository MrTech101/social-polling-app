"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreatePollPage() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]); // Minimum 2 options
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (!loading) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2 && !loading) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        setError("You must be logged in to create a poll.");
        return;
      }

      const filteredOptions = options.map((o) => o.trim()).filter((o) => o !== "");
      const uniqueOptions = Array.from(new Set(filteredOptions));

      if (!title.trim() || uniqueOptions.length < 2) {
        setError("Please provide a title and at least two unique options.");
        return;
      }

      const payload = {
        title: title.trim(),
        options: uniqueOptions,
        user_id: user.id,
      };

      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong.");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Poll creation failed:", err);
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-12 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create a New Poll</h2>

      {error && <p className="text-red-600 mb-4 bg-red-50 p-2 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Poll Title"
          autoComplete="off"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                placeholder={`Option ${idx + 1}`}
                autoComplete="off"
                className="flex-1 p-2 border rounded"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="text-red-500"
                  disabled={loading}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          disabled={loading}
          className="text-blue-600 underline"
        >
          + Add Option
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </main>
  );
}
