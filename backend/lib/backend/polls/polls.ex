defmodule Backend.Polls do
  alias Backend.Repo
  alias Backend.Polls.{Poll, Option, Vote}
  import Ecto.Query

  def create_poll(question, option_texts) do
    with :ok <- validate_question(question),
         :ok <- validate_options(option_texts) do
      Repo.transaction(fn ->
        {:ok, poll} =
          %Poll{}
          |> Poll.changeset(%{question: question})
          |> Repo.insert()

        options =
          option_texts
          |> Enum.with_index()
          |> Enum.map(fn {text, idx} ->
            {:ok, option} =
              %Option{}
              |> Option.changeset(%{text: text, position: idx, poll_id: poll.id})
              |> Repo.insert()

            option
          end)

        format_poll(poll, options, nil)
      end)
    end
  end

  def get_poll(id, voter_id) do
    case Repo.get(Poll, id) do
      nil ->
        {:error, :not_found}

      poll ->
        options = Repo.all(from o in Option, where: o.poll_id == ^id, order_by: [asc: o.position])
        your_vote = get_your_vote(id, voter_id, options)
        {:ok, format_poll(poll, options, your_vote)}
    end
  end

  def cast_vote(poll_id, option_index, voter_id) do
    case Repo.get(Poll, poll_id) do
      nil ->
        {:error, :not_found}

      poll ->
        options = Repo.all(from o in Option, where: o.poll_id == ^poll_id, order_by: [asc: o.position])

        case Enum.at(options, option_index) do
          nil ->
            {:error, :invalid_option}

          option ->
            case do_cast_vote(poll_id, option.id, voter_id) do
              {:ok, updated_option} ->
                updated_options = Enum.map(options, fn o ->
                  if o.id == option.id, do: updated_option, else: o
                end)

                {:ok, format_poll(poll, updated_options, option_index)}

              {:error, reason} ->
                {:error, reason}
            end
        end
    end
  end

  defp do_cast_vote(poll_id, option_id, voter_id) do
    Repo.transaction(fn ->
      case %Vote{}
           |> Vote.changeset(%{poll_id: poll_id, option_id: option_id, voter_id: voter_id})
           |> Repo.insert() do
        {:ok, _vote} ->
          {1, [updated_option]} =
            from(o in Option, where: o.id == ^option_id, select: o)
            |> Repo.update_all(inc: [votes_count: 1])

          updated_option

        {:error, changeset} ->
          if unique_constraint_error?(changeset) do
            Repo.rollback(:already_voted)
          else
            Repo.rollback(:invalid)
          end
      end
    end)
  end

  defp get_your_vote(_poll_id, nil, _options), do: nil

  defp get_your_vote(poll_id, voter_id, options) do
    case Repo.get_by(Vote, poll_id: poll_id, voter_id: voter_id) do
      nil -> nil
      vote -> Enum.find_index(options, &(&1.id == vote.option_id))
    end
  end

  defp format_poll(poll, options, your_vote) do
    %{
      id: poll.id,
      question: poll.question,
      options: Enum.map(options, fn o -> %{text: o.text, votes: o.votes_count} end),
      your_vote: your_vote,
      created_at: poll.inserted_at
    }
  end

  defp validate_question(q) when is_binary(q) and byte_size(q) > 0, do: :ok
  defp validate_question(_), do: {:error, :invalid_question}

  defp validate_options(opts)
       when is_list(opts) and length(opts) >= 2 and length(opts) <= 10 do
    if Enum.all?(opts, &(is_binary(&1) and byte_size(String.trim(&1)) > 0)),
      do: :ok,
      else: {:error, :invalid_options}
  end

  defp validate_options(_), do: {:error, :invalid_options}

  defp unique_constraint_error?(changeset) do
    Enum.any?(changeset.errors, fn {_field, {_msg, opts}} ->
      Keyword.get(opts, :constraint) == :unique
    end)
  end
end
