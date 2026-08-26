/* Contract data (the "property cards"): rents, upgrade cost and mortgage
   value, keyed by the index of the space on the board (see spaces.ts).
   The numbers are the ones of the classic game. */

/** Rents of a product/service space, in Buoni Pasto. */
export interface Rents {
  /** Base rent: licence with no upgrades. */
  bare: number;
  /** Rent with 1, 2, 3 and 4 upgrades (the "houses"). */
  upgrades: readonly [number, number, number, number];
  /** Rent with the Major Release (the "hotel"). */
  release: number;
}

/** Everything needed to print one property contract. */
export interface ContractData {
  rents: Rents;
  /** Cost of one upgrade (and of a Major Release, as in the classic game). */
  upgradeCost: number;
  mortgage: number;
}

/**
 * Contratti delle 22 caselle prodotto/servizio, per indice di casella.
 * I valori sono quelli del tabellone originale: dipendono dalla posizione,
 * non dal colore, quindi la chiave è l'indice.
 */
export const CONTRACTS: Readonly<Record<number, ContractData>> = {
  1: { rents: { bare: 5, upgrades: [25, 75, 225, 400], release: 625 }, upgradeCost: 125, mortgage: 75 },
  3: { rents: { bare: 10, upgrades: [50, 150, 450, 800], release: 1125 }, upgradeCost: 500, mortgage: 75 },
  6: { rents: { bare: 15, upgrades: [75, 225, 675, 1000], release: 1375 }, upgradeCost: 125, mortgage: 125 },
  8: { rents: { bare: 15, upgrades: [75, 225, 675, 1000], release: 1375 }, upgradeCost: 125, mortgage: 125 },
  9: { rents: { bare: 20, upgrades: [100, 250, 750, 1125], release: 1500 }, upgradeCost: 125, mortgage: 150 },
  11: { rents: { bare: 25, upgrades: [125, 360, 1025, 1435], release: 1875 }, upgradeCost: 250, mortgage: 175 },
  13: { rents: { bare: 25, upgrades: [125, 360, 1025, 1435], release: 1875 }, upgradeCost: 250, mortgage: 175 },
  14: { rents: { bare: 30, upgrades: [150, 400, 1125, 1565], release: 2000 }, upgradeCost: 250, mortgage: 200 },
  16: { rents: { bare: 35, upgrades: [175, 500, 1375, 1875], release: 2375 }, upgradeCost: 250, mortgage: 225 },
  18: { rents: { bare: 35, upgrades: [175, 500, 1375, 1875], release: 2375 }, upgradeCost: 250, mortgage: 225 },
  19: { rents: { bare: 40, upgrades: [200, 550, 1500, 2000], release: 2500 }, upgradeCost: 250, mortgage: 250 },
  21: { rents: { bare: 45, upgrades: [225, 625, 1750, 2200], release: 2625 }, upgradeCost: 375, mortgage: 275 },
  23: { rents: { bare: 45, upgrades: [225, 625, 1750, 2200], release: 2625 }, upgradeCost: 375, mortgage: 275 },
  24: { rents: { bare: 50, upgrades: [250, 750, 1875, 2250], release: 2750 }, upgradeCost: 375, mortgage: 300 },
  26: { rents: { bare: 55, upgrades: [275, 825, 2000, 2500], release: 3000 }, upgradeCost: 375, mortgage: 325 },
  27: { rents: { bare: 55, upgrades: [275, 825, 2000, 2500], release: 3000 }, upgradeCost: 375, mortgage: 325 },
  29: { rents: { bare: 60, upgrades: [300, 900, 2125, 2625], release: 3125 }, upgradeCost: 375, mortgage: 350 },
  31: { rents: { bare: 65, upgrades: [325, 1000, 2250, 2750], release: 3250 }, upgradeCost: 500, mortgage: 375 },
  32: { rents: { bare: 65, upgrades: [325, 1000, 2250, 2750], release: 3250 }, upgradeCost: 500, mortgage: 375 },
  34: { rents: { bare: 70, upgrades: [375, 1125, 2500, 3000], release: 3500 }, upgradeCost: 500, mortgage: 400 },
  37: { rents: { bare: 90, upgrades: [500, 1250, 2750, 3250], release: 3750 }, upgradeCost: 500, mortgage: 450 },
  39: { rents: { bare: 125, upgrades: [500, 1500, 3500, 4250], release: 5000 }, upgradeCost: 500, mortgage: 500 },
};

/** The 4 Consulenza spaces: the "stations" of the classic game. */
export const CONSULTANT_INDEXES: readonly number[] = [5, 15, 25, 35];

/** Consulenza rent with 1, 2, 3 and 4 spaces owned by the same player. */
export const CONSULTANT_RENTS: readonly [number, number, number, number] = [60, 120, 240, 480];

export const CONSULTANT_MORTGAGE = 240;

/** Enel and Impianto clima: the "utilities" of the classic game. */
export const UTILITY_INDEXES: readonly number[] = [12, 28];

/** Dice multiplier when a single utility space is owned. */
export const UTILITY_MULTIPLIER = 4;

/** Dice multiplier when both utility spaces are owned. */
export const UTILITIES_MULTIPLIER = 10;

export const UTILITY_MORTGAGE = 190;
