import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Medicare+',
    short_name: 'Medicare+',
    description: 'Premium Medicine Notifier & Personal Health Assistant.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfbff',
    theme_color: '#005ac1',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Add Medicine',
        url: '/medicines/add',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
      },
      {
        name: 'Health Tracker',
        url: '/health',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
      }
    ],
    categories: ['medical', 'health', 'lifestyle'],
  }
}
