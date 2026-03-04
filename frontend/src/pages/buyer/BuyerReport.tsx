import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useReports, type ReportTargetType } from "../../store/reportStore";
import { useToast } from "../../store/toastStore";

export default function BuyerReport() {
  const { user, ready } = useAuth();
  const { submitReport, listMyReports } = useReports();
  const { showToast } = useToast();
  const [targetType, setTargetType] = useState<ReportTargetType>("product");
  const [targetId, setTargetId] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const myReports = listMyReports;

  if (!ready) return <Shell title="Report" subtitle="Loading..." />;
  if (!user) return <Shell title="Report" subtitle="Please login first." />;
  if (user.role !== "BUYER") return <Shell title="Report" subtitle="Only buyers can access this page." />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!targetId || targetId <= 0) throw new Error("Target ID must be a valid number.");
      if (!reason.trim()) throw new Error("Reason is required.");

      await submitReport({ target_type: targetType, target_id: targetId, reason });
      showToast("✅ Report submitted");
      setTargetId(0);
      setReason("");
    } catch (err) {
      showToast(`❌ ${(err as Error).message ?? "Failed to submit report"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell title="Report a Seller/Product" subtitle="Submit an issue for review (demo localStorage).">
      <form className="mt-6 grid gap-3 max-w-xl" onSubmit={onSubmit}>
        <select
          className="rounded-xl border px-3 py-2"
          value={targetType}
          onChange={(e) => setTargetType(e.target.value as ReportTargetType)}
        >
          <option value="product">Product</option>
          <option value="seller">Seller (user_id)</option>
        </select>

        <input
          className="rounded-xl border px-3 py-2"
          type="number"
          min={1}
          placeholder={targetType === "product" ? "Product ID (e.g. 123)" : "Seller user_id (e.g. 555)"}
          value={targetId === 0 ? "" : targetId}
          onChange={(e) => setTargetId(Number(e.target.value))}
          required
        />

        <textarea
          className="rounded-xl border px-3 py-2 min-h-[120px]"
          placeholder="Reason (e.g., scam, wrong item, fake listing...)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button 
          className="rounded-xl border px-3 py-2 hover:bg-gray-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit report"}
        </button>
      </form>

      <div className="mt-8">
        <div className="font-semibold">My Reports</div>
        {myReports.length === 0 ? (
          <div className="mt-2 text-sm text-gray-600">No reports yet.</div>
        ) : (
          <div className="mt-3 rounded-2xl border bg-white divide-y">
            {myReports.map((r) => (
              <div key={r.id} className="p-4">
                <div className="text-sm">
                  <span className="font-semibold">{r.target_type.toUpperCase()}</span> #{r.target_id}
                </div>
                <div className="text-sm text-gray-700 mt-1">{r.reason}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link className="underline underline-offset-4 text-sm" to="/profile">
            Back to Profile
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      {children}
    </div>
  );
}