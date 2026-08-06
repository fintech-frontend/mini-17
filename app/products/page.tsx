import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/productType';


async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:7777/products', {
      cache: 'no-store', // Ma'lumotlar har doim yangilanib turishi uchun
    });

    if (!res.ok) {
      throw new Error('API dan ma\'lumot olishda xatolik');
    }

    return res.json();
  } catch (error) {
    console.error("Xatolik:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const productsData = await getProducts();

  return (
    <main className="max-w-9xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mahsulotlar katalogi</h1>
      
      {productsData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Hozircha mahsulotlar topilmadi yoki API server ishlamayapti.</p>
          <p className="text-sm mt-2">Iltimos,serveri yoniqligini tekshiring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
    
  );
}