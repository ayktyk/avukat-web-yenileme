# Vega Hukuk Web

Kurumsal hukuk sitesi (Vite + React + TypeScript + Tailwind).

## Gereksinimler
- Node.js 20+
- npm 10+
- Vercel uzerinde deploy edilecekse bir Vercel hesabi
- Form mailleri icin Resend hesabi veya ayni REST sozlesmesini saglayan baska bir servis

## Lokal Gelistirme
```bash
npm install
npm run dev
```

Varsayilan gelistirme adresi: `http://localhost:8080`

## Vercel API ile Lokal Test
Frontend `npm run dev` ile calisir; ancak `api/contact` route'u Vite dev server tarafindan servis edilmez.
Vercel function'larini da lokal test etmek icin Vercel CLI ile su akisi kullanilabilir:

```bash
npx vercel dev
```

## Build ve Onizleme
```bash
npm run build
npm run preview
```

## Blog Veri Kaynagi
- Varsayilan kaynak: `src/data/blog-posts.ts`
- Harici API kullanmak icin `.env.local` veya `.env` icine `VITE_BLOG_API_URL=https://...` eklenebilir.
- Gerekirse Bearer token icin `VITE_BLOG_API_TOKEN=...` kullanilabilir.
- API yaniti dogrudan `BlogPost[]` olabilir.
- Alternatif olarak post dizisi icin `VITE_BLOG_ITEMS_PATH=data.items` gibi bir yol verilebilir.
- Alan isimleri farkliysa `.env.example` icindeki `VITE_BLOG_FIELD_*` degiskenleriyle esleme yapilabilir.

## Iletisim Formu
- Browser tarafinda endpoint icin `VITE_CONTACT_FORM_ENDPOINT=/api/contact` kullanilabilir.
- Vercel deploy'unda bu endpoint, custom env verilmemisse production ortaminda otomatik olarak `/api/contact` kabul edilir.
- Serverless function dosyasi: `api/contact.ts`
- Sunucu tarafinda Resend entegrasyonu icin su env'ler tanimlanmalidir:
  - `RESEND_API_KEY`
  - `CONTACT_TO_EMAIL`
  - `CONTACT_FROM_EMAIL`
  - `CONTACT_ALLOWED_ORIGINS`
- Istemci tarafinda KVKK onayi, honeypot alan ve 60 saniyelik temel rate limit bulunur.
- Sunucu tarafinda origin kontrolu ve temel IP bazli rate limit bulunur.

## Vercel Deploy Notlari
- `vercel.json` icinde SPA rewrite tanimlandi; React Router route'lari refresh durumunda da `index.html` uzerinden acilir.
- `api/contact.ts` Vercel Functions uzerinde calisacak sekilde eklendi.
- Vercel dashboard icinde Production env'lerine `.env.example` dosyasindaki ilgili degiskenleri girin.
- Resend tarafinda `CONTACT_FROM_EMAIL` icin dogrulanmis bir domain veya test gondericisi kullanin.

## Test ve Lint
```bash
npm run test
npm run lint
```

## Klasorler
- `src/pages`: sayfalar
- `src/components`: UI bolumleri
- `public`: statik dosyalar
- `api`: Vercel serverless function'lari

## Yayin (Bagimsiz)
- Proje Vercel uzerinde static frontend + serverless function olarak yayinlanabilir.
- Build cikti klasoru: `dist/`
- Domain, DNS ve SSL ayarlari deploy sonrasi Vercel veya registrar uzerinden yonetilir.
