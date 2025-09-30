import React from "react";
import { Link } from "@inertiajs/react";

type LinkItem = {
  url: string | null;
  label: string;
  active?: boolean;
};

export default function TablePaginate({ links }: { links?: LinkItem[] }) {
  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <div className="flex items-center justify-center space-x-1 py-4">
      {links.map((link, idx) => {
        // Laravel sometimes returns labels with HTML (eg. &laquo; &raquo;),
        // so we use dangerouslySetInnerHTML for the label.
        const label = link.label;
        const url = link.url;
        const active = !!link.active;

        // disabled/no-url (e.g. "..." placeholder)
        if (!url) {
          return (
            <span
              key={idx}
              className="px-3 py-1 text-sm text-gray-500"
              dangerouslySetInnerHTML={{ __html: label }}
            />
          );
        }

        return (
          <Link
            key={idx}
            href={url}
            // preserveState: false by default for pagination (so we re-fetch)
            // adjust if you want to preserve local state
            className={`px-3 py-1 text-sm border rounded-md ${
              active ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        );
      })}
    </div>
  );
}
