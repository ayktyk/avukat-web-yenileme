(function () {
  const CMS = window.CMS;
  const h = window.React?.createElement || window.h;

  if (!CMS) {
    return;
  }

  const state = {
    linkTargets: [],
  };

  const STOPWORDS = new Set([
    "ve",
    "veya",
    "ile",
    "icin",
    "gibi",
    "daha",
    "en",
    "bir",
    "bu",
    "da",
    "de",
    "mi",
    "mu",
    "mü",
    "guncel",
    "yeni",
    "kritik",
    "notlar",
    "notlari",
    "rehber",
    "detayli",
    "yaklasimi",
    "degerlendirme",
    "degerlendirmesi",
    "haritasi",
    "sartlari",
    "karari",
    "kararlari",
  ]);

  const CHAR_FOLD_MAP = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  const foldChar = (char) => CHAR_FOLD_MAP[char] || String(char || "").toLowerCase();

  const normalizeWithMap = (value) => {
    let normalized = "";
    const charMap = [];

    for (let index = 0; index < String(value || "").length; index += 1) {
      const folded = foldChar(value[index]);
      for (const char of folded) {
        normalized += char;
        charMap.push(index);
      }
    }

    return { normalized, charMap };
  };

  const normalizeForSearch = (value) => normalizeWithMap(value).normalized;

  const escapeHtml = (value) =>
    String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const toJsValue = (value) => {
    if (!value) {
      return value;
    }

    if (typeof value.toJS === "function") {
      return value.toJS();
    }

    if (Array.isArray(value)) {
      return value.map((item) => toJsValue(item));
    }

    if (typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toJsValue(item)]));
    }

    return value;
  };

  const isWordChar = (char) => Boolean(char && /[a-z0-9]/.test(char));

  const hasWordBoundary = (normalizedText, start, end) =>
    !isWordChar(normalizedText[start - 1]) && !isWordChar(normalizedText[end]);

  const findFirstAliasMatch = (sourceIndex, aliases) => {
    for (const alias of aliases) {
      let cursor = 0;

      while (cursor >= 0) {
        const start = sourceIndex.normalized.indexOf(alias, cursor);
        if (start === -1) {
          break;
        }

        const end = start + alias.length;
        if (hasWordBoundary(sourceIndex.normalized, start, end)) {
          return { alias, start, end, matchLength: alias.length };
        }

        cursor = start + alias.length;
      }
    }

    return null;
  };

  const unique = (items) => [...new Set(items)];

  const buildAliases = (target) => {
    const slugTokens = String(target.slug || "")
      .split("-")
      .map((token) => normalizeForSearch(token).trim())
      .filter((token) => token.length > 1);

    const aliases = [];

    for (let size = Math.min(5, slugTokens.length); size >= 1; size -= 1) {
      for (let start = 0; start <= slugTokens.length - size; start += 1) {
        const windowTokens = slugTokens.slice(start, start + size);
        const significantCount = windowTokens.filter((token) => !STOPWORDS.has(token) && token.length >= 4).length;
        const phrase = windowTokens.join(" ").trim();

        if (!phrase) {
          continue;
        }

        if (size === 1 && phrase.length < 10) {
          continue;
        }

        if (size > 1 && (phrase.length < 10 || significantCount === 0)) {
          continue;
        }

        aliases.push({
          phrase,
          score: size * 20 + phrase.length - start,
        });
      }
    }

    return unique(
      aliases
        .sort((left, right) => right.score - left.score)
        .map((item) => item.phrase),
    );
  };

  const normalizeTargetKey = (value) => normalizeForSearch(String(value || "").trim().replace(/^\/+/, ""));

  const findCandidateByTarget = (target, candidates) => {
    const normalizedTarget = normalizeTargetKey(target);

    return (
      candidates.find((candidate) => normalizeTargetKey(candidate.href) === normalizedTarget) ||
      candidates.find((candidate) => normalizeForSearch(candidate.slug) === normalizedTarget) ||
      candidates.find((candidate) => normalizeTargetKey(candidate.href).endsWith(`/${normalizedTarget}`))
    );
  };

  const getPriorityBonus = (source, candidate) => {
    const priorities = Array.isArray(source.internalLinkPriority) ? source.internalLinkPriority : [];
    const candidateSlug = normalizeForSearch(candidate.slug);
    const candidateHref = normalizeTargetKey(candidate.href);

    const matchIndex = priorities.findIndex((priority) => {
      const normalizedPriority = normalizeTargetKey(priority);
      return (
        normalizedPriority === candidateHref ||
        normalizedPriority === candidateSlug ||
        candidateHref.endsWith(`/${normalizedPriority}`)
      );
    });

    return matchIndex === -1 ? 0 : 500 - matchIndex * 40;
  };

  const tokenize = (value) =>
    normalizeForSearch(value)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2 && !STOPWORDS.has(token));

  const rankCandidates = (source, candidates) => {
    const sourceContentIndex = normalizeWithMap(source.content || "");
    const sourceTokens = new Set(tokenize(`${source.title || ""} ${source.excerpt || ""} ${source.content || ""}`));
    const ranked = [];

    const manualRules = Array.isArray(source.internalLinkMatches) ? source.internalLinkMatches : [];
    manualRules.forEach((rule, index) => {
      const candidate = findCandidateByTarget(rule.target, candidates);
      if (!candidate || candidate.href === source.href) {
        return;
      }

      const aliases = [normalizeForSearch(rule.phrase || "").trim()].filter(Boolean);
      const aliasMatch = findFirstAliasMatch(sourceContentIndex, aliases);
      if (!aliasMatch) {
        return;
      }

      ranked.push({
        ...candidate,
        aliases,
        isManual: true,
        relevance: 1000 - index * 25 + getPriorityBonus(source, candidate),
      });
    });

    candidates
      .filter((candidate) => candidate.href !== source.href)
      .forEach((candidate) => {
        const aliases = buildAliases(candidate);
        const aliasMatch = findFirstAliasMatch(sourceContentIndex, aliases);
        if (!aliasMatch) {
          return;
        }

        const candidateTokens = tokenize(`${candidate.title || ""} ${candidate.description || ""}`);
        const commonTokenCount = candidateTokens.filter((token) => sourceTokens.has(token)).length;

        ranked.push({
          ...candidate,
          aliases,
          isManual: false,
          relevance: aliasMatch.matchLength + commonTokenCount * 8 + getPriorityBonus(source, candidate),
        });
      });

    const deduped = new Map();
    ranked.forEach((candidate) => {
      const existing = deduped.get(candidate.href);
      if (!existing || candidate.relevance > existing.relevance) {
        deduped.set(candidate.href, candidate);
      }
    });

    return [...deduped.values()].sort((left, right) => right.relevance - left.relevance);
  };

  const replaceAliasInSegment = (segment, aliases, href) => {
    const sourceIndex = normalizeWithMap(segment);
    const match = findFirstAliasMatch(sourceIndex, aliases);

    if (!match) {
      return segment;
    }

    const originalStart = sourceIndex.charMap[match.start] || 0;
    const originalEndIndex = sourceIndex.charMap[match.end - 1];
    const originalEnd = typeof originalEndIndex === "number" ? originalEndIndex + 1 : segment.length;
    const matchedText = segment.slice(originalStart, originalEnd);

    if (!matchedText) {
      return segment;
    }

    return `${segment.slice(0, originalStart)}[${matchedText}](${href})${segment.slice(originalEnd)}`;
  };

  const replaceFirstLinkInLine = (line, candidate) => {
    const parts = line.split(/(`[^`]*`|\[[^\]]+\]\([^)]+\))/g);

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index] || "";
      if (!part || /^(`[^`]*`|\[[^\]]+\]\([^)]+\))$/.test(part)) {
        continue;
      }

      const updated = replaceAliasInSegment(part, candidate.aliases, candidate.href);
      if (updated !== part) {
        parts[index] = updated;
        return parts.join("");
      }
    }

    return line;
  };

  const autoLinkContent = (source, candidates, maxLinks = 3) => {
    const rankedCandidates = rankCandidates(source, candidates).slice(0, maxLinks * 2);
    const lines = String(source.content || "").split("\n");
    const linkedTargets = new Set();
    const applied = [];
    let inCodeFence = false;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex] || "";

      if (line.trim().startsWith("```")) {
        inCodeFence = !inCodeFence;
        continue;
      }

      if (inCodeFence || !line.trim() || /^(#{1,6}\s|>|[-*]\s|\d+\.\s|\|)/.test(line.trim()) || linkedTargets.size >= maxLinks) {
        continue;
      }

      for (const candidate of rankedCandidates) {
        if (linkedTargets.has(candidate.href)) {
          continue;
        }

        const updatedLine = replaceFirstLinkInLine(line, candidate);
        if (updatedLine !== line) {
          lines[lineIndex] = updatedLine;
          linkedTargets.add(candidate.href);
          applied.push(candidate);
          break;
        }
      }
    }

    return {
      content: lines.join("\n"),
      applied,
      suggestions: rankCandidates(source, candidates).slice(0, 3),
    };
  };

  const markdownLinksToHtml = (value) =>
    escapeHtml(value)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" style="color:#0f3a4a;font-weight:600;text-decoration:underline">$1</a>',
      )
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/\n/g, "<br />");

  const buildSourceFromEntry = (entry, collectionName) => {
    const data = toJsValue(entry.getIn(["data"])) || {};
    const slug = data.slug || "";
    const content = data.body || "";

    return {
      title: data.title || "",
      excerpt: data.excerpt || "",
      slug,
      content,
      internalLinkPriority: Array.isArray(data.internalLinkPriority)
        ? data.internalLinkPriority.map((item) => (typeof item === "object" ? item.value : item)).filter(Boolean)
        : [],
      internalLinkMatches: Array.isArray(data.internalLinkMatches) ? data.internalLinkMatches : [],
      href:
        collectionName === "blog"
          ? `/blog/${slug || "yeni-yazi"}`
          : `/guncel-hukuk-gundemi/${slug || "yeni-icerik"}`,
    };
  };

  const renderPreviewTemplate = (collectionName) => {
    if (!h) {
      return null;
    }

    return function PreviewTemplate(props) {
      const source = buildSourceFromEntry(props.entry, collectionName);
      const candidates = state.linkTargets.filter((item) => item.href !== source.href);
      const preview = autoLinkContent(source, candidates);

      return h(
        "div",
        {
          style: {
            fontFamily: "Georgia, serif",
            padding: "24px",
            background: "#f8f5ef",
            color: "#1d2830",
            minHeight: "100%",
          },
        },
        h(
          "div",
          {
            style: {
              maxWidth: "1080px",
              margin: "0 auto",
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "minmax(0,2fr) minmax(320px,1fr)",
            },
          },
          h(
            "article",
            {
              style: {
                background: "#fffdf9",
                border: "1px solid #e4dccc",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 10px 30px rgba(19,41,51,0.08)",
              },
            },
            h(
              "div",
              {
                dangerouslySetInnerHTML: {
                  __html: `<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#9a6c1f;font-weight:700">İç Link Önizleme</p>
<h1 style="margin:0 0 16px;font-size:34px;line-height:1.1;color:#0f2e3c">${escapeHtml(source.title || "Yeni içerik")}</h1>
<div style="font-size:17px;line-height:1.85;color:#2c3d47"><p>${markdownLinksToHtml(preview.content || source.content || "Henüz içerik girilmedi.")}</p></div>`,
                },
              },
            ),
          ),
          h(
            "aside",
            {
              style: {
                display: "grid",
                gap: "16px",
                alignContent: "start",
              },
            },
            h(
              "section",
              {
                style: {
                  background: "#0f2e3c",
                  color: "#f5efe4",
                  borderRadius: "18px",
                  padding: "20px",
                },
              },
              h("p", { style: { margin: "0 0 10px", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#d6b16d", fontWeight: 700 } }, "SEO Özeti"),
              h(
                "ul",
                { style: { margin: 0, paddingLeft: "18px", lineHeight: 1.8 } },
                h("li", null, `Otomatik / manuel link sayısı: ${preview.applied.length}`),
                h("li", null, `Öncelikli hedef sayısı: ${(source.internalLinkPriority || []).length}`),
                h("li", null, `Manuel eşleşme sayısı: ${(source.internalLinkMatches || []).length}`),
              ),
            ),
            h(
              "section",
              {
                style: {
                  background: "#fffdf9",
                  border: "1px solid #e4dccc",
                  borderRadius: "18px",
                  padding: "20px",
                },
              },
              h("p", { style: { margin: "0 0 12px", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a6c1f", fontWeight: 700 } }, "Linklenen İfadeler"),
              ...(preview.applied.length > 0
                ? preview.applied.map((item) =>
                    h(
                      "div",
                      {
                        key: item.href,
                        style: {
                          marginBottom: "12px",
                          paddingBottom: "12px",
                          borderBottom: "1px solid #eee6d8",
                        },
                      },
                      h("strong", { style: { display: "block", color: "#0f2e3c" } }, item.title),
                      h("small", { style: { color: "#6a7680" } }, item.href),
                    ),
                  )
                : [h("p", { key: "empty", style: { margin: 0, color: "#6a7680" } }, "Henüz eşleşen iç link yok.")]),
            ),
            h(
              "section",
              {
                style: {
                  background: "#fffdf9",
                  border: "1px solid #e4dccc",
                  borderRadius: "18px",
                  padding: "20px",
                },
              },
              h("p", { style: { margin: "0 0 12px", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a6c1f", fontWeight: 700 } }, "Önerilen Hedefler"),
              ...(preview.suggestions.length > 0
                ? preview.suggestions.map((item) =>
                    h(
                      "div",
                      {
                        key: item.href,
                        style: {
                          marginBottom: "12px",
                          paddingBottom: "12px",
                          borderBottom: "1px solid #eee6d8",
                        },
                      },
                      h("strong", { style: { display: "block", color: "#0f2e3c" } }, item.title),
                      h("small", { style: { color: "#6a7680" } }, `${item.href} ${item.isManual ? "• manuel" : "• otomatik"}`),
                    ),
                  )
                : [h("p", { key: "empty-suggestions", style: { margin: 0, color: "#6a7680" } }, "Öneri üretilemedi.")]),
            ),
          ),
        ),
      );
    };
  };

  const ensureLinkTargetDatalist = () => {
    let datalist = document.getElementById("vega-link-targets");

    if (!datalist) {
      datalist = document.createElement("datalist");
      datalist.id = "vega-link-targets";
      document.body.appendChild(datalist);
    }

    datalist.innerHTML = state.linkTargets
      .map(
        (item) =>
          `<option value="${escapeHtml(item.href)}">${escapeHtml(item.title)}${item.category ? ` - ${escapeHtml(item.category)}` : ""}</option>`,
      )
      .join("");
  };

  const applyAutocompleteHints = () => {
    ensureLinkTargetDatalist();

    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach((input) => {
      const nearbyText = (input.closest("label")?.textContent || input.parentElement?.textContent || "").toLowerCase();
      const shouldAttach = nearbyText.includes("hedef");

      if (shouldAttach) {
        input.setAttribute("list", "vega-link-targets");
        if (!input.getAttribute("placeholder")) {
          input.setAttribute("placeholder", "/blog/ornek-yazi veya /guncel-hukuk-gundemi/ornek");
        }
      }
    });
  };

  const initMutationObserver = () => {
    const observer = new MutationObserver(() => {
      applyAutocompleteHints();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  const registerPreviewTemplates = () => {
    if (!h || typeof CMS.registerPreviewTemplate !== "function") {
      return;
    }

    CMS.registerPreviewTemplate("blog", renderPreviewTemplate("blog"));
    CMS.registerPreviewTemplate("legal_updates", renderPreviewTemplate("legal_updates"));
  };

  const initialize = async () => {
    try {
      const response = await fetch("/admin/link-targets.json", { cache: "no-store" });
      if (response.ok) {
        state.linkTargets = await response.json();
      }
    } catch (error) {
      console.error("CMS link target listesi yuklenemedi.", error);
    }

    registerPreviewTemplates();
    applyAutocompleteHints();
    initMutationObserver();
  };

  void initialize();
})();
