export interface CountryOption {
  code: string;
  dialCode: string;
  label: string;
  flag: string;
}

// Sélection de pays courants pour une clientèle parisienne — facile à
// étendre plus tard.
export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "FR", dialCode: "33", label: "France", flag: "🇫🇷" },
  { code: "BE", dialCode: "32", label: "Belgique", flag: "🇧🇪" },
  { code: "CH", dialCode: "41", label: "Suisse", flag: "🇨🇭" },
  { code: "LU", dialCode: "352", label: "Luxembourg", flag: "🇱🇺" },
  { code: "DE", dialCode: "49", label: "Allemagne", flag: "🇩🇪" },
  { code: "ES", dialCode: "34", label: "Espagne", flag: "🇪🇸" },
  { code: "IT", dialCode: "39", label: "Italie", flag: "🇮🇹" },
  { code: "GB", dialCode: "44", label: "Royaume-Uni", flag: "🇬🇧" },
  { code: "PT", dialCode: "351", label: "Portugal", flag: "🇵🇹" },
  { code: "NL", dialCode: "31", label: "Pays-Bas", flag: "🇳🇱" },
  { code: "MA", dialCode: "212", label: "Maroc", flag: "🇲🇦" },
  { code: "DZ", dialCode: "213", label: "Algérie", flag: "🇩🇿" },
  { code: "TN", dialCode: "216", label: "Tunisie", flag: "🇹🇳" },
  { code: "US", dialCode: "1", label: "États-Unis", flag: "🇺🇸" },
];

export const DEFAULT_COUNTRY = COUNTRY_OPTIONS[0];

// Regroupe les chiffres par paires en partant de la gauche ; si le nombre de
// chiffres est impair, le premier groupe ne contient qu'un chiffre — c'est
// la convention d'affichage française standard (+33 6 12 34 56 78).
export function formatNationalNumber(rawDigits: string): string {
  const digits = rawDigits.replace(/\D/g, "");
  const groups: string[] = [];
  let i = 0;
  if (digits.length % 2 === 1) {
    groups.push(digits.slice(0, 1));
    i = 1;
  }
  for (; i < digits.length; i += 2) {
    groups.push(digits.slice(i, i + 2));
  }
  return groups.join(" ");
}

// Retire un éventuel 0 initial (format national) — inutile une fois le
// pays choisi explicitement via l'indicatif.
export function stripLeadingZero(rawDigits: string): string {
  const digits = rawDigits.replace(/\D/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

export function isValidNationalNumber(dialCode: string, rawDigits: string): boolean {
  const digits = stripLeadingZero(rawDigits);
  if (dialCode === "33") {
    return digits.length === 9;
  }
  return digits.length >= 6 && digits.length <= 12;
}

export function formatPhoneForStorage(dialCode: string, rawDigits: string): string {
  const digits = stripLeadingZero(rawDigits);
  return `+${dialCode} ${formatNationalNumber(digits)}`;
}
