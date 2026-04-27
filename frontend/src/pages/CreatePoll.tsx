import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPoll } from "../api";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 10) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const poll = await createPoll(question, options);
      navigate(`/${poll.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Create a Poll</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="question">Question</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
            required
          />
        </div>

        <div className="field">
          <label>Options</label>
          {options.map((opt, i) => (
            <div key={i} className="option-row">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeOption(i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {options.length < 10 && (
            <button type="button" className="btn-secondary" onClick={addOption}>
              + Add option
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
}
