/* The Buoni Pasto (BP) denominations: face value and recognition colour of
   each bill, as in the classic game. */

export interface Denomination {
  value: number;
  color: string;
}

/** The 7 denominations, from the smallest to the largest. */
export const DENOMINATIONS: readonly Denomination[] = [
  { value: 5, color: '#6DBE8F' },
  { value: 10, color: '#4FA6D9' },
  { value: 20, color: '#F2A93B' },
  { value: 50, color: '#E4699D' },
  { value: 100, color: '#2FA6A6' },
  { value: 200, color: '#C9A227' },
  { value: 500, color: '#6C3483' },
];

/** Printed copies per denomination: one full sheet each (see BILLS_PER_SHEET). */
export const COPIES_PER_DENOMINATION = 10;
