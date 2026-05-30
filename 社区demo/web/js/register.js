const skillList = document.getElementById("skill-chain-list");
const form = document.getElementById("register-form");
const resultPanel = document.getElementById("result-panel");
const yamlOutput = document.getElementById("yaml-output");
const filenameHint = document.getElementById("filename-hint");

let lastYaml = "";
let lastId = "";

function addSkillRow(data = {}) {
  const row = document.createElement("div");
  row.className = "skill-row";
  row.innerHTML = `
    <label>Skill ID
      <input type="text" class="skill-id" placeholder="scrna-qc-filter" value="${escAttr(data.skill || "")}" />
    </label>
    <label>步骤名称
      <input type="text" class="skill-name" placeholder="质控过滤" value="${escAttr(data.name || "")}" />
    </label>
    <label>input_from（可选）
      <input type="text" class="skill-input-from" placeholder="上一步.skill.output" value="${escAttr(data.input_from || "")}" />
    </label>
    <button type="button" class="btn btn-secondary btn-remove" title="删除">×</button>
  `;
  row.querySelector(".btn-remove").addEventListener("click", () => {
    if (skillList.children.length > 1) row.remove();
  });
  skillList.appendChild(row);
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function yamlScalar(value) {
  const s = String(value ?? "").trim();
  if (!s) return '""';
  if (/^[a-zA-Z0-9._-]+$/.test(s)) return s;
  return (
    '"' +
    s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") +
    '"'
  );
}

function parsePipeLines(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return { name: parts[0] || "", type: parts[1] || "", description: parts[2] || "" };
    });
}

function buildYaml(data) {
  const lines = [];
  lines.push(`id: ${yamlScalar(data.id)}`);
  lines.push(`name: ${yamlScalar(data.name)}`);
  lines.push(`version: ${yamlScalar(data.version || "1.0.0")}`);
  lines.push(`domain: ${yamlScalar(data.domain)}`);
  lines.push(`author: ${yamlScalar(data.author)}`);
  lines.push(`description: ${yamlScalar(data.description)}`);
  lines.push("");
  lines.push("scenario:");
  lines.push(`  title: ${yamlScalar(data.scenario_title || "—")}`);
  lines.push(`  summary: ${yamlScalar(data.scenario_summary || "")}`);
  lines.push("");
  lines.push("capabilities:");
  if (data.capabilities.length) {
    data.capabilities.forEach((c) => lines.push(`  - ${yamlScalar(c)}`));
  } else {
    lines.push("  - 待补充");
  }
  lines.push("");
  lines.push("skill_chain:");
  if (data.skill_chain.length) {
    data.skill_chain.forEach((step) => {
      lines.push(`  - skill: ${yamlScalar(step.skill)}`);
      lines.push(`    name: ${yamlScalar(step.name || step.skill)}`);
      if (step.input_from) lines.push(`    input_from: ${yamlScalar(step.input_from)}`);
    });
  } else {
    lines.push("  - skill: mock-skill-id");
    lines.push("    name: 待 Skills 组确认");
  }
  lines.push("");
  lines.push("io:");
  lines.push("  input:");
  if (data.inputs.length) {
    data.inputs.forEach((x) => {
      lines.push(`    - name: ${yamlScalar(x.name)}`);
      lines.push(`      type: ${yamlScalar(x.type)}`);
      lines.push(`      description: ${yamlScalar(x.description)}`);
    });
  } else {
    lines.push("    - name: input_data");
    lines.push("      type: csv");
    lines.push(`      description: ${yamlScalar("待补充")}`);
  }
  lines.push("  output:");
  if (data.outputs.length) {
    data.outputs.forEach((x) => {
      lines.push(`    - name: ${yamlScalar(x.name)}`);
      lines.push(`      type: ${yamlScalar(x.type)}`);
      lines.push(`      description: ${yamlScalar(x.description)}`);
    });
  } else {
    lines.push("    - name: report");
    lines.push("      type: html");
    lines.push(`      description: ${yamlScalar("分析报告")}`);
  }
  if (data.evaluation.length) {
    lines.push("");
    lines.push("evaluation:");
    data.evaluation.forEach((e) => {
      lines.push(`  - name: ${yamlScalar(e.name)}`);
      lines.push(`    threshold: ${e.threshold}`);
      lines.push(`    description: ${yamlScalar(e.description)}`);
    });
  }
  lines.push("");
  lines.push("tags:");
  lines.push("  - registered-via-form");
  return lines.join("\n") + "\n";
}

function collectForm() {
  const fd = new FormData(form);
  const skill_chain = [...skillList.querySelectorAll(".skill-row")].map((row) => ({
    skill: row.querySelector(".skill-id").value.trim(),
    name: row.querySelector(".skill-name").value.trim(),
    input_from: row.querySelector(".skill-input-from").value.trim(),
  })).filter((s) => s.skill);

  const evaluation = parsePipeLines(fd.get("evaluation")).map((e) => ({
    name: e.name,
    threshold: parseFloat(e.type) || 0,
    description: e.description,
  }));

  return {
    id: fd.get("id").trim(),
    name: fd.get("name").trim(),
    version: fd.get("version").trim() || "1.0.0",
    domain: fd.get("domain").trim(),
    author: fd.get("author").trim(),
    description: fd.get("description").trim(),
    scenario_title: fd.get("scenario_title").trim(),
    scenario_summary: fd.get("scenario_summary").trim(),
    capabilities: String(fd.get("capabilities") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    skill_chain,
    inputs: parsePipeLines(fd.get("inputs")),
    outputs: parsePipeLines(fd.get("outputs")),
    evaluation,
  };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = collectForm();
  if (!/^[a-z0-9-]+$/.test(data.id)) {
    alert("Agent ID 只能用小写字母、数字和连字符（如 my-agent-1）");
    return;
  }
  lastYaml = buildYaml(data);
  lastId = data.id;
  yamlOutput.textContent = lastYaml;
  filenameHint.textContent = `${data.id}/agent.yaml`;
  resultPanel.classList.remove("hidden");
  resultPanel.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("add-skill").addEventListener("click", () => addSkillRow());

document.getElementById("btn-download").addEventListener("click", () => {
  if (!lastYaml) return;
  const blob = new Blob([lastYaml], { type: "text/yaml;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "agent.yaml";
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById("btn-copy").addEventListener("click", async () => {
  if (!lastYaml) return;
  try {
    await navigator.clipboard.writeText(lastYaml);
    alert("已复制到剪贴板，可粘贴发给负责人。");
  } catch {
    alert("复制失败，请手动选中下方文本复制。");
  }
});

addSkillRow();
addSkillRow();
