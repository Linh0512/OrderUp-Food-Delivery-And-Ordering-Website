import product from '../../assets/product.jpg'
import { formatCurrencyVN } from '../../utils/Format';

export default function OrderItem({ orderItem }) {
  return (
    <div className="flex w-full shadow rounded caret-transparent bg-gray-50 p-3">
      <img
        src={product||orderItem.dishImage}
        alt={orderItem?.dishName}
        className="w-[8%] h-auto object-contain shadow"
      />
      <div className="flex justify-between w-full ml-5">
        <div className="space-y-2">
          <p className="font-bold">{orderItem?.dishName}</p>
          <p className="text-sm text-gray-500">
            {orderItem?.specialInstructions}
          </p>
        </div>
        <p className="font-semibold">Số lượng: {orderItem?.quantity}</p>
        <div className="space-y-2">
          <p className="font-semibold">{formatCurrencyVN(orderItem?.subtotal)}</p>
          <p className="text-sm text-gray-500">{formatCurrencyVN(orderItem?.unitPrice)}/món</p>
        </div>
      </div>
    </div>
  );
}
