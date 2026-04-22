defmodule BackendWeb.FactController do
  use BackendWeb, :controller

  alias Backend.Facts

  def random(conn, _params) do
    case Facts.random_fact() do
      nil -> conn |> put_status(:not_found) |> json(%{error: "No facts available"})
      fact -> json(conn, %{fact: fact.content})
    end
  end
end