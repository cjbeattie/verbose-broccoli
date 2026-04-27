defmodule Backend.Polls.Poll do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "polls" do
    field :question, :string
    has_many :options, Backend.Polls.Option, preload_order: [asc: :position]
    timestamps(updated_at: false)
  end

  def changeset(poll, attrs) do
    poll
    |> cast(attrs, [:question])
    |> validate_required([:question])
  end
end
