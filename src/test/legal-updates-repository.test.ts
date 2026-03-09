import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getLegalUpdateBySlug,
  listLatestLegalUpdates,
  listLegalUpdates,
  resetLegalUpdatesRepositoryCache,
} from "@/lib/legal-updates-repository";

describe("legal updates repository", () => {
  beforeEach(() => {
    resetLegalUpdatesRepositoryCache();
  });

  afterEach(() => {
    resetLegalUpdatesRepositoryCache();
  });

  it("returns local legal updates sorted by publication date", async () => {
    const items = await listLegalUpdates();

    expect(items).toHaveLength(3);
    expect(items[0]?.slug).toBe("yargitay-fazla-mesai-karari-2026");
    expect(items[1]?.slug).toBe("kira-uyarlama-davalarinda-emsal-kira-egilimi");
    expect(items[2]?.slug).toBe("sigorta-uyusmazliklarinda-eksper-raporu-notlari");
  });

  it("returns the latest legal updates with a limit", async () => {
    const items = await listLatestLegalUpdates(2);

    expect(items).toHaveLength(2);
  });

  it("finds an update by slug", async () => {
    const item = await getLegalUpdateBySlug("yargitay-fazla-mesai-karari-2026");

    expect(item?.title).toBe("Yargıtay'dan Fazla Mesai Hesabına İlişkin Yeni Değerlendirme");
  });
});
