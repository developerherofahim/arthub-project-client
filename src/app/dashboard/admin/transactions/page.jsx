"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowDownUp,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Search,
  XCircle,
} from "lucide-react";
import { getAdminTransactions } from "@/lib/api";

const STATUS_STYLES = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-slate-100 text-slate-600",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportTransactions(transactions) {
  const rows = [
    ["Transaction ID", "Buyer", "Email", "Item", "Type", "Date", "Amount", "Status"],
    ...transactions.map((transaction) => [
      transaction.transactionId,
      transaction.buyerName,
      transaction.buyerEmail,
      transaction.artworkTitle || transaction.tier,
      transaction.type,
      formatDate(transaction.createdAt),
      Number(transaction.amount) || 0,
      transaction.status,
    ]),
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "arthub-transactions.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function SummaryCard({ label, value, detail, icon: Icon, tone }) {
  return (
    <article className="rounded-2xl border border-art-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-art-secondary">{label}</p>
          <p className="mt-3 font-art-display text-2xl font-semibold tracking-tight text-art-text sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-art-muted">{detail}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "Transactions could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getAdminTransactions()
      .then((data) => {
        if (isMounted) setTransactions(Array.isArray(data) ? data : []);
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(loadError.message || "Transactions could not be loaded.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        [
          transaction.transactionId,
          transaction.buyerName,
          transaction.buyerEmail,
          transaction.artworkTitle,
          transaction.tier,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "all" ||
        String(transaction.status).toLowerCase() === statusFilter;
      const matchesType =
        typeFilter === "all" ||
        String(transaction.type).toLowerCase() === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, transactions, typeFilter]);

  const completedTransactions = transactions.filter(
    (transaction) => String(transaction.status).toLowerCase() === "completed",
  );
  const completedRevenue = completedTransactions.reduce(
    (total, transaction) => total + (Number(transaction.amount) || 0),
    0,
  );
  const pendingCount = transactions.filter(
    (transaction) => String(transaction.status).toLowerCase() === "pending",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-art-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-art-primary">
            <CreditCard size={14} aria-hidden="true" />
            Finance
          </div>
          <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">
            Transactions
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-art-secondary">
            Review marketplace purchases and membership payments in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportTransactions(filteredTransactions)}
          disabled={filteredTransactions.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-art-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-art-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowDownToLine size={16} aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <section aria-label="Transaction overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total transactions"
          value={transactions.length.toLocaleString()}
          detail="Across all transaction types"
          icon={ArrowDownUp}
          tone="bg-art-primary/10 text-art-primary"
        />
        <SummaryCard
          label="Completed revenue"
          value={formatCurrency(completedRevenue)}
          detail="Completed payments only"
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-700"
        />
        <SummaryCard
          label="Completed"
          value={completedTransactions.length.toLocaleString()}
          detail="Successfully recorded payments"
          icon={CreditCard}
          tone="bg-blue-50 text-blue-700"
        />
        <SummaryCard
          label="Pending"
          value={pendingCount.toLocaleString()}
          detail="Payments awaiting completion"
          icon={Clock3}
          tone="bg-amber-50 text-amber-700"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-art-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-art-display text-lg font-semibold text-art-text">
              Payment ledger
            </h3>
            <p className="mt-0.5 text-xs text-art-muted">
              {loading
                ? "Loading transaction records…"
                : `${filteredTransactions.length} of ${transactions.length} transactions`}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_150px_160px]">
            <label className="relative">
              <span className="sr-only">Search transactions</span>
              <Search
                size={16}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-art-muted"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search buyer, item, ID…"
                className="w-full rounded-xl border border-art-border bg-white py-2.5 pl-9 pr-3 text-sm text-art-text outline-none transition placeholder:text-art-muted focus:border-art-primary"
              />
            </label>
            <label>
              <span className="sr-only">Filter by status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-art-border bg-white px-3 py-2.5 text-sm text-art-secondary outline-none focus:border-art-primary"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by transaction type</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full rounded-xl border border-art-border bg-white px-3 py-2.5 text-sm text-art-secondary outline-none focus:border-art-primary"
              >
                <option value="all">All types</option>
                <option value="purchase">Artwork purchase</option>
                <option value="subscription">Membership</option>
              </select>
            </label>
          </div>
        </div>

        {error ? (
          <div role="alert" className="m-4 flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadTransactions()}
              className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-white"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sm text-art-secondary">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-art-primary/20 border-t-art-primary" />
            Loading transactions…
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-art-background text-art-muted">
              <CreditCard size={24} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-art-display text-lg font-semibold text-art-text">
              {transactions.length === 0 ? "No transactions yet" : "No matching transactions"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-art-secondary">
              {transactions.length === 0
                ? "Completed purchases and membership payments will appear here."
                : "Try changing your search or filters to see more results."}
            </p>
            {(search || statusFilter !== "all" || typeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-art-primary hover:underline"
              >
                <XCircle size={14} aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-art-border bg-art-background/50 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-art-muted">
                  <th className="px-5 py-3.5">Transaction</th>
                  <th className="px-4 py-3.5">Buyer</th>
                  <th className="px-4 py-3.5">Item</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id || transaction.transactionId}
                    className="border-b border-art-border last:border-0 hover:bg-art-background/40"
                  >
                    <td className="px-5 py-4">
                      <p className="max-w-[150px] truncate font-mono text-xs font-semibold text-art-text" title={transaction.transactionId}>
                        {transaction.transactionId || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-[180px] truncate text-sm font-medium text-art-text">
                        {transaction.buyerName || "Collector"}
                      </p>
                      <p className="max-w-[180px] truncate text-xs text-art-muted">
                        {transaction.buyerEmail || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-[180px] truncate text-sm text-art-text">
                        {transaction.artworkTitle ||
                          (transaction.tier
                            ? `${transaction.tier} membership`
                            : "—")}
                      </p>
                      {transaction.artistName && (
                        <p className="max-w-[180px] truncate text-xs text-art-muted">
                          by {transaction.artistName}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-art-background px-2.5 py-1 text-xs capitalize text-art-secondary">
                        {transaction.type || "—"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-art-secondary">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-art-muted" aria-hidden="true" />
                        {formatDate(transaction.createdAt)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-art-text">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
