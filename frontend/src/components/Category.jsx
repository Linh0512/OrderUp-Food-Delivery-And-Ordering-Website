
export default function Category() {
  const categories = [
    {
      categoryName: "Tất cả",
      description: "",
    },
    {
      categoryName: "Cơm",
      description: "Cơm phần, cơm chiên, cơm tấm, cơm sườn...",
    },
    {
      categoryName: "Bún / Phở / Hủ tiếu",
      description: "Bún bò, bún thịt nướng, phở bò/gà, hủ tiếu...",
    },
    {
      categoryName: "Mì",
      description: "Mì xào, mì nước, mì cay, mì gói topping...",
    },
    {
      categoryName: "Cháo / Soup / Canh",
      description: "Cháo gà, cháo sườn, súp cua, canh rong biển...",
    },
    {
      categoryName: "Bánh mì / Xôi / Bánh cuốn",
      description: "Bánh mì thịt, bánh mì chả cá, xôi, bánh cuốn...",
    },
    {
      categoryName: "Burger / Pizza / Fastfood",
      description: "Burger bò, pizza pho mai, khoai tây chiên...",
    },
    {
      categoryName: "Salad / Món chay / Healthy",
      description: "Salad cá ngừ, bầu luộc chấm, đồ chay thanh đạm...",
    },
    {
      categoryName: "Combo / Set ăn / Gia đình",
      description: "Combo trưa, combo nhóm, phần ăn 2-4 người...",
    },
    {
      categoryName: "Ăn vặt",
      description: "Bánh tráng trộn, cá viên chiên, xúc xích...",
    },
    {
      categoryName: "Tráng miệng",
      description: "Chè, sữa chua, rau câu, bánh flan...",
    },
    {
      categoryName: "Đồ uống",
      description: "Trà sữa, nước ép, sinh tố, cà phê...",
    },
  ];

  return (
    <div className="border h-fit p-2 rounded-2xl">
      <h3 className="text-center">Danh mục món ăn</h3>
      <hr />
      <div className="space-y-2">
        {categories.map((category, index) => (
        <div key={index} className="flex space-x-2">
          <input type="checkbox" />
          <div>
            <h4 className="font-bold">{category.categoryName}</h4>
            <p className="text-xs">{category.description}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
