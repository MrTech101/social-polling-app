import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface SupabasePollResponse {
  id: string;
  title: string;
  created_at: string;
  options: {
    id: string;
    text: string;
    votes: { id: string }[];
  }[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  const pollId = params?.id;

  if (!pollId) {
    return NextResponse.json({ error: 'Missing poll ID' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('polls')
    .select(
      `
      id, title, created_at,
      options (
        id, text,
        votes (id)
      )
    `
    )
    .eq('id', pollId)
    .single();

  if (error) {
    const notFound = error.message.toLowerCase().includes('row not found');
    return NextResponse.json(
      { error: error.message },
      { status: notFound ? 404 : 500 }
    );
  }

  const formatted = {
    id: data.id,
    title: data.title,
    created_at: data.created_at,
    options: data.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes?.length ?? 0,
    })),
  };

  return NextResponse.json(formatted, { status: 200 });
}
