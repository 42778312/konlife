---
name: KONSTANZ
description: A night you open from a photo plate — black field, charcoal weekend, one lime mark.
colors:
  night: "#000000"
  charcoal: "#161616"
  plate-night: "#171717"
  capsule: "#1A1A1A"
  plate: "#222222"
  circle: "#282828"
  lime: "#F2F862"
  ink-on-lime: "#161616"
  white: "#FFFFFF"
  muted-night: "#8D8D8D"
  muted: "#8E8E93"
  subtle: "#C7C7C7"
  frost: "rgba(0, 0, 0, 0.48)"
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
  city:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-0.2px"
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
  poster: "22px"
  plate: "24px"
  photo: "32px"
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
  button-open-night:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
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
  stadium-idle:
    backgroundColor: "{colors.plate-night}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "6px 14px 6px 6px"
    height: "44px"
  stadium-selected:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.full}"
    padding: "6px 14px 6px 6px"
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
  photo-plate:
    backgroundColor: "{colors.plate-night}"
    textColor: "{colors.white}"
    rounded: "{rounded.photo}"
  poster-card:
    backgroundColor: "{colors.plate-night}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.poster}"
    width: "200px"
    height: "248px"
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
  door-time:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.full}"
    padding: "0 8px"
    height: "44px"
  chrome-circle:
    backgroundColor: "{colors.circle}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    width: "36px"
    height: "36px"
  chrome-home:
    backgroundColor: "{colors.circle}"
    textColor: "{colors.lime}"
    rounded: "{rounded.full}"
    width: "44px"
    height: "44px"
  save-disc:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.full}"
    width: "36px"
    height: "36px"
  search-pill:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 48px 12px 44px"
    height: "48px"
  search-pill-home:
    backgroundColor: "{colors.plate-night}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "10px 48px 10px 44px"
    height: "44px"
  tab-active:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-on-lime}"
    rounded: "{rounded.full}"
    height: "44px"
---

# Design System: KONSTANZ

## Overview

**Creative North Star: "The Lime Mark"**

KONSTANZ is a night phone: Poppins, circular chrome, and one lime signal that means *this night is on*. Discover is a night you open from a photo plate — black field, a 32px image plate, stadiums you scan, posters you swipe. Weekend is still the charcoal list: a month name, vertical date stadiums, a lime lead plate, then charcoal plates. You tap a day, you open a night. Nothing else asks for attention.

Two grounds, one mark. Discover’s column is true black; Weekend, the html shell, site nav, and tab bar stay charcoal. Plates sit one step up from their field; circular chrome sits one step up from the plates. Lime is not a brand wash and not a marketplace CTA. Type on lime is charcoal, never white. The face is Poppins at 400 / 500 / 600 / 700 / 800 — one family, no second display cut.

This is a city going-out guide, not a ticket desk. Nav is Discover, Explore, Weekend, Saved. No create, no profile, no attendee piles, no invented crowds. Web is the product; native is a companion. Phone is a single column. Discover on desktop keeps a 430px column under site nav; Weekend keeps 640px.

**Key Characteristics:**

- Discover field (`#000000`) with night plates (`#171717`); Weekend/chrome field (`#161616`) with charcoal plates (`#222222`) and idle capsules (`#1A1A1A`)
- One lime (`#F2F862`) for selected / open / active; charcoal ink on lime
- Circular chrome (`#282828`) for the K mark, filter, saved, help, month chevrons, idle plate arrows
- Poppins only; Discover photo plates at 32px; Weekend event plates at 24px; date capsules as vertical stadiums
- Discover: category stadiums, image-led featured plate, poster carousel. Weekend: two-register night plates. No fake attendee counts

## Colors

A near-black night with one acid-yellow mark. Neutrals do the structure; lime does the selection and the open door.

### Primary

- **Lime Mark**: The selected category stadium and date capsule; Discover’s door-time mark and Open night; the poster date pill; the K glyph and saved bookmark on chrome; Weekend’s featured plate and help glyph; the active bottom tab and the 1px underline on the active site-nav link. Also the web selection highlight, caret, and `:focus-visible` ring. If it is not selected, open, featured, or active, it is not lime.

### Neutral

