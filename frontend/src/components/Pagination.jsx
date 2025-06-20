import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Pagination({limit,count,current,onPageChange}) {
    const totalPages = Math.ceil(count / limit);

    const handleClick = (page) => {
    if (page !== current && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

    const getPagesToDisplay = () => {
    const pages = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 4) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const displayPages = getPagesToDisplay();
  return (
    <div className="flex flex-wrap items-center gap-2 justify-center my-10">
      <div className="flex items-center gap-2  text-sm justify-end">
        <button
          className=" rounded-full hover:bg-green-400 active:bg-secondary-variant/20 text-lg size-10 "
          onClick={()=>handleClick(current - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {displayPages.map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              className={`${
                page === current  ? "bg-green-400" : "bg-white"
              }  rounded-lg hover:bg-green-400 active:bg-secondary-variant/20 text-lg size-10 shadow-2xl transition`}
              onClick={() => handleClick(page)}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 ">
              {page}
            </span>
          )
        )}
        <button
          disabled={current === totalPages}
          className="rounded-full hover:bg-green-400 active:bg-secondary-variant/20 text-lg size-10 "
          onClick={()=>handleClick(current + 1)}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
}