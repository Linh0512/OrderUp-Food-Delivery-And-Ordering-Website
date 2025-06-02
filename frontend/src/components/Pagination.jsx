import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Pagination() {
    const current=1;
    const totalPages=7;
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
    <div className="flex flex-wrap items-center gap-2 justify-center mt-10">
      <div className="flex items-center gap-2  text-sm justify-end">
        <button
          className=" rounded-full hover:bg-surface active:bg-secondary-variant/20 text-lg size-10 "
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {displayPages.map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              className={`${
                page === idx + 1 ? "bg-surface" : ""
              }  rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10 bg-white shadow-2xl`}
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
          className="rounded-full hover:bg-surface active:bg-secondary-variant/20 text-lg size-10 "
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <span>Go to:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          className="input-variant-1 px-2 text-center bg-[rgba(217,217,217,0.4)] focus:border-none rounded"
        />
      </div>
    </div>
  );
}
