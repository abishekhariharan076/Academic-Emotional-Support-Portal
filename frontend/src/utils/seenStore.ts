const KEY = "aesp_seen_v1";

interface SeenStore {
  [category: string]: {
    [id: string]: boolean;
  };
}

function readStore(): SeenStore {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(obj: SeenStore): void {
  sessionStorage.setItem(KEY, JSON.stringify(obj));
}

// seen categories: "checkin_response", "support_reply"
export function isSeen(category: string, id: string): boolean {
  const store = readStore();
  return !!store[category]?.[id];
}

export function markSeen(category: string, id: string): void {
  const store = readStore();
  if (!store[category]) store[category] = {};
  store[category][id] = true;
  writeStore(store);
}

export function markManySeen(category: string, ids: string[] = []): void {
  const store = readStore();
  if (!store[category]) store[category] = {};
  ids.forEach((id) => {
    store[category][id] = true;
  });
  writeStore(store);
}

export function countUnseen(category: string, ids: string[] = []): number {
  const store = readStore();
  const cat = store[category] || {};
  let c = 0;
  ids.forEach((id) => {
    if (!cat[id]) c++;
  });
  return c;
}
