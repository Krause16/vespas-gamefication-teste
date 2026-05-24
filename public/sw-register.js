// Service worker registration — loaded in <head> via layout.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {
      // SW registration is a progressive enhancement — fail silently
    })
  })
}
