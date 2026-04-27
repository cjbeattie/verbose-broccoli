import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPoll, castVote, type Poll } from "../api";

export default function PollPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const {
    data: poll,
    isLoading,
    error,
  } = useQuery<Poll>({
    queryKey: ["poll", id],
    queryFn: () => getPoll(id!),
  });

  const voteMutation = useMutation({
    mutationFn: (optionIndex: number) => castVote(id!, optionIndex),
    onSuccess: (updatedPoll) => {
      queryClient.setQueryData(["poll", id], updatedPoll);
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <p className="error">
        {error instanceof Error ? error.message : "Failed to load poll"}
      </p>
    );
  if (!poll) return null;

  const hasVoted = poll.your_vote !== null;
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="page">
      <h1>{poll.question}</h1>

      {hasVoted ? (
        <ResultsView
          poll={poll}
          totalVotes={totalVotes}
          onRefresh={() =>
            queryClient.invalidateQueries({ queryKey: ["poll", id] })
          }
        />
      ) : (
        <VoteView
          poll={poll}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          onVote={() => {
            if (selectedOption !== null) voteMutation.mutate(selectedOption);
          }}
          isPending={voteMutation.isPending}
          error={
            voteMutation.error instanceof Error
              ? voteMutation.error.message
              : null
          }
        />
      )}
    </div>
  );
}

function VoteView({
  poll,
  selectedOption,
  onSelect,
  onVote,
  isPending,
  error,
}: {
  poll: Poll;
  selectedOption: number | null;
  onSelect: (i: number) => void;
  onVote: () => void;
  isPending: boolean;
  error: string | null;
}) {
  return (
    <div>
      <ul className="options-list">
        {poll.options.map((option, i) => (
          <li key={i}>
            <label className="option-label">
              <input
                type="radio"
                name="vote"
                value={i}
                checked={selectedOption === i}
                onChange={() => onSelect(i)}
              />
              {option.text}
            </label>
          </li>
        ))}
      </ul>
      {error && <p className="error">{error}</p>}
      <button
        className="btn-primary"
        onClick={onVote}
        disabled={selectedOption === null || isPending}
      >
        {isPending ? "Voting..." : "Vote"}
      </button>
    </div>
  );
}

function ResultsView({
  poll,
  totalVotes,
  onRefresh,
}: {
  poll: Poll;
  totalVotes: number;
  onRefresh: () => void;
}) {
  return (
    <div>
      <ul className="results-list">
        {poll.options.map((option, i) => {
          const pct =
            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isYours = poll.your_vote === i;
          return (
            <li key={i} className={isYours ? "your-vote" : ""}>
              <div className="result-label">
                <span>
                  {option.text}
                  {isYours && " ✓"}
                </span>
                <span>
                  {option.votes} vote{option.votes !== 1 ? "s" : ""} ({pct}%)
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="total-votes">
        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
      </p>
      <button className="btn-secondary" onClick={onRefresh}>
        Refresh
      </button>
    </div>
  );
}
