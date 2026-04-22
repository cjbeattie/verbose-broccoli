defmodule Backend.Facts.Fact do
  use Ecto.Schema

  schema "facts" do
    field :content, :string

    timestamps()
  end
end