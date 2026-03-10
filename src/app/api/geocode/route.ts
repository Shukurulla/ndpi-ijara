import { NextRequest, NextResponse } from "next/server";

const YANDEX_API_KEY = "8a6b39f7-a80e-4498-8ada-76461664a6af";
const NUKUS_LON = 59.6;
const NUKUS_LAT = 42.46;

async function yandexGeocode(query: string, lang = "ru_RU"): Promise<any[]> {
  const url = new URL("https://geocode-maps.yandex.ru/1.x/");
  url.searchParams.set("apikey", YANDEX_API_KEY);
  url.searchParams.set("geocode", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("results", "5");
  url.searchParams.set("lang", lang);
  url.searchParams.set("ll", `${NUKUS_LON},${NUKUS_LAT}`);
  url.searchParams.set("spn", "0.5,0.5");
  url.searchParams.set("rspn", "1");

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  return data?.response?.GeoObjectCollection?.featureMember || [];
}

function buildQueries(q: string): string[] {
  const trimmed = q.trim();
  // Asosiy va ko'shimcha qidiruv variantlari
  return [
    `Nukus, ${trimmed}`,
    `Nukus, ${trimmed} ko'chasi`,
    `Nukus, ulitsa ${trimmed}`,
  ];
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const queries = buildQueries(q);

    // Parallel qidiruv — hamma variantni bir vaqtda
    const responses = await Promise.all(
      queries.map((query) => yandexGeocode(query, "ru_RU").catch(() => []))
    );

    const allResults: any[] = [];
    const seen = new Set<string>();

    for (const members of responses) {
      for (const m of members) {
        const geo = m.GeoObject;
        const pos = geo.Point?.pos?.split(" ") || [];
        const fullAddress = geo.metaDataProperty?.GeocoderMetaData?.text || "";

        if (seen.has(fullAddress)) continue;
        seen.add(fullAddress);

        // "Узбекистан, Республика Каракалпакстан, " ni olib tashlash
        const shortAddress = fullAddress
          .replace(/^Узбекистан,\s*/i, "")
          .replace(/^Республика Каракалпакстан,\s*/i, "")
          .replace(/^Каракалпакстан,\s*/i, "");

        allResults.push({
          name: geo.name || "",
          description: geo.description || "",
          fullAddress: shortAddress,
          kind: geo.metaDataProperty?.GeocoderMetaData?.kind || "",
          lon: pos[0] ? parseFloat(pos[0]) : 0,
          lat: pos[1] ? parseFloat(pos[1]) : 0,
        });
      }
    }

    return NextResponse.json({ results: allResults.slice(0, 10) });
  } catch (err) {
    console.error("Yandex geocode error:", err);
    return NextResponse.json({ results: [] });
  }
}