- **Night Field**: Discover’s viewport and screen. The photo-plate column sits on true black, not charcoal.
- **Charcoal Night**: Html/body, theme color, site-nav bar, tab bar, Weekend screen, and ink on lime. App chrome stays here even when Discover’s column is black.
- **Night Plate**: Discover search pill, idle category stadiums, featured plate body, poster card fallback.
- **Capsule Idle**: Unstroked fill for unselected Weekend date stadiums and skeleton bases. Darker than a charcoal plate so the strip reads as a control, not a card.
- **Plate**: Weekend idle event plates, Explore chips, default search pill, secondary buttons.
- **Circle Chrome**: 36–44px circles for the K mark, filter, saved, help, month chevrons, idle plate arrows, and the `circle` icon-button variant.
- **Type White**: Primary type and icons on black or charcoal. Featured-plate and poster save sit on a white disc.
- **Night Mute**: Discover greeting, place line, and “See all”.
- **Muted Steel**: Placeholders, idle tab labels, Weekend plate meta, idle capsule weekdays. Search on Discover still uses this for the glyph and placeholder (shared field chrome).
- **Soft Silver**: Body copy and secondary titles (venue on the night sheet).
- **Frost**: 48px date badge on the Discover photo — black at 48% over the image, not a card fill.
- **Hairline Rule**: Site-nav bottom edge, tab-bar top edge, secondary-button stroke, plate meta divider on idle Weekend cards. Featured Weekend plates use charcoal at 28% opacity for the same divider (`rgba(22, 22, 22, 0.28)`).
- **Overlay** / **Overlay Heavy**: Photo-hero scrims on the night sheet. Not a card fill.

### Named Rules

**The Lime Mark Rule.** Lime is a selection and an open-door, not a decoration. On Discover it fills the selected stadium, the door-time mark, Open night, and the poster date pill; the K and the saved bookmark sit lime on chrome. On Weekend it fills the selected date, the featured plate, the help glyph, and the active tab. Focus, caret, and selection are lime. It does not paint prices, “See all”, or the field. Audit: cover every lime pixel that is not selected, open, featured, active, or focus — those pixels are out.

**The Ink-on-Lime Rule.** Type and icons sitting on lime are charcoal. White on lime is illegal. Lime on lime (Weekend featured arrow) sits in a charcoal circle so the glyph stays lime. Discover save uses a white disc with charcoal stroke; lime *fill* means saved.

**The Two Fields Rule.** Discover’s column is black with night plates. Weekend and app chrome are charcoal with charcoal plates. Do not put a `#222222` Weekend plate on Discover home, or a `#000000` field under Weekend.

## Typography

**Display Font:** Poppins (with system-ui, sans-serif)
**Body Font:** Poppins (same cut)
**Label/Mono Font:** Poppins (tabular nums on date capsules only)

**Character:** One geometric grotesque at night. ExtraBold for the word that opens a screen and the K mark; Bold for plates, city, and month; Medium for weekdays and “See all”; Regular for ledes and the Discover greeting. Tight tracking on display; open tracking only on the KONSTANZ wordmark and true overlines.

### Hierarchy

- **Display** (800, 40px / 44, −0.4): Explore/night-sheet titles (“Out this week”). Night-sheet featured titles step to 42–44px ExtraBold — same cut, larger night.
- **Headline** (700, 24px / 28, −0.3): Section titles on Explore (“This weekend”, “Happening”). Month name on Weekend is the same weight at 22px / 28.
- **Title** (700, 16px / 20, −0.2): Event names on plates and Discover section rows (“Categories”, “Top nights in Konstanz”).
- **City** (700, 18px / 22, −0.2): “Konstanz” in the Discover header. Weekend screen title is the same weight at 18px / 24, centered.
- **Body** (400, 16px / 24, Soft Silver): Ledes and night-sheet description.
- **Label** (600, 14px / 18): Category stadium labels; Weekend plate category; chip labels at 13px / 18 Semibold; buttons 14px / 18 Bold.
- **Wordmark** (700, 20px / 24, +1.8): `KONSTANZ` in the site nav. Tracking, not a kicker. Phone Discover hides the wordmark so the K circle is the first mark.
- **Meta** (400, 13px / 18): Supporting lines. Discover place uses Night Mute; Weekend plate clock/place is 12px / 16 Medium.
- **Overline** (600, 12px / 16, +1.2, uppercase): Structural labels only. Do not use it as a lime eyebrow on cards.
- **Nav** (500, 14px / 18): Site-nav links; Bold when active.
- **K mark** (800, 18px / 22, lime): Single letter in the 44px chrome circle. Identity, not a portrait.

### Named Rules

**The One Face Rule.** Poppins 400 / 500 / 600 / 700 / 800. No second family, no condensed cut, no system display face. Date numbers are tabular.

## Layout

