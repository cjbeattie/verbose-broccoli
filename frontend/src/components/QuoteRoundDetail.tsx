import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API = "https://youtooz-interview-test.ytz-workers-9354.workers.dev";

const COLORS = [
  "#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed",
  "#0891b2", "#db2777", "#65a30d", "#ea580c", "#6366f1",
];

interface Pricing {
  quantity: number;
  price: number;
}

interface Offer {
  id: number;
  factoryName: string;
  moldPrice: number | null;
  samplePrice: number | null;
  pricing: Pricing[] | null;
  submittedAt: string;
  acceptedAt: string | null;
}

interface Project {
  id: number;
  projectName: string;
  quantities: number[];
  moldRequired: boolean;
  sampleRequired: boolean;
  notes: string | null;
  offers: Offer[];
}

interface QuoteRoundDetail {
  id: number;
  requiredBy: string;
  insertedAt: string;
  completedAt: string | null;
  closedAt: string | null;
  cancelledAt: string | null;
  status: string;
  notes: string | null;
  projects: Project[];
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function buildChartData(quantities: number[], offers: Offer[]) {
  return quantities.map((qty) => {
    const point: Record<string, number | string> = { quantity: qty };
    for (const offer of offers) {
      if (!offer.pricing) continue;
      const match = offer.pricing.find((p) => p.quantity === qty);
      if (match) point[offer.factoryName] = match.price / 100;
    }
    return point;
  });
}

function ProjectSection({ project, index }: { project: Project; index: number }) {
  const offersWithPricing = project.offers.filter((o) => o.pricing !== null);
  const offersWithoutPricing = project.offers.filter((o) => o.pricing === null);
  const chartData = buildChartData(project.quantities, offersWithPricing);

  return (
    <div style={{ marginBottom: "48px" }}>
      <h2 style={{ marginBottom: "4px" }}>
        {index + 1}. {project.projectName}
      </h2>
      <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 16px" }}>
        Quantities: {project.quantities.join(", ")} &nbsp;|&nbsp;
        Mold required: {project.moldRequired ? "Yes" : "No"} &nbsp;|&nbsp;
        Sample required: {project.sampleRequired ? "Yes" : "No"}
      </p>

      {offersWithPricing.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No pricing submitted for this project.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="quantity"
              label={{ value: "Quantity", position: "insideBottom", offset: -4 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) => `$${v.toFixed(2)}`}
              label={{ value: "Price per unit", angle: -90, position: "insideLeft", offset: 8 }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatDollars(value * 100), name]}
              labelFormatter={(label) => `Qty: ${label}`}
            />
            <Legend verticalAlign="top" />
            {offersWithPricing.map((offer, i) => (
              <Line
                key={offer.id}
                type="monotone"
                dataKey={offer.factoryName}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {offersWithoutPricing.length > 0 && (
        <p style={{ marginTop: "12px", fontSize: "13px", color: "#6b7280" }}>
          No quote submitted:{" "}
          {offersWithoutPricing.map((o) => o.factoryName).join(", ")}
        </p>
      )}
    </div>
  );
}

export default function QuoteRoundDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery<QuoteRoundDetail>({
    queryKey: ["quote-round", id],
    queryFn: () => fetch(`${API}/quote-round/${id}`).then((r) => r.json()),
  });

  if (isLoading) return <p style={{ padding: "24px" }}>Loading...</p>;
  if (isError) return <p style={{ padding: "24px" }}>Failed to load quote round.</p>;
  if (!data) return null;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "960px" }}>
      <Link to="/" style={{ fontSize: "14px" }}>← Back to Quote Rounds</Link>

      <h1 style={{ marginTop: "16px", marginBottom: "4px" }}>Quote Round #{data.id}</h1>
      <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px" }}>
        Status: <strong>{data.status}</strong> &nbsp;|&nbsp;
        Required by: <strong>{formatDate(data.requiredBy)}</strong> &nbsp;|&nbsp;
        Inserted: {formatDate(data.insertedAt)} &nbsp;|&nbsp;
        Completed: {formatDate(data.completedAt)} &nbsp;|&nbsp;
        Closed: {formatDate(data.closedAt)}
      </p>
      {data.notes && <p style={{ marginBottom: "24px" }}>{data.notes}</p>}

      <hr style={{ margin: "24px 0", borderColor: "#e5e7eb" }} />

      {data.projects.map((project, i) => (
        <ProjectSection key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}
