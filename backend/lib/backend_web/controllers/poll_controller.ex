defmodule BackendWeb.PollController do
  use BackendWeb, :controller
  alias Backend.Polls

  @voter_cookie "voter_id"

  def create(conn, %{"question" => question, "options" => options}) when is_list(options) do
    case Polls.create_poll(question, options) do
      {:ok, poll} ->
        conn |> put_status(:created) |> json(poll)

      {:error, :invalid_question} ->
        conn |> put_status(:bad_request) |> json(%{error: "Question is required"})

      {:error, :invalid_options} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Between 2 and 10 non-empty options are required"})
    end
  end

  def create(conn, _params) do
    conn |> put_status(:bad_request) |> json(%{error: "question and options are required"})
  end

  def show(conn, %{"id" => id}) do
    voter_id = conn.cookies[@voter_cookie]

    case Polls.get_poll(id, voter_id) do
      {:ok, poll} -> json(conn, poll)
      {:error, :not_found} -> conn |> put_status(:not_found) |> json(%{error: "Poll not found"})
    end
  end

  def vote(conn, %{"poll_id" => poll_id, "option_index" => option_index})
      when is_integer(option_index) do
    voter_id = conn.cookies[@voter_cookie] || Ecto.UUID.generate()

    case Polls.cast_vote(poll_id, option_index, voter_id) do
      {:ok, poll} ->
        conn
        |> put_resp_cookie(@voter_cookie, voter_id,
          max_age: 60 * 60 * 24 * 365,
          same_site: "Lax",
          http_only: true
        )
        |> json(poll)

      {:error, :not_found} ->
        conn |> put_status(:not_found) |> json(%{error: "Poll not found"})

      {:error, :invalid_option} ->
        conn |> put_status(:bad_request) |> json(%{error: "Invalid option index"})

      {:error, :already_voted} ->
        conn |> put_status(:conflict) |> json(%{error: "Already voted in this poll"})
    end
  end

  def vote(conn, _params) do
    conn |> put_status(:bad_request) |> json(%{error: "poll_id and option_index are required"})
  end
end
