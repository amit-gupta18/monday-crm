import { useEffect, useState } from "react";

export default function Popup() {
  const [data, setData] = useState({});
  const [tab, setTab] = useState("contacts");

  useEffect(() => {
    chrome.storage.local.get("monday_data", res => {
      setData(res.monday_data || {});
    });
  }, []);

  const extract = () => {
    chrome.runtime.sendMessage({ action: "EXTRACT_CURRENT_BOARD" });
  };

  const del = (id) => {
    chrome.runtime.sendMessage({
      action: "DELETE_RECORD",
      boardType: tab,
      id
    });
    setData(prev => ({
      ...prev,
      [tab]: prev[tab].filter(i => i.id !== id)
    }));
  };

  return (
    <div className="p-3 w-80">
      <button onClick={extract} className="bg-indigo-600 text-white px-3 py-1 rounded">
        Extract Current Board
      </button>

      <div className="flex gap-2 mt-3">
        {["contacts", "deals"].map(t => (
          <button key={t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <ul className="mt-3 text-sm">
        {(data[tab] || []).map(item => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <button onClick={() => del(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
