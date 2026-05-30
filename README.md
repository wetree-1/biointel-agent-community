# 智能体社区

BioIntelOS **Agent** 能力管理 — 本组负责 Agent 入库与规范；Skill 由 Skills 小组负责。

**从这里开始：**

| 我要… | 打开 |
|--------|------|
| 知道项目干什么 | [docs/方案.md](./docs/方案.md) |
| 今天该做什么 | [docs/执行清单.md](./docs/执行清单.md) |
| demo 之后怎么扩 | [docs/拓展路线.md](./docs/拓展路线.md) |
| 登记 / 改 Agent | [社区demo/docs/agent-sop.md](./社区demo/docs/agent-sop.md) |
| 本地预览 / 部署 | 双击 `run.bat` 或 [社区demo/docs/deploy.md](./社区demo/docs/deploy.md) |
| 和平台开会 | [docs/对接提问清单.md](./docs/对接提问清单.md) |

---

## 核心：`社区demo/`

```
社区demo/
├── agents/*/agent.yaml    ← 改这里登记 Agent
├── scripts/export_json.py
├── web/                   ← 列表 + 详情页
└── docs/                  ← SOP、模板、部署
```

```powershell
cd "d:\智能体社区"
python tools\build_github_dist.py   # 构建
# 或双击 run.bat                     # 构建 + 本地预览
```

---

## 平台

https://biointelos.xdataspeak.com/#/login

**当前阶段**：Phase 1 — 规范 + 目录 + 能演示（突破口是 demo，详见 [拓展路线](./docs/拓展路线.md)）
