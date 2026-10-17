import fs from 'node:fs';
import path from 'node:path';

/**
 * Read index.html and extract head metadata, links, scripts, and body elements.
 */
export function getIndexHtmlDetails(projectRoot) {
  const htmlPath = path.join(projectRoot, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    return { exists: false };
  }

  const content = fs.readFileSync(htmlPath, 'utf-8');
  
  // Extract viewport meta
  const viewportMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const viewportContent = viewportMatch ? viewportMatch[1] : null;

  // Extract favicon link
  const iconMatch = content.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const iconHref = iconMatch ? iconMatch[1] : null;

  // Extract title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : null;

  return {
    exists: true,
    content,
    viewportContent,
    iconHref,
    title,
    hasViewportFitCover: !!(viewportContent && viewportContent.includes('viewport-fit=cover')),
    hasWidthDeviceWidth: !!(viewportContent && viewportContent.includes('width=device-width')),
  };
}

/**
 * Parse CSS files in src/ and dist/ to verify filter classes, zero CLS properties, and safe-area utilities.
 */
export function getCssFilterRules(projectRoot) {
  const cssPath = path.join(projectRoot, 'src', 'index.css');
  const result = {
    exists: fs.existsSync(cssPath),
    rules: {},
    rawCss: '',
  };

  if (!result.exists) return result;

  const content = fs.readFileSync(cssPath, 'utf-8');
  result.rawCss = content;

  // Look for .filter-digicam-* classes
  const filterNames = ['original', 'vintage-ccd', 'noir-monolith', 'flash-glow'];
  for (const name of filterNames) {
    const className = `filter-digicam-${name}`;
    const regex = new RegExp(`\\.${className}\\s*\\{([^\\}]*)\\}`, 'm');
    const match = content.match(regex);
    if (match) {
      result.rules[name] = {
        className,
        body: match[1].trim(),
        hasFilterProp: /filter\s*:/.test(match[1]),
        hasLayoutShiftProps: /(width|height|margin|padding|top|left|right|bottom|position)\s*:/.test(match[1]),
      };
    }
  }

  return result;
}

/**
 * Scan directory recursively for Marcus Bennet remnants or stock photo domains.
 */
export function scanFilesForRemnants(rootDir, fileExtensions = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.json']) {
  const findings = {
    marcusBennetOccurrences: [],
    bennetOccurrences: [],
    stockDomains: [],
  };

  const stockRegex = /(unsplash\.com|pexels\.com|pixabay\.com|via\.placeholder\.com)/i;
  const bennetRegex = /\bBennet\b/i;
  const marcusBennetRegex = /Marcus\s+Bennet/i;

  function traverse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.agents' || entry.name === 'tests') {
          continue;
        }
        traverse(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (fileExtensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');

          lines.forEach((line, idx) => {
            if (marcusBennetRegex.test(line)) {
              findings.marcusBennetOccurrences.push({ file: fullPath, line: idx + 1, content: line.trim() });
            }
            if (bennetRegex.test(line)) {
              findings.bennetOccurrences.push({ file: fullPath, line: idx + 1, content: line.trim() });
            }
            if (stockRegex.test(line)) {
              findings.stockDomains.push({ file: fullPath, line: idx + 1, content: line.trim() });
            }
          });
        }
      }
    }
  }

  traverse(rootDir);
  return findings;
}

/**
 * Verify authentic photos in public/assets/.
 */
export function getAuthenticPhotos(projectRoot) {
  const assetsDir = path.join(projectRoot, 'public', 'assets');
  const photos = [
    { name: 'alice_hero_red.png', format: 'png', minSize: 150000, maxSize: 300000 },
    { name: 'alice_smile_portrait.jpg', format: 'jpg', minSize: 200000, maxSize: 400000 },
    { name: 'alice_childhood_2020.jpg', format: 'jpg', minSize: 250000, maxSize: 500000 },
    { name: 'alice_school_uniform.jpg', format: 'jpg', minSize: 200000, maxSize: 400000 },
    { name: 'alice_childhood_playful.jpg', format: 'jpg', minSize: 200000, maxSize: 400000 },
  ];

  const results = [];
  for (const p of photos) {
    const fullPath = path.join(assetsDir, p.name);
    const exists = fs.existsSync(fullPath);
    let size = 0;
    let isHeaderValid = false;
    if (exists) {
      const stat = fs.statSync(fullPath);
      size = stat.size;
      const buf = Buffer.alloc(8);
      const fd = fs.openSync(fullPath, 'r');
      fs.readSync(fd, buf, 0, 8, 0);
      fs.closeSync(fd);

      if (p.format === 'png') {
        // PNG magic number: 89 50 4E 47 0D 0A 1A 0A
        isHeaderValid = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
      } else if (p.format === 'jpg') {
        // JPEG magic number: FF D8 FF
        isHeaderValid = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
      }
    }
    results.push({
      ...p,
      exists,
      size,
      isHeaderValid,
      isSizeInRange: size >= p.minSize && size <= p.maxSize,
    });
  }
  return results;
}

/**
 * Verify dist build outputs.
 */
export function getDistBuildInfo(projectRoot) {
  const distDir = path.join(projectRoot, 'dist');
  const indexHtml = path.join(distDir, 'index.html');
  const assetsDir = path.join(distDir, 'assets');
  const exists = fs.existsSync(distDir) && fs.existsSync(indexHtml);

  let jsFiles = [];
  let cssFiles = [];
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    jsFiles = files.filter(f => f.endsWith('.js'));
    cssFiles = files.filter(f => f.endsWith('.css'));
  }

  return {
    distExists: exists,
    indexHtmlExists: fs.existsSync(indexHtml),
    jsFiles,
    cssFiles,
  };
}
