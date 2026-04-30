/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// MOM Salary Benchmarks (Approximated based on 2024/2025/2026/2027 criteria)
// These benchmarks increase with age up to 45.

export const AGE_RANGE = {
  MIN: 23,
  MAX: 45,
};

export const PASS_TYPES = {
  EP: 'Employment Pass',
  S_PASS: 'S Pass',
} as const;

export const SECTORS = {
  GENERAL: 'All Other Sectors',
  FINANCIAL: 'Financial Services',
};

// Official MOM Minimum Qualifying Salaries (Projected for 2026/2027)
export const SALARY_BENCHMARKS = {
  2026: {
    EP: {
      [SECTORS.GENERAL]: { min: 5600, max: 10700 }, // Base 5600, Max 10700 at age 45
      [SECTORS.FINANCIAL]: { min: 6200, max: 11800 }, // Base 6200, Max 11800 at age 45
    },
    S_PASS: {
      [SECTORS.GENERAL]: { min: 3300, max: 4800 },
      [SECTORS.FINANCIAL]: { min: 3850, max: 5500 },
    },
  },
  2027: {
    EP: {
      [SECTORS.GENERAL]: { min: 6000, max: 11500 }, // Base 6000, Max 11500 at age 45
      [SECTORS.FINANCIAL]: { min: 6600, max: 12700 }, // Base 6600, Max 12700 at age 45
    },
    S_PASS: {
      [SECTORS.GENERAL]: { min: 3500, max: 5000 },
      [SECTORS.FINANCIAL]: { min: 4100, max: 5800 },
    },
  }
};

// COMPASS-style "Sector Benchmarks"
export const SECTOR_BENCHMARKS = {
  [SECTORS.FINANCIAL]: { low: 7500, mid: 12000, high: 18000 },
  [SECTORS.GENERAL]: { low: 5000, mid: 7500, high: 11000 },
};

/**
 * Calculates the qualifying salary for a specific age, sector, and year.
 */
export function getQualifyingSalary(passType: keyof typeof PASS_TYPES, age: number, sector: string, year: number): number {
  const yearData = SALARY_BENCHMARKS[year as 2026 | 2027] || SALARY_BENCHMARKS[2026];
  const passData = yearData[passType];
  const sectorData = (passData as any)[sector] || (passData as any)[SECTORS.GENERAL];
  
  const baseSalary = sectorData.min;
  const ceilingSalary = sectorData.max;

  if (age <= AGE_RANGE.MIN) return baseSalary;
  if (age >= AGE_RANGE.MAX) return ceilingSalary;

  // Linear progression from Age 23 to Age 45
  const percentage = (age - AGE_RANGE.MIN) / (AGE_RANGE.MAX - AGE_RANGE.MIN);
  return Math.round(baseSalary + (ceilingSalary - baseSalary) * percentage);
}
