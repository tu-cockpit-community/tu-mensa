import React, { useState, useMemo } from "react";
import {
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  Leaf,
  CheckCircle2,
  Bookmark,
  Share2,
  Info,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface Dish {
  id: string;
  name: string;
  soupOrSide: string;
  category: "classic" | "veggie" | "vegan" | "special";
  priceStudent: number;
  priceRegular: number;
  allergens: string[];
  calories: number;
  tags: string[];
  rating: number;
}

interface MensaLocation {
  id: string;
  name: string;
  shortName: string;
  address: string;
  hours: string;
  currentQueue: "low" | "medium" | "high";
  queueText: string;
}

const LOCATIONS: MensaLocation[] = [
  {
    id: "freihaus",
    name: "TU Mensa Freihaus",
    shortName: "Freihaus",
    address: "Wiedner Hauptstraße 8-10, Gelber Turm, 1. Stock",
    hours: "11:00 – 14:00 Uhr",
    currentQueue: "low",
    queueText: "3–5 min Wartezeit (Gering)",
  },
  {
    id: "markt",
    name: "TU Mensa Markt",
    shortName: "Mensa Markt",
    address: "Campus Gußhaus, Gußhausstraße 27-29",
    hours: "11:30 – 14:00 Uhr",
    currentQueue: "medium",
    queueText: "8–12 min Wartezeit (Normal)",
  },
  {
    id: "gushaus_cafe",
    name: "Cafeteria Gußhaus",
    shortName: "Cafeteria",
    address: "Altes EI-Gebäude, Gußhausstraße 25, EG",
    hours: "08:30 – 15:30 Uhr",
    currentQueue: "low",
    queueText: "Direkt verfügbar",
  },
];

const MENUS_BY_DAY: Record<string, Dish[]> = {
  today: [
    {
      id: "dish_1",
      name: "Knuspriges Hühnerschnitzel mit Petersilerdäpfeln & Zitrone",
      soupOrSide: "Klare Rindsuppe mit Frittaten",
      category: "classic",
      priceStudent: 6.9,
      priceRegular: 8.9,
      allergens: ["A", "C", "G"],
      calories: 780,
      tags: ["Beliebt", "Hausmannskost"],
      rating: 4.8,
    },
    {
      id: "dish_2",
      name: "Kürbis-Spinat-Lasagne mit Grana Padano & Blattsalat",
      soupOrSide: "Karotten-Ingwer-Cremesuppe",
      category: "veggie",
      priceStudent: 6.2,
      priceRegular: 7.9,
      allergens: ["A", "G", "L"],
      calories: 620,
      tags: ["Vegetarisch", "Saisonal"],
      rating: 4.7,
    },
    {
      id: "dish_3",
      name: "Rotes Linsen-Süßkartoffel-Dal mit Basmatireis & Naan",
      soupOrSide: "Kokos-Koriander-Brühe",
      category: "vegan",
      priceStudent: 5.8,
      priceRegular: 7.4,
      allergens: ["A", "F"],
      calories: 540,
      tags: ["Vegan", "Proteinreich"],
      rating: 4.9,
    },
    {
      id: "dish_4",
      name: "Gegrilltes Lachsforellenfilet auf mediterranem Zucchinigemüse",
      soupOrSide: "Kräuterkartoffeln & Rucola",
      category: "special",
      priceStudent: 8.4,
      priceRegular: 10.5,
      allergens: ["D", "G"],
      calories: 590,
      tags: ["Chef Special", "Omega-3"],
      rating: 4.6,
    },
  ],
  tomorrow: [
    {
      id: "dish_5",
      name: "Rindsgulasch mit Butternockerln & Essiggurkerl",
      soupOrSide: "Grießnockerlsuppe",
      category: "classic",
      priceStudent: 6.9,
      priceRegular: 8.9,
      allergens: ["A", "C", "G", "L"],
      calories: 820,
      tags: ["Klassiker", "Herzhaft"],
      rating: 4.7,
    },
    {
      id: "dish_6",
      name: "Pikantes Kichererbsen-Chili sin Carne mit Guacamole & Tacos",
      soupOrSide: "Maiscremesuppe mit Koriander",
      category: "vegan",
      priceStudent: 5.9,
      priceRegular: 7.5,
      allergens: ["F", "L"],
      calories: 560,
      tags: ["Vegan", "Glutenfrei Option"],
      rating: 4.8,
    },
    {
      id: "dish_7",
      name: "Tiroler Kaspressknödel auf warmem Fasskrautsalat",
      soupOrSide: "Kräftige Gemüsesuppe",
      category: "veggie",
      priceStudent: 6.1,
      priceRegular: 7.8,
      allergens: ["A", "C", "G"],
      calories: 680,
      tags: ["Vegetarisch", "Regional"],
      rating: 4.9,
    },
  ],
  friday: [
    {
      id: "dish_8",
      name: "Kabeljaufilet im Backteig mit hausgemachtem Erdäpfelsalat",
      soupOrSide: "Sauce Remoulade & Zitrone",
      category: "classic",
      priceStudent: 7.2,
      priceRegular: 9.2,
      allergens: ["A", "C", "D", "M"],
      calories: 710,
      tags: ["Freitags-Tradition"],
      rating: 4.7,
    },
    {
      id: "dish_9",
      name: "Süßkartoffel-Gnocchi mit Salbeibutter & gerösteten Pinienkernen",
      soupOrSide: "Kürbiscremesuppe",
      category: "veggie",
      priceStudent: 6.4,
      priceRegular: 8.1,
      allergens: ["A", "G"],
      calories: 590,
      tags: ["Vegetarisch", "Fein"],
      rating: 4.8,
    },
  ],
};

const ALLERGEN_LABELS: Record<string, string> = {
  A: "Glutenhaltiges Getreide",
  C: "Eier",
  D: "Fisch",
  F: "Soja",
  G: "Milch / Laktose",
  L: "Sellerie",
  M: "Senf",
};

export const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("freihaus");
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow" | "friday">("today");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "veggie" | "vegan" | "budget">("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["dish_1"]));
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const currentLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === selectedLocation) || LOCATIONS[0],
    [selectedLocation]
  );

  const dishes = useMemo(() => {
    const list = MENUS_BY_DAY[selectedDay] || [];
    return list.filter((dish) => {
      if (selectedFilter === "veggie") return dish.category === "veggie" || dish.category === "vegan";
      if (selectedFilter === "vegan") return dish.category === "vegan";
      if (selectedFilter === "budget") return dish.priceStudent <= 6.0;
      return true;
    });
  }, [selectedDay, selectedFilter]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = () => {
    const text = `TU Wien Mensa (${currentLocation.shortName}) Menü für ${
      selectedDay === "today" ? "Heute" : selectedDay === "tomorrow" ? "Morgen" : "Freitag"
    }:\n` + dishes.map((d) => `• ${d.name} (€${d.priceStudent.toFixed(2)})`).join("\n");

    navigator.clipboard?.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "var(--tu-bg-base)",
        color: "var(--tu-text-primary)",
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          height: "56px",
          backgroundColor: "var(--tu-bg-surface)",
          borderBottom: "1px solid var(--tu-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "var(--tu-radius-sm)",
              backgroundColor: "var(--tu-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            <Utensils style={{ width: "18px", height: "18px" }} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              TU Mensa Radar
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "1px 6px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "var(--tu-success)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                Live WS 2026
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--tu-text-secondary)" }}>
              Offizielle Tagesmenüs für TU Wien Studierende
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              padding: "4px 10px",
              borderRadius: "var(--tu-radius-sm)",
              backgroundColor: "rgba(0, 102, 153, 0.15)",
              border: "1px solid rgba(0, 102, 153, 0.3)",
              color: "var(--tu-text-accent)",
            }}
          >
            <CheckCircle2 style={{ width: "14px", height: "14px", color: "var(--tu-success)" }} />
            <span>TU Card Studierenden-Tarif aktiv</span>
          </div>

          <button
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: "var(--tu-radius-sm)",
              backgroundColor: "var(--tu-bg-card)",
              border: "1px solid var(--tu-border)",
              color: "var(--tu-text-primary)",
              cursor: "pointer",
            }}
          >
            <Share2 style={{ width: "13px", height: "13px" }} />
            {copiedNotice ? "Kopiert! ✓" : "Menü Teilen"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar: Mensa Location Selector */}
        <div
          style={{
            width: "280px",
            backgroundColor: "var(--tu-bg-surface)",
            borderRight: "1px solid var(--tu-border)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            padding: "16px",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--tu-text-muted)" }}>
            TU Wien Mensa Standorte
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {LOCATIONS.map((loc) => {
              const isSelected = loc.id === selectedLocation;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--tu-radius)",
                    backgroundColor: isSelected ? "rgba(0, 102, 153, 0.15)" : "var(--tu-bg-base)",
                    border: `1px solid ${isSelected ? "var(--tu-accent)" : "var(--tu-border)"}`,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "var(--tu-text-accent)" : "var(--tu-text-primary)" }}>
                      {loc.name}
                    </div>
                    <ChevronRight style={{ width: "14px", height: "14px", color: isSelected ? "var(--tu-accent)" : "var(--tu-text-muted)" }} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--tu-text-secondary)", marginBottom: "6px" }}>
                    <MapPin style={{ width: "12px", height: "12px", flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loc.address}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "10px", marginTop: "4px" }}>
                    <span style={{ color: "var(--tu-text-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Clock style={{ width: "11px", height: "11px" }} />
                      {loc.hours}
                    </span>
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: "4px",
                        backgroundColor: loc.currentQueue === "low" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: loc.currentQueue === "low" ? "var(--tu-success)" : "var(--tu-warning)",
                        fontWeight: 600,
                      }}
                    >
                      {loc.queueText.split(" ")[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div
            style={{
              marginTop: "auto",
              padding: "12px",
              borderRadius: "var(--tu-radius)",
              backgroundColor: "var(--tu-bg-card)",
              border: "1px solid var(--tu-border)",
              fontSize: "11px",
              color: "var(--tu-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--tu-text-primary)", fontWeight: 600, marginBottom: "4px" }}>
              <Info style={{ width: "14px", height: "14px", color: "var(--tu-accent)" }} />
              ÖH Mensapickerl Rabatt
            </div>
            Mit dem auf der TU Card aktivierten Mensapickerl erhältst du bei jedem Menü automatisch **€ 0,80 Nachlass** an allen Kassen.
          </div>
        </div>

        {/* Right Area: Menus & Dish Cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "16px 24px" }}>
          {/* Controls Bar: Day Tabs & Dietary Filter Chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
              paddingBottom: "14px",
              borderBottom: "1px solid var(--tu-border)",
            }}
          >
            {/* Day Switcher */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                backgroundColor: "var(--tu-bg-surface)",
                padding: "3px",
                borderRadius: "var(--tu-radius)",
                border: "1px solid var(--tu-border)",
              }}
            >
              {[
                { id: "today", label: "Heute (Mittwoch)" },
                { id: "tomorrow", label: "Morgen (Donnerstag)" },
                { id: "friday", label: "Freitag" },
              ].map((tab) => {
                const isActive = selectedDay === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedDay(tab.id as any)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--tu-radius-sm)",
                      border: "none",
                      backgroundColor: isActive ? "var(--tu-accent)" : "transparent",
                      color: isActive ? "#ffffff" : "var(--tu-text-secondary)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Dietary Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--tu-text-muted)", fontWeight: 600 }}>Filter:</span>
              {[
                { id: "all", label: "Alle Menüs" },
                { id: "veggie", label: "Vegetarisch", icon: Leaf },
                { id: "vegan", label: "Vegan", icon: Sparkles },
                { id: "budget", label: "Unter €6", icon: TrendingUp },
              ].map((f) => {
                const isActive = selectedFilter === f.id;
                const IconComponent = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id as any)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "14px",
                      border: `1px solid ${isActive ? "var(--tu-accent)" : "var(--tu-border)"}`,
                      backgroundColor: isActive ? "rgba(0, 102, 153, 0.2)" : "var(--tu-bg-surface)",
                      color: isActive ? "var(--tu-text-accent)" : "var(--tu-text-secondary)",
                      fontSize: "11px",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {IconComponent && <IconComponent style={{ width: "12px", height: "12px" }} />}
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dish Grid */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "16px",
              paddingRight: "4px",
            }}
          >
            {dishes.map((dish) => {
              const isFav = favorites.has(dish.id);
              const badgeColor =
                dish.category === "vegan"
                  ? "var(--tu-success)"
                  : dish.category === "veggie"
                  ? "var(--tu-success)"
                  : dish.category === "special"
                  ? "var(--tu-accent)"
                  : "var(--tu-warning)";

              return (
                <div
                  key={dish.id}
                  style={{
                    backgroundColor: "var(--tu-bg-surface)",
                    border: "1px solid var(--tu-border)",
                    borderRadius: "var(--tu-radius)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  <div>
                    {/* Dish Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: `${badgeColor}20`,
                            color: badgeColor,
                            border: `1px solid ${badgeColor}40`,
                          }}
                        >
                          {dish.category === "classic"
                            ? "Menü Classic"
                            : dish.category === "veggie"
                            ? "Veggie Menü"
                            : dish.category === "vegan"
                            ? "Vegan Menü"
                            : "Chef Special"}
                        </span>
                        {dish.tags.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: "10px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "var(--tu-bg-card)",
                              color: "var(--tu-text-muted)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleFavorite(dish.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: isFav ? "#eab308" : "var(--tu-text-muted)",
                          cursor: "pointer",
                          padding: "2px",
                        }}
                      >
                        <Bookmark style={{ width: "16px", height: "16px", fill: isFav ? "#eab308" : "none" }} />
                      </button>
                    </div>

                    {/* Dish Name */}
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--tu-text-primary)", marginBottom: "6px", lineHeight: 1.4 }}>
                      {dish.name}
                    </div>

                    {/* Soup / Side Description */}
                    <div style={{ fontSize: "12px", color: "var(--tu-text-secondary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "var(--tu-accent)", fontWeight: 600 }}>Inklusive:</span>
                      {dish.soupOrSide}
                    </div>
                  </div>

                  {/* Dish Footer: Prices, Allergens, Calories */}
                  <div
                    style={{
                      paddingTop: "12px",
                      borderTop: "1px solid var(--tu-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                        <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--tu-text-primary)" }}>
                          € {dish.priceStudent.toFixed(2)}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--tu-text-muted)", textDecoration: "line-through" }}>
                          € {dish.priceRegular.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--tu-success)", fontWeight: 600 }}>
                        Studentenpreis
                      </div>
                    </div>

                    {/* Allergens & Energy */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {dish.allergens.map((a) => (
                          <span
                            key={a}
                            title={ALLERGEN_LABELS[a] || a}
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              fontFamily: "var(--tu-font-mono)",
                              width: "18px",
                              height: "18px",
                              borderRadius: "3px",
                              backgroundColor: "var(--tu-bg-card)",
                              color: "var(--tu-text-secondary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid var(--tu-border)",
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: "10px", color: "var(--tu-text-muted)" }}>
                        {dish.calories} kcal
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
