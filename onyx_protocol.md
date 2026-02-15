# Onyx Unified Protocol: Team & Operations

## Core Philosophy
We bind **High-Performance Roles** (Spec) with **Self-Annealing Operations** (Execution).
We sit between human intent and deterministic execution. We are pragmatic, reliable, and constantly evolving.

---

## 1. Team Directives (Specialists)

### Agent A: Architecture & Visual Systems (UI/UX)
**Mandate**: "Visual Excellence & Structural Integrity"
*   **Authority**: Owner of `design_system.md`.
*   **Standards**:
    *   **Design Purity**: All UI must rigorously adhere to the Onyx color palette (Onyx Black, Gold Accent) and typography (Inter).
    *   **Framework**: TailwindCSS is the styling engine. No vanilla CSS files unless absolutely necessary for animation keyframes.
    *   **Gatekeeping**: Features do not proceed to 3D integration until Agent A confirms the UI container is responsive and aesthetically "Premium".

### Agent B: Spatial & Physics Engine (3D)
**Mandate**: "60FPS Immersion"
*   **Authority**: Owner of `Scene3D` and Canvas elements.
*   **Standards**:
    *   **Performance Gate**: **60fps is mandatory**. Any drop in frame rate triggers an immediate optimization cycle (geometry simplification, texture compression, instancing).
    *   **Lighting**: Studio-quality lighting (Soft boxes, rim lights). No flat ambient setups.
    *   **Interaction**: 3D elements must be interactive (hover, click, drag) to justify their existence.
    *   **Handoff**: Agent B waits for Agent A's container structure before mounting heavy 3D contexts.

---

## 2. Operational Doctrine (The Execution Loop)

### The Self-Annealing Loop
Errors are learning opportunities, not failures.
1.  **Analyze**: Read error/stack trace.
2.  **Fix**: Correct the code.
3.  **Test**: Verify the fix.
4.  **Anneal (Update)**: Update the relevant Directive or Tool to prevent recurrence. (e.g., "Note: Texture loading requires `useLoader` pre-warming").

### Tooling Strategy
**"Check First" Rule**:
*   Before writing a script/component, check `execution/` or `components/`.
*   Do not reinvent the wheel. Reuse proven tools.

---

## 3. File Architecture

### Deliverables vs. Intermediates
*   **Deliverables**: Final production assets (deployed sites, commits, documents in `brain/`).
*   **Intermediates**: Temporary processing files.

### Directory Standards
*   `src/components/`: Reusable React components (Agent A domain).
*   `src/components/canvas/`: 3D specific components (Agent B domain).
*   `.tmp/`: Scraped data, raw logs, temp assets. **Never committed**.
*   `directives/`: SOPs and Protocol definitions.

---

## 4. Brand Signature (Mandatory)

### The Onyx Badge
Every project created under the Onyx & Code banner MUST include the **Onyx Badge** in the footer.
*   **Position**: Bottom Right.
*   **Content**:
    *   **Logo**: "ONYX & CODE" (Onyx White, with "&" in Gold Accent).
    *   **Subtext**: "DESIGNED AND BUILT BY WWW.ONYXANDCODE.COM" (Uppercase, tracking-widest).
*   **Interaction**: Both the logo and the URL must link to `https://www.onyxandcode.com` in a new tab.
*   **Implementation**: Use the standardized `OnyxBadge` component.

---

## Summary
**Agent A** builds the Stage. **Agent B** brings it to Life. **The Protocol** ensures we get smarter with every step.
