import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminProduct, createAdminProduct, updateAdminProduct } from '../../services/adminApi';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';

const CATEGORIES = ['Men', 'Women', 'T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Hoodies', 'Jackets', 'Dresses', 'Ethnic Wear', 'Accessories'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const EMPTY = { name: '', slug: '', description: '', category: '', subcategory: '', brand: 'House of RCR', price: '', originalPrice: '', discount: '0', stock: '0', images: [''], sizes: ['S', 'M', 'L', 'XL'], colors: [], isFeatured: false, isNewArrival: false, isDeal: false, badge: '' };

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    {children}
  </div>
);

const inp = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== 'new');

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [colorInput, setColorInput] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    fetchAdminProduct(id)
      .then((d) => {
        const p = d.product;
        setForm({ name: p.name || '', slug: p.slug || '', description: p.description || '', category: p.category || '', subcategory: p.subcategory || '', brand: p.brand || '', price: String(p.price ?? ''), originalPrice: String(p.originalPrice ?? ''), discount: String(p.discount ?? '0'), stock: String(p.stock ?? '0'), images: p.images?.length ? p.images : [''], sizes: p.sizes || [], colors: p.colors || [], isFeatured: Boolean(p.isFeatured), isNewArrival: Boolean(p.isNewArrival), isDeal: Boolean(p.isDeal), badge: p.badge || '' });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: form.originalPrice !== '' ? Number(form.originalPrice) : Number(form.price), discount: Number(form.discount), stock: Number(form.stock), images: form.images.filter(Boolean) };
      if (isEdit) await updateAdminProduct(id, payload); else await createAdminProduct(payload);
      navigate('/admin/products');
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" />Back to Products
      </button>
      <h1 className="text-2xl font-bold text-slate-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name" required><input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inp} /></Field>
            <Field label="Slug (URL)"><input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated if empty" className={inp} /></Field>
          </div>
          <Field label="Description" required><textarea required value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={inp} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select required value={form.category} onChange={(e) => set('category', e.target.value)} className={inp}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Subcategory"><input value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} className={inp} /></Field>
          </div>
          <Field label="Brand"><input value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inp} /></Field>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm">Pricing & Stock</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Price (&#8377;)" required><input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className={inp} /></Field>
            <Field label="Original Price (&#8377;)"><input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} className={inp} /></Field>
            <Field label="Discount (%)"><input type="number" min="0" max="100" value={form.discount} onChange={(e) => set('discount', e.target.value)} className={inp} /></Field>
          </div>
          <Field label="Stock" required><input required type="number" min="0" step="1" value={form.stock} onChange={(e) => set('stock', e.target.value)} className={inp} /></Field>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm">Images (URLs)</h2>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input value={img} onChange={(e) => { const imgs = [...form.images]; imgs[i] = e.target.value; set('images', imgs); }} placeholder="https://..." className={`${inp} flex-1`} />
              {form.images.length > 1 && <button type="button" onClick={() => set('images', form.images.filter((_, j) => j !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>}
            </div>
          ))}
          <button type="button" onClick={() => set('images', [...form.images, ''])} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium">
            <Plus className="w-4 h-4" />Add Image URL
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm">Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => (
              <button key={s} type="button" onClick={() => set('sizes', form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s])} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.sizes.includes(s) ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm">Colors</h2>
          <div className="flex gap-2">
            <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (colorInput.trim() && !form.colors.includes(colorInput.trim())) { set('colors', [...form.colors, colorInput.trim()]); setColorInput(''); } } }} placeholder="Type a color and press Enter" className={`${inp} flex-1`} />
            <button type="button" onClick={() => { if (colorInput.trim() && !form.colors.includes(colorInput.trim())) { set('colors', [...form.colors, colorInput.trim()]); setColorInput(''); } }} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.colors.map((c) => (
              <span key={c} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-2.5 py-1 rounded-full">{c}<button type="button" onClick={() => set('colors', form.colors.filter(x => x !== c))} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button></span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-semibold text-slate-700 text-sm">Visibility</h2>
          {[{ key: 'isFeatured', label: 'Featured Product' }, { key: 'isNewArrival', label: 'New Arrival' }, { key: 'isDeal', label: 'Deal / Sale' }].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="w-4 h-4 rounded accent-amber-500" />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
          <Field label="Badge (optional)"><input value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="e.g. Best Seller, Limited Edition" className={inp} /></Field>
        </div>

        <div className="flex gap-3 pb-6">
          <button type="button" onClick={() => navigate('/admin/products')} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
