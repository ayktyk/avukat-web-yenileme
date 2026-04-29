import { useEffect } from "react";

// WebMCP — Browser-side Model Context Protocol bridge
// https://webmachinelearning.github.io/webmcp/
// Exposes Vega Hukuk's calculators and content feeds to AI agents
// running in the browser (Chrome experimental API).

type WebMCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

const SITE = "https://vegahukukistanbul.com";

const calculatorTools: Array<Omit<WebMCPTool, "execute"> & { slug: string }> = [
  {
    slug: "iscilik-alacaklari",
    name: "calculate-iscilik-alacaklari",
    description: "Türk iş hukukuna göre kıdem tazminatı, ihbar tazminatı, fazla mesai, UBGT, hafta tatili ve yıllık izin alacaklarını dönem bazlı tavan ve kademeli vergi kurallarıyla hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        iseGiris: { type: "string", format: "date", description: "İşe giriş tarihi (YYYY-MM-DD)" },
        istenCikis: { type: "string", format: "date", description: "İşten çıkış tarihi (YYYY-MM-DD)" },
        sonNetUcret: { type: "number", description: "Son net ücret (TL)" },
        yemekYardimi: { type: "number", description: "Aylık yemek yardımı (TL, opsiyonel)" },
        servisYardimi: { type: "number", description: "Aylık servis yardımı (TL, opsiyonel)" },
        fesihTuru: { type: "string", enum: ["isveren_haksiz", "isci_hakli", "ikale", "istifa"], description: "Fesih türü" },
      },
      required: ["iseGiris", "istenCikis", "sonNetUcret", "fesihTuru"],
    },
  },
  {
    slug: "vekalet-ucreti",
    name: "calculate-vekalet-ucreti",
    description: "2026 yılı AAÜT tarifesine göre nispi ve maktu vekalet ücretini; mahkeme türü, dava aşaması ve seri dava indirimiyle hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        mahkemeTuru: { type: "string", description: "Mahkeme türü (asliye_hukuk, asliye_ticaret, sulh_hukuk, vb.)" },
        davaTuru: { type: "string", description: "Dava türü (alacak, tazminat, tespit, vb.)" },
        davaDegeri: { type: "number", description: "Dava değeri (TL)" },
        davaAsamasi: { type: "string", description: "Dava aşaması (ilk_derece, istinaf, temyiz)" },
        seriDava: { type: "boolean", description: "Seri dava indirimi uygulanacak mı?" },
      },
      required: ["mahkemeTuru", "davaDegeri"],
    },
  },
  {
    slug: "arabuluculuk-ucreti",
    name: "calculate-arabuluculuk-ucreti",
    description: "Arabuluculuk Asgari Ücret Tarifesi uyarınca saatlik ve nispi ücretten yüksek olanı, KDV ve stopaj hesabıyla net ödeme tutarını hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        uyusmazlikTuru: { type: "string", description: "Uyuşmazlık türü (iscilik, ticaret, tuketici, vb.)" },
        uyusmazlikTutari: { type: "number", description: "Uyuşmazlık tutarı (TL)" },
        saatSayisi: { type: "number", description: "Görüşme saat sayısı" },
        tarafSayisi: { type: "number", description: "Taraf sayısı" },
      },
      required: ["uyusmazlikTuru", "uyusmazlikTutari", "saatSayisi"],
    },
  },
  {
    slug: "faiz",
    name: "calculate-faiz",
    description: "3095 sayılı Kanun kapsamında yasal, ticari (TCMB avans) veya özel oran üzerinden dönem değişikliklerini dikkate alan kümülatif faiz hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        anaPara: { type: "number", description: "Ana para (TL)" },
        baslangicTarihi: { type: "string", format: "date", description: "Faiz başlangıç tarihi" },
        bitisTarihi: { type: "string", format: "date", description: "Faiz bitiş tarihi" },
        faizTuru: { type: "string", enum: ["yasal", "ticari", "ozel"], description: "Faiz türü" },
        ozelOran: { type: "number", description: "Özel faiz oranı (%, faizTuru=ozel ise)" },
      },
      required: ["anaPara", "baslangicTarihi", "bitisTarihi", "faizTuru"],
    },
  },
  {
    slug: "harc",
    name: "calculate-harc",
    description: "492 sayılı Harçlar Kanunu ve Gider Avansı Tarifesi kapsamında başvurma harcı, peşin harç, vekalet ve gider avansını topluca hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        davaTuru: { type: "string", description: "Dava türü" },
        davaDegeri: { type: "number", description: "Dava değeri (TL)" },
        tarafSayisi: { type: "number", description: "Taraf sayısı" },
      },
      required: ["davaTuru", "davaDegeri"],
    },
  },
  {
    slug: "kira-sureleri",
    name: "calculate-kira-sureleri",
    description: "TBK m.315-352 tahliye nedenleri için ihtar, dava ve fesih sürelerini; m.344 kapsamında TÜFE ortalamasına göre kira artış üst sınırını hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        islemTuru: { type: "string", description: "İşlem türü (artis, tahliye, fesih)" },
        kiraBaslangic: { type: "string", format: "date", description: "Kira sözleşmesi başlangıç tarihi" },
        mevcutKira: { type: "number", description: "Mevcut kira bedeli (TL)" },
      },
      required: ["islemTuru", "kiraBaslangic"],
    },
  },
  {
    slug: "kaza-tazminati",
    name: "calculate-kaza-tazminati",
    description: "Trafik ve iş kazalarında TRH2010 ömür tablosu ve %10 progresif rant yöntemiyle sürekli maluliyet tazminatını aktif-pasif dönem ayrımıyla hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        yas: { type: "number", description: "Mağdurun yaşı" },
        cinsiyet: { type: "string", enum: ["erkek", "kadin"], description: "Cinsiyet" },
        maluliyetOrani: { type: "number", description: "Maluliyet oranı (%)" },
        kusurOrani: { type: "number", description: "Karşı taraf kusur oranı (%)" },
        aylikGelir: { type: "number", description: "Aylık net gelir (TL)" },
      },
      required: ["yas", "cinsiyet", "maluliyetOrani", "kusurOrani", "aylikGelir"],
    },
  },
  {
    slug: "infaz",
    name: "calculate-infaz",
    description: "5275/7242/7456 sayılı Kanunlar kapsamında koşullu salıverilme, denetimli serbestlik, açık cezaevi ve bihakkin tahliye tarihlerini hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        sucTuru: { type: "string", description: "Suç türü (genel, terorle_mucadele, cinsel, vb.)" },
        verilenCeza: { type: "string", description: "Verilen ceza süresi (YYYY-MM-DD veya yıl-ay-gün)" },
        tutuklamaTarihi: { type: "string", format: "date", description: "İlk tutuklama tarihi" },
      },
      required: ["sucTuru", "verilenCeza"],
    },
  },
  {
    slug: "miras-payi",
    name: "calculate-miras-payi",
    description: "Türk Medeni Kanunu zümre sistemine göre mirasçı paylarını ve saklı pay oranlarını hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        mirasTutari: { type: "number", description: "Toplam terekye (TL)" },
        mirasciDurumu: { type: "string", description: "Mirasçıların yapısı" },
      },
      required: ["mirasTutari", "mirasciDurumu"],
    },
  },
];

