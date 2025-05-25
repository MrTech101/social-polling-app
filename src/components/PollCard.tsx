import Link from "next/link";

interface PollCardProps {
  poll: {
    id: string;
    title: string;
    created_at: string;
    user_id: string;
  };
}

export default function PollCard({ poll }: PollCardProps) {
  const formattedDate = new Date(poll.created_at).toLocaleDateString();

  return (
    <Link
      href={`/polls/${poll.id}`}
      className="block p-4 border rounded shadow-sm hover:shadow-md transition bg-white"
    >
      <h3 className="text-lg font-semibold">{poll.title}</h3>
      <p className="text-sm text-gray-500 mt-1">Created on {formattedDate}</p>
    </Link>
  );
}
