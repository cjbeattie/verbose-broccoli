defmodule BackendWeb.FactController do
  use BackendWeb, :controller

  alias Backend.Facts

  def random(conn, _params) do
    fact = Facts.random_fact()
    json(conn, %{fact: fact.content})
  end
end