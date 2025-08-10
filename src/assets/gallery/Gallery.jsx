- +const SHOW_CAPTIONS = (import.meta.env.VITE_GALLERY_SHOW_CAPTIONS || 'false') === 'true';
             
  <figcaption className="text-left text-xs text-gray-400 p-2">{pretty(src)}</figcaption>
+              {SHOW_CAPTIONS ? (
+                <figcaption className="text-left text-xs text-gray-400 p-2">
+                  {labelFromSrc(src)}
+                </figcaption>
+              ) : (
+                <figcaption className="sr-only">Euphoria gallery image</figcaption>
+              )}
