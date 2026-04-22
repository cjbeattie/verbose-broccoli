import { useSuspenseQuery } from "@tanstack/react-query";

interface FactResponse {
  fact: string;
}

const fetchRandomFact = async (): Promise<FactResponse> => {
  const response = await fetch("http://localhost:4000/api/facts/random");
  const data = await response.json();
  return data;
};

function BroccoliFact() {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["randomFact"],
    queryFn: fetchRandomFact,
  });

  return (
    <div>
      <p style={{ marginTop: "40px", fontSize: "1.2rem", maxWidth: "600px", margin: "40px auto" }}>
        {data.fact}
      </p>
      <button onClick={() => refetch()}>Give me another one</button>
    </div>
  );
}

export default BroccoliFact;