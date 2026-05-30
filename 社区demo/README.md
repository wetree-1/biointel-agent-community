# Agent 社区 Demo

**可运行的 Agent 目录**：yaml 登记 → 导出 JSON → 网页展示。

上级入口：[../README.md](../README.md) · 执行清单：[../docs/执行清单.md](../docs/执行清单.md)

## 目录

```
社区demo/
├── agents/              # Agent 源数据（编辑这里）
├── docs/
│   ├── agent-sop.md     # 登记 SOP
│   ├── deploy.md        # 部署
│   └── templates/       # agent.yaml 模板
├── scripts/export_json.py
└── web/                 # 前端（列表 + 详情）
```

## 本地运行

```powershell
cd "d:\智能体社区"
python tools\build_github_dist.py
cd dist
python -m http.server 8080
```

或直接双击根目录 **`run.bat`** → http://localhost:8080

## 改 Agent 后

改 `agents/*/agent.yaml` → 运行 build → 刷新页面。详见 [docs/agent-sop.md](./docs/agent-sop.md)。

## 说明

- 当前为 mock 数据；平台真实清单到位后在 `agents/` 追加 yaml 即可
- skill_chain 中的 Skill id 需与 Skills 组对齐
