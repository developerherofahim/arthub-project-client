"use client";

import { useState } from "react";
import BoughtArtworks from "./BoughtArtworks";

const tabs = [
  { id: "bought", label: "Bought Artworks" },
  { id: "history", label: "Purchase History" },
  { id: "subscription", label: "Subscription Tier" },
];

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("bought");

  return (
    <div className="mt-6 sm:mt-8">
      {/* Tab list - scrollable on mobile */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto border-b border-art-border pb-px scrollbar-hide sm:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative shrink-0 pb-3 text-sm font-medium transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "text-art-text"
                    : "text-art-muted hover:text-art-secondary"
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-art-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="mt-5 sm:mt-6">
        {activeTab === "bought" && <BoughtArtworks />}
        {activeTab === "history" && (
          <div className="rounded-2xl border border-art-border bg-white p-8 sm:p-12 text-center text-sm text-art-muted">
            Purchase history coming soon…
          </div>
        )}
        {activeTab === "subscription" && (
          <div className="rounded-2xl border border-art-border bg-white p-8 sm:p-12 text-center text-sm text-art-muted">
            Subscription management coming soon…
          </div>
        )}
      </div>
    </div>
  );
}