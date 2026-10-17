# Mobile-First Tamil Nadu Government Petition Application ("Manu" / மனு)

A mobile-first, privacy-respecting civic assistant that transforms everyday citizen grievances into court-ready, administrative petitions compliant with the Government of Tamil Nadu Secretariat Office Manual and District Collectorate standards.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been incorporated:
> - **App-Wide Language Toggle (தமிழ் / English)**: Instantaneous language switcher accessible from the mobile app header/settings, dynamically updating every screen, label, helper cue, and validation message.
> - **Petition Output Language Switcher (Tamil ↔ English)**: The AI pipeline generates both court-ready Formal Tamil (*தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு*) and Formal English versions simultaneously. In the Draft Review and PDF Export screens, citizens can switch back and forth between Tamil and English with a single tap, or choose to generate a combined bilingual submission document.
> - **Desktop Viewport Presentation**: Centered high-fidelity smartphone device frame with responsive viewport scaling for desktop browsers, expanding to 100% native screen space on actual mobile touch devices.
> - **PDF Export Engine**: Client-side vector PDF generation (`jspdf` with clean margins, proper Tamil script and English rendering) combined with responsive native browser print formatting.
> - **Confidential Data Storage**: Privacy-first local browser storage (`IndexedDB` / `localStorage`) for all drafts and completed petitions, featuring single-click privacy controls (Wipe Data, Export JSON backup) with zero unauthorized cloud storage of citizen grievance text.

---

## 1. Overview & Core Concept

- **What It Does**: Guides citizens step-by-step from informal problem descriptions (in colloquial Tamil, Tanglish, or English) through intelligent authority verification, administrative drafting, and instant PDF petition generation.
- **Bilingual Accessibility**: Every citizen can comfortably interact in either **தமிழ் (Tamil)** or **English**, and independently choose the language of their final petition document (Tamil or English).
- **Target Audience**: Tamil Nadu citizens across all 38 districts seeking redressal from municipal corporations, district collectors, TANGEDCO, police, revenue, TWAD, and state departments.
- **Key Value**: Eliminates the intimidating bureaucratic barrier of legal formatting and wrong-authority submissions. Gemini AI verifies recipient appropriateness *before* drafting, ensuring the petition reaches the competent officer.

---

## 2. User Experience & Visual Design

### Flow Architecture (One Task Per Screen)

```
[Splash / TN Govt Intro] ──▶ [Google Auth] ──▶ [Location Permission] ──▶ [Home Dashboard]
                                                                                │
                                                                   ┌────────────┴────────────┐
                                                                   ▼                         ▼
                                                             [Create New]            [My Petitions / PDF]
                                                                   │
    ┌──────────────────────────────────────────────────────────────┴───────────────────────────┐
    ▼                                                                                          ▼
[Step 1: About You] ──▶ [Step 2: Recipient / "I Don't Know"] ──▶ [Step 3: Problem Description] ──▶
    │
    ▼
[Step 4: AI Analysis & Recipient Verification] ──▶ [Step 5: Draft Review & Language Toggle] ──▶
    │                                                    (தமிழ் ⇄ English Instant Switcher)
    ▼
[Step 6: PDF Generation (Tamil/English/Dual), Download & Share]
```

### Visual Identity & Theme (Green + White + Blue)
- **Primary Canvas**: Clean stark white (`#ffffff`) and soft tinted neutral (`#f8fafc`).
- **State Brand Accents**:
  - Forest Emerald & Deep Teal (`#065f46`, `#047857`, `#0d9488`): Symbolizing public welfare, agriculture, and civic trust.
  - Deep Government Cobalt (`#1e3a8a`, `#1d4ed8`): Administrative authority and legal integrity.
  - Subtle Gradient Atmosphere: Soft top bar and accent transitions (`from-emerald-700 via-teal-700 to-blue-800`).
- **Typography Hierarchy**:
  - State Crest & Inscriptions: `Cinzel` (`font-serif`) for the Tamil Nadu Government emblem.
  - Tamil Legal Script: `Noto Serif Tamil` with `leading-relaxed` line spacing.
  - English Administrative Prose: `Source Serif 4`.
  - Mobile UI Labels & Body: `Plus Jakarta Sans`.
  - Administrative Reference Numbers & Dockets: `JetBrains Mono` (`tabular-nums`).
