import React, { useState } from 'react';

const ImageGallery = ({ images = [], productName, badge, discount }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const activeImage = images[selectedImageIndex] || images[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail List */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative w-16 sm:w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-100 ${
              selectedImageIndex === index
                ? 'border-amber-600 shadow-md ring-2 ring-amber-400/30'
                : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`${productName} view ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </button>
        ))}
      </div>

      {/* Main Large Image Viewer with Hover Zoom */}
      <div
        className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-crosshair shadow-sm"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage}
          alt={productName}
          className={`w-full h-full object-cover object-center transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                }
              : undefined
          }
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {badge && (
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-brand-dark text-amber-300 rounded-full shadow-lg">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-rose-600 text-white rounded-full shadow-lg w-fit">
              -{discount}% Off
            </span>
          )}
        </div>

        {/* Zoom Hint Indicator */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg pointer-events-none opacity-75">
          Hover to zoom
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;

