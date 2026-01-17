const DEFAULT_DATA = {
  contacts: [],
  deals: [],
  leads: [],
  activities: [],
  lastSync: {}
};

function mergeById(existing = [], incoming = []) {
  const map = new Map(existing.map(i => [i.id, i]));
  incoming.forEach(i => map.set(i.id, i));
  return Array.from(map.values());
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "EXTRACT_CURRENT_BOARD") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { action: "START_EXTRACTION" });
    });
  }

  if (msg.action === "STORE_DATA") {
    chrome.storage.local.get("monday_data", res => {
      const data = res.monday_data || DEFAULT_DATA;
      data[msg.boardType] = mergeById(data[msg.boardType], msg.payload);
      data.lastSync[msg.boardType] = Date.now();
      chrome.storage.local.set({ monday_data: data });
    });
  }

  if (msg.action === "DELETE_RECORD") {
    chrome.storage.local.get("monday_data", res => {
      const data = res.monday_data;
      data[msg.boardType] = data[msg.boardType].filter(
        i => i.id !== msg.id
      );
      chrome.storage.local.set({ monday_data: data });
    });
  }
});
