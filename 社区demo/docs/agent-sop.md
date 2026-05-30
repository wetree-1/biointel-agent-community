# Agent 登记 SOP（1 页）

> **适用**：`社区demo/` 目录下的 Agent 入库与上线  
> **前提**：Skill 由 Skills 组维护；本 SOP 只讲 **如何登记 Agent、更新网页、部署**

---

## 一、整体流程（和你题库项目对齐）

| 你熟悉的（题库检索） | 本项目（Agent 社区 Demo） |
|---------------------|---------------------------|
| 改 `app.py` / `tiku/` | 改页面代码，或改 `agents/*/agent.yaml` |
| `tools\build_github_dist.ps1` | **同一个名字**：根目录 `tools\build_github_dist.ps1` |
| 上传 `dist/` 到 GitHub | `git push`（整仓或只传 dist 均可） |
| Streamlit **Reboot** | **不需要** — 静态站 push 后 GitHub Actions 自动更新 |
| 题目在 **数据库** 里改 | **现阶段** Agent 在 **yaml** 里改（平台库未接） |

```
① 改代码（根目录）或改 agents/*/agent.yaml
        ↓
② tools\build_github_dist.ps1   ← 导出 JSON + 同步 dist/
        ↓
③ git add / commit / push       ← 约 1～2 分钟线上生效
```

> **以后接 BioIntelOS 平台**：Agent 列表可能改由平台 API / 数据库提供，那时登记 Agent 就像你「题库编辑」改库，不必再动 yaml。

---

## 二、① 新增 / 修改 Agent（agent.yaml）

### 2.1 目录规则

每个 Agent 一个文件夹，内含一个 `agent.yaml`：

```
社区demo/agents/
└── 你的-agent-id/          ← 文件夹名建议与 id 一致
    └── agent.yaml
```

**复制现有 Agent 改最快：**

```powershell
cd "d:\智能体社区\社区demo\agents"
mkdir my-new-agent
copy scrna-full-analysis\agent.yaml my-new-agent\agent.yaml
```

然后用编辑器打开 `my-new-agent/agent.yaml`，改下面这些 **必填项**：

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 唯一标识，与文件夹名一致 | `my-new-agent` |
| `name` | 显示名称 | `我的新 Agent` |
| `version` | 版本号 | `1.0.0` |
| `domain` | 领域标签 | `scrna-seq` |
| `description` | 一句话描述 | 列表页卡片上显示 |
| `skill_chain` | 引用的 Skill 列表 | id 需与 Skills 组一致 |
| `io` | 整体输入 / 输出 | 详情页展示 |

### 2.2 skill_chain 注意

- `skill:` 填 **Skills 组注册表里的 Skill id**（demo 阶段可先写 mock id）
- 顺序即调用顺序；有上下游时用 `input_from` 标明

### 2.3 保存前自检

- [ ] `id` 与文件夹名一致
- [ ] 缩进用 **空格**，不要用 Tab
- [ ] 改的是 `agents/` 下的 yaml，**不要手改** `web/data/agents.json`

---

## 三、② 导出 JSON（yaml → 网页数据）

在终端执行：

```powershell
pip install pyyaml
python "d:\智能体社区\社区demo\scripts\export_json.py"
```

**成功时会看到：**

```
  + scrna-full-analysis
  + proteomics-diff-analysis
  + my-new-agent

已导出 N 个 Agent:
  -> ...\社区demo\data\agents.json
  -> ...\社区demo\web\data\agents.json
```

**规则：** 每次改完 `agent.yaml` 都要 **重新跑一遍** export，网页才会更新。

**export 失败常见原因：**

| 现象 | 处理 |
|------|------|
| 提示安装 pyyaml | `pip install pyyaml` |
| yaml 缩进报错 | 检查空格对齐，用在线 YAML 校验工具 |
| 未找到 agent | 确认路径为 `agents/某名字/agent.yaml` |

---

## 四、③ 本地预览

```powershell
cd "d:\智能体社区\社区demo\web"
python -m http.server 8080
```

浏览器打开：**http://localhost:8080**

- 列表页：应能看到新 Agent
- 点击卡片：详情页应显示 skill_chain、输入输出

---

## 五、③ 部署到云端

见 **[deploy.md](./deploy.md)**。

简要：

```powershell
cd "d:\智能体社区"
python tools\build_github_dist.py
git add . && git commit -m "update" && git push
```

或双击根目录 **`run.bat`** 本地预览；Netlify 可拖 **`dist/`**。

---

## 六、快速命令备忘

```powershell
# 构建（yaml → json → dist）
python "d:\智能体社区\tools\build_github_dist.py"

# 本地看效果（或双击 run.bat）
cd "d:\智能体社区\dist"
python -m http.server 8080
```

---

## 七、相关文件

| 路径 | 作用 |
|------|------|
| `agents/*/agent.yaml` | Agent 源数据（你要编辑的） |
| `docs/templates/agent.yaml` | 空白模板 |
| `scripts/export_json.py` | 导出脚本（build 会自动调用） |
| `web/data/agents.json` | 网页数据（自动生成，勿手改） |
| `docs/deploy.md` | 部署说明 |

---

*版本 v1.0 | 与社区 demo 配套使用*
