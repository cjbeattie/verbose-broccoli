import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const API = "https://youtooz-interview-test.ytz-workers-9354.workers.dev";

interface QuoteRound {
  id: number;
  requiredBy: string;
  insertedAt: string;
  completedAt: string | null;
  closedAt: string | null;
  status: string;
  projectCount: number;
}

const STATUS_COLORS: Record<string, string> = {
  sent: "#2563eb",
  completed: "#16a34a",
  closed: "#6b7280",
  cancelled: "#dc2626",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

export default function QuoteRoundsList() {
  const { data, isLoading, isError } = useQuery<QuoteRound[]>({
    queryKey: ["quote-rounds"],
    queryFn: () => fetch(`${API}/quote-rounds`).then((r) => r.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load quote rounds.</p>;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Quote Rounds</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
            <th style={{ padding: "8px 12px" }}>ID</th>
            <th style={{ padding: "8px 12px" }}>Status</th>
            <th style={{ padding: "8px 12px" }}>Required By</th>
            <th style={{ padding: "8px 12px" }}>Inserted At</th>
            <th style={{ padding: "8px 12px" }}>Completed At</th>
            <th style={{ padding: "8px 12px" }}>Closed At</th>
            <th style={{ padding: "8px 12px" }}>Projects</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((round) => (
            <tr key={round.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "8px 12px" }}>
                <Link to={`/quote-rounds/${round.id}`}>{round.id}</Link>
              </td>
              <td style={{ padding: "8px 12px" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: STATUS_COLORS[round.status] ?? "#6b7280",
                  }}
                >
                  {round.status}
                </span>
              </td>
              <td style={{ padding: "8px 12px" }}>{formatDate(round.requiredBy)}</td>
              <td style={{ padding: "8px 12px" }}>{formatDate(round.insertedAt)}</td>
              <td style={{ padding: "8px 12px" }}>{formatDate(round.completedAt)}</td>
              <td style={{ padding: "8px 12px" }}>{formatDate(round.closedAt)}</td>
              <td style={{ padding: "8px 12px" }}>{round.projectCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
