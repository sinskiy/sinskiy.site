const FULL_MONTHS = {
  Jan: "january",
  Feb: "february",
  Mar: "march",
  Apr: "april",
  May: "may",
  Jun: "june",
  Jul: "july",
  Aug: "august",
  Sep: "september",
  Oct: "october",
  Nov: "november",
  Dec: "december",
} as const;

export function formatDate(date: Date) {
  const [week, month, day, year] = date.toDateString().split(" ");
  const isThisYear = year === String(new Date().getFullYear());
  const yearOmmitedIfThis = isThisYear ? "" : year;
  return `${day} ${FULL_MONTHS[month as keyof typeof FULL_MONTHS] ?? month} ${yearOmmitedIfThis}`;
}
