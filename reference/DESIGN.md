---
name: Midnight Slate Mobile
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#414848'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#717879'
  outline-variant: '#c1c8c8'
  surface-tint: '#466365'
  primary: '#001618'
  on-primary: '#ffffff'
  primary-container: '#0d2c2e'
  on-primary-container: '#769496'
  inverse-primary: '#adccce'
  secondary: '#4d6072'
  on-secondary: '#ffffff'
  secondary-container: '#cee2f6'
  on-secondary-container: '#526576'
  tertiary: '#101413'
  on-tertiary: '#ffffff'
  tertiary-container: '#252828'
  on-tertiary-container: '#8c8f8e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e8eb'
  primary-fixed-dim: '#adccce'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#2e4c4e'
  secondary-fixed: '#d1e5f9'
  secondary-fixed-dim: '#b5c9dd'
  on-secondary-fixed: '#081d2c'
  on-secondary-fixed-variant: '#364959'
  tertiary-fixed: '#e1e3e2'
  tertiary-fixed-dim: '#c4c7c6'
  on-tertiary-fixed: '#191c1c'
  on-tertiary-fixed-variant: '#444747'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  margin-page: 24px
  gutter-grid: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 48px
---

## Brand & Style

The design system is engineered for high-end mobile experiences, focusing on a premium, editorial aesthetic. It prioritizes a sense of calm and precision, mimicking the tactile quality of physical luxury goods through digital interfaces. The brand personality is sophisticated, understated, and exceptionally functional.

The design style is a hybrid of **High-End Minimalism** and **Refined Glassmorphism**. It relies on high-quality typography and intentional negative space to guide the user's eye, utilizing translucent layers to provide a sense of depth and architectural hierarchy without clutter.

## Colors

The palette is anchored by **Midnight Emerald** (#0D2C2E), a deep, near-black green that provides a more organic and sophisticated foundation than pure black or purple. **Deep Slate Blue** (#4A5D6E) serves as a secondary accent for interactive secondary elements and subtle state changes.

The neutral system uses a range of cool greys and off-whites to maintain a "clean" feel. Semantic colors (success, error, warning) should be desaturated to match the premium tone, avoiding neon or overly vibrant shades. Use transparency levels (alpha values) on the surface colors to facilitate the glassmorphic layering required for the navigation and cards.

## Typography

The typography system utilizes **Inter** for its exceptional legibility and neutral, modern character. The hierarchy is strictly enforced to ensure a "system-native" feel reminiscent of premium iOS applications.

- **Headlines:** Use tight letter-spacing and bold weights to create strong visual anchors.
- **Body Text:** Set with generous line height to enhance readability and contribute to the spacious feel.
- **Labels:** Use uppercase with increased tracking for secondary metadata or section headers to create a distinct editorial contrast.

## Layout & Spacing

This design system employs a **Fluid Mobile Grid** with a 24px outer margin to ensure content feels contained yet breathable. The internal rhythm is built on an 8px base unit.

Negative space is treated as a functional element, not a void. Large "Stack" increments (32px and 48px) should be used between major content blocks to prevent visual crowding. Navigation and Action Bars are excluded from the grid flow, floating as glassmorphic overlays to maximize the perceived screen size.

## Elevation & Depth

Depth is communicated through **Glassmorphic layering** and **Ambient Shadows**. 

1.  **The Base:** Pure white or light-grey background.
2.  **The Canvas:** Surfaces use `backdrop-blur-xl` (20px-30px blur) with a 70% opacity white fill.
3.  **The Border:** Every elevated element features a subtle 0.5px or 1px stroke (`rgba(0,0,0,0.05)`) to define edges without adding visual weight.
4.  **The Shadow:** Shadows are highly diffused and soft. Use a Y-offset of 4px to 10px with a 20px+ blur radius and very low opacity (3-5%).

Navigation bars and toolbars must always use the backdrop-blur effect to allow content to "peek" through as the user scrolls, creating a sense of continuity.

## Shapes

The shape language is defined by **large, continuous curves**. The standard radius for cards and major containers is 24px, increasing to 32px for larger modal sheets or full-width sections. 

Buttons utilize a pill-shape or a 16px radius to distinguish them from the larger container structures. All borders must be "inner-aligned" and utilize the subtle stroke color defined in the Elevation section to maintain the premium, high-fidelity finish.

## Components

- **Buttons:** Primary buttons use the Midnight Emerald fill with white text. Secondary buttons are "Ghost" style with a 1px slate-blue border or a subtle grey-scale glass fill.
- **Navigation Bars:** Floating or pinned headers with `backdrop-blur-xl`. Title alignment should follow the iOS pattern: Large titles that transition to centered small titles on scroll.
- **Cards:** 24px corner radius. No heavy borders; use the soft ambient shadow and 0.5px stroke for definition. Cards should have generous internal padding (20px-24px).
- **Chips/Tags:** Small, pill-shaped elements with a subtle tinted background (5% opacity of the accent color) and semi-bold text.
- **Input Fields:** Soft-grey backgrounds with 12px-16px corner radii. Focus states are indicated by a subtle thickening of the 1px border using the Deep Slate Blue.
- **Lists:** Clean rows with 1px hairline separators that do not extend to the full width of the screen, maintaining the 24px margin.