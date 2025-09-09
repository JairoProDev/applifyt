// Service Worker deshabilitado para evitar errores
// Este archivo previene errores de cache con chrome-extension

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  self.clients.claim()
})
