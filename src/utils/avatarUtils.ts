/**
 * Avatar & Image System Utilities
 * Source-agnostic, resilient image validation and URL normalization.
 */

export const DEFAULT_AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

// Fallback SVG data in case all network requests fail
export const DEFAULT_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23312e81"/><circle cx="50" cy="40" r="20" fill="%23fbbf24"/><path d="M20,90 C20,68 35,65 50,65 C65,65 80,68 80,90 Z" fill="%23fbbf24"/><polygon points="50,15 54,26 65,26 56,33 60,44 50,37 40,44 44,33 35,26 46,26" fill="%23ffffff" opacity="0.9"/></svg>`;

/**
 * Normalizes avatar URL:
 * - Trims whitespace
 * - Preserves query strings, CDN transformations (Cloudinary, Imgix, etc.)
 * - Validates safe protocols (http, https, data)
 * - Disallows dangerous protocols (javascript:, vbscript:, etc.)
 */
export function normalizeAvatarUrl(inputUrl?: string | null): string {
  if (!inputUrl) return '';
  const trimmed = inputUrl.trim();
  if (!trimmed) return '';

  // Allow data URIs for image uploads
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Reject dangerous protocols
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:') || lower.startsWith('data:text/html')) {
    return '';
  }

  // If URL starts with protocol-relative "//", prepend "https:"
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  return trimmed;
}

/**
 * Checks if a URL represents a GIF (either animated or static)
 */
export function isGifUrl(url?: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.startsWith('data:image/gif')) return true;
  if (lower.includes('.gif')) return true;
  if (lower.includes('format=gif') || lower.includes('f_gif') || lower.includes('fm=gif')) return true;
  return false;
}

export interface ImageDiagnosticResult {
  valid: boolean;
  isGif: boolean;
  protocol: string;
  url: string;
  error?: string;
  dimensions?: { width: number; height: number };
}

/**
 * Asynchronously verifies if an image can actually be loaded by the browser.
 * Uses browser-native `new Image()` without fragile HEAD request or unnecessary CORS.
 */
export function verifyImageLoad(url: string, timeoutMs = 8000): Promise<ImageDiagnosticResult> {
  return new Promise((resolve) => {
    const normalized = normalizeAvatarUrl(url);

    if (!normalized) {
      resolve({
        valid: false,
        isGif: false,
        protocol: 'NONE',
        url: '',
        error: 'Đường dẫn hình ảnh không hợp lệ hoặc bị bỏ trống.'
      });
      return;
    }

    let protocol = 'HTTPS';
    if (normalized.startsWith('data:')) {
      protocol = 'DATA';
    } else if (normalized.startsWith('http://')) {
      protocol = 'HTTP';
    }

    const isGif = isGifUrl(normalized);

    const img = new Image();
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        img.src = '';
        resolve({
          valid: false,
          isGif,
          protocol,
          url: normalized,
          error: 'Thời gian tải ảnh quá lâu hoặc máy chủ không phản hồi.'
        });
      }
    }, timeoutMs);

    img.onload = () => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve({
          valid: true,
          isGif: isGif || (img.src && img.src.includes('.gif')),
          protocol,
          url: normalized,
          dimensions: {
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          }
        });
      }
    };

    img.onerror = () => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve({
          valid: false,
          isGif,
          protocol,
          url: normalized,
          error: 'Không thể tải ảnh này. Hãy kiểm tra lại đường dẫn hoặc chọn ảnh khác.'
        });
      }
    };

    // Trigger browser image load
    try {
      img.src = normalized;
    } catch {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve({
          valid: false,
          isGif,
          protocol,
          url: normalized,
          error: 'Không thể xử lý URL hình ảnh này.'
        });
      }
    }
  });
}

/**
 * Validates and reads a file uploaded from the local device
 */
export function readAvatarFile(file: File, maxSizeMB = 10): Promise<{ url?: string; isGif: boolean; error?: string }> {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ isGif: false, error: 'Chưa chọn tệp tin.' });
      return;
    }

    // Validate type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      resolve({ isGif: false, error: 'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh (PNG, JPG, WEBP, GIF).' });
      return;
    }

    // Validate size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      resolve({
        isGif: file.type === 'image/gif',
        error: `Tệp quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là ${maxSizeMB}MB.`
      });
      return;
    }

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        resolve({ url: dataUrl, isGif });
      } else {
        resolve({ isGif, error: 'Không thể đọc nội dung tệp tin.' });
      }
    };
    reader.onerror = () => {
      resolve({ isGif, error: 'Lỗi khi đọc tệp từ thiết bị.' });
    };
    reader.readAsDataURL(file);
  });
}
