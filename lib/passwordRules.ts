// Parol qoidalari (backend validatoriga mos): kamida 8 belgi, harf, raqam va maxsus belgi
export const PASSWORD_HINT =
  "Не короче 8 символов: буквы, цифра и специальный символ (например ! @ # $ %)";

export function passwordProblem(password: string): string | null {
  if (password.length < 8) return "Пароль должен быть не короче 8 символов";
  if (!/[A-Za-zА-Яа-яЁё]/.test(password)) return "Пароль должен содержать букву";
  if (!/\d/.test(password)) return "Пароль должен содержать цифру";
  if (!/[^A-Za-zА-Яа-яЁё0-9\s]/.test(password))
    return "Пароль должен содержать специальный символ (например ! @ # $ %)";
  return null;
}

// Backend'ning inglizcha xabarlarini ruschaga o'tkazish
const TRANSLATIONS: [RegExp, string][] = [
  [/special character/i, "Пароль должен содержать специальный символ (например ! @ # $ %)"],
  [/too short|at least \d+ characters/i, "Пароль слишком короткий (минимум 8 символов)"],
  [/too common/i, "Этот пароль слишком простой"],
  [/entirely numeric/i, "Пароль не может состоять только из цифр"],
  [/too similar/i, "Пароль слишком похож на ваши данные"],
  [/uppercase/i, "Пароль должен содержать заглавную букву"],
  [/lowercase/i, "Пароль должен содержать строчную букву"],
  [/digit|number/i, "Пароль должен содержать цифру"],
  [/already exists|already registered|unique/i, "Пользователь с таким email уже существует"],
  [/passwords? (do not|don't) match/i, "Пароли не совпадают"],
  [/invalid|incorrect|expired/i, "Неверный или просроченный код"],
];

export function translateError(message: string): string {
  return TRANSLATIONS.find(([re]) => re.test(message))?.[1] ?? message;
}
