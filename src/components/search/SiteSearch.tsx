import { createContext, startTransition, useContext, useDeferredValue, useEffect, useState } from "react";
import { FileText, HelpCircle, Scale, Search, Shield, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { staticSearchDocuments } from "@/data/search-content";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { buildSiteSearchDocuments, getSearchGroupLabel, getSuggestedSearchDocuments, searchSiteDocuments } from "@/lib/site-search";
import { cn } from "@/lib/utils";
import type { SearchDocument } from "@/types/search";

type SearchContextValue = {
  openSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

const resultIconMap: Record<SearchDocument["type"], typeof FileText> = {
  section: Search,
  "practice-area": Scale,
  faq: HelpCircle,
  team: Users,
  blog: FileText,
  "legal-update": Scale,
  page: Shield,
};

const scrollToHashTarget = (hash: string) => {
  const targetId = decodeURIComponent(hash.replace(/^#/, ""));
  const element = document.getElementById(targetId);

  if (!element) {
    return false;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
};

export const HashScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    let attempts = 0;
    let timeoutId = 0;

    const tryScroll = () => {
      if (scrollToHashTarget(location.hash) || attempts >= 12) {
        return;
      }

      attempts += 1;
      timeoutId = window.setTimeout(tryScroll, 80);
    };

    timeoutId = window.setTimeout(tryScroll, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash, location.pathname]);

  return null;
};

export const useSiteSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSiteSearch must be used within SiteSearchProvider");
  }

  return context;
};

type SearchTriggerProps = {
  className?: string;
  compact?: boolean;
};

export const SearchTrigger = ({ className, compact = false }: SearchTriggerProps) => {
  const { openSearch } = useSiteSearch();

  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Site içinde ara"
      className={cn(
        "inline-flex items-center gap-2 rounded-[10px] border border-border bg-background/85 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background",
        compact ? "h-10 w-10 justify-center p-0" : "px-4 py-2.5",
        className,
      )}
    >
      <Search className="h-4 w-4" />
      {!compact && <span>Ara</span>}
    </button>
  );
};

const SiteSearchFloatingButton = () => {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="fixed right-5 bottom-5 z-40">
      <SearchTrigger className="border-primary/10 bg-background/95 pr-3 shadow-elegant backdrop-blur-xl" />
    </div>
  );
};

export const SiteSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [documents, setDocuments] = useState<SearchDocument[]>(staticSearchDocuments);
  const [results, setResults] = useState<SearchDocument[]>([]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (documents.length > staticSearchDocuments.length) {
      return;
    }

    let active = true;

    void buildSiteSearchDocuments()
      .then((loadedDocuments) => {
        if (!active) {
          return;
        }

        setDocuments(loadedDocuments);
      })
      .catch((error) => {
        console.error("Site arama verisi yuklenemedi.", error);
      });

    return () => {
      active = false;
    };
  }, [documents.length]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    startTransition(() => {
      if (deferredQuery.trim()) {
        setResults(searchSiteDocuments(documents, deferredQuery));
        return;
      }

      setResults(getSuggestedSearchDocuments(documents));
    });
  }, [deferredQuery, documents, open]);

  const groupedResults = results.reduce<Record<string, SearchDocument[]>>((acc, item) => {
    const groupLabel = getSearchGroupLabel(item.type);
    acc[groupLabel] = [...(acc[groupLabel] ?? []), item];
    return acc;
  }, {});

  const openSearch = () => setOpen(true);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");

    const [path, hash] = href.split("#");
    const targetPath = path || location.pathname;

    navigate(hash ? `${targetPath}#${hash}` : targetPath);

    if (hash && targetPath === location.pathname) {
      window.setTimeout(() => {
        scrollToHashTarget(`#${hash}`);
      }, 0);
    }
  };

  return (
    <SearchContext.Provider value={{ openSearch }}>
      {children}
      <SiteSearchFloatingButton />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput value={query} onValueChange={setQuery} placeholder="Blog, hukuk gündemi, ekip veya konu ara..." />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>Aramanızla eşleşen bir sonuç bulunamadı.</CommandEmpty>
          {Object.entries(groupedResults).map(([groupLabel, items], index) => (
            <div key={groupLabel}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={groupLabel}>
                {items.map((item) => {
                  const Icon = resultIconMap[item.type];

                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.description} ${(item.keywords ?? []).join(" ")} ${item.searchText ?? ""}`}
                      onSelect={() => handleSelect(item.href)}
                      className="flex items-start gap-3 rounded-xl px-3 py-3.5"
                    >
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.06] text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold text-primary-deep">{item.title}</span>
                          {item.badge && (
                            <span className="rounded-full bg-accent-pale px-2 py-0.5 text-[10px] font-bold uppercase tracking-[1.1px] text-primary-deep">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </SearchContext.Provider>
  );
};
