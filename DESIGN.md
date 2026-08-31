---
name: KONSTANZ
description: A date you tap and a night you open — charcoal field, one lime mark.
colors:
  charcoal: "#161616"
  plate: "#222222"
  capsule: "#1A1A1A"
  lime: "#F2F862"
  ink-on-lime: "#161616"
  circle: "#282828"
  white: "#FFFFFF"
  muted: "#8E8E93"
  subtle: "#C7C7C7"
  rule: "rgba(255, 255, 255, 0.1)"
  overlay: "rgba(22, 22, 22, 0.55)"
  overlay-heavy: "rgba(22, 22, 22, 0.92)"
typography:
  display:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.4px"
  headline:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.17
    letterSpacing: "-0.3px"
  title:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.2px"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: "normal"
  wordmark:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "1.8px"
  meta:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.38
    letterSpacing: "normal"
  overline:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "1.2px"
  button:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.29
    letterSpacing: "0.2px"
  nav:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  plate: "24px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  4xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "48px"
  chip-idle:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "0 14px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.full}"
    padding: "0 14px"
    height: "44px"
  date-capsule-idle:
    backgroundColor: "{colors.capsule}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    width: "54px"
    height: "76px"
  date-capsule-selected:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.full}"
    width: "54px"
    height: "76px"
  plate-featured:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.plate}"
    padding: "16px 48px 16px 16px"
  plate-idle:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.white}"
    rounded: "{rounded.plate}"
    padding: "16px 48px 16px 16px"
  chrome-circle:
    backgroundColor: "{colors.circle}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    width: "36px"
    height: "36px"
  search-pill:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 48px 12px 44px"
    height: "48px"
  tab-active:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.full}"
    height: "44px"
---

# Design System: KONSTANZ

## Overview

**Creative North Star: "The Lime Mark"**

KONSTANZ is a night phone: charcoal ground, Poppins, and one lime signal that means *this date and this night are on*. The Weekend surface is the world at rest — a month name, a row of vertical stadiums, a lime lead plate, then charcoal plates. You tap a day, you open a night. Nothing else asks for attention.

The field is dark because the subject is going out after dark. Plates sit one step up from the ground; circular chrome sits one step up from the plates. Lime is not a brand wash and not a marketplace CTA. It is a mark: selected capsule, featured plate, help glyph, active tab. Type on lime is charcoal, never white. The face is Poppins at 400 / 500 / 600 / 700 / 800 — one family, no second display cut.

This is a city going-out guide, not a ticket desk. Nav is Discover, Explore, Weekend, Saved. No create, no profile, no attendee piles, no invented crowds. Web is the product; native is a companion. Phone is a single column. Desktop keeps the same column on Weekend (max 640px) with site nav on top.

**Key Characteristics:**

- Charcoal field (`#161616`) with plate charcoal (`#222222`) and unstroked idle capsules (`#1A1A1A`)
- One lime (`#F2F862`) reserved for selected / featured / active; charcoal ink on lime
- Circular chrome (`#282828`) for help, month chevrons, idle plate arrows
- Poppins only; event plates at 24px; date capsules as vertical stadiums (number over weekday)
- Two-register night plates; up-right arrow in a circle; no fake attendee counts

## Colors

A near-black night with one acid-yellow mark. Neutrals do the structure; lime does the selection.

### Primary

- **Lime Mark** (`#F2F862`): The selected date capsule, the featured night plate, the “?” help glyph, the active bottom tab (and the 1px underline on the active site-nav link). Also the web selection highlight, caret, and `:focus-visible` ring. If it is not selected, featured, or active, it is not lime.

### Neutral

- **Charcoal Night** (`#161616`): Viewport, screen, site-nav bar, and ink on lime. Theme color, html/body, status bar. The ground everything sits on.
- **Plate** (`#222222`): Idle event plates, idle chips, search pill, secondary buttons, Discover list cards.
- **Capsule Idle** (`#1A1A1A`): Unstroked fill for unselected date stadiums and skeleton bases. Darker than a plate so the strip reads as a control, not a card.
- **Circle Chrome** (`#282828`): 36–44px circles for help, month chevrons, idle plate arrows, and the `circle` icon-button variant.
- **Type White** (`#FFFFFF`): Primary type and icons on charcoal.
- **Muted Steel** (`#8E8E93`): Idle capsule weekdays, plate meta (time, place), idle tab labels, placeholders.
- **Soft Silver** (`#C7C7C7`): Body copy and secondary titles (venue on the night sheet).
- **Hairline Rule** (`rgba(255, 255, 255, 0.1)`): Site-nav bottom edge, tab-bar top edge, secondary-button stroke, plate meta divider on idle cards. Featured plates use charcoal at 28% opacity for the same divider (`rgba(22, 22, 22, 0.28)`).
- **Overlay** (`rgba(22, 22, 22, 0.55)`) / **Overlay Heavy** (`rgba(22, 22, 22, 0.92)`): Photo-hero scrims on Discover featured and the night sheet. Not a card fill.

