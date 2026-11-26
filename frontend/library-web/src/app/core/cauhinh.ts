// Frontend gọi trực tiếp Auth và Reader Service
export const AUTH_API_URL = 'http://localhost:3001';
export const READER_API_URL = 'http://localhost:3003/api/v1';
// Dùng proxy /catalog-api ở local (tránh CORS khi catalog-service chưa bật CORS); đổi sang Gateway http://localhost:3000/api/v1 khi sẵn sàng
export const CATALOG_API_URL = '/catalog-api';