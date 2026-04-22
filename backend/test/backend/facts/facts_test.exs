defmodule Backend.FactsTest do
  use Backend.DataCase, async: true

  alias Backend.Facts
  alias Backend.Facts.Fact

  describe "random_fact/0" do
    test "returns a Fact struct when facts exist" do
      Repo.insert!(%Fact{content: "Honey never spoils."})

      assert %Fact{content: "Honey never spoils."} = Facts.random_fact()
    end

    test "returns nil when no facts exist" do
      assert Facts.random_fact() == nil
    end

    test "returns one of the existing facts" do
      Repo.insert!(%Fact{content: "Fact A"})
      Repo.insert!(%Fact{content: "Fact B"})

      result = Facts.random_fact()

      assert result.content in ["Fact A", "Fact B"]
    end
  end
end
