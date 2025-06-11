import { useState, useEffect } from 'react';
import { restaurantService } from '../services/userServices/restaurantService';
import ShopCard from './ShopCard';

export default function ShopList() {
  const [shopData, setShopData] = useState({ count: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchShops = async () => {
          try {
              const data = await restaurantService.getAllShops();
              setShopData(data);
          } catch (error) {
              console.error('Error fetching shops:', error);
              setError('Không thể tải danh sách cửa hàng. Vui lòng thử lại sau.');
          } finally {
              setLoading(false);
          }
      };
  
      fetchShops();
  }, []);
  
  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg">
      <p className="text-lg">{error}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 justify-items-center">
      {shopData.data.map((shop, index) => (
        <ShopCard key={shop.id || index} shopDetail={shop} />
      ))}
    </div>
  );
}