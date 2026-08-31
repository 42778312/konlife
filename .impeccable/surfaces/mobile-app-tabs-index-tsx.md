---
version: 1
slug: "mobile-app-tabs-index-tsx"
primary_target: "mobile/app/(tabs)/index.tsx"
related_targets: ["mobile/components/home/HomeHeader.tsx","mobile/components/home/CategoryPills.tsx","mobile/components/home/HomeFeaturedCard.tsx","mobile/components/home/HomePosterCard.tsx"]
---

# Surface: KONSTANZ home (Discover)

- **Mode:** Operate
- **Audience / job:** Students and locals in Konstanz deciding where to go tonight.
- **Action:** Scan categories, open tonight’s featured night, swipe coming posters.
- **Constraints:** No auth, tickets, create-event, or profile. Live Party Insider catalog, Konstanz only. Web-responsive first. Tab bar out of scope.
- **Direction:** User-pinned screenshot `.impeccable/mocks/home-approved.png`. Same layers and wireframe: mark · greeting · saved; Discover search + filter; category stadiums with photo thumbs; photo featured plate; Top nights posters.
- **Approved comp:** `.impeccable/mocks/home-approved.png`
- **Memorable moment:** Lime “Open night” on the photo plate — the mark that opens a real Konstanz night.
- **Signature interaction:** Category stadium selects the plate; Open night opens the sheet. Bookmark on the plate saves. No fake crowds, Join now, or profile.

## Sampled tokens (from approved comp)

| Role | Hex | Notes |
| ground | `#000000` | viewport field |
| plate | `#171717` | search, idle stadiums, card body |
| lime | `#F2F862` | selected stadium, Open night, time mark |
| ink on lime | `#161616` | type and icons on lime |
| circle | `#282828` | filter and saved chrome |
| muted | `#8D8D8D` | Welcome back, See all, place |

## Inventory

| Region | Medium |
| Ground | View `#000000` |
| Header mark | View + Poppins “K”, not a fake portrait |
| Greeting | Text “Welcome back” / “Konstanz” |
| Saved | lucide Bookmark in circle chrome → Saved tab |
| Search | semantic TextInput, placeholder Discover |
| Filter | lucide SlidersHorizontal → Explore |
| Category stadiums | horizontal ScrollView, RemoteImage thumbs from catalog |
| Featured plate | RemoteImage (Party Insider) + date badge + Heart save + title/place/price + door-time lime mark + Open night |
| Top nights posters | horizontal image cards, date pill not fake ratings |
| See all | muted text → Explore |
| Nav | existing tabs (out of scope); hide site wordmark on phone home so the header is the first layer |

## Compositional commitments

- Phone column: padding 16, max ~430px on desktop under site nav.
- Header: 48 circle · centered two-line greeting · 48 circle.
- Search 48 pill + 48 filter circle.
- Category stadiums ~48 tall, 32 photo thumb, lime selected / plate idle.
- Featured: 32 radius plate, image-led, date circle top-left, heart top-right, title+place left / price right, lime time mark + Open night.
- Posters: portrait image cards, peeking carousel, lime date pill + heart. No invented 5.0.
- Product copy in screenshot slots; dummy Blackpink / $40.230 / 1.2K faces are layout only.
