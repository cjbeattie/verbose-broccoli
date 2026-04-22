import { useSuspenseQuery } from "@tanstack/react-query";
import styles from "./BroccoliFact.module.css";

interface FactResponse {
  fact: string;
}

const fetchRandomFact = async (): Promise<FactResponse> => {
  const response = await fetch("http://localhost:4000/api/facts/random");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

function BroccoliFact() {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["randomFact"],
    queryFn: fetchRandomFact,
  });

  return (
    <div>
      <p className={styles.fact}>
        {data.fact}
      </p>
      <button onClick={() => refetch()}>Give me another one</button>
    </div>
  );
}

export default BroccoliFact;