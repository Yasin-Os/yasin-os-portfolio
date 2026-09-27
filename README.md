# 🚀 Portfolio Website

### Development & Deployment Workflow

A modern personal portfolio website built through an AI-assisted development workflow, from initial planning and UI/UX design to coding, version control, backend integration, deployment, and custom domain configuration.

---

## 🧩 Development Workflow

```mermaid
flowchart TD

    A["💡 Project Idea"]
    B["🤖 ChatGPT<br/>Planning & Prompts"]
    C["🎨 Lovable AI<br/>UI/UX + Coding"]
    D["📦 ZIP Export<br/>Source Code"]
    E["🧠 AI Studio<br/>Code Editing"]
    F["📱 Termux<br/>Git Workflow"]
    G["🐙 GitHub<br/>Source Control"]
    H["▲ Vercel<br/>Deployment"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H

    H --> I["☁️ Supabase<br/>Backend"]
    H --> J["🌐 ReadySite<br/>Domain"]

    I --> I1["🗄️ Database"]
    I --> I2["📁 Storage"]
    I --> I3["⚙️ Backend / API"]

    J --> J1["🔗 Custom Domain"]
    J --> J2["🌍 DNS"]

    I --> K["🚀 Live Portfolio"]
    J --> K

    classDef idea fill:#FFF3CD,stroke:#F59E0B,color:#7C2D12,stroke-width:2px;
    classDef ai fill:#DBEAFE,stroke:#3B82F6,color:#1E3A8A,stroke-width:2px;
    classDef design fill:#F3E8FF,stroke:#A855F7,color:#581C87,stroke-width:2px;
    classDef code fill:#E0E7FF,stroke:#6366F1,color:#312E81,stroke-width:2px;
    classDef git fill:#F1F5F9,stroke:#64748B,color:#0F172A,stroke-width:2px;
    classDef deploy fill:#CCFBF1,stroke:#14B8A6,color:#134E4A,stroke-width:2px;
    classDef cloud fill:#DCFCE7,stroke:#22C55E,color:#14532D,stroke-width:2px;
    classDef domain fill:#E0F2FE,stroke:#0EA5E9,color:#0C4A6E,stroke-width:2px;
    classDef live fill:#FEF3C7,stroke:#F59E0B,color:#78350F,stroke-width:3px;

    class A idea;
    class B ai;
    class C design;
    class D,E code;
    class F,G git;
    class H deploy;
    class I,I1,I2,I3 cloud;
    class J,J1,J2 domain;
    class K live;
```

---

## 🛠️ Technology Stack

| Category | Technology |
|:---|:---|
| 🤖 AI Planning | ChatGPT |
| 🎨 UI/UX & Development | Lovable AI |
| 🧠 Code Editing | AI Studio |
| 📱 Development Environment | Termux |
| 🐙 Version Control | GitHub |
| 🚀 Deployment | Vercel |
| ☁️ Backend & Database | Supabase |
| 🌐 Domain & DNS | ReadySite |

---

## 🔄 Project Flow

**Idea → ChatGPT → Lovable AI → ZIP Export → AI Studio → Termux → GitHub → Vercel → Supabase + ReadySite → Live Portfolio**

---

## ☁️ Backend Architecture

```text
                 🌐 LIVE PORTFOLIO WEBSITE
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      ▲ Vercel Deployment          🌐 Custom Domain
             │                           │
             ▼                           ▼
       ☁️ Supabase                  ReadySite
             │
      ┌──────┼──────┐
      │      │      │
      ▼      ▼      ▼
   Database Storage Backend
                     / API
```

---

## ✨ About

This portfolio represents an AI-assisted development journey, combining modern development tools, cloud infrastructure, source control, and deployment technologies into a complete web experience.

### 👨‍💻 Designed & Developed by **Yasin Adnan**

> **Building ideas into digital experiences — step by step.**
