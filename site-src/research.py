# Researcher tab: hub page and the Reference Mapper tool. Run by build.py (exec), so it uses build.py's helpers.
_HERE_R = os.path.dirname(os.path.abspath(__file__))
REFMAP_JS = open(os.path.join(_HERE_R, "refmap.js"), encoding="utf-8").read()

RM_CSS = """<style>
.rm-box{background:#fff;border:2px solid var(--border);border-radius:24px;padding:26px;display:grid;gap:16px}
.rm-drop{border:2.5px dashed #C7C9F2;border-radius:18px;padding:26px;text-align:center;display:grid;gap:8px;justify-items:center;background:#FAFAFF;transition:background .15s,border-color .15s}
.rm-drop.over{background:#EEF0FF;border-color:var(--accent)}
.rm-drop b{font-size:18px}.rm-drop input{display:none}
.rm-fname{font-weight:700;color:var(--accent-dk,#3730A3);min-height:1.2em}
.rm-or{text-align:center;color:var(--muted);font-weight:700;font-size:14px}
.rm-row{display:grid;grid-template-columns:1.2fr 1fr;gap:16px;align-items:end}
@media(max-width:720px){.rm-row{grid-template-columns:1fr}}
.rm-outw{display:grid;gap:16px}.rm-outw[hidden]{display:none}
.rm-status{font-weight:600;min-height:1.3em}.rm-status.err{color:#B91C1C}
details.rm-more{border:2px solid var(--border);border-radius:16px;padding:12px 16px;background:#fff}
details.rm-more summary{cursor:pointer;font-weight:700}
details.rm-more .field{margin-top:10px}
.rm-stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
@media(max-width:820px){.rm-stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
.rm-stat{background:#fff;border:2px solid var(--border);border-radius:16px;padding:12px;text-align:center}
.rm-stat b{display:block;font-size:26px;color:var(--ink)}.rm-stat span{font-size:13px;color:var(--muted);font-weight:600}
.rm-stat.warn{border-color:#FCD34D;background:#FFFBEB}
.rm-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}
.rm-tabs{display:flex;gap:6px;flex-wrap:wrap}
.rm-tabs button{font:inherit;font-weight:700;font-size:15px;border:2px solid var(--border);background:#fff;border-radius:999px;padding:8px 16px;cursor:pointer;color:var(--ink)}
.rm-tabs button.on{background:var(--ink);border-color:var(--ink);color:#fff}
.rm-dl{display:flex;gap:8px;flex-wrap:wrap}
.rm-pane{background:#fff;border:2px solid var(--border);border-radius:20px;padding:20px}
.rm-list{margin:12px 0 0;padding:0;list-style:none;display:grid;gap:10px}
.rm-list li{border-bottom:1px solid var(--border);padding-bottom:10px}
.rm-ref{font-family:"Times New Roman",Times,serif;font-size:17px;line-height:1.55;padding-left:2em;text-indent:-2em;word-break:break-word}
.rm-list.num .rm-ref{padding-left:0;text-indent:0}
.rm-meta{display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap}
.rm-badge{font-size:12.5px;font-weight:700;background:#FEF3C7;color:#92400E;border-radius:999px;padding:3px 10px}
.rm-badge.grey{background:#EEEEF3;color:#55556A}
.rm-type{font-size:12.5px;color:var(--muted);text-transform:capitalize}
.rm-edit{font:inherit;font-size:13px;font-weight:700;border:0;background:#EEF0FF;color:#3730A3;border-radius:999px;padding:4px 12px;cursor:pointer;margin-left:auto}
.rm-form{background:#FAFAFF;border:2px solid var(--border);border-radius:14px;padding:14px;margin-top:10px}
.rm-fgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.rm-fgrid .wide{grid-column:1/-1}
@media(max-width:720px){.rm-fgrid{grid-template-columns:1fr}}
.rm-fgrid .field label{font-size:13px}.rm-fgrid .field input,.rm-fgrid .field select,.rm-fgrid .field textarea{font-size:15px;padding:9px 11px;border-radius:10px}
.rm-fgrid textarea{min-height:70px}
.rm-scroll{overflow-x:auto}
.rm-table{border-collapse:collapse;width:100%;font-size:14.5px;min-width:640px}
.rm-table th,.rm-table td{border-bottom:1px solid var(--border);padding:9px 10px;text-align:left;vertical-align:top}
.rm-table th{font-size:12.5px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted)}
.rm-table .w{color:#92400E}.rm-table .x{color:#B91C1C;font-weight:700}
.rm-check{border-radius:14px;padding:12px 16px;margin-bottom:10px;background:#F4F4F8}
.rm-check.bad{background:#FEE2E2;color:#7F1D1D}.rm-check.warn{background:#FFFBEB;color:#78350F}.rm-check.ok{background:#DCFCE7;color:#14532D}.rm-check.info{background:#EEF0FF;color:#312E81}
.rm-check ul{margin:6px 0 0 18px;font-size:14.5px}
.rm-styles{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.rm-styles span{font-size:13px;font-weight:700;padding:4px 10px;border-radius:999px;background:#EEF0FF;color:#3730A3}
</style>"""

