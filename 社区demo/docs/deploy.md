# 部署说明

部署 **`dist/`** 或 **`社区demo/web/`**（纯静态，无后端）。

---

## 日常流程（推荐）

```powershell
cd "d:\智能体社区"
python tools\build_github_dist.py
git add . && git commit -m "update" && git push
```

或双击 **`run.bat`**（构建 + 本地 http://localhost:8080 预览）。

push 后 GitHub Actions 自动部署，**无需 Streamlit Reboot**。

---

## 第一次：Git + GitHub Pages

```powershell
cd "d:\智能体社区"
git init
git add .
git commit -m "Initial commit: Agent community demo"
git branch -M main
git remote add origin https://github.com/你的用户名/biointel-agent-community.git
git push -u origin main
```

仓库 → **Settings → Pages → Source 选 GitHub Actions**，等 Action 变绿。

也可双击 **`tools/首次部署.bat`**（构建 + git commit，push 需自行执行）。

---

## 最快演示：Netlify Drop（不用 Git）

1. 先运行 `python tools\build_github_dist.py`
2. 打开 https://app.netlify.com/drop
3. 拖 **`dist/`** 文件夹进去

---

## 部署前检查

- [ ] 已运行 build，`web/data/agents.json` 最新
- [ ] 本地预览正常
- [ ] 公网页：列表、详情、skill_chain 可见

---

## 常见问题

| 问题 | 处理 |
|------|------|
| 页面空白 | 勿用 `file://`；用 `run.bat` 或部署 |
| 列表为空 | 确认 build 已跑，`data/agents.json` 已上传 |
| 中文路径报错 | build 用 `tools/build_github_dist.py`；或拖 `dist/` 部署 |
