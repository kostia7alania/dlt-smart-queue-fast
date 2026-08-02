const BANGKOK_OFFICE_DIRECTORY = [
  {
    siteId: 1,
    name: "Area Land Transport Office 1 (Bang Khun Thian)",
    district: "Bang Khun Thian",
  },
  {
    siteId: 2,
    name: "Area Land Transport Office 2 (Taling Chan)",
    district: "Taling Chan",
  },
  {
    siteId: 3,
    name: "Area Land Transport Office 3 (Phra Khanong)",
    district: "Phra Khanong",
  },
  {
    siteId: 4,
    name: "Area Land Transport Office 4 (Nong Chok)",
    district: "Nong Chok",
  },
  {
    siteId: 5,
    name: "Area Land Transport Office 5 (Chatuchak)",
    district: "Chatuchak",
  },
] as const;

export type BangkokOfficeSiteId = (typeof BANGKOK_OFFICE_DIRECTORY)[number]["siteId"];

export type BangkokOfficeGeo = {
  sit_id: number;
  lat: number;
  lon: number;
  precision: "office" | "district" | "province";
  th_name: string;
  matched: string;
};

export function getBangkokOfficeLinks(siteId: BangkokOfficeSiteId) {
  return {
    calendar: `/calendar?siteId=${siteId}`,
    map: `/map?search=${encodeURIComponent(`#${siteId}`)}`,
    history: `/history?siteId=${siteId}`,
  } as const;
}

export function buildBangkokOffices(geoById: ReadonlyMap<number, BangkokOfficeGeo>) {
  return BANGKOK_OFFICE_DIRECTORY.map((office) => {
    const geo = geoById.get(office.siteId);
    if (!geo) {
      throw new Error(`Missing committed geography for Bangkok DLT office ${office.siteId}`);
    }

    return {
      ...office,
      thaiName: geo.th_name,
      latitude: geo.lat,
      longitude: geo.lon,
      precision: geo.precision,
      matchedPlace: geo.matched,
      links: getBangkokOfficeLinks(office.siteId),
    };
  });
}

export const BANGKOK_COMPARE_PATH = `/compare?siteIds=${BANGKOK_OFFICE_DIRECTORY.map(
  (office) => office.siteId,
).join(",")}`;

export const BANGKOK_MAP_PATH = `/map?search=${encodeURIComponent("Area Land Transport Office")}`;

export type BangkokOffice = ReturnType<typeof buildBangkokOffices>[number];
