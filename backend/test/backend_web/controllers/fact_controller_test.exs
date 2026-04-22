defmodule BackendWeb.FactControllerTest do
  use BackendWeb.ConnCase, async: true

  alias Backend.Repo
  alias Backend.Facts.Fact

  describe "GET /api/facts/random" do
    test "returns 404 when no facts exist", %{conn: conn} do
      conn = get(conn, ~p"/api/facts/random")

      assert %{"error" => "No facts available"} = json_response(conn, 404)
    end

    test "returns a fact when facts exist", %{conn: conn} do
      Repo.insert!(%Fact{content: "Broccoli is a flower."})

      conn = get(conn, ~p"/api/facts/random")

      assert %{"fact" => fact} = json_response(conn, 200)
      assert is_binary(fact)
      assert String.length(fact) > 0
    end

    test "returns the correct fact content", %{conn: conn} do
      Repo.insert!(%Fact{content: "A group of flamingos is called a flamboyance."})

      conn = get(conn, ~p"/api/facts/random")

      assert %{"fact" => "A group of flamingos is called a flamboyance."} = json_response(conn, 200)
    end
  end
end
