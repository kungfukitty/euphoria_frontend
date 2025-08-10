- +const SHOW_CAPTIONS = (import.meta.env.VITE_GALLERY_SHOW_CAPTIONS || 'false') === 'true';
     -function pretty(url) { try { const f = url.split('/').pop().split('.').slice(0,-1).join('.'); return f.replace(/[-_]/g,' ').replace(/\s+/g,' ').trim(); } catch { return 'Euphoria Image'; } }
-function altFrom(url) { const b = pretty(url); return b || 'Euphoria gallery image'; }
+function labelFromSrc(_url) { return 'Euphoria gallery image'; }
+function altFrom(_url) { return 'Euphoria gallery image'; }
        
  <figcaption className="text-left text-xs text-gray-400 p-2">{pretty(src)}</figcaption>
+              {SHOW_CAPTIONS ? (
+                <figcaption className="text-left text-xs text-gray-400 p-2">
+                  {labelFromSrc(src)}
+                </figcaption>
+              ) : (
+                <figcaption className="sr-only">Euphoria gallery image</figcaption>
+              )}
