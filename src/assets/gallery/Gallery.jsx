--- a/src/components/Gallery.jsx
+++ b/src/components/Gallery.jsx
@@ -2,6 +2,9 @@
 import { categories } from '@/data/gallery';
 
 const Tab = ({ active, onClick, children }) => (
   <button
     onClick={onClick}
     className={[
       "px-4 py-2 rounded-full text-sm font-medium transition border focus-visible:outline focus-visible:outline-magenta",
       active ? "bg-white text-black border-transparent" : "bg-carbon/70 text-gray-300 hover:bg-carbon border-white/10"
     ].join(' ')}
   >
     {children}
   </button>
 );
 
+const SHOW_CAPTIONS = (import.meta.env.VITE_GALLERY_SHOW_CAPTIONS || 'false') === 'true';
+
 export default function Gallery() {
   const [activeKey, setActiveKey] = useState(() => (categories.find(c => c.data.length > 0)?.key || categories[0].key));
   const [lightbox, setLightbox] = useState({ open: false, idx: 0 });
@@ -27,7 +30,13 @@
         {/* Masonry Grid */}
         <div className='mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]'>
           {active.data.length === 0 && (<p className='text-gray-400 text-center'>No images yet. Add files to <code className='bg-carbon/70 px-2 py-1 rounded'>src/assets/gallery/{active.key}</code></p>)}
-          {active.data.map((src, idx) => (<figure key={src+idx} className='mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-soft gradient-ring cursor-zoom-in group' onClick={()=>open(idx)}><img src={src} alt={altFrom(src)} loading='lazy' decoding='async' className='w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]'/><figcaption className='text-left text-xs text-gray-400 p-2'>{pretty(src)}</figcaption></figure>))}
+          {active.data.map((src, idx) => (
+            <figure key={src+idx} className='mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-soft gradient-ring cursor-zoom-in group' onClick={()=>open(idx)}>
+              <img src={src} alt={altFrom(src)} loading='lazy' decoding='async' className='w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]'/>
+              {SHOW_CAPTIONS ? (
+                <figcaption className='text-left text-xs text-gray-400 p-2'>{pretty(src)}</figcaption>
+              ) : (<figcaption className='sr-only'>{altFrom(src)}</figcaption>)}
+            </figure>
+          ))}
         </div>
       </div>
 
@@ -43,9 +52,15 @@
   );
 }
 
-function pretty(url) { try { const f = url.split('/').pop().split('.').slice(0,-1).join('.'); return f.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim(); } catch { return 'Euphoria Image'; } }
-function altFrom(url) { const b = pretty(url); return b || 'Euphoria gallery image'; }
+function pretty(url) {
+  try {
+    const f = url.split('/').pop().replace(/-\w{8}\./, '.').split('.').slice(0,-1).join('.');
+    return f.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
+  } catch {
+    return 'Euphoria Image';
+  }
+}
 
+function altFrom(url) {
+  const b = pretty(url);
+  return b || 'Euphoria gallery image';
+}
