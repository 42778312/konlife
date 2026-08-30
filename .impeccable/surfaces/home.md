# Surface: KONSTANZ home (Discover)

<!-- impeccable:surface-brief 1 -->

- **Mode:** Operate
- **Audience / job:** Students and locals in Konstanz deciding where to go tonight.
- **Action:** Scan tonight’s doors by hour, highlight a night they’re going to, open a night sheet.
- **Constraints:** No auth, tickets, create-event, or profile. Mock catalog only. Web-responsive first.
- **Direction:** Door Clipboard. First viewport is a time rail on paper: hours as the spine, nights hanging off 21:00 / 22:00 / 23:00.
- **Approved comp:** `.impeccable/mocks/decision/assigned-c.webp` (time-spine). Decision-round sheet list remains compositional option one, not the build.
- **Memorable moment:** Highlighting a row (“I’m going”) with reserved yellow; the yellow is never decoration.
- **Signature interaction:** Highlighter fill on a night row; those nights gather on Weekend.
- **Seed:** a2aab498 · grounded #3 Door Clipboard · time-rail composition.

## Sampled tokens (from approved comp)

| Role | Hex | Notes |
| metal ground | `#1F201F` | clipboard / viewport |
| paper | `#E2DFDA` | sheet field |
| ink | `#1B1D1F` | type (comp time glyphs read graphite) |
| highlighter | `#E0EB53` | I’m going only |
| nav strip | `#CCC9C5` | top bar |
| hairline | `rgba(27,29,31,0.16)` | rules |

## Inventory

| Region | Medium |
| Clipboard / metal ground | CSS/View color + paper drop shadow |
| Paper sheet | View, max-width, hairline |
| Binder clip | View/SVG, metal |
| Wordmark + times | Barlow Condensed |
| Titles, venues, nav | Barlow |
| Highlighter | View background, not a card |
| Find field | semantic TextInput |
| Event photos | existing Unsplash URIs on Explore/detail only — home has none |
| Nav | text links desktop; bottom tabs phone |
| Primary action | highlight row / open night |

## Compositional commitments

- Nav: Discover, Explore, Weekend, Saved. No Create, no Profile.
- Display times at rail scale; titles secondary to the hour.
- Highlighter reserved for saved/going.
- Home is rows on paper, not a card grid or search hero.
