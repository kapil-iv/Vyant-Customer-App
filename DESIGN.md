---
name: Luminous Editorial
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#494454'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#7b7486'
  outline-variant: '#cbc3d7'
  surface-tint: '#6d3bd7'
  primary: '#6b38d4'
  on-primary: '#ffffff'
  primary-container: '#8455ef'
  on-primary-container: '#fffbff'
  inverse-primary: '#d0bcff'
  secondary: '#5d5d67'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ed'
  on-secondary-container: '#64636d'
  tertiary: '#555c6e'
  on-tertiary: '#ffffff'
  tertiary-container: '#6e7487'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#e3e1ed'
  secondary-fixed-dim: '#c7c5d1'
  on-secondary-fixed: '#1a1b23'
  on-secondary-fixed-variant: '#46464f'
  tertiary-fixed: '#dce2f7'
  tertiary-fixed-dim: '#c0c6db'
  on-tertiary-fixed: '#141b2b'
  on-tertiary-fixed-variant: '#404758'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 80px
---

## Brand & Style

This design system is built for a high-end fashion marketplace that prioritizes visual clarity and aspirational imagery. The brand personality is sophisticated yet accessible, bridging the gap between luxury editorial and modern e-commerce.

The design style is **Minimalist** with subtle **Glassmorphism** accents. It utilizes generous whitespace to allow product photography to breathe, creating a sense of "digital calm." The emotional response should be one of curated elegance—users should feel they are browsing a high-end boutique rather than a cluttered warehouse. Transitions are fluid, and the overall aesthetic is airy, light, and premium.

## Colors

The palette centers on a vibrant **Vibrant Purple (#8B5CF6)** as the primary action color. This is supported by a soft **Lavender Tint (#F5F3FF)** used for large surface areas and background subtle shifts.

- **Primary:** Used for key calls-to-action, active states, and brand moments.
- **Secondary:** Used for chip backgrounds, secondary buttons, and tonal grouping.
- **Neutral:** A range of grays from Charcoal (#111827) for high-readability text to Silver (#F9FAFB) for page backgrounds.
- **Surface:** Pure white (#FFFFFF) is the standard for cards and elevated containers to maintain a clean, minimalist look.

## Typography

This system uses a dual-typeface approach to balance character with utility. 

**Outfit** is used for all display and headline roles. Its geometric construction feels modern and high-fashion. **Inter** is used for body copy and labels to ensure maximum legibility at smaller scales and during long-form reading. 

Headlines should utilize tighter letter-spacing to feel more "locked-in" and editorial. Body text should maintain standard tracking to support readability. Use `label-sm` in uppercase for category tags and small metadata.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with strict margin constraints. 

- **Mobile:** 4-column grid with 16px margins and 16px gutters.
- **Desktop:** 12-column grid with 80px+ margins and 24px gutters.

Spacing follows a 4px/8px baseline rhythm. Generous vertical spacing (`2xl` and `3xl`) should be used between major sections (e.g., between a "Hero" and "New Arrivals") to maintain the minimalist editorial feel. Internal card padding should never be less than `md` (16px).

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Layers**. 

1. **Base Level (Level 0):** Soft Gray (#F9FAFB) background.
2. **Card Level (Level 1):** White surface with a very soft, diffused shadow: `0px 4px 20px rgba(0, 0, 0, 0.04)`.
3. **Interactive Level (Level 2):** On hover or focus, cards lift slightly with a more pronounced shadow: `0px 10px 30px rgba(0, 0, 0, 0.08)`.
4. **Overlay Level (Level 3):** Modals and drawers use a backdrop blur (12px) to maintain context while focusing the user.

Avoid heavy black shadows; instead, use shadows tinted with a hint of the primary purple color to keep the UI feeling "light."

## Shapes

The shape language is consistently **Rounded**. This softens the minimalist aesthetic, making the interface feel more welcoming and modern.

- **Standard Containers:** Use a 16px (`rounded-lg`) radius (e.g., product cards, input fields).
- **Large Containers:** Use a 24px (`rounded-xl`) radius (e.g., promotional banners, modals).
- **Buttons & Chips:** Use a full pill-shape (999px) for primary actions to distinguish them from structural cards.

## Components

### Buttons
Primary buttons are pill-shaped, using the primary purple with white text. Secondary buttons use the lavender tint with purple text. Interaction states should involve a subtle scale-down (0.98x) to provide tactile feedback.

### Product Cards
Cards feature a 16px corner radius and no border. The image should be the focal point, using a 4:5 aspect ratio (standard for fashion). Text within cards is left-aligned with `label-md` for pricing and `body-md` for product names.

### Chips
Used for sizes, categories, and filters. These are pill-shaped with a 1px border in a light neutral gray, switching to a solid purple fill when selected.

### Input Fields
Inputs use a 12px radius with a light gray background (#F3F4F6) rather than a border. On focus, the background turns white and gains a 1.5px primary purple stroke.

### Iconography
Use thin-stroke (2pt) linear icons. Icons should be "open" and airy, avoiding heavy fills except for active bottom-navigation states.