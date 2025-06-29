import {
  faBoxOpen,
  faCalendar,
  faPenToSquare,
  faTicket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatCurrencyVN, formatDateVN1 } from "../../utils/Format";

export default function CategoryItem({ voucher, handleDelete, edit}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="bg-green-100 text-green-600 text-xl p-3 rounded-lg">
              <FontAwesomeIcon icon={faTicket} />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <p className="text-xl font-bold text-gray-800">
                  {voucher.code}
                </p>
                <div className="bg-green-500 px-3 py-1 rounded-full text-white text-sm font-medium">
                  Giảm {formatCurrencyVN(voucher.value)}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Đơn tối thiểu: {formatCurrencyVN(voucher.minimumOrderAmount)}
              </p>
            </div>

            <div className="flex items-center space-x-5 text-sm">
              <div className="text-center">
                <div className="flex items-center text-gray-600 mb-1">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Hết hạn </span>
                </div>
                <p className="font-medium">
                  {formatDateVN1(voucher.expiresAt)}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center space-x-1 text-gray-600 mb-1">
                  <FontAwesomeIcon icon={faBoxOpen} />
                  <span>Còn lại</span>
                </div>
                <p className={`font-medium `}>{voucher.remainingValue}</p>
              </div>
            </div>
          </div>
          <button
            className=" hover:text-blue-500 p-2 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-2"
            onClick={() => edit(voucher)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className=" hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            onClick={() => handleDelete(voucher.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
}
