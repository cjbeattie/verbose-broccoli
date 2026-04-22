defmodule Backend.Repo.Migrations.CreateFacts do
  use Ecto.Migration

  def change do
    create table(:facts) do
      add :content, :string, null: false

      timestamps()
    end
  end
end