### Named Rules

**The Lime Mark Rule.** Lime is a selection, not a decoration. It fills the selected date, the featured plate, the help glyph, and the active tab. It does not paint prices, dates, section actions, empty-state icons, or saved hearts. Audit: cover every lime pixel that is not selected, featured, active, or focus — those pixels are out.

**The Ink-on-Lime Rule.** Type and icons sitting on lime are charcoal (`#161616`). White on lime is illegal. Lime on lime (featured arrow) sits in a charcoal circle so the glyph stays lime.

## Typography

**Display Font:** Poppins (with system-ui, sans-serif)
**Body Font:** Poppins (same cut)
**Label/Mono Font:** Poppins (tabular nums on date capsules only)

**Character:** One geometric grotesque at night. ExtraBold for the word that opens a screen; Bold for plates and month; Medium for weekdays and meta; Regular for ledes. Tight tracking on display; open tracking only on the KONSTANZ wordmark and true overlines.

### Hierarchy

- **Display** (800, 40px / 44, −0.4): Discover headline (“Out this week”). Night-sheet and Discover featured titles step to 42–44px ExtraBold — same cut, larger night.
- **Headline** (700, 24px / 28, −0.3): Section titles (“This weekend”, “Happening”). Month name on Weekend is the same weight at 22px / 28.
- **Title** (700, 16px / 20, −0.2): Event names on plates. Weekend screen title is 18px / 24 Bold, centered.
- **Body** (400, 16px / 24, Soft Silver): Ledes and night-sheet description. Max width on the Discover lede is 420px.
- **Label** (600, 14px / 18): Category on the weekend plate; chip labels at 13px / 18 Semibold; buttons 14px / 18 Bold.
- **Wordmark** (700, 20px / 24, +1.8): `KONSTANZ` in the site nav. Tracking, not a kicker.
- **Meta** (400, 13px / 18, Muted Steel): Supporting lines. Weekend plate clock/place is 12px / 16 Medium.
- **Overline** (600, 12px / 16, +1.2, uppercase): Structural labels only. Do not use it as a lime eyebrow on cards.
- **Nav** (500, 14px / 18): Site-nav links; Bold when active.

### Named Rules

**The One Face Rule.** Poppins 400 / 500 / 600 / 700 / 800. No second family, no condensed cut, no system display face. Date numbers are tabular.

## Layout

Web-responsive first: one charcoal column, not a stretched phone chrome. Break to desktop site nav at 900px; hide the bottom tab bar at that width.

- **Weekend column:** max 640px, centered, page gap 20px, list gap 12px. Screen padding 16px.
- **Discover / Explore / Saved:** max 1120px. Discover “Happening” becomes a two-up wrap on desktop; Weekend does not — it stays a single stack.
- **Touch:** 44px minimum. Help and title spacers are 44×44 so “Upcoming Event” stays optically centered.
- **Date strip:** horizontal scroll, 54×76 stadiums, 10px gap, no scrollbar.
- **Month row:** name left, two 36px chrome chevrons right, 8px apart.
- **Nav:** Discover, Explore, Weekend, Saved. Site nav is wordmark left, text links right (desktop). Phone: wordmark only on top; lime pill tabs on the bottom.

Density is night-list, not dashboard. One featured plate, then idle plates. Empty and error sit in the same column with a primary button under the message.

## Elevation & Depth

Flat and tonal. Depth is a fill step (ground → capsule → plate → chrome), not a shadow. Weekend plates, capsules, chips, and buttons carry no `box-shadow`. Press feedback is a 0.97 scale spring (damping 16, stiffness 420, mass 0.4), not a lift.

Photo heroes (Discover featured, night sheet) darken the image with charcoal overlays so white type holds. That is a scrim, not a card shadow.

Focus is a 2px lime ring with 2px offset (`:focus-visible`). Selection and caret are lime on charcoal. `prefers-reduced-motion` collapses animation and transition duration to 0.01ms.

### Named Rules

**The Flat Night Rule.** Surfaces are fills. No offset drop shadows on plates, capsules, or chrome. If a leftover paper-sheet shadow still exists in the codebase, it is not this world.

## Shapes

The silhouette is the stadium and the circle.

