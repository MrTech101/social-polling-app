// src/types/poll.ts

export interface Poll {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  options?: Option[];  // Optional, populated in API responses
}

export interface Option {
  id: string;
  text: string;
  poll_id: string;
  votes?: number;       // Number of votes per option
}
