import React, { useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { VideoConfig } from '../../types';

interface BrandAssetsSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

export const BrandAssetsSection: React.FC<BrandAssetsSectionProps> = ({ config, onChange }) => {
  const logoRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange({ logoImage: reader.result as string });
    reader.readAsDataURL(file as Blob);
  };

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ productImages: [...(config.productImages || []), reader.result as string] });
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const removeProductImage = (index: number) => {
    const updated = config.productImages.filter((_, i) => i !== index);
    onChange({ productImages: updated });
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center">
          <Image className="w-4 h-4 text-rose-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Brand Assets</h2>
          <p className="text-xs text-gray-500">Upload logo & product images for reference</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Logo <span className="text-gray-600 normal-case font-normal">(PNG, SVG)</span>
          </label>
          <div
            onClick={() => logoRef.current?.click()}
            className="relative group cursor-pointer border-2 border-dashed border-gray-800 rounded-xl overflow-hidden hover:border-rose-500/50 transition-colors"
          >
            {config.logoImage ? (
              <div className="relative h-28 flex items-center justify-center p-3">
                <img src={config.logoImage} alt="Logo" className="max-h-24 max-w-full object-contain" />
                <button
                  onClick={(e) => { e.stopPropagation(); onChange({ logoImage: undefined }); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <div className="h-28 flex flex-col items-center justify-center gap-2 text-gray-600 group-hover:text-rose-400 transition-colors">
                <Upload className="w-6 h-6" />
                <p className="text-xs">Upload Logo</p>
                <p className="text-[10px] text-gray-700">Watermark + ending screen</p>
              </div>
            )}
          </div>
          <input ref={logoRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Product Images <span className="text-gray-600 normal-case font-normal">(PNG, JPG)</span>
          </label>
          <div
            onClick={() => productRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-gray-800 rounded-xl hover:border-rose-500/50 transition-colors h-28 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-rose-400 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <p className="text-xs">Add Product Photos</p>
            <p className="text-[10px] text-gray-700">Used as visual reference</p>
          </div>
          <input ref={productRef} type="file" accept="image/*" multiple className="hidden" onChange={handleProductUpload} />
        </div>
      </div>

      {/* Product image thumbnails */}
      {config.productImages && config.productImages.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">{config.productImages.length} product image{config.productImages.length > 1 ? 's' : ''} uploaded</p>
          <div className="flex flex-wrap gap-2">
            {config.productImages.map((img, i) => (
              <div key={i} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-gray-800">
                <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeProductImage(i)}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
