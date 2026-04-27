defmodule Backend.Polls.Option do
  use Ecto.Schema
  import Ecto.Changeset

  schema "options" do
    field :text, :string
    field :position, :integer
    field :votes_count, :integer, default: 0
    belongs_to :poll, Backend.Polls.Poll, type: :binary_id
  end

  def changeset(option, attrs) do
    option
    |> cast(attrs, [:text, :position, :poll_id])
    |> validate_required([:text, :position, :poll_id])
  end
end
