"""
Generates a new, original AIStudyTools newsletter article roughly every
2 days, inspired by a recent AI News headline. Uses the news title purely
as a topic trigger — it does NOT summarize or reproduce the source article.
The AI is instructed to write original commentary/analysis connected to
AIStudyTools' themes (education, simulations, faculty tools).

Topics come from the AI News feed that AIjuggernauts updates daily.

Requires GEMINI_API_KEY as an environment variable (set via a GitHub
Actions repository secret — never exposed publicly).
"""

import json
import os
import re
import sys
from datetime import datetime, timezone, date
from pathlib import Path

import requests

NEWS_DATA_URL = "https://raw.githubusercontent.com/Anuja-Shukla/AIjuggernauts/main/_data/ai_news.json"
NEWSLETTER_DIR = Path("site-src/newsletter")
MIN_DAYS_BETWEEN_POSTS = 2

API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL = "gemini-3.6-flash"


def slugify(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:60]


def get_used_source_titles():
    used = set()
    for f in NEWSLETTER_DIR.glob("auto-*.md"):
        content = f.read_text()
        match = re.search(r"^source_title:\s*(.+)$", content, re.MULTILINE)
        if match:
            used.add(match.group(1).strip())
    return used


def days_since_last_auto_post():
    dates = []
    for f in NEWSLETTER_DIR.glob("auto-*.md"):
        content = f.read_text()
        match = re.search(r"^date:\s*(\d{4}-\d{2}-\d{2})", content, re.MULTILINE)
        if match:
            dates.append(date.fromisoformat(match.group(1)))
    if not dates:
        return MIN_DAYS_BETWEEN_POSTS  # no prior auto post — allow one now
    most_recent = max(dates)
    return (date.today() - most_recent).days


def pick_news_topic():
    try:
        resp = requests.get(NEWS_DATA_URL, timeout=30)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"Could not load AI News feed: {e}", file=sys.stderr)
        return None
    used_titles = get_used_source_titles()
    for article in data.get("articles", []):
        if article["title"] not in used_titles:
            return article
    return None


def build_prompt(news_title):
    return f"""You write original articles for AIStudyTools, an education platform offering AI tools and training for educators, business faculty, and students (simulations, quick case generators, and classroom AI tools).

A recent AI news headline is: "{news_title}"

Use this headline only as a topic trigger — do NOT summarize, describe, or claim to know the contents of that specific news article, since you have not read it. Instead, write an original ~600-800 word article that:
- Takes the general theme or trend implied by the headline (e.g., if it's about an AI acquisition, write about consolidation in AI tooling; if it's about an AI model release, write about what new capabilities mean for classroom use)
- Connects that theme to something genuinely useful for educators, business faculty, or students
- Does NOT invent specific facts, figures, quotes, or claims about the actual news event — stay at the level of general, defensible commentary
- Has a clear, specific title (not generic), a short one-sentence description, and 3-5 short lowercase-hyphenated tags
- Is written in clear, confident, non-hype prose — no "revolutionize your learning journey" style language

Output ONLY valid JSON in this exact structure, nothing else, no markdown code fences:
{{
  "title": "...",
  "description": "...",
  "tags": ["...", "..."],
  "body": "... (markdown formatted article body, using ## for subheadings)"
}}"""


def call_gemini(prompt):
    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
        params={"key": API_KEY},
        headers={"Content-Type": "application/json"},
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"maxOutputTokens": 3000},
        },
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    candidate = data["candidates"][0]
    text = "".join(p.get("text", "") for p in candidate["content"]["parts"]).strip()
    text = re.sub(r"^```json\s*|\s*```$", "", text.strip())
    return json.loads(text)


def main():
    if not API_KEY:
        print("GEMINI_API_KEY not set — skipping (add it as a repo secret to enable).", file=sys.stderr)
        sys.exit(0)

    days_elapsed = days_since_last_auto_post()
    if days_elapsed < MIN_DAYS_BETWEEN_POSTS:
        print(f"Only {days_elapsed} day(s) since last auto article — skipping.")
        sys.exit(0)

    topic = pick_news_topic()
    if not topic:
        print("No new, unused AI News topics available — skipping.")
        sys.exit(0)

    prompt = build_prompt(topic["title"])
    try:
        result = call_gemini(prompt)
    except Exception as e:
        print(f"Generation failed: {e}", file=sys.stderr)
        sys.exit(1)

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    slug = slugify(result["title"])
    filename = NEWSLETTER_DIR / f"auto-{today}-{slug}.md"

    tags_yaml = ", ".join(result["tags"])
    front_matter = f"""---
title: "{result['title']}"
date: {today}
description: "{result['description']}"
tags: [{tags_yaml}]
source_title: {topic['title']}
---

"""

    filename.write_text(front_matter + result["body"] + "\n")
    print(f"Wrote new article: {filename}")


if __name__ == "__main__":
    main()
