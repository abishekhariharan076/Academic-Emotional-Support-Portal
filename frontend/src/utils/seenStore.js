const KEY = "aesp_seen_v1";

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

// seen categories: "checkin_response", "support_reply"
export function isSeen(category, id) {
  const store = readStore();
  return !!store?.[category]?.[id];
}

export function markSeen(category, id) {
  const store = readStore();
  store[category] = store[category] || {};
  store[category][id] = true;
  writeStore(store);
}

export function markManySeen(category, ids = []) {
  const store = readStore();
  store[category] = store[category] || {};
  ids.forEach((id) => {
    store[category][id] = true;
  });
  writeStore(store);
}

export function countUnseen(category, ids = []) {
  const store = readStore();
  const cat = store?.[category] || {};
  let c = 0;
  ids.forEach((id) => {
    if (!cat[id]) c++;
  });
  return c;
}
