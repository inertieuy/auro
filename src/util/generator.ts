export class Generator {
  static genString(n: number): string {
    const charSet = 'abcdefghijklmnopqrstuvwxys';
    let result = '';

    for (let i = 1; i <= n; i++) {
      const rand = Math.floor(Math.random() * charSet.length);
      result += charSet[rand];
    }

    return result;
  }

  static genNumber(n: number): string {
    const charSet = '0123456789';
    let result = '';

    for (let i = 1; i <= n; i++) {
      const rand = Math.floor(Math.random() * charSet.length);
      result += charSet[rand];
    }

    return result;
  }
}
