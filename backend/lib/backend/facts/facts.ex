defmodule Backend.Facts do
  alias Backend.Repo
  alias Backend.Facts.Fact
  import Ecto.Query

  def random_fact do
    Repo.one(from f in Fact, order_by: fragment("RANDOM()"), limit: 1)
  end
end