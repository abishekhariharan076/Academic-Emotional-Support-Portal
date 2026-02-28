export default function NotifBadge({ count }) {
  if (!count || count <= 0) return null;

  return (
    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
