import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ReviewBox() {
  const totalReviews = 876;
  const rating = 5.0;
  const ratingBars = [
    { stars: 5, percent: 100 },
    { stars: 4, percent: 0 },
    { stars: 3, percent: 0 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
  ];

  return (
    <div className="border rounded-t-2xl text-center bg-white h-fit">
      <div className="bg-white py-2 border-b rounded-t-2xl">
        <h2 className="font-semibold text-lg">Review</h2>
      </div>

      <div className="bg-white p-5">
        <div className="flex items-center justify-between text-sm mb-2 px-6 py-2 bg-[rgba(217,217,217,0.4)] rounded-t-2xl">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-semibold">{rating}</span>
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
          </div>
          <span className="text-gray-500">{totalReviews} đánh giá</span>
        </div>

        <div className="space-y-1 text-sm text-gray-500 p-5 bg-[rgba(217,217,217,0.4)] rounded-b-2xl">
          {ratingBars.map((bar) => (
            <div key={bar.stars} className="flex items-center space-x-2">
              <span className="w-4">{bar.stars}</span>
              <div className="flex-1 bg-gray-300 rounded-full h-1">
                <div
                  className="bg-yellow-400 h-1 rounded-full"
                  style={{ width: `${bar.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-2 border-t text-sm text-gray-700 hover:bg-black/20 transition-colors duration-200">
        Chạm để xem thêm
      </div>
    </div>
  );
}
