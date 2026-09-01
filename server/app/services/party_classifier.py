"""
Deterministic, configurable party classifier.

Scoring is transparent:
- Category / tag name matches → high weight
- Title keyword matches → medium weight
- Description keyword matches → lower weight

Never silently drops events; only annotates is_party + party_score.
"""

from __future__ import annotations

import re
import unicodedata
from typing import Iterable

from app.core.config import get_settings
from app.models.event import Event


def _normalize(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKC", text)
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()
    return text


class PartyClassifier:
    def __init__(self, keywords: Iterable[str] | None = None) -> None:
        settings = get_settings()
        raw = list(keywords) if keywords is not None else settings.party_keywords_list
        # Longer phrases first for better matching
        self.keywords = sorted({_normalize(k) for k in raw if k}, key=len, reverse=True)

    def score(self, event: Event) -> tuple[bool, float]:
        score = 0.0
        matched: set[str] = set()

        # Categories (weight 0.45 each, capped)
        for cat in event.categories:
            name = _normalize(cat.name or "")
            slug = _normalize(cat.slug or "")
            for kw in self.keywords:
                if kw in name or kw in slug:
                    if kw not in matched:
                        score += 0.45
                        matched.add(kw)
                    break

        # Tags (weight 0.35)
        for tag in event.tags:
            name = _normalize(tag.name or "")
            slug = _normalize(tag.slug or "")
            for kw in self.keywords:
                if kw in name or kw in slug:
                    if kw not in matched:
                        score += 0.35
                        matched.add(kw)
                    break

        # Title (weight 0.25)
        title = _normalize(event.title or "")
        for kw in self.keywords:
            if kw in title:
                if kw not in matched:
                    score += 0.25
                    matched.add(kw)

        # Description / excerpt (weight 0.10)
        body = _normalize((event.description or "") + " " + (event.excerpt or ""))
        for kw in self.keywords:
            if kw in body:
                if kw not in matched:
                    score += 0.10
                    matched.add(kw)
                    break  # one description hit is enough

        # Venue name hint (small boost)
        if event.venue and event.venue.name:
            vname = _normalize(event.venue.name)
            for kw in ("club", "disco", "bar", "lounge", "night"):
                if kw in vname:
                    score += 0.05
                    break

        score = min(1.0, round(score, 3))
        # Threshold: any solid signal counts as party
        is_party = score >= 0.25
        return is_party, score

    def classify(self, event: Event) -> Event:
        is_party, score = self.score(event)
        event.is_party = is_party
        event.party_score = score
        return event
