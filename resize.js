const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImagePath = 'C:\\Users\\revap\\.gemini\\antigravity\\brain\\66c4343a-21e7-432a-b1fe-5dc910a06d68\\medicare_plus_icon_premium_1775488951800.png';
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

async function resizeIcons() {
  try {
    // Standard PWA Icons
    await sharp(inputImagePath)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'icon-192x192.png'));
    console.log('Created icon-192x192.png');

    await sharp(inputImagePath)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'icon-512x512.png'));
    console.log('Created icon-512x512.png');

    // Favicon (standard ICO if possible, but modern browsers support PNG)
    await sharp(inputImagePath)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon.ico')); // Using PNG renamed to ICO as a shortcut, or just simple 32x32
    console.log('Created favicon.ico');

    // Apple Touch Icon
    await sharp(inputImagePath)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Created apple-touch-icon.png');

  } catch (error) {
    console.error('Error resizing images:', error);
  }
}

resizeIcons();
