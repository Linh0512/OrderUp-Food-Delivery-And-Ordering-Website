import React from "react";

export default function ProductCategory() {
  const categories = [
    { name: "Món đang giảm" },
    { name: "Sản phẩm mới" },
    { name: "Trà và Trà sữa" },
    { name: "Cà phê Amazon Signature" },
    { name: "Cà phê Việt Nam" },
    { name: "Cà phê kiểu Ý" },
    { name: "Frappe" },
    { name: "Thức uống khác" },
    { name: "Bánh" },
    { name: "Bánh tươi nướng tại chỗ" },
    { name: "Bánh ngọt" },
    { name: "Món ăn vặt" },
    { name: "Deal Flash Sale" },
  ];

  return(<div className="w-fit shadow-2xl">
    <ul>
        {categories.map((item,index)=>(
            <div key={index}>
                <p className="p-4 font-semibold">{item.name}</p>
                <hr className="opacity-10"/>
            </div>
        ))}
    </ul>
  </div>) ;
}
