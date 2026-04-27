defmodule Backend.Repo.Migrations.CreatePolls do
  use Ecto.Migration

  def change do
    create table(:polls, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :question, :string, null: false
      timestamps(updated_at: false)
    end

    create table(:options) do
      add :poll_id, references(:polls, type: :binary_id, on_delete: :delete_all), null: false
      add :text, :string, null: false
      add :position, :integer, null: false
      add :votes_count, :integer, null: false, default: 0
    end

    create index(:options, [:poll_id])

    create table(:votes) do
      add :poll_id, references(:polls, type: :binary_id, on_delete: :delete_all), null: false
      add :option_id, references(:options, on_delete: :delete_all), null: false
      add :voter_id, :string, null: false
      timestamps(updated_at: false)
    end

    create unique_index(:votes, [:poll_id, :voter_id])
    create index(:votes, [:option_id])
  end
end
