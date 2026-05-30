let agents = [];

function getDomains() {
  const set = new Set(agents.map((a) => a.domain).filter(Boolean));
  return ["全部", ...Array.from(set).sort()];
}

async function loadAgents() {
  const res = await fetch("./data/agents.json");
  if (!res.ok) throw new Error("无法加载 agents.json，请用本地服务器打开（见 README）");
  agents = await res.json();
}

function getQueryId() {
  return new URLSearchParams(location.search).get("id");
}

function renderList() {
  document.getElementById("view-list").classList.remove("hidden");
  document.getElementById("view-detail").classList.add("hidden");

  const q = (document.getElementById("search").value || "").trim().toLowerCase();
  const domain = document.getElementById("domain-filter").value;

  const filtered = agents.filter((a) => {
    const matchDomain = domain === "全部" || a.domain === domain;
    const text = `${a.name} ${a.description} ${a.domain}`.toLowerCase();
    const matchSearch = !q || text.includes(q);
    return matchDomain && matchSearch;
  });

  const grid = document.getElementById("agent-grid");
  if (!filtered.length) {
    grid.innerHTML = '<div class="empty">没有匹配的 Agent</div>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (a) => `
    <article class="agent-card" data-id="${a.id}">
      <div class="meta">
        <span class="tag domain">${a.domain}</span>
        <span class="tag">v${a.version}</span>
      </div>
      <h2>${a.name}</h2>
      <p>${a.description}</p>
    </article>
  `
    )
    .join("");

  grid.querySelectorAll(".agent-card").forEach((el) => {
    el.addEventListener("click", () => {
      location.search = `?id=${el.dataset.id}`;
      route();
    });
  });
}

function renderDetail(id) {
  const agent = agents.find((a) => a.id === id);
  if (!agent) {
    location.search = "";
    route();
    return;
  }

  document.getElementById("view-list").classList.add("hidden");
  document.getElementById("view-detail").classList.remove("hidden");

  document.getElementById("detail-title").textContent = agent.name;
  document.getElementById("detail-meta").innerHTML = `
    <span class="tag domain">${agent.domain}</span>
    <span class="tag">v${agent.version}</span>
    <span class="tag">${agent.author || "—"}</span>
  `;
  document.getElementById("detail-desc").textContent = agent.description;

  const scenario = agent.scenario || {};
  document.getElementById("detail-scenario").innerHTML = `
    <p><strong>${scenario.title || "—"}</strong></p>
    <p style="margin-top:0.5rem;color:#555">${scenario.summary || ""}</p>
  `;

  document.getElementById("detail-capabilities").innerHTML = (agent.capabilities || [])
    .map((c) => `<span class="tag" style="margin:0.25rem">${c}</span>`)
    .join("");

  document.getElementById("detail-chain").innerHTML = (agent.skill_chain || [])
    .map(
      (step, i) => `
    <div class="chain-step">
      <div class="chain-num">${i + 1}</div>
      <div class="chain-body">
        <strong>${step.name || step.skill}</strong>
        <small>skill: ${step.skill}</small>
        ${step.input_from ? `<br><small>input_from: ${step.input_from}</small>` : ""}
      </div>
    </div>
  `
    )
    .join("");

  const io = agent.io || {};
  const ioLines = [];
  (io.input || []).forEach((x) => {
    ioLines.push(`<div class="io-row"><span class="label">输入</span><span>${x.name} (${x.type}) — ${x.description || ""}</span></div>`);
  });
  (io.output || []).forEach((x) => {
    ioLines.push(`<div class="io-row"><span class="label">输出</span><span>${x.name} (${x.type}) — ${x.description || ""}</span></div>`);
  });
  document.getElementById("detail-io").innerHTML = ioLines.join("") || "<p>—</p>";

  document.getElementById("btn-use").onclick = () => {
    alert(
      `「${agent.name}」的使用入口待接入 BioIntelOS 平台。\n\n对接后此处将跳转到平台 Agent 运行页（上传数据、执行分析）。`
    );
  };
  document.getElementById("btn-feedback").onclick = () => {
    alert(
      `「${agent.name}」的意见反馈待接入。\n\n对接后此处将打开反馈表单或关联 Issue。`
    );
  };
}

function initFilters() {
  const sel = document.getElementById("domain-filter");
  sel.innerHTML = getDomains().map((d) => `<option value="${d}">${d === "全部" ? "全部领域" : d}</option>`).join("");
  sel.addEventListener("change", renderList);
  document.getElementById("search").addEventListener("input", renderList);
  document.getElementById("back-btn").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState({}, "", location.pathname);
    route();
  });
}

function route() {
  const id = getQueryId();
  if (id) renderDetail(id);
  else renderList();
}

async function init() {
  try {
    await loadAgents();
    initFilters();
    route();
    window.addEventListener("popstate", route);
  } catch (e) {
    document.getElementById("agent-grid").innerHTML = `<div class="empty">${e.message}</div>`;
  }
}

init();