Web-responsive first: one column, not a stretched phone chrome. Break to desktop site nav at 900px; hide the bottom tab bar at that width. Phone Discover also hides the top wordmark so the header (K · greeting · saved) is the first layer.

- **Discover column:** max 430px, centered, screen padding 16px, block gap 8px. Search row gap 10px. Featured image 200px tall (100px below 360px viewport). Posters 200×248, 12px gap, snap to interval.
- **Weekend column:** max 640px, centered, page gap 20px, list gap 12px. Screen padding 16px.
- **Explore / Saved:** max 1120px. Explore “Happening” becomes a two-up wrap on desktop; Weekend and Discover do not — they stay a single stack.
- **Touch:** 44px minimum. Discover chrome (K, filter, saved, door-time, Open night) is 44×44. Category stadiums reach 44 via 32px thumb plus 6px vertical pad.
- **Date strip (Weekend):** horizontal scroll, 54×76 stadiums, 10px gap, no scrollbar.
- **Month row:** name left, two 36px chrome chevrons right, 8px apart.
- **Nav:** Discover, Explore, Weekend, Saved. Site nav is wordmark left, text links right (desktop). Phone: wordmark on top except Discover home; lime pill tabs on the bottom (charcoal bar).

Density is night-list, not dashboard. Discover: one photo plate, then posters. Weekend: one featured plate, then idle plates. Empty and error sit in the same column with a primary button under the message.

## Elevation & Depth

Flat and tonal. Depth is a fill step (field → plate → chrome), not a shadow. Discover adds a photo as the plate’s top register; frost and a white save disc sit on the image. Weekend plates, capsules, chips, and buttons carry no `box-shadow`. Press feedback is a 0.97 scale spring (damping 16, stiffness 420, mass 0.4), not a lift.

Photo heroes darken with frost (Discover date badge) or charcoal overlays (night sheet) so white type holds. That is a scrim, not a card shadow.

Focus is a 2px lime ring with 2px offset (`:focus-visible`). Selection and caret are lime on charcoal. `prefers-reduced-motion` collapses animation and transition duration to 0.01ms.

### Named Rules

**The Flat Night Rule.** Surfaces are fills. No offset drop shadows on plates, capsules, posters, or chrome. If a leftover paper-sheet shadow still exists in the codebase, it is not this world.

## Shapes

The silhouette is the stadium, the circle, and — on Discover — the photo plate.

- **Discover photo plate:** 32px corners, clipped image on top, 14×8px body pad. Date is a 48px frost circle, top-left 10px; save is a 36px white disc, top-right 10px.
- **Discover posters:** 22px corners, 200×248, lime date pill top-left, white save disc top-right.
- **Weekend event plates:** 24px corners, 16px padding, 48px right inset so the arrow circle does not collide with the title. Thumb is 56×56 at 12px radius.
- **Category stadiums:** Full pills, 32px circular photo thumb, 8px gap to the label, 10px between stadiums.
- **Date capsules:** 54×76 vertical stadiums (border-radius 38px). Number over weekday, 4px gap, unstroked.
- **Chrome:** Perfect circles — 44px Discover header/filter/saved and help; 36px month chevrons; 32px Weekend plate arrows.
- **Pills:** Buttons, chips, search, Open night, door-time, poster date, and the active tab are fully rounded (999px).
- **Hairlines:** 1px meta rules on Weekend plates (12px tall); hairline strokes on secondary buttons and nav edges — never a 1px box around an idle capsule.

No overlapping avatar clusters. No back-chevron on Weekend (it is a tab). Weekend title row is spacer · title · help.

## Components

### Buttons

- **Shape:** Full pill (999px), 20px horizontal padding, 8px icon gap.
- **Primary:** Lime fill, charcoal Bold 14px label, 48px tall. Used for “Try again”, “I'm going”.
- **Open night:** Same lime pill language at 44px, full-width beside the door-time mark. The mark that opens a Discover night.
- **Secondary:** Charcoal plate fill, white hairline stroke, white label, 48px. Used for “Share”.
- **Hover / Focus:** Press scales to 0.97. Focus-visible is the lime ring. No fill shift, no glow.

### Chips

- **Category stadiums (Discover):** Full pill, 32px circular catalog thumb, Semibold 14px label. Idle night-plate fill, white type. Selected lime fill, charcoal ink.
- **Filter chips (Explore):** Full pill, 44px min height, 14px horizontal padding. Idle charcoal plate, white Semibold 13px. Selected lime fill, charcoal ink.

### Cards / Containers

Discover’s signature card is the photo plate. Weekend’s is the two-register night plate. They do not substitute for each other.

