import ManageCollections from "@/components/admin/ManageCollections";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">
          User Management
        </h2>
        <p className="mt-1 text-sm text-art-secondary">
          Review, approve, and manage registered collectors, verified artists, and gallery partners.
        </p>
      </div>

      <ManageCollections />
    </div>
  );
}
