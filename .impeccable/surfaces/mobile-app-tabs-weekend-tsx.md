---
version: 1
slug: "mobile-app-tabs-weekend-tsx"
primary_target: "mobile/app/(tabs)/weekend.tsx"
related_targets: ["mobile/components/events/WeekendEventCard.tsx","mobile/components/events/DateCapsuleStrip.tsx"]
---

# Surface: KONSTANZ Weekend (Upcoming Event)

<!-- impeccable:surface-brief 1 -->

- **Mode:** Operate
- **Audience / job:** Students and locals in Konstanz deciding which night to go to this week or weekend.
- **Action:** Pick a date, scan the featured night, open the night sheet.
- **Constraints:** No auth, tickets, create-event, or profiles. No fake attendee counts. Tab + site nav stay. Live Party Insider catalog, Konstanz only.
- **Direction:** User-pinned Upcoming Event mock. Horizontal date capsules, lime featured plate, charcoal plates. Poppins. Sampled #161616 / #F2F862 / #222222.
- **Approved comp:** `.impeccable/mocks/weekend-approved.png`
- **Memorable moment:** The lime date capsule and the lime featured card are the same mark: this is the night that’s on.
- **Signature interaction:** Tap a date capsule; the lead night fills lime; the up-right arrow opens the sheet.
- **Help:** Circular chrome with “?”; toggles a one-line hint. No back button (tab).

## Sampled tokens (from approved comp)

| Role | Hex | Notes |
| ground | `#161616` | viewport |
| plate | `#222222` | idle cards |
| lime | `#F2F862` | selected date + featured card |
| circle | `#282828` | help, chevrons, card arrow |
| ink on lime | `#161616` | |
| type | `#FFFFFF` / `#8E8E93` | primary / meta |

## Inventory

| Region | Medium |
| Title row | Text + circular “?” button |
| Month + chevrons | Text + circular icon buttons |
| Date capsules | Pressable ovals in a horizontal ScrollView |
| Featured card | View fill lime, RemoteImage thumb, lucide clock/pin, arrow circle |
| Idle cards | Same structure, charcoal fill |
| Empty / error | Existing EmptyState + Button |
| Nav | Existing SiteNav + MobileBottomNav |

## Compositional commitments

- Nav: Discover, Explore, Weekend, Saved. No Create, no Profile.
- Title: Upcoming Event, centered, help on the right, spacer on the left.
- No overlapping avatars, no invented crowd counts.
- Lime only on selected date, featured card, help glyph, and active tab.
- Phone: single column. Desktop: same column, max 640px, site nav on top.