STYLE_OPTS = [("apa", "APA 7th edition"), ("harvard", "Harvard (Cite Them Right)"), ("mla", "MLA 9th edition"), ("chicago", "Chicago 17th (author-date)"), ("ieee", "IEEE (numbered)"), ("vancouver", "Vancouver (numbered)")]

# ---------------- RESEARCHER HUB ----------------
rs = head("Researcher Tools: Reference Mapper and Journal Finder | AIStudyTools",
          "Free tools for researchers: map and reformat references in APA, Harvard, MLA, Chicago, IEEE or Vancouver, check every in-text citation, and find journals by ABDC, SJR and Web of Science.", "/research/") + header("research")
rs += hero("Free for researchers", 'Research faster. <span class="hl">Cite right.</span>',
           "Upload your paper and get every reference mapped to its in-text citations and rewritten in the style your journal wants. Then pick the right journal by ABDC rating, SJR quartile and Web of Science index.",
           [("Map my references", "/research/reference-mapper/", "btn-ink"), ("Find a journal", "/journals/", "btn-soft")],
           mindmap("Your paper", ["Map references", "Check citations", "Change style", "Find journals", "Download"], "Researchers map references, check citations, change style and find journals"))
rs += f'''<section class="white">
  <div class="wrap">
    {sec_head("Pick a tool", "Both tools run in your browser. Your paper is read on your device and is not uploaded.", "Researcher tools")}
    {tool_cards([
        ("layers", "Reference Mapper", "Upload a paper (PDF, Word or text). Every in-text citation is matched to its reference, gaps are flagged, and the list is rewritten in APA, Harvard, MLA, Chicago, IEEE or Vancouver. Download it as Word, text or a CSV map.", "/research/reference-mapper/", "New · No API key needed"),
        ("search", "Journal Finder", "Search journals by name or ISSN and filter by ABDC rating, SJR quartile and Web of Science index, all in one place.", "/journals/", "No API key needed"),
    ])}
  </div>
</section>
<section>
  <div class="wrap">
    {sec_head("What the Reference Mapper checks", "", "Before you submit")}
    {cards([("target", "Every citation has a reference", "Citations in the text with no entry in the reference list are listed, so nothing goes missing."), ("clip", "Every reference is cited", "Entries in the list that are never cited are flagged for you to cite or remove."), ("spark", "Years and names agree", "Mismatched years (Smith, 2019 in the text, 2018 in the list) and possible duplicates are shown."), ("doc", "Style is consistent", "Authors, italics, volume, issue, pages and DOIs are rewritten the same way for every entry.")], color="rotate")}
  </div>
</section>
'''
rs += cta("Running a research methods session?", "We run live webinars on AI in research and teaching, including literature reviews and responsible use of AI in writing.", "See webinars", "/webinars/")
rs += FOOT
write("/research/", rs)

# ---------------- REFERENCE MAPPER ----------------
_opts = "".join(f'<option value="{k}">{html.escape(v)}</option>' for k, v in STYLE_OPTS)
rm = head("Reference Mapper: Check and Reformat References (APA, Harvard, MLA, IEEE) | AIStudyTools",
          "Upload your paper and map every in-text citation to its reference. Find missing and uncited references, then download the list in APA, Harvard, MLA, Chicago, IEEE or Vancouver as a Word file. Free, runs in your browser.", "/research/reference-mapper/") + header("research")
