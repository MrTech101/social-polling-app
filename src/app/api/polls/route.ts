import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface CreatePollRequest {
  title: string;
  options: string[];
  user_id: string;
}

// GET /api/polls - List all polls
export async function GET() {
  const { data, error } = await supabase
    .from('polls')
    .select('id, title, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// POST /api/polls - Create a new poll
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreatePollRequest;
    const { title, options, user_id } = body;

    // Validation
    if (!title || typeof title !== 'string' || !Array.isArray(options) || options.length < 2 || !user_id) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const trimmedOptions = options.map((opt) => opt.trim()).filter(Boolean);

    if (new Set(trimmedOptions).size !== trimmedOptions.length) {
      return NextResponse.json({ error: 'Options must be unique' }, { status: 400 });
    }

    // Insert poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert([{ title, user_id }])
      .select()
      .single();

    if (pollError) {
      return NextResponse.json({ error: pollError.message }, { status: 500 });
    }

    // Insert options
    const optionRows = trimmedOptions.map((text) => ({
      text,
      poll_id: poll.id,
    }));

    const { error: optionsError } = await supabase.from('options').insert(optionRows);

    if (optionsError) {
      return NextResponse.json({ error: optionsError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Poll created', poll }, { status: 201 });
  } catch (err) {
    console.error('POST /api/polls error:', err);
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }
}
