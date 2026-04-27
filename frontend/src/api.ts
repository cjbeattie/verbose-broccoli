const API_BASE = "http://localhost:4000/api";

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  your_vote: number | null;
  created_at: string;
}

export async function createPoll(
  question: string,
  options: string[]
): Promise<Poll> {
  const res = await fetch(`${API_BASE}/poll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ question, options }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to create poll");
  }
  return res.json();
}

export async function getPoll(id: string): Promise<Poll> {
  const res = await fetch(`${API_BASE}/poll/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Poll not found");
    throw new Error("Failed to fetch poll");
  }
  return res.json();
}

export async function castVote(
  pollId: string,
  optionIndex: number
): Promise<Poll> {
  const res = await fetch(`${API_BASE}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ poll_id: pollId, option_index: optionIndex }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to cast vote");
  }
  return res.json();
}
