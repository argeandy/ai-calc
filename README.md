# ⚡ AI Hardware & Sizing Calculator

[![Deploy to GitHub Pages](https://github.com/andreasaugustin/ai-calc/actions/workflows/deploy.yml/badge.svg)](https://github.com/andreasaugustin/ai-calc/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Pure Client-Side](https://img.shields.io/badge/Architecture-100%25%20Client--Side-brightgreen)](https://github.com/andreasaugustin/ai-calc)

> **Ein interaktiver, rein client-seitiger Web-Kalkulator zur präzisen Dimensionierung von Hardware- und Rechenzentrumsanforderungen für moderne KI- und LLM-Usecases.**  
> *An interactive, pure client-side web calculator for precise GPU hardware sizing, memory breakdown (VRAM), throughput estimation, and TCO cost analysis for LLM inference (vLLM, TensorRT-LLM, SGLang).*

---

## 🚀 Live Demo

👉 **Online ausprobieren:** [https://andreasaugustin.github.io/ai-calc/](https://andreasaugustin.github.io/ai-calc/)

---

## ✨ Features

- **🤖 Umfassende Modell-Bibliothek (Open-Weights)**:
  - **Meta**: Llama 3.3 (70B), Llama 3.1 (405B, 70B, 8B), Llama 3.2 (3B)
  - **DeepSeek**: DeepSeek V3 (671B MoE / 37B Active), DeepSeek R1 (671B MoE Reasoning), Distill Qwen 32B
  - **Alibaba**: Qwen 2.5 (72B, 32B Coder, 14B, 7B)
  - **Mistral**: Mistral Large 2 (123B), Mixtral 8x22B, Mixtral 8x7B, Mistral NeMo (12B)
  - **Google & Microsoft**: Gemma 2 (27B, 9B), Phi-4 (14B), Command R+ (104B)
  - **⚙️ Custom Model Modus**: Benutzerdefinierte Parameter (B), Layer, KV-Heads und Hidden Size.

- **💾 Präzise VRAM- und KV-Cache-Berechnung**:
  - **Weights VRAM**: FP16/BF16, FP8, INT8, INT4 / AWQ / GPTQ, GGUF Quants.
  - **KV-Cache (PagedAttention)**: GQA / MHA und DeepSeek Multi-Head Latent Attention (MLA) mit FP16-, FP8- oder INT4-Präzision.
  - **Overhead**: CUDA Context Working Memory & Activation Buffer.

- **🖥️ Hardware- & GPU-Katalog**:
  - **Datacenter**: NVIDIA B200 SXM, H200 SXM (141GB), H100 SXM (80GB), A100 80GB, AMD Instinct MI300X (192GB HBM3).
  - **Enterprise Inference**: NVIDIA L40S (48GB), NVIDIA L4 (24GB / 72W), RTX 6000 Ada (48GB).
  - **Workstation / DIY**: NVIDIA RTX 5090 (32GB GDDR7), RTX 4090 (24GB).
  - **Apple Silicon**: Mac Studio M2 / M4 Ultra (128GB / 192GB Unified Memory).

- **📊 4 Integrierte Analysebereiche**:
  1. **⚡ Dimensionierung & Sizing**: Visueller VRAM-Balken, Spitzen-RPS, parallele Streams, GPU-Empfehlungsmatrix mit SLA-Checks.
  2. **💰 TCO & Kostenanalyse**: On-Premises 3-Jahres-Eigenbetrieb (Capex, Stromkosten basierend auf TDP & PUE-Faktor, Wartung) vs. Cloud Reserved/On-Demand vs. kommerzielle Token-APIs (OpenAI GPT-4o, Claude 3.5 Sonnet, DeepSeek API) mit **Break-Even-Amortisationszeit**.
  3. **🖥️ Cluster & Topologie**: Visuelle Partitionierung auf Server-Nodes, Darstellung der GPU-Dies, Memory Bandwidth, Tensor Parallelism Ranks und äquivalente Cloud-Instanzen (AWS EC2, Azure VM, GCP).
  4. **📄 Export & ADR**: Download als JSON, zustandsbehaftetes URL-Sharing (`#cfg=...`), Druckansicht/PDF und Export als Markdown Architecture Decision Record (ADR).

- **🌐 Vollständige Zweisprachigkeit & Themes**:
  - Nahtloser Wechsel zwischen **Deutsch (DE)** und **Englisch (EN)**.
  - Dark Mode & Light Mode mit Glassmorphism-Ästhetik.

---

## 🛠️ Lokale Installation & Start

Keine Build-Tools, Node.js-Server oder Datenbanken erforderlich. Das Projekt läuft nativ in jedem modernen Webbrowser:

```bash
# 1. Repository klonen
git clone https://github.com/andreasaugustin/ai-calc.git
cd ai-calc

# 2. Lokalen HTTP-Server starten (optional, oder index.html direkt öffnen)
python3 -m http.server 8080
# oder
npx -y serve -p 8080
```

Öffne anschließend **`http://localhost:8080`** in deinem Browser.

---

## 📁 Projektstruktur

```
ai-calc/
├── index.html                 # Semantische HTML5-Struktur & App-Shell
├── css/
│   ├── main.css              # Design-System, CSS Variablen & Themes (Dark/Light)
│   ├── components.css        # Glassmorphic Cards, Sliders, Tabellen & Topologie
│   └── responsive.css        # Responsive Breakpoints & PDF/Druck-Styles
├── js/
│   ├── data/
│   │   ├── models.js         # Modell-Katalog (Params, Layers, KV-Heads, GQA/MLA)
│   │   ├── gpus.js           # GPU-Katalog (VRAM, Bandbreite, TDP, Capex, Cloud)
│   │   └── presets.js        # Usecase-Vorlagen (RAG, Copilot, MoE, etc.)
│   ├── engine/
│   │   ├── calculator.js     # Mathematische Berechnungs-Engine (VRAM, Durchsatz, TTFT)
│   │   └── tco.js            # TCO-Berechnung (On-Prem Capex/Opex vs. Cloud vs. APIs)
│   ├── ui/
│   │   ├── i18n.js           # Sprachunterstützung (DE / EN)
│   │   ├── state.js          # Reaktiver State-Manager mit URL Hash Sync
│   │   ├── renderer.js       # Dynamischer UI- & SVG/DOM-Renderer
│   │   └── export.js         # Markdown ADR, JSON & Clipboard Exporter
│   └── app.js                # App-Initialisierung & Event-Handling
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions Workflow für GitHub Pages
├── .gitignore
├── LICENSE                   # MIT License
└── README.md
```

---

## 🔒 Sicherheit & Datenschutz

- **100% Client-Side**: Alle Eingaben und Berechnungen verbleiben vollständig in Ihrem Browser.
- **Keine Telemetrie / Tracking**: Keine Tracker, keine Cookies, keine Third-Party Requests.
- **OWASP Top 10 konform**: Strikte Input-Validierung und sanitisiertes DOM-Rendering.

---

## 📄 Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert.
