#!/usr/bin/env python3
"""从 agents/*/agent.yaml 导出 web 使用的 agents.json"""

import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("请先安装: pip install pyyaml")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
AGENTS_DIR = ROOT / "agents"
OUT_DATA = ROOT / "data" / "agents.json"
OUT_WEB = ROOT / "web" / "data" / "agents.json"


def load_agent(yaml_path: Path) -> dict:
    with open(yaml_path, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if not data or "id" not in data:
        raise ValueError(f"无效 agent.yaml: {yaml_path}")
    return data


def main():
    agents = []
    for yaml_path in sorted(AGENTS_DIR.glob("*/agent.yaml")):
        agents.append(load_agent(yaml_path))
        print(f"  + {yaml_path.parent.name}")

    if not agents:
        print(f"未找到 agent.yaml，请检查 {AGENTS_DIR}")
        sys.exit(1)

    payload = json.dumps(agents, ensure_ascii=False, indent=2)
    OUT_DATA.parent.mkdir(parents=True, exist_ok=True)
    OUT_WEB.parent.mkdir(parents=True, exist_ok=True)
    OUT_DATA.write_text(payload, encoding="utf-8")
    OUT_WEB.write_text(payload, encoding="utf-8")
    print(f"\n已导出 {len(agents)} 个 Agent:")
    print(f"  -> {OUT_DATA}")
    print(f"  -> {OUT_WEB}")


if __name__ == "__main__":
    main()