- **Event plates:** 24px corners, 16px padding, 48px right inset so the arrow circle does not collide with the title. Thumb is 56×56 at 12px radius.
- **Date capsules:** 54×76 vertical stadiums (border-radius 38px). Number over weekday, 4px gap, unstroked.
- **Chrome:** perfect circles — 36px month chevrons, 32px plate arrows, 44px help and icon buttons.
- **Pills:** buttons, chips, search, and the active tab are fully rounded (999px).
- **Hairlines:** 1px meta rules on plates (12px tall); hairline strokes on secondary buttons and nav edges — never a 1px box around an idle capsule.

No overlapping avatar clusters. No back-chevron on Weekend (it is a tab). The title row is spacer · title · help.

## Components

### Buttons

- **Shape:** Full pill (999px), 48px tall, 20px horizontal padding, 8px icon gap.
- **Primary:** Lime fill, charcoal Bold 14px label. Used for “Try again”, “I'm going”.
- **Secondary:** Plate fill, white hairline stroke, white label. Used for “Share”.
- **Hover / Focus:** Press scales to 0.97. Focus-visible is the lime ring. No fill shift, no glow.

### Chips

- **Style:** Full pill, 44px min height, 14px horizontal padding. Idle plate fill, white Semibold 13px. Selected lime fill, charcoal ink.
- **State:** Selected is the lime mark (Discover day filters). Idle is a plate, not a ghost stroke.

### Cards / Containers

Weekend night plates are the signature card. Discover photo cards still use 16–20px radii and image-led layouts; new work follows the Weekend plate, not those leftovers.

- **Corner Style:** 24px on night plates.
- **Background:** Lime if featured (one per day); plate charcoal otherwise.
- **Shadow Strategy:** None. Tonal fill only.
- **Border:** None. Meta divider is an internal 1×12 rule, not a card stroke.
- **Internal Padding:** 16px, with 12px between the two registers.

**Two-register plate.** Top: 56px thumb + title (Bold 16) + category (Semibold 14). Bottom, full width under the thumb: clock · vertical rule · place. Up-right arrow in a 32px circle, absolutely top-right (14px inset). Featured arrow circle is charcoal with a lime glyph; idle arrow circle is chrome with a white glyph.

### Inputs / Fields

- **Style:** Search is a plate pill, 48px, Poppins 16 Regular, muted placeholder, search glyph 16px from the left. Sheet variant uses 12px corners and a hairline instead of a pill — same fill.
- **Focus:** Caret and text selection are lime. No extra glow.
- **Clear:** Ghost icon button on the right when the field has a value.

### Navigation

- **Site nav:** Charcoal bar, hairline bottom, 20px horizontal padding. Wordmark `KONSTANZ`. Desktop links 14 Medium, 10px pad; active is Bold with a 1px lime underline (the mark, not a fill).
- **Bottom tabs (phone):** Charcoal bar, hairline top. Idle: muted glyph + Medium 11px label. Active: lime pill behind glyph + Bold charcoal label. Icons 20px, stroke 1.8 idle / 2.4 active.
- **Help:** 44px chrome circle, Bold 18 “?” in lime. Toggles one muted 14px hint: pick a date, the lime card is the featured night.

### Date Capsule Strip

Horizontal stadiums for the month. Selected fill is lime with charcoal number (Bold 18, tabular) over charcoal weekday (Medium 12). Idle fill is `#1A1A1A`, white number, muted weekday. No stroke, no today-ring, no event dots on the capsule. The strip scrolls; the selected day is brought into view.

### Circle Chrome

Help, month chevrons, idle plate arrows, and the circle icon-button variant. Fill `#282828`, no border, lucide strokes at 2.2. This is hardware on the night phone, not a ghost icon on the field.

## Do's and Don'ts

### Do:

- **Do** put lime only on the selected date, the featured plate, the help glyph, and the active tab (plus focus/selection/caret).
- **Do** set type and icons on lime to charcoal (`#161616`).
- **Do** build night plates as two registers with a 24px radius and a 32px up-right arrow circle.
- **Do** stack date capsules as vertical stadiums: number over weekday, unstroked idle fill `#1A1A1A`.
- **Do** keep Weekend a single 640px column on desktop, with site nav above.
- **Do** use Poppins 400 / 500 / 600 / 700 / 800 and circular chrome `#282828` for help, chevrons, and idle arrows.

### Don't:

- **Don't** draw attendee avatars, overlapping faces, or fake counts (“3K+”).
- **Don't** stroke idle capsules, add a month grid, or put a back chevron on Weekend.
- **Don't** use lime for prices, date overlines, empty-state icons, “See all” links, or saved bookmarks.
- **Don't** drop paper sheets, binder clips, or offset shadows onto this charcoal field.
- **Don't** add Create, Profile, tickets, or checkout chrome.
- **Don't** introduce a second type family or a decorative accent besides lime.
