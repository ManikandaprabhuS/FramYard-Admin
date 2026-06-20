import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, Upload, Info } from 'lucide-react';
import { Product, ProductVariant, ProductStatus } from '../../types';

export const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';

  const { 
    currentProduct, 
    loading, 
    error, 
    fetchProductById, 
    addProduct, 
    editProduct, 
    clearCurrentProduct 
  } = useProducts();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('Solid Oak');
  const [colors, setColors] = useState<string[]>([]);
  const [status, setStatus] = useState<ProductStatus>('active');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // Variant Modal State
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [varSize, setVarSize] = useState('');
  const [varBorder, setVarBorder] = useState('');
  const [varPrice, setVarPrice] = useState('');
  const [varOfferPrice, setVarOfferPrice] = useState('');
  const [varStock, setVarStock] = useState('');

  // Image Input Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Load product if editing
  useEffect(() => {
    if (!isNew && id) {
      fetchProductById(id);
    } else {
      clearCurrentProduct();
      // Initialize with empty/default fields for new product
      setName('');
      setDescription('');
      setBrand('');
      setMaterial('Solid Oak');
      setColors(['#0f172a', '#fef3c7', '#ffffff']);
      setStatus('active');
      setVariants([]);
      setImages(['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400']);
    }
  }, [id, isNew, fetchProductById, clearCurrentProduct]);

  // Set form state when product loads
  useEffect(() => {
    if (!isNew && currentProduct) {
      setName(currentProduct.name);
      setDescription(currentProduct.description);
      setBrand(currentProduct.brand);
      setMaterial(currentProduct.material);
      setColors(currentProduct.colors);
      setStatus(currentProduct.status);
      setVariants(currentProduct.variants);
      setImages(currentProduct.images);
    }
  }, [currentProduct, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !brand) return;

    const payload = {
      name,
      description,
      brand,
      material,
      colors,
      status,
      variants,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400'],
    };

    let success = false;
    if (isNew) {
      success = await addProduct(payload);
    } else if (id) {
      success = await editProduct(id, payload);
    }

    if (success) {
      navigate('/admin/products');
    }
  };

  // Color Swatch handler
  const togglePresetColor = (colorCode: string) => {
    if (colors.includes(colorCode)) {
      setColors(colors.filter(c => c !== colorCode));
    } else {
      setColors([...colors, colorCode]);
    }
  };

  // Variant adding/editing
  const openAddVariant = () => {
    setEditingVariant(null);
    setVarSize('');
    setVarBorder('');
    setVarPrice('');
    setVarOfferPrice('');
    setVarStock('');
    setVariantModalOpen(true);
  };

  const openEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVarSize(variant.size);
    setVarBorder(variant.border);
    setVarPrice(variant.price.toString());
    setVarOfferPrice(variant.offerPrice?.toString() || '');
    setVarStock(variant.stock.toString());
    setVariantModalOpen(true);
  };

  const handleSaveVariant = () => {
    if (!varSize || !varPrice || !varStock) return;

    const newVariant: ProductVariant = {
      id: editingVariant?.id || 'v-' + Math.random().toString(36).substr(2, 5),
      size: varSize,
      border: varBorder || 'None',
      price: parseFloat(varPrice),
      offerPrice: varOfferPrice ? parseFloat(varOfferPrice) : undefined,
      stock: parseInt(varStock),
    };

    if (editingVariant) {
      setVariants(variants.map(v => v.id === editingVariant.id ? newVariant : v));
    } else {
      setVariants([...variants, newVariant]);
    }
    setVariantModalOpen(false);
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId));
  };

  // Add simulated image URL
  const handleAddImage = () => {
    if (newImageUrl.startsWith('http')) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
      setImageModalOpen(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  if (loading && !isNew) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-secondary">Loading product details...</p>
      </div>
    );
  }

  const presetColors = [
    { code: '#0f172a', name: 'Black' },
    { code: '#fef3c7', name: 'Natural Oak' },
    { code: '#ffffff', name: 'White' },
    { code: '#4a3728', name: 'Dark Walnut' },
    { code: '#94a3b8', name: 'Silver' },
    { code: '#ca8a04', name: 'Gold' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <nav className="flex items-center gap-1 text-[11px] text-on-surface-variant">
              <Link to="/admin/products" className="hover:text-primary">Products</Link>
              <span>&gt;</span>
              <span className="text-primary font-medium">{isNew ? 'New Product' : 'Edit Product'}</span>
            </nav>
            <h2 className="text-2xl font-bold text-on-surface mt-0.5">
              {isNew ? 'New Product' : name || 'Edit Product'}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-colors h-10"
          >
            Discard
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm h-10 hover:scale-[1.01]"
          >
            Save Product
          </button>
        </div>
      </div>

      {/* Main Grid Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Info & Pricing */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: General Info */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/50">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">General Information</h3>
              <Badge type={status === 'active' ? 'success' : 'neutral'}>
                Status: {status === 'active' ? 'Active' : 'Draft'}
              </Badge>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-outline-variant rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  placeholder="e.g. Nordic Oak Gallery"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-outline-variant rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  rows={4}
                  placeholder="Describe the materials, craftsmanship, and aesthetics..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Brand Name</label>
                <input 
                  type="text" 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border border-outline-variant rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  placeholder="e.g. FrameYard Studio"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Material</label>
                <select 
                  value={material} 
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full border border-outline-variant rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option>Solid Oak</option>
                  <option>Black Walnut</option>
                  <option>Anodized Aluminum</option>
                  <option>Maple Wood</option>
                  <option>Pine Wood</option>
                </select>
              </div>

              {/* Preset Colors */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Available Colors</label>
                <div className="flex flex-wrap items-center gap-2 py-1">
                  {presetColors.map((color) => {
                    const isSelected = colors.includes(color.code);
                    return (
                      <button
                        key={color.code}
                        type="button"
                        onClick={() => togglePresetColor(color.code)}
                        className={`w-7 h-7 rounded-full border ring-offset-1 transition-all ${
                          isSelected ? 'ring-2 ring-primary border-transparent' : 'border-outline-variant hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Status Radio options */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Publishing Status</label>
                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                      className="text-primary focus:ring-primary/10 w-4 h-4" 
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                      className="text-primary focus:ring-primary/10 w-4 h-4" 
                    />
                    <span>Draft</span>
                  </label>
                </div>
              </div>
            </form>
          </section>

          {/* Card 2: Pricing & Variants Table */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/50 bg-surface-container-lowest">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Pricing &amp; Variants</h3>
              <button 
                type="button"
                onClick={openAddVariant}
                className="flex items-center gap-1 bg-secondary text-on-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-secondary/95 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface border-b border-outline-variant">
                  <tr className="text-secondary font-semibold text-xs uppercase tracking-wider">
                    <th className="px-6 py-3">Frame Size</th>
                    <th className="px-6 py-3">Border</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-sm">
                  {variants.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-xs text-on-surface-variant">
                        No sizing variants added. Click "Add Variant" to insert options.
                      </td>
                    </tr>
                  ) : (
                    variants.map((v) => (
                      <tr key={v.id} className="hover:bg-surface transition-colors">
                        <td className="px-6 py-4 font-semibold text-on-surface">{v.size}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{v.border}</td>
                        <td className="px-6 py-4 font-semibold">
                          <div className="flex flex-col">
                            <span>${v.price.toFixed(2)}</span>
                            {v.offerPrice && (
                              <span className="text-xs text-error font-medium">${v.offerPrice.toFixed(2)} Offer</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          <span className={v.stock <= 5 ? 'text-error font-bold' : 'text-on-surface'}>
                            {v.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditVariant(v)}
                              className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(v.id)}
                              className="p-1 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* Right Column: Images */}
        <div className="lg:col-span-4">
          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Product Images</h3>
              <button 
                type="button"
                onClick={() => setImageModalOpen(true)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Upload Images
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Primary Image Preview */}
              {images.length > 0 ? (
                <div className="col-span-2 relative group aspect-square rounded-lg overflow-hidden bg-surface-container inner-stroke cursor-pointer">
                  <img 
                    src={images[0]} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      type="button"
                      onClick={() => handleDeleteImage(0)}
                      className="p-2 bg-white rounded-full text-error hover:bg-error hover:text-white transition-all shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary text-on-primary text-[9px] font-bold uppercase rounded tracking-wider shadow">
                    Primary Cover
                  </div>
                </div>
              ) : (
                <div className="col-span-2 aspect-square border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center bg-surface-container">
                  <ImageIcon className="w-8 h-8 text-outline-variant/80 mb-2" />
                  <span className="text-xs text-on-surface-variant">No images added</span>
                </div>
              )}

              {/* Thumbnails grid */}
              {images.slice(1).map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-surface-container inner-stroke">
                  <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => handleDeleteImage(idx + 1)}
                      className="p-1.5 bg-white rounded-full text-error hover:bg-error hover:text-white transition-all shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload Placeholder */}
              <button 
                type="button"
                onClick={() => setImageModalOpen(true)}
                className="aspect-square border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-surface-container transition-all group"
              >
                <Upload className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-semibold text-outline-variant group-hover:text-primary transition-colors">Add Image</span>
              </button>
            </div>

            <div className="p-4 bg-surface-container rounded-lg flex items-start gap-3">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Add high-resolution image URLs. The first image in the grid is automatically utilized as the primary catalog cover.
              </p>
            </div>
          </section>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* ADD/EDIT VARIANT SUBMODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal 
        isOpen={variantModalOpen} 
        onClose={() => setVariantModalOpen(false)}
        title={editingVariant ? 'Edit Sizing Variant' : 'Create Custom Variant'}
        footer={
          <>
            <button 
              type="button"
              onClick={() => setVariantModalOpen(false)}
              className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold hover:bg-surface"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSaveVariant}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/95"
            >
              Save Variant
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Frame Size (e.g. 11" x 14", A3)</label>
            <input 
              type="text" 
              value={varSize} 
              onChange={(e) => setVarSize(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder='e.g. 8" x 10"'
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Matte Border (e.g. White Matte, Gold Fillet)</label>
            <input 
              type="text" 
              value={varBorder} 
              onChange={(e) => setVarBorder(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. Natural Oak, White Matte"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Price ($)</label>
            <input 
              type="number" 
              value={varPrice} 
              onChange={(e) => setVarPrice(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 45.00"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Offer Price ($ - Optional)</label>
            <input 
              type="number" 
              value={varOfferPrice} 
              onChange={(e) => setVarOfferPrice(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 39.00"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Stock Inventory (Units)</label>
            <input 
              type="number" 
              value={varStock} 
              onChange={(e) => setVarStock(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 100"
              required
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* IMAGE URL UPLOADER SUBMODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal 
        isOpen={imageModalOpen} 
        onClose={() => setImageModalOpen(false)}
        title="Add Product Image URL"
        footer={
          <>
            <button 
              type="button"
              onClick={() => setImageModalOpen(false)}
              className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold hover:bg-surface"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/95"
            >
              Add Image
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Image Source URL</label>
            <input 
              type="url" 
              value={newImageUrl} 
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="https://images.unsplash.com/photo-..."
              required
            />
          </div>
          <p className="text-xs text-on-surface-variant/80">
            Paste any web image URL (Unsplash, Imgur, etc.) to simulate uploading frames into the layout gallery.
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default ProductDetailsPage;