**Photo plate (Discover).** 32px radius, night-plate fill, image-led. Top: catalog photo (200px). Frost month/day circle (Medium 11 / Bold 16, white). White save disc with charcoal heart; lime fill when saved. Body: title (Bold 16, white) + place (Regular 13, Night Mute) left; price (Bold 18, white) right — never lime. Foot: lime door-time (Bold 12, charcoal ink) + Open night.

**Poster card (Discover).** 22px radius, 200×248 image. Lime date pill (Bold 11, charcoal ink, 8×4 pad). Same white save disc. No ratings, no invented “5.0”.

**Two-register plate (Weekend).** 24px radius, 16px pad, 12px between registers. Lime if featured (one per day); charcoal plate otherwise. Top: 56px thumb + title (Bold 16) + category (Semibold 14). Bottom: clock · vertical rule · place. Up-right arrow in a 32px circle, absolutely top-right (14px inset). Featured arrow circle is charcoal with a lime glyph; idle arrow circle is chrome with a white glyph. No card stroke. Shadow: none.

### Inputs / Fields

- **Discover search:** Night-plate pill, 44px compact, placeholder “Discover”. Shared Search glyph 16px from the left, muted.
- **Default search:** Charcoal-plate pill, 48px, Poppins 16 Regular, muted placeholder. Sheet variant uses 12px corners and a hairline instead of a pill — same fill.
- **Focus:** Caret and text selection are lime. No extra glow.
- **Clear:** Ghost icon button on the right when the field has a value.
- **Filter:** 44px chrome circle, sliders glyph, white stroke 2.2 — opens Explore.

### Navigation

- **Site nav:** Charcoal bar, hairline bottom, 20px horizontal padding. Wordmark `KONSTANZ`. Desktop links 14 Medium, 10px pad; active is Bold with a 1px lime underline (the mark, not a fill). Hidden on phone Discover so the home header leads.
- **Bottom tabs (phone):** Charcoal bar, hairline top — including under Discover’s black column. Idle: muted glyph + Medium 11px label. Active: lime pill behind glyph + Bold charcoal label. Icons 20px, stroke 1.8 idle / 2.4 active.
- **Discover header:** 44px chrome K (ExtraBold 18, lime) · centered “Welcome back” / “Konstanz” · 44px chrome bookmark (lime stroke). Bookmark goes to Saved.
- **Help (Weekend):** 44px chrome circle, Bold 18 “?” in lime. Toggles one muted 14px hint: pick a date, the lime card is the featured night.

### Date Capsule Strip

Weekend only. Horizontal stadiums for the month. Selected fill is lime with charcoal number (Bold 18, tabular) over charcoal weekday (Medium 12). Idle fill is capsule, white number, muted weekday. No stroke, no today-ring, no event dots on the capsule. The strip scrolls; the selected day is brought into view.

### Circle Chrome

Help, month chevrons, idle Weekend arrows, Discover K / filter / saved, and the circle icon-button variant. Fill `#282828`, no border, lucide strokes at 2.2. This is hardware on the night phone, not a ghost icon on the field.

## Do's and Don'ts

### Do:

- **Do** put lime on selected stadiums/capsules, Open night, the door-time mark, poster date pills, the K and saved bookmark on chrome, the Weekend featured plate, the help glyph, and the active tab (plus focus/selection/caret).
- **Do** set type and icons on lime to charcoal (`#161616`).
- **Do** build Discover nights as 32px photo plates on `#000000` / `#171717`, with a white save disc and a lime open-door.
- **Do** build Weekend nights as two-register plates with a 24px radius and a 32px up-right arrow circle, on `#161616` / `#222222`.
- **Do** stack Weekend date capsules as vertical stadiums: number over weekday, unstroked idle fill `#1A1A1A`.
- **Do** keep Discover a 430px column and Weekend a 640px column on desktop, with site nav above (wordmark hidden on phone Discover).
- **Do** use Poppins 400 / 500 / 600 / 700 / 800 and circular chrome `#282828`.

### Don't:

- **Don't** draw attendee avatars, overlapping faces, fake counts (“3K+”), or invented poster ratings.
- **Don't** stroke idle capsules, add a month grid, or put a back chevron on Weekend.
- **Don't** use lime for prices, “See all” links, or a field wash.
- **Don't** drop paper sheets, binder clips, or offset shadows onto this night field.
- **Don't** add Create, Profile, tickets, or checkout chrome.
- **Don't** introduce a second type family or a decorative accent besides lime.
- **Don't** swap Discover’s photo plate for Weekend’s two-register card, or the other way around.
