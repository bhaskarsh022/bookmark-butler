document.getElementById("saveTabs").addEventListener("click", saveTabs);
document.getElementById("savedSessions").addEventListener("click", handleSavedSessionClick);

function saveTabs() {
  const sessionTitle = document.getElementById("sessionTitle").value || "Untitled";
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const tabUrls = tabs.map((tab) => tab.url);
    chrome.storage.sync.get("savedSessions", function (result) {
      const savedSessions = result.savedSessions || [];
      savedSessions.push({ title: sessionTitle, tabs: tabUrls });
      chrome.storage.sync.set({ savedSessions: savedSessions }, function () {
        renderSavedSessions();
        document.getElementById("sessionTitle").value = "";
      });
    });
  });
}

function handleSavedSessionClick(e) {
  if (e.target.classList.contains("delete-btn")) {
    const index = parseInt(e.target.dataset.index, 10);
    chrome.storage.sync.get("savedSessions", function (result) {
      const savedSessions = result.savedSessions || [];
      savedSessions.splice(index, 1);
      chrome.storage.sync.set({ savedSessions: savedSessions }, renderSavedSessions);
    });
  } else if (e.target.classList.contains("session") || e.target.parentElement.classList.contains("session")) {
    const index = e.target.dataset.index || e.target.parentElement.dataset.index;
    chrome.storage.sync.get("savedSessions", function (result) {
      const savedSessions = result.savedSessions || [];
      const session = savedSessions[index];
      if (session) {
        chrome.windows.create({ url: session.tabs });
      }
    });
  }
}

function renderSavedSessions() {
  chrome.storage.sync.get("savedSessions", function (result) {
    const savedSessions = result.savedSessions || [];
    const savedSessionsDiv = document.getElementById("savedSessions");
    savedSessionsDiv.innerHTML = "";
    for (let i = 0; i < savedSessions.length; i++) {
      const session = savedSessions[i];
      const sessionDiv = document.createElement("div");
      sessionDiv.className = "session";
      sessionDiv.dataset.index = i;

      const sessionTitle = document.createElement("div");
      sessionTitle.className = "session-title";
      sessionTitle.textContent = session.title;
      sessionDiv.appendChild(sessionTitle);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.dataset.index = i;
      deleteButton.textContent = "Delete session";
      sessionDiv.appendChild(deleteButton);

      savedSessionsDiv.appendChild(sessionDiv);
    }
  });
}

renderSavedSessions();
