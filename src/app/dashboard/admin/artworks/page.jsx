import CategoryDonutChart from "@/components/admin/CategoryDonutChart";
import ManageCollections from "@/components/admin/ManageCollections";

export default function AdminArtworksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">
          Artwork Catalog & Moderation
        </h2>
        <p className="mt-1 text-sm text-art-secondary">
          Review artwork submissions, monitor category distribution, and inspect listings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryDonutChart />
        </div>
        <div className="lg:col-span-2">
          <ManageCollections />
        </div>
      </div>
    </div>
  );
}
