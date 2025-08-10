import React, { useMemo, useState } from 'react';
import { categories } from '@/data/gallery';

const Tab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={[
      'px-4 py-2 rounded-full text-sm font-medium transition border focus-visible:outline focus-visible:outline-magenta',
      active ? 'bg-white text-black border-transparent' : 'bg-carbon/70 text-gray-300 hover:bg-carbon border-white/10'
    ].join(' ')}
  >
    {children}
  </button>
);

const SHOW_CAPTIONS = (import.meta.env.VITE_GALLERY_SHOW_CAPTIONS || 'true') === 'true';

export default function Gallery() {
  const [activeKey, setActiveKey] = useState(() => (categories.find(c => c.data.length > 0)?.key || categories[0].key));
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });

  const active = useMemo(() => categories.find(c => c.key === activeKey) || categories[0], [activeKey]);

  const open = (idx) => setLightbox({ open: true, idx });
  const close = () => setLightbox({ open: false, idx: 0 });
  const prev = (e) => { e?.stopPropagation?.(); setLightbox(s => ({ open: true, idx: (s.idx - 1 + active.data.length) % active.data.length })); };
  const next = (e) => { e?.stopPropagation?.(); setLightbox(s => ({ open: true, idx: (s.idx + 1) % active.data.length })); };

  return (
    <section id='gallery' className='py-16 bg-onyx' aria-labelledby='gallery-title'>
      <div className='max-w-6xl mx-auto px-4'>
        <h2 id='gallery-title' className='text-3xl md:text-4xl font-bold text-center'>Gallery</h2>
        <p className='text-gray-400 text-center mt-2'>Flyers, crowd, performers, and art moments from recent nights.</p>

        <div className='mt-6 flex flex-wrap gap-3 justify-center' role='tablist' aria-label='Gallery categories'>
          {categories.map(c => (
            <Tab key={c.key} active={c.key === activeKey} onClick={() => setActiveKey(c.key)}>
              {c.label} {c.data.length ? <span className='opacity-70'>({c.data.length})</span> : null}
            </Tab>
          ))}
        </div>

        <div className='mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]'>
          {active.data.length === 0 && (
            <p className='text-gray-400 text-center'>No images yet. Add files to <code className='bg-carbon/70 px-2 py-1 rounded'>src/assets/gallery/{active.key}</code></p>
          )}
          {active.data.map((src, idx) => (
            <figure key={src + idx} className='mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-soft gradient-ring cursor-zoom-in group' onClick={() => open(idx)}>
              <img src={src} alt={altFrom(src)} loading='lazy' decoding='async' className='w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]' />
              {SHOW_CAPTIONS && (
                <figcaption className='text-left text-xs text-gray-400 p-2'>{pretty(src)}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {lightbox.open && active.data.length > 0 && (
        <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4' onClick={close} role='dialog' aria-modal='true' aria-label='Image lightbox'>
          <button onClick={close} className='absolute top-4 right-4 text-white text-2xl' aria-label='Close'>×</button>
          <button onClick={prev} className='absolute left-2 md:left-8 text-white text-3xl select-none' aria-label='Previous'>‹</button>
          <img src={active.data[lightbox.idx]} alt={altFrom(active.data[lightbox.idx])} className='max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-xl' />
          <button onClick={next} className='absolute right-2 md:right-8 text-white text-3xl select-none' aria-label='Next'>›</button>
        </div>
      )}
    </section>
  );
}

/**
 * Cleans the image URL to create a human-readable caption.
 * e.g., /assets/image-name.ab12cd34.jpg -> "image name"
 */
function pretty(url) {
  try {
    const fileName = url.split('/').pop();
    const nameWithoutHash = fileName.replace(/\.[a-f0-9]{8}\./i, '.');
    const nameWithoutExtension = nameWithoutHash.split('.').slice(0, -1).join('.');
    return nameWithoutExtension.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  } catch {
    return 'Euphoria Image';
  }
}

/**
 * Creates a descriptive alt tag from the image URL.
 */
function altFrom(url) {
  const base = pretty(url);
  return base ? `Euphoria Gallery: ${base}` : 'Euphoria gallery image';
}
