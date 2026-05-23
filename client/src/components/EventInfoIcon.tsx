/** イベント情報行のラベル用アイコン（mockup/self-stance の SVG スタイル） */

type IconKind = "calendar" | "location" | "people" | "gift" | "pencil" | "building" | "default";

const LABEL_KIND: Record<string, IconKind> = {
  日時: "calendar",
  会場: "location",
  定員: "people",
  参加費: "gift",
  持ち物: "pencil",
  運営会社: "building",
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <circle cx="18" cy="8" r="2.5" />
      <path d="M22 21v-1.5a3 3 0 0 0-2-2.83" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-8h6v8" />
      <line x1="8" y1="6" x2="8" y2="6.01" />
      <line x1="12" y1="6" x2="12" y2="6.01" />
      <line x1="16" y1="6" x2="16" y2="6.01" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
    </svg>
  );
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function IconGraphic({ kind }: { kind: IconKind }) {
  switch (kind) {
    case "calendar":
      return <CalendarIcon />;
    case "location":
      return <LocationIcon />;
    case "people":
      return <PeopleIcon />;
    case "gift":
      return <GiftIcon />;
    case "pencil":
      return <PencilIcon />;
    case "building":
      return <BuildingIcon />;
    default:
      return <DefaultIcon />;
  }
}

export function EventInfoIcon({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const kind = LABEL_KIND[label] ?? "default";
  return (
    <span className={className ?? "event-info-icon-svg"}>
      <IconGraphic kind={kind} />
    </span>
  );
}
