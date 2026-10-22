const list = document.querySelector("#starred");

if (!list) {
  console.error("Starred list container not found.");
} else {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const renderList = (events) => {
    if (!Array.isArray(events)) {
      throw new Error("Expected an array of events.");
    }

    list.innerHTML = "";

    const fragment = document.createDocumentFragment();

    events.forEach(({ name, starred }) => {
      if (!name || !starred) {
        return;
      }

      const item = document.createElement("li");
      item.className = "starred-item";

      const repoName = document.createElement("span");
      repoName.className = "repo-name";
      repoName.textContent = name;

      const date = document.createElement("time");
      date.dateTime = starred;
      date.textContent = `Starred ${formatDate(starred)}`;

      item.append(repoName, date);
      fragment.appendChild(item);
    });

    if (!fragment.childNodes.length) {
      const emptyState = document.createElement("li");
      emptyState.className = "empty-state";
      emptyState.textContent = "No starred repositories yet.";
      list.appendChild(emptyState);
      return;
    }

    list.appendChild(fragment);
  };

  fetch("events.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json();
    })
    .then((events) => {
      renderList(events);
    })
    .catch((error) => {
      console.error("Unable to load starred repositories:", error);
      list.innerHTML = '<li class="error-state">Unable to load starred repositories right now.</li>';
    });
}
