/**
 * Validates a Hungarian Social Security Number (TAJ)
 * TAJ validation formula: the sum of the (1st, 3rd, 5th, 7th) digits multiplied by 3 and 
 * the (2nd, 4th, 6th, 8th) digits multiplied by 7, modulo 10, equals the 9th digit
 * @param taj The TAJ number to validate
 * @returns boolean
 */
export function validateTaj(taj: string): boolean {
  // Check if taj is a string with exactly 9 digits
  if (!taj || typeof taj !== 'string' || !/^\d{9}$/.test(taj)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const multiplier = (i % 2 === 0) ? 3 : 7;
    sum += parseInt(taj[i]) * multiplier;
  }
  
  return sum % 10 === parseInt(taj[8]);
}
