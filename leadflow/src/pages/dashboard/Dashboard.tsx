function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your leads and outreach campaigns.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Leads
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Campaigns
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Emails Sent
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;