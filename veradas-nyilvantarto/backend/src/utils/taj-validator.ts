export function validateTaj(taj: string): boolean {
    if (!/^\d{9}$/.test(taj)) {
      return false;
    }
  
    const digits = taj.split('').map(Number);
    const sum = digits.slice(0, 8).reduce((acc, digit, index) => {
      return acc + digit * (index % 2 === 0 ? 3 : 7);
    }, 0);
  
    return sum % 10 === digits[8];
  }
  