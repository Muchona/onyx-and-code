# Proposal: B3D Designs (The Digital Showroom)
**Client:** 3D Architect (Houses, Kitchens, AutoCAD)
**Vibe:** Technical, Precision, Minimalist.

## The "Killer Feature": Interactive 3D Models
Since he creates 3D models, a static image gallery is boring.
**We will pitch him a "Live 3D Viewer".**
*   Imagine a client visiting the site and physically **rotating a house design** with their mouse.
*   We can easily do this by embedding **Sketchfab** or using **Spline**.
*   *Why this sells:* It proves his technical skill immediately. No other local architect is doing this.

## Proposed Structure
1.  **Hero Section:** A high-quality auto-playing video of a "Flythrough" (Camera moving through a house).
2.  **Services Grid:**
    *   3D Exterior Visualization
    *   Interior Design (Kitchens)
    *   Planning Permission Drawings
3.  **The Interactive Lab:** A section where users can spin a model.
4.  **Before/After Sliders:** Show a "CAD Drawing" vs "Real Photo" split slider.

## Technical Requirements
*   **Platform:** React (Vite) for speed and 3D rendering capabilities.
*   **Gallery:** Masonry layout for high-res renders.
*   **Domain:** `b3ddesigns.com` (or similar).

## Questions for the Client
1.  "Do you have video files of your 'flythroughs'?" (These make the best website backgrounds).
2.  "Can you export your AutoCAD models as `.obj` or `.fbx` files?" (If yes, we can put them in the 3D viewer).
3.  "Who is your main customer? Homeowners wanting extensions, or Developers building 50 houses?" (Changes the text tone).
