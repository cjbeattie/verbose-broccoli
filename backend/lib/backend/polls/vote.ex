defmodule Backend.Polls.Vote do
  use Ecto.Schema
  import Ecto.Changeset

  schema "votes" do
    field :voter_id, :string
    belongs_to :poll, Backend.Polls.Poll, type: :binary_id
    belongs_to :option, Backend.Polls.Option
    timestamps(updated_at: false)
  end

  def changeset(vote, attrs) do
    vote
    |> cast(attrs, [:poll_id, :option_id, :voter_id])
    |> validate_required([:poll_id, :option_id, :voter_id])
    |> unique_constraint([:poll_id, :voter_id])
  end
end