rm += RM_CSS
rm += f'''<section class="hero" style="padding-bottom:10px">
  <div class="wrap" style="display:block">
    <a href="/research/" style="font-weight:700;color:var(--accent-dk,#3730A3);text-decoration:none">← Researcher tools</a>
    <h1 style="margin-top:10px">Reference Mapper</h1>
    <p class="lead" style="max-width:820px">Upload your paper. We find the reference list and every in-text citation, map them to each other, flag what is missing, and rewrite everything in the style you choose. Your file is read on your device and is not uploaded.</p>
    <div class="rm-styles">{"".join(f"<span>{html.escape(v)}</span>" for _k, v in STYLE_OPTS)}</div>
  </div>
</section>
<section style="padding-top:18px">
  <div class="wrap" style="display:grid;gap:18px">
    <div class="rm-box">
      <label class="rm-drop" id="rm-drop" for="rm-file">
        <b>Upload your paper</b>
        <span class="muted">PDF, Word (.docx) or text. Drag it here or click to choose.</span>
        <input type="file" id="rm-file" accept=".pdf,.docx,.txt,.md,.rtf,.tex">
        <span class="btn btn-soft btn-sm">Choose file</span>
        <span class="rm-fname" id="rm-fname"></span>
      </label>
      <div class="rm-or">or</div>
      <div class="field"><label for="rm-text">Paste the text of your paper (including the reference list)</label><textarea id="rm-text" rows="6" placeholder="Paste your paper here…"></textarea></div>
      <details class="rm-more" id="rm-refwrap"><summary>Reference list not found? Paste it separately</summary><div class="field"><label for="rm-reflist">Reference list only (one reference per line or paragraph)</label><textarea id="rm-reflist" rows="5"></textarea></div></details>
      <div class="rm-row">
        <div class="field"><label for="rm-style">Map and format the references as…</label><select id="rm-style">{_opts}</select></div>
        <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn btn-accent" type="button" id="rm-go">Map references {I["arrow"]}</button><button class="btn btn-soft" type="button" id="rm-sample">Try a sample</button></div>
      </div>
      <p class="rm-status" id="rm-status" role="status" aria-live="polite"></p>
    </div>
    <div id="rm-out" class="rm-outw" hidden>
      <div class="rm-stats" id="rm-stats"></div>
      <div class="rm-bar">
        <div class="rm-tabs" role="tablist"><button type="button" data-t="list" class="on">Reference list</button><button type="button" data-t="map">Citation map</button><button type="button" data-t="checks">Checks</button></div>
        <div class="rm-dl"><button class="btn btn-ink btn-sm" type="button" id="rm-docx">Download Word (.docx)</button><button class="btn btn-soft btn-sm" type="button" id="rm-txt">Text (.txt)</button><button class="btn btn-soft btn-sm" type="button" id="rm-csv">Citation map (.csv)</button><button class="btn btn-soft btn-sm" type="button" id="rm-copy">Copy list</button></div>
      </div>
      <div class="rm-pane" id="rm-pane"></div>
      <details class="rm-more"><summary>Some entries marked “Please check”? Let AI read them (optional)</summary>
        <p class="small muted" style="margin-top:8px">Only the flagged reference entries (not your paper) are sent to Google Gemini with your own free API key. The key stays on your device. You can also fix any entry by hand with <b>Edit</b>.</p>
        <div class="field"><label for="rm-key">Gemini API key</label><input type="password" id="rm-key" placeholder="Starts with AIza…" autocomplete="off"></div>
        <label style="display:flex;gap:8px;align-items:center;margin-top:8px;font-size:15px"><input type="checkbox" id="rm-remember" style="width:auto"> Remember the key on this device</label>
        <div class="row" style="margin-top:10px"><button class="btn btn-soft btn-sm" type="button" id="rm-ai">Fix flagged entries with AI</button><a class="small" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Get a free key</a></div>
      </details>
    </div>
    <div class="card" style="display:grid;gap:8px"><h3>Good to know</h3><ul class="checks"><li>Works best on papers with a clear “References”, “Bibliography” or “Works Cited” heading.</li><li>Scanned PDFs have no text to read: upload the Word file or paste the text instead.</li><li>Titles are kept exactly as written. APA asks for sentence case in titles, so check capitals before you submit.</li><li>Always glance over the result. Automatic reading is fast but not perfect; use Edit for any entry.</li></ul></div>
  </div>
</section>
<script>{REFMAP_JS}</script>
'''
rm += FOOT
write("/research/reference-mapper/", rm)
