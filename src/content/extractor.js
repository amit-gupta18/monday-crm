function showIndicator(text, color = "#4f46e5") {
  let container = document.getElementById("__monday_ext_indicator");
  if (!container) {
    container = document.createElement("div");
    container.id = "__monday_ext_indicator";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "999999";
    const shadow = container.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <div style="background:${color};padding:8px 12px;border-radius:8px;color:white;font-size:12px;">
        ${text}
      </div>`;
    document.body.appendChild(container);
  }
}

function detectBoardType() {
  const url = window.location.href;
  if (url.includes("contacts")) return "contacts";
  if (url.includes("deals")) return "deals";
  if (url.includes("leads")) return "leads";
  return null;
}

function extractContacts() {
  const rows = document.querySelectorAll("[data-row-id]");
  return [...rows].map(row => ({
    id: row.dataset.rowId,
    name: row.innerText.split("\n")[0] || "",
    email: "",
    phone: "",
    company: "",
    owner: ""
  }));
}

function extractDeals() {
  const rows = document.querySelectorAll("[data-row-id]");
  return [...rows].map(row => ({
    id: row.dataset.rowId,
    name: row.innerText.split("\n")[0],
    value: "",
    stage: "",
    group: row.closest("[data-group-id]")?.innerText || "Unknown"
  }));
}

chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === "START_EXTRACTION") {
    showIndicator("Extracting...");
    const boardType = detectBoardType();
    let data = [];

    if (boardType === "contacts") data = extractContacts();
    if (boardType === "deals") data = extractDeals();

    chrome.runtime.sendMessage({
      action: "STORE_DATA",
      boardType,
      payload: data
    });

    showIndicator("Extraction Complete", "#16a34a");
  }
});
