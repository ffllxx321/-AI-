
import { Brand, Showroom } from '../types';

const categories = ["瓷砖", "卫浴", "地板", "灯具", "涂料", "五金", "家具", "厨电"];
const brandPrefixes = ["奥", "贝尔", "科", "德", "法", "格", "海", "金", "利", "美", "诺", "欧", "派", "瑞", "圣", "特", "维", "西", "雅", "卓"];
const brandSuffixes = ["斯", "克", "尼", "曼", "尔", "诺", "德", "森", "莱", "特", "奥", "普", "朗", "迪", "雅", "盛", "华", "泰", "丰", "源"];

export const mockBrands: Brand[] = Array.from({ length: 200 }, (_, i) => {
  const prefix = brandPrefixes[Math.floor(Math.random() * brandPrefixes.length)];
  const suffix = brandSuffixes[Math.floor(Math.random() * brandSuffixes.length)];
  const name = `${prefix}${suffix}${Math.random() > 0.5 ? brandSuffixes[Math.floor(Math.random() * brandSuffixes.length)] : ""}`;
  const material_type = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    id: i + 1,
    name: `${name}品牌`,
    material_type,
    model: `PRO-${1000 + i}`,
    price: 100 + Math.floor(Math.random() * 900),
    unit: 'm²',
    supplier: `${name}建材有限公司`,
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    reviews: Math.floor(Math.random() * 500) + 50,
  };
});

export const mockShowrooms: Showroom[] = [
  {
    id: "sr-1",
    name: "智筑旗舰展示中心 (静安店)",
    address: "上海市静安区南京西路1601号",
    lat: 31.2243,
    lng: 121.4511,
    phone: "021-6288-XXXX",
    distance: "1.2km"
  },
  {
    id: "sr-2",
    name: "高端材料体验馆 (徐汇店)",
    address: "上海市徐汇区虹桥路1号",
    lat: 31.1941,
    lng: 121.4375,
    phone: "021-6445-XXXX",
    distance: "3.5km"
  },
  {
    id: "sr-3",
    name: "智能家居生活馆 (浦东店)",
    address: "上海市浦东新区世纪大道8号",
    lat: 31.2359,
    lng: 121.5063,
    phone: "021-5836-XXXX",
    distance: "5.8km"
  },
  {
    id: "sr-4",
    name: "装饰艺术中心 (黄浦店)",
    address: "上海市黄浦区中山东一路18号",
    lat: 31.2397,
    lng: 121.4873,
    phone: "021-6323-XXXX",
    distance: "4.2km"
  }
];
