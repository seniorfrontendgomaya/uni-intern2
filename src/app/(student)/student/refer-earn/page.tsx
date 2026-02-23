"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Users, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useStudentReferralCode } from "@/contexts/student-referral-code";
import { getStudentReferralList } from "@/services/referral.service";
import type { StudentReferralListItem } from "@/services/referral.service";

type LedgerEntry = {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
};

function formatJoinedDate(iso?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatUpdatedDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

// Static data for earning ledger
const LEDGER_ENTRIES: LedgerEntry[] = [
  { id: "1", date: "15 Jan 2025", description: "Referral bonus - Priya Sharma signed up", type: "credit", amount: 200 },
  { id: "2", date: "10 Jan 2025", description: "Referral bonus - Rahul Verma signed up", type: "credit", amount: 200 },
  { id: "3", date: "08 Jan 2025", description: "Withdrawal to bank", type: "debit", amount: 300 },
  { id: "4", date: "05 Jan 2025", description: "Referral bonus - Anita Patel signed up", type: "credit", amount: 200 },
  { id: "5", date: "28 Dec 2024", description: "Referral bonus - Vikram Singh signed up", type: "credit", amount: 200 },
  { id: "6", date: "20 Dec 2024", description: "Referral bonus - Kavita Reddy signed up", type: "credit", amount: 200 },
];

export default function ReferEarnPage() {
  const [activeTab, setActiveTab] = useState<"referred" | "ledger">("referred");
  const { referralCode, isActive: referralIsActive, updated: referralUpdated, loading: referralCodeLoading } = useStudentReferralCode();
  const [copied, setCopied] = useState(false);
  const [referredList, setReferredList] = useState<StudentReferralListItem[]>([]);
  const [referredLoading, setReferredLoading] = useState(true);
  const [referredError, setReferredError] = useState<string | null>(null);

  const loadReferredList = useCallback(async () => {
    setReferredLoading(true);
    setReferredError(null);
    try {
      const res = await getStudentReferralList();
      setReferredList(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setReferredError(e instanceof Error ? e.message : "Failed to load referred users");
      setReferredList([]);
    } finally {
      setReferredLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferredList();
  }, [loadReferredList]);

  const handleCopyCode = async () => {
    if (referralCode == null) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Referral code copied to clipboard!");
    } catch {
      const el = document.getElementById("referral-code-input");
      if (el instanceof HTMLInputElement) {
        el.select();
      }
      toast.error("Couldn’t copy — try selecting the code and copying manually.");
    }
  };

  const totalReferred = referredList.length;
  const totalCredits = LEDGER_ENTRIES.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0);
  const totalDebits = LEDGER_ENTRIES.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0);
  const netEarning = totalCredits - totalDebits;

  return (
    <div className="space-y-6 mt-6 px-4 sm:px-0">
      {!referralCodeLoading && !referralIsActive && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Your referral is disabled
          {referralUpdated ? ` ${formatUpdatedDate(referralUpdated)}` : ""}.
        </div>
      )}

      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Refer & Earn
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your referral code and earn rewards. Track your referred users and earnings here.
        </p>
      </div>

      {/* Referral code — copy-pastable */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Your referral code
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            id="referral-code-input"
            type="text"
            readOnly
            value={referralCodeLoading ? "Loading…" : referralCode ?? "—"}
            className="min-w-32 flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 font-mono text-base tracking-wide text-foreground outline-none selection:bg-brand/30 focus:border-border focus:ring-0 sm:text-lg"
            aria-label="Your referral code"
          />
          <button
            type="button"
            onClick={handleCopyCode}
            disabled={referralCodeLoading || referralCode == null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
          >
            <Copy className="h-4 w-4 shrink-0" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex w-fit gap-0 rounded-2xl border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("referred")}
          className={
            activeTab === "referred"
              ? "flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-medium text-white whitespace-nowrap sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
              : "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap hover:bg-muted hover:text-foreground sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          }
        >
          <Users className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          Referred Users
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ledger")}
          className={
            activeTab === "ledger"
              ? "flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-medium text-white whitespace-nowrap sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
              : "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap hover:bg-muted hover:text-foreground sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          }
        >
          <Wallet className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          Earning Ledger
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "referred" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Total count on top */}
          <div className="border-b border-border bg-muted/30 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total referrals
            </p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">
              {totalReferred}
            </p>
          </div>
          {/* Referred users table */}
          <div className="overflow-x-auto">
            {referredLoading ? (
              <div className="flex items-center justify-center px-4 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              </div>
            ) : referredError ? (
              <div className="px-4 py-8 text-center text-sm text-red-600">
                {referredError}
              </div>
            ) : (
              <table className="w-full min-w-0 text-left text-sm sm:min-w-[400px]">
                <thead className="bg-brand text-xs uppercase text-white">
                  <tr className="h-11">
                    <th className="w-16 px-4 py-2.5 text-center">S No</th>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="hidden px-4 py-2.5 sm:table-cell">Email</th>
                    <th className="hidden px-4 py-2.5 md:table-cell">Mobile</th>
                    <th className="px-4 py-2.5">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {referredList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No referred users yet. Share your referral code to get started.
                      </td>
                    </tr>
                  ) : (
                    referredList.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-t border-border bg-card transition hover:bg-muted/40"
                      >
                        <td className="px-4 py-2.5 text-center text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {[user.first_name, user.last_name].filter(Boolean).join(" ") || user.full_name || user.email || "—"}
                        </td>
                        <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">
                          {user.email ?? "—"}
                        </td>
                        <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                          {user.mobile ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {formatJoinedDate(user.joined_date)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "ledger" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Summary on top — horizontal on all screens */}
          <div className="grid grid-cols-3 gap-3 border-b border-border bg-muted/30 p-4 sm:gap-4 sm:p-5">
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                Total credit
              </p>
              <p className="mt-0.5 text-base font-semibold tabular-nums text-emerald-600 sm:text-xl">
                ₹{totalCredits.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                Total debit
              </p>
              <p className="mt-0.5 text-base font-semibold tabular-nums text-red-600 sm:text-xl">
                ₹{totalDebits.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                Net earning
              </p>
              <p className="mt-0.5 text-base font-semibold tabular-nums text-foreground sm:text-xl">
                ₹{netEarning.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          {/* Ledger table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-0 text-left text-sm sm:min-w-[500px]">
              <thead className="bg-brand text-xs uppercase text-white">
                <tr className="h-11">
                  <th className="w-28 shrink-0 px-4 py-2.5 whitespace-nowrap">Date</th>
                  <th className="hidden px-4 py-2.5 sm:table-cell">Description</th>
                  <th className="w-24 shrink-0 px-4 py-2.5 text-center whitespace-nowrap">Type</th>
                  <th className="w-28 shrink-0 px-4 py-2.5 text-right whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody>
                {LEDGER_ENTRIES.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-t border-border bg-card transition hover:bg-muted/40"
                  >
                    <td className="w-28 shrink-0 px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="hidden px-4 py-2.5 text-foreground sm:table-cell">
                      {entry.description}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={
                          entry.type === "credit"
                            ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700"
                        }
                      >
                        {entry.type === "credit" ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-medium tabular-nums ${
                        entry.type === "credit"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {entry.type === "credit" ? "+" : "-"}₹
                      {entry.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
