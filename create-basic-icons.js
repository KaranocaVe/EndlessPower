const fs = require('fs');
const path = require('path');

// 创建基本的 SVG 到 Data URL 转换器
function createBasicIconDataUrl(size) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <!-- Background -->
      <rect width="${size}" height="${size}" fill="#3B82F6" rx="${size * 0.15}"/>
      
      <!-- Charging Station Body -->
      <rect x="${size * 0.35}" y="${size * 0.3}" width="${size * 0.15}" height="${size * 0.4}" fill="white" rx="${size * 0.015}"/>
      
      <!-- Screen -->
      <rect x="${size * 0.37}" y="${size * 0.34}" width="${size * 0.11}" height="${size * 0.08}" fill="#1E40AF" rx="${size * 0.008}"/>
      
      <!-- Charging Port -->
      <circle cx="${size * 0.425}" cy="${size * 0.47}" r="${size * 0.03}" fill="#10B981"/>
      <circle cx="${size * 0.425}" cy="${size * 0.47}" r="${size * 0.015}" fill="white"/>
      
      <!-- Cable -->
      <path d="M${size * 0.455} ${size * 0.47} Q${size * 0.5} ${size * 0.47} ${size * 0.54} ${size * 0.51} Q${size * 0.58} ${size * 0.55} ${size * 0.61} ${size * 0.55}" stroke="white" stroke-width="${size * 0.015}" fill="none" stroke-linecap="round"/>
      
      <!-- Plug -->
      <rect x="${size * 0.605}" y="${size * 0.535}" width="${size * 0.04}" height="${size * 0.04}" fill="white" rx="${size * 0.008}"/>
      <rect x="${size * 0.615}" y="${size * 0.545}" width="${size * 0.02}" height="${size * 0.02}" fill="#3B82F6" rx="${size * 0.004}"/>
      
      <!-- Lightning Bolt -->
      <path d="M${size * 0.41} ${size * 0.55} L${size * 0.44} ${size * 0.57} L${size * 0.42} ${size * 0.6} L${size * 0.45} ${size * 0.62} L${size * 0.42} ${size * 0.65} L${size * 0.39} ${size * 0.63} L${size * 0.41} ${size * 0.6} L${size * 0.38} ${size * 0.58} Z" fill="#FBBF24"/>
      
      <!-- Base -->
      <rect x="${size * 0.33}" y="${size * 0.7}" width="${size * 0.19}" height="${size * 0.06}" fill="white" rx="${size * 0.03}"/>
      
      <!-- Text -->
      <text x="${size * 0.5}" y="${size * 0.82}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size * 0.07}" font-weight="bold" fill="white">EP</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// 创建基本图标文件（占位符）
function createPlaceholderIcon(size, filename) {
  const content = `
<!-- This is a placeholder icon file -->
<!-- Replace with actual ${size}x${size} PNG icon -->
<!-- Use the icon generator at scripts/generate-icons.html -->
<!-- Or use online tools to create proper PWA icons -->

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#3B82F6" rx="${size * 0.15}"/>
  <text x="${size/2}" y="${size/2}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size * 0.1}" font-weight="bold" fill="white" dy="0.35em">EP</text>
  <text x="${size/2}" y="${size * 0.8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size * 0.05}" fill="white">${size}x${size}</text>
</svg>
  `.trim();
  
  fs.writeFileSync(path.join(__dirname, 'public', filename), content);
}

// 创建 public 目录
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// 创建占位符图标
createPlaceholderIcon(192, 'pwa-192x192.svg');
createPlaceholderIcon(512, 'pwa-512x512.svg');
createPlaceholderIcon(180, 'apple-touch-icon.svg');

console.log('✅ 基本 PWA 图标占位符已创建');
console.log('📁 文件位置: public/');
console.log('📋 创建的文件:');
console.log('   - pwa-192x192.svg');
console.log('   - pwa-512x512.svg');
console.log('   - apple-touch-icon.svg');
console.log('');
console.log('⚠️  注意: 这些是 SVG 占位符文件');
console.log('🔧 需要创建真实的 PNG 图标文件才能正常使用 PWA 功能');
console.log('📖 参考 PWA-SETUP.md 了解如何创建真实图标');
console.log('');
console.log('🚀 现在可以测试 PWA 功能:');
console.log('   npm run build && npm run preview');
