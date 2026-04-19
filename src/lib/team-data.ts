export type TeamMember = {
  slug: string;
  name: string;
  initials: string;
  jobTitle: string;
  roleShort: string;
  baroSicilNo?: string;
  baro: string;
  email: string;
  phone: string;
  shortDescription: string;
  longBio: string[];
  knowsAbout: string[];
  practiceAreas: Array<{ title: string; description: string }>;
  sameAs: string[];
  seoTitle: string;
  seoDescription: string;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "aykut-yesilkaya",
    name: "Av. Aykut Yeşilkaya",
    initials: "AY",
    jobTitle: "Kurucu Avukat",
    roleShort: "Kurucu Avukat • Arabulucu • Özel Hukuk",
    baroSicilNo: "61223",
    baro: "İstanbul Barosu",
    email: "vegalaw.contact@gmail.com",
    phone: "+905519814937",
    shortDescription:
      "İş hukuku, kira ve gayrimenkul, miras ve aile hukuku, tüketici ve sigorta alanlarında hukuki danışmanlık ve dava takibi.",
    longBio: [
      "Av. Aykut Yeşilkaya, İstanbul Barosu'na kayıtlı (sicil no: 61223) kurucu avukat olarak Vega Hukuk İstanbul bünyesinde görev yapar. İş hukuku, kira ve gayrimenkul, miras ve aile hukuku ile tüketici ve sigorta uyuşmazlıkları odaklı uygulamacıdır.",
      "Büro stratejisi, dosyaların sadece mahkeme sonrası değil; uyuşmazlık doğmadan önceki sözleşme, arabuluculuk ve ihtarname aşamasında da proaktif yönetilmesine dayanır. Müvekkil iletişiminde resmi fakat erişilebilir bir dil benimser; her dosyada karar ve mevzuat referanslı değerlendirme yapılır.",
      "Yazılı çalışmalar ve Vega Hukuk blog sayfasındaki makaleler, güncel Yargıtay içtihadı ve mevzuat takibiyle üretilir. Yayınlanan tüm içerikler avukat tarafından gözden geçirilmektedir.",
    ],
    knowsAbout: [
      "İş Hukuku",
      "Kira Hukuku",
      "Gayrimenkul Hukuku",
      "Miras Hukuku",
      "Aile Hukuku",
      "Tüketici Hukuku",
      "Sigorta Hukuku",
      "Arabuluculuk",
      "İcra ve İflas Hukuku",
    ],
    practiceAreas: [
      { title: "İş Hukuku", description: "İşe iade, kıdem-ihbar tazminatı, fazla mesai alacağı ve mobbing süreçleri." },
      { title: "Kira ve Gayrimenkul", description: "Tahliye davaları, kira uyarlama, tapu iptal-tescil ve izaleyi şuyu." },
      { title: "Miras ve Aile", description: "Tereke tespiti, tenkis, nafaka, velayet ve mal rejimi tasfiyesi." },
      { title: "Tüketici ve Sigorta", description: "Ayıplı mal, cayma hakkı, poliçe uyuşmazlıkları ve tazminat talepleri." },
    ],
    sameAs: [
      "https://www.istanbulbarosu.org.tr/",
      "https://www.linkedin.com/in/aykut-yesilkaya/",
    ],
    seoTitle: "Av. Aykut Yeşilkaya | Kurucu Avukat | Vega Hukuk İstanbul",
    seoDescription:
      "Av. Aykut Yeşilkaya, İstanbul Barosu sicil no 61223. İş, kira, miras, aile, tüketici ve sigorta uyuşmazlıkları alanında danışmanlık ve dava takibi.",
  },
  {
    slug: "mucahit-islam-keskun",
    name: "Av. Mücahit İslam Keskün",
    initials: "MK",
    jobTitle: "Kurucu Avukat",
    roleShort: "Kurucu Avukat · Ceza Hukuku",
    baro: "İstanbul Barosu",
    email: "vegalaw.contact@gmail.com",
    phone: "+905519814937",
    shortDescription:
      "Ceza davalarında savunma, soruşturma ve kovuşturma süreçlerinde etkin temsil ve stratejik savunma hizmeti.",
    longBio: [
      "Av. Mücahit İslam Keskün, Vega Hukuk İstanbul'un kurucu avukatlarındandır. Ceza hukuku ağırlıklı dosya yönetimi yürütür; soruşturma aşamasından istinaf ve temyize uzanan kovuşturma sürecinin her aşamasında müvekkil temsili sağlar.",
      "Dosya stratejisi; delil değerlendirmesi, tutukluluk ve adli kontrol incelemeleri, uzlaştırma kurumunun doğru yönetilmesi ve mağdur-müşteki müdafiliği gibi ceza yargılamasının kritik eşiklerinde yoğunlaşır.",
    ],
    knowsAbout: ["Ceza Hukuku", "Ceza Muhakemesi", "Tutukluluk", "Adli Kontrol", "Uzlaştırma", "Sözleşmeler Hukuku"],
    practiceAreas: [
      { title: "Ceza Soruşturması", description: "Şüpheli ve mağdur müdafiliği, ifade süreci ve delil değerlendirmesi." },
      { title: "Ceza Kovuşturması", description: "Sanık savunması, tutukluluk incelemesi ve adli kontrol tedbirleri." },
      { title: "İstinaf ve Temyiz", description: "Bölge Adliye Mahkemesi ve Yargıtay aşamasında hukuki başvurular." },
    ],
    sameAs: ["https://www.istanbulbarosu.org.tr/"],
    seoTitle: "Av. Mücahit İslam Keskün | Kurucu Avukat | Vega Hukuk İstanbul",
    seoDescription:
      "Av. Mücahit İslam Keskün, ceza hukuku odaklı kurucu avukat. Soruşturma, kovuşturma, istinaf ve temyiz süreçlerinde müdafilik ve stratejik savunma.",
  },
  {
    slug: "busra-yesilkaya",
    name: "Av. Büşra Yeşilkaya",
    initials: "BY",
    jobTitle: "Avukat",
    roleShort: "Sözleşmeler Hukuku · Miras · Aile",
    baro: "İstanbul Barosu",
    email: "vegalaw.contact@gmail.com",
    phone: "+905519814937",
    shortDescription:
      "Miras, aile ve gayrimenkul hukuku ağırlıklı dosya yönetimi; sözleşme tasarımı ve uyuşmazlık çözümünde detay odaklı hukuki destek.",
    longBio: [
      "Av. Büşra Yeşilkaya, Vega Hukuk İstanbul ekibinde miras, aile ve gayrimenkul hukuku ağırlıklı dosyaları yönetir. Sözleşme tasarımı, müzakeresi ve uyuşmazlık çözümünde titiz bir yaklaşım benimser.",
      "Dosyalarda müvekkil ile düzenli iletişim ve delil seti yönetimi önceliklidir. Her dosyada yargı kararlarına atıflı stratejik değerlendirme yapılır.",
    ],
    knowsAbout: [
      "Miras Hukuku",
      "Aile Hukuku",
      "Gayrimenkul Hukuku",
      "Sözleşmeler Hukuku",
      "Sözleşme Tasarımı",
      "Uyuşmazlık Çözümü",
    ],
    practiceAreas: [
      { title: "Miras ve Aile", description: "Tereke, tenkis, muris muvazaası, nafaka ve velayet dosyaları." },
      { title: "Gayrimenkul", description: "Tapu iptal-tescil, izaleyi şuyu ve gayrimenkul satış uyuşmazlıkları." },
      { title: "Sözleşmeler", description: "Sözleşme tasarımı, müzakere, ifa ve temerrüt uyuşmazlıkları." },
    ],
    sameAs: ["https://www.istanbulbarosu.org.tr/"],
    seoTitle: "Av. Büşra Yeşilkaya | Avukat | Vega Hukuk İstanbul",
    seoDescription:
      "Av. Büşra Yeşilkaya, miras, aile ve gayrimenkul hukuku odaklı avukat. Sözleşme tasarımı ve uyuşmazlık çözümünde detay odaklı hukuki destek.",
  },
];

export const getTeamMemberBySlug = (slug: string): TeamMember | undefined =>
  teamMembers.find((member) => member.slug === slug);
