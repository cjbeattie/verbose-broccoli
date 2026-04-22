import { useSuspenseQuery } from "@tanstack/react-query";

const fetchRandomFact = async (): Promise<string> => {
  const response = await fetch("http://localhost:4000/api/facts/random");
  const data = await response.json();
  return data.fact;
};

function BroccoliFact() {
  const { data: fact, refetch } = useSuspenseQuery({
    queryKey: ["randomFact"],
    queryFn: fetchRandomFact,
  });

  return (
    <div>
      <p style={{ marginTop: "40px", fontSize: "1.2rem", maxWidth: "600px", margin: "40px auto" }}>
        {fact}
      </p>
      <button onClick={() => refetch()}>Give me another one</button>
    </div>
  );
}

export default BroccoliFact;