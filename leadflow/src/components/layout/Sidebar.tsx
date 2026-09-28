function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-gray-900">
          LeadFlow
        </span>
      </div>

      <nav className="space-y-1 p-4">
        <a
          href="#"
          className="block rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          Leads
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          Campaigns
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          Inbox
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          Settings
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;