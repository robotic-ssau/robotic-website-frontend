/**
 * Базовый URL API-сервиса.
 * Источником правды является переменная окружения VITE_API_URL,
 * которая по умолчанию указывает на dev-прокси `/api`.
 */
export const BASE_API_URL = import.meta.env.VITE_API_URL;
