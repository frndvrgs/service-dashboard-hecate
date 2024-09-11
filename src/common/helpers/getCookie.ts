type CookieValue = string | number | boolean | object | null;

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function getCookie<T extends CookieValue = string>(
  name: string,
): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      const rawValue = decodeURIComponent(c.substring(nameEQ.length, c.length));
      return parseCookieValue<T>(rawValue);
    }
  }
  return null;
}

function parseCookieValue<T extends CookieValue>(value: string): T {
  if (isJsonString(value)) {
    return JSON.parse(value) as T;
  }

  if (value === "true") return true as T;
  if (value === "false") return false as T;
  if (value === "null") return null as T;
  if (!isNaN(Number(value)) && value !== "") return Number(value) as T;

  return value as T;
}
