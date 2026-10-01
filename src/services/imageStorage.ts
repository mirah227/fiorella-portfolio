/**
 * Dedicated image storage service separating binary media storage
 * from the lightweight article JSON metadata database.
 */

const DB_NAME = 'fiorella_media_store';
const STORE_NAME = 'images';
const DB_VERSION = 1;

function openImageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Optimize an uploaded file using HTML5 Canvas
 * Resizes down to max dimensions (1200px) and compresses to ~80% quality JPEG/WebP
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression failed'));
              return;
            }
            const compressedDataUrl = canvas.toDataURL(mimeType, quality);
            resolve({
              blob,
              dataUrl: compressedDataUrl,
              width,
              height,
            });
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Store an image blob in the dedicated image store and return an image reference ID
 */
export async function storeImageBlob(id: string, blob: Blob, mimeType: string): Promise<string> {
  try {
    const db = await openImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = { id, blob, mimeType, createdAt: new Date().toISOString() };
      const req = store.put(record);
      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Falling back from IndexedDB image storage:', err);
    return id;
  }
}

/**
 * Retrieve an image by ID from the image store and return a temporary Object URL
 */
export async function getImageBlobUrl(id: string): Promise<string | null> {
  try {
    const db = await openImageDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(URL.createObjectURL(req.result.blob));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Curated list of high-quality, relevant SEO preset images
 * Hosted on fast CDNs with high-res responsive parameters
 */
export const PRESET_IMAGES = [
  {
    id: 'search-intent',
    title: 'Search Intent & Analytics',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    altText: 'Search analytics graphs and organic query performance dashboard',
    category: 'SEO Strategy',
  },
  {
    id: 'core-web-vitals',
    title: 'Core Web Vitals & Performance',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    altText: 'Speed performance metrics, Core Web Vitals, and website optimization code',
    category: 'Technical SEO',
  },
  {
    id: 'on-page-structure',
    title: 'On-Page Architecture',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    altText: 'Clean semantic web layout and on-page heading structure planning',
    category: 'On-Page SEO',
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research & Clustering',
    url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
    altText: 'Keyword research planning notebook with topic clusters and search volume data',
    category: 'Keyword Research',
  },
  {
    id: 'content-strategy',
    title: 'Content Strategy & Editorial',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    altText: 'Author workspace with laptop, notes, and content optimization editorial calendar',
    category: 'Content Strategy',
  },
  {
    id: 'technical-hygiene',
    title: 'Technical Crawl & Schema',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    altText: 'Structured data JSON-LD and clean technical search engine crawl code',
    category: 'Technical SEO',
  },
];
