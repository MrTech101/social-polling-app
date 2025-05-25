import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface VoteRequest {
  poll_id: string;
  option_id: string;
  user_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VoteRequest;
    const { poll_id, option_id, user_id } = body;

    if (!poll_id || !option_id || !user_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check for existing vote (one vote per poll per user)
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', poll_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingVote) {
      return NextResponse.json({ error: 'User already voted on this poll' }, { status: 409 });
    }

    // Insert vote
    const { error: voteError } = await supabase.from('votes').insert([
      { poll_id, option_id, user_id },
    ]);

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Vote recorded successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/votes error:', error);
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }
}
