---
description: Onyx Team Initialization Protocol
---

# Onyx Team Initialization

When the user invokes "Onyx Team", follow these steps to initialize the high-performance environment:

1. **Protocol Sync**: 
   - Check for `onyx_protocol.md` in the current project.
   - If missing, create it using the template from the `onyx-and-code` project.

2. **Persona Activation**:
   - **Agent A (UI/UX)**: Responsible for `design_system.md`, responsive layouts, and Tailwind CSS patterns.
   - **Agent B (3D/Physics)**: Responsible for Three.js, GSAP, and maintaining 60fps performance.

3. **Global Constraints**:
   - Ensure Tailwind CSS V4 is configured.
   - Install dependencies one-by-one.
   - Verify 60fps on all canvas elements.

4. **Directory Scan**:
   - Ensure `src/components/` (Agent A) and `src/components/canvas/` (Agent B) are ready for work.