const contentTools: WebMCPTool[] = [
  {
    name: "search-vega-blog",
    description: "Vega Hukuk blog yazıları arşivinde Türk hukukuna dair konuları arar. JSON feed'i döndürür.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Arama terimi (opsiyonel — boşsa tüm yazılar)" },
      },
    },
    execute: async () => {
      const response = await fetch(`${SITE}/blog.json`);
      return await response.json();
    },
  },
  {
    name: "list-vega-services",
    description: "Vega Hukuk'un sekiz hukuk alanındaki hizmetlerinin tam listesini ve markdown URL'lerini döndürür.",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      const response = await fetch(`${SITE}/hizmetler.json`);
      return await response.json();
    },
  },
  {
    name: "get-vega-contact",
    description: "Vega Hukuk İstanbul iletişim bilgilerini döndürür (adres, telefon, e-posta, çalışma saatleri).",
    inputSchema: { type: "object", properties: {} },
    execute: async () => ({
      name: "Vega Hukuk İstanbul",
      address: "Osmanağa Mah., Karadut Sok. No:14/10, Kadıköy/İstanbul",
      phone: "+905519814937",
      email: "vegalaw.contact@gmail.com",
      whatsapp: "https://wa.me/905519814937",
      hours: "Pazartesi–Cuma 09:00–18:00",
      appointmentUrl: `${SITE}/#iletisim`,
    }),
  },
];

const WebMCPProvider = () => {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const nav = navigator as Navigator & {
      modelContext?: {
        provideContext?: (ctx: { tools: WebMCPTool[] }) => void;
      };
    };
    if (!nav.modelContext || typeof nav.modelContext.provideContext !== "function") {
      return;
    }

    const calculatorWebMCPTools: WebMCPTool[] = calculatorTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      execute: async (input: Record<string, unknown>) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(input)) {
          if (value !== undefined && value !== null) {
            params.set(key, String(value));
          }
        }
        const url = `${SITE}/embed/${tool.slug}${params.toString() ? `?${params.toString()}` : ""}`;
        return {
          ok: true,
          message: `Vega Hukuk ${tool.name} hesaplayıcısı için interaktif sayfa açılmalıdır.`,
          embedUrl: url,
          fullPageUrl: `${SITE}/hesaplamalar/${tool.slug}`,
          markdownUrl: `${SITE}/hesaplamalar/${tool.slug}.md`,
        };
      },
    }));

    try {
      nav.modelContext.provideContext({
        tools: [...calculatorWebMCPTools, ...contentTools],
      });
    } catch (err) {
      console.warn("WebMCP provideContext failed:", err);
    }
  }, []);

  return null;
};

export default WebMCPProvider;
