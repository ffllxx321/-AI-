import React, { useState, useMemo } from 'react';
import { Search, Star, Building2, MessageSquare, Box, Filter, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { Brand } from '../types';
import { mockBrands } from '../data/mockData';

interface BrandLibraryProps {
  brands: Brand[];
  onSelectBrand?: (brand: Brand) => void;
  maxHeight?: string;
  initialCategory?: string | null;
}

export const BrandLibrary: React.FC<BrandLibraryProps> = ({ brands, onSelectBrand, maxHeight, initialCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync with initialCategory
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = useMemo(() => {
    const cats = new Set(brands.map(b => b.material_type));
    return Array.from(cats);
  }, [brands]);

  const fuse = useMemo(() => {
    return new Fuse(brands, {
      keys: ['name', 'material_type', 'supplier', 'model'],
      threshold: 0.3,
    });
  }, [brands]);

  const filteredBrands = useMemo(() => {
    let results = searchQuery 
      ? fuse.search(searchQuery).map(r => r.item)
      : brands;

    if (selectedCategory) {
      results = results.filter(b => b.material_type === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory, fuse, brands]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header & Search */}
      <div className="p-6 border-b border-slate-800 bg-slate-800/30 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">品牌库推荐</h3>
            <p className="text-xs text-slate-500 mt-1">共收录 {brands.length} 个认证供应商</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索品牌、材料类型或供应商..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Categories Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${!selectedCategory ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
          >
            全部
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${selectedCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand List */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
        style={{ maxHeight: maxHeight || 'none' }}
      >
        {filteredBrands.length > 0 ? (
          filteredBrands.map(brand => (
            <div 
              key={brand.id} 
              className="p-4 rounded-xl border border-slate-800 bg-slate-800/30 hover:border-blue-500/30 transition-all group cursor-pointer"
              onClick={() => onSelectBrand?.(brand)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{brand.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-slate-500">{brand.rating} ({brand.reviews})</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-400">{brand.material_type}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">型号：</span>
                  <span className="font-medium text-slate-300">{brand.model}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">预估单价：</span>
                  <span className="font-bold text-white">¥{brand.price}/{brand.unit}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">供应商：</span>
                  <span className="font-medium text-blue-400 truncate max-w-[150px]">{brand.supplier}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-slate-800 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-700 transition-colors">查看详情</button>
                <button className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-500">
            <Box className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">未找到匹配的品牌</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className="mt-4 text-blue-500 text-xs font-bold hover:underline"
            >
              重置搜索条件
            </button>
          </div>
        )}
      </div>

      {/* Footer / Showroom Link */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500/30 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">申请实物小样</p>
            <p className="text-[10px] text-slate-500">免费配送至您的工作室</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 ml-auto" />
        </div>
      </div>
    </div>
  );
};
