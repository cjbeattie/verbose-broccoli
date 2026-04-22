# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Backend.Repo.insert!(%Backend.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Backend.Repo
alias Backend.Facts.Fact

facts = [
  "Broccoli is technically a flower that you eat before it blooms. You're basically a floral cannibal.",
  "The word 'broccoli' comes from the Italian word for 'little arm'. You've been eating tiny arms this whole time.",
  "Broccoli is 90% water, which means it's basically just a very complicated glass of water.",
  "Ancient Romans ate broccoli over 2000 years ago, making it one of history's most persistent vegetables.",
  "If broccoli were a person, it would be that annoyingly healthy friend who runs marathons for fun.",
  "Broccoli produces more protein per calorie than steak. The cows are furious about this.",
  "A single serving of broccoli has more vitamin C than an orange. Oranges have been lying to us for years."
]

Enum.each(facts, fn content ->
  Repo.insert!(%Fact{content: content})
end)