export function buildMoodTrend(checkIns, limit = 10) {
  // checkIns already sorted (latest first). We want oldest -> newest for chart.
  const items = (checkIns || []).slice(0, limit).reverse();

  return items.map((c, idx) => {
    const d = new Date(c.createdAt);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return {
      idx: idx + 1,
      label,
      mood: Number(c.moodLevel || 0),
    };
  });
}

export function countStatuses(checkIns) {
  let open = 0;
  let reviewed = 0;

  (checkIns || []).forEach((c) => {
    if (c.status === "reviewed") reviewed++;
    else open++;
  });

  return { open, reviewed };
}