- **Ergonomics & Touch Targets**:
  - Strict minimum touch hitboxes of $44 \times 44\text{px}$ ($48\text{px}$ for primary action bars).
  - Floating sticky bottom action bar within the natural thumb zone.
  - Header persistent **Language Switcher (தமிழ் | EN)** for instant UI switching at any point.

---

## 3. Bilingual Engine & Translation Strategy

- **Dual-Generation Architecture**:
  - The Gemini backend produces a structured JSON output containing **both** complete petition texts (`tamilOutput` and `englishOutput`) in a single round-trip.
  - This allows the user on the mobile review screen to switch between **தமிழ்** and **English** with zero loading delay or additional API cost.
- **In-Place Editable Document**:
  - Editing either the Tamil or English draft is immediately preserved in local state.
  - Quick-polish AI actions are bilingual (e.g. "சட்டப்பூர்வ நடையை அதிகப்படுத்து / Make more formal", "சுருக்கமாக்கு / Make concise").
- **PDF Language Options**:
  - Download as **Tamil PDF** (Official for Taluk/Collectorate submissions).
  - Download as **English PDF** (Official for Central/Judicial/Corporate submissions).
  - Download as **Bilingual Docket** (Side-by-side or sequential 2-page package).

---

## 4. Technical Architecture & System Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE-FIRST CLIENT (React 19 + Vite)                     │
│  - AppShell (Mobile Frame on Desktop / Native Fullscreen on Touch)           │
│  - LanguageContext: App-wide UI strings (English & Tamil)                    │
│  - Step Navigation: Back Arrow + Progress Meter + Floating Bottom CTA        │
│  - Offline & Privacy Storage: LocalStorage / IndexedDB Adapter               │
│  - Geolocation: Browser Geolocation API + Nominatim / District Resolver      │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ POST /api/analyze-and-generate
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS / SERVERLESS API                             │
│  - /api/analyze: Joint Problem Classification & Recipient Verification       │
│  - /api/generate: Dual-Language Secretariat Drafting (Tamil & English)       │
│  - /api/improve: Targeted AI Refinement in selected language                 │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
┌────────────────────────────────────────┐ ┌───────────────────────────────────┐
│        GEMINI 3.8 FLASH ENGINE         │ │     OFFLINE TN LEGAL ENGINE       │
│ - Strict JSON Schema Outputs           │ │ - Fallback District & Dept Rules  │
│ - Simultaneous Tamil & English payload │ │ - Deterministic Gazetted Format   │
└────────────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 5. Implementation Steps & Work Plan

1. **Phase 1: Dependencies & Asset Setup**
   - Install `jspdf` for client-side vector PDF rendering.
   - Configure Green + White + Blue color tokens and typography in `src/index.css`.
2. **Phase 2: Mobile Navigation, Shell & Bilingual Context**
   - Create responsive smartphone device frame container with notch, status bar, and adaptive full-bleed mobile display.
   - Implement persistent top bar with Tamil/English app language switch button.
   - Implement bottom navigation for primary tabs (`Home`, `Petitions`, `Profile`, `Settings`).
3. **Phase 3: Auth, Location & Privacy-First Store**
   - Integrate Google Sign-In with local profile persistence.
   - Implement one-time foreground location detection with reverse geocoding to Tamil Nadu districts/taluks and manual edit fallback.
   - Build client-side storage manager with export/wipe capabilities.
4. **Phase 4: Guided Multi-Step Petition Wizard**
   - **Step 1 (About You)**: Auto-filled sender form.
   - **Step 2 (Who Is This For)**: Department selector with "I don't know who to address" trigger.
   - **Step 3 (Problem Description)**: Large voice/text input with prompt cues.
   - **Step 4 (AI Verification & Recommendation)**: Interactive card explaining authority suitability with "Accept Recommendation" or "Keep Mine".
   - **Step 5 (Petition Draft & Language Switcher)**: Live toggle between Formal Tamil and Formal English draft with quick-polish AI actions.
   - **Step 6 (PDF Export & Complete)**: Stamped document generation with Tamil/English/Bilingual options, 1-click Download, Native Print, and Share.
5. **Phase 5: Backend AI Routes & Robust Fallbacks**
   - Update `server.ts` and `api/` endpoints to handle joint problem verification, dual-language outputs, and iterative refinements.
6. **Phase 6: Verification & Compilation**
   - Run `lint_applet` and `compile_applet` to verify production readiness.
