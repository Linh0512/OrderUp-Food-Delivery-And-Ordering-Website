use("food_delivery_app");

const priceRanges = [
    "20,000 - 50,000",
    "30,000 - 60,000", 
    "40,000 - 80,000",
    "50,000 - 100,000",
    "60,000 - 120,000",
    "70,000 - 140,000",
    "80,000 - 160,000",
    "90,000 - 180,000",
    "100,000 - 200,000",
    "50,000 - 150,000",
    "60,000 - 140,000",
    "70,000 - 160,000",
    "80,000 - 180,000",
    "90,000 - 200,000"
  ];
  
  // Update với aggregation pipeline
  db.restaurants.updateMany(
    {},
    [
      {
        $set: {
          "basicInfo.priceRange": {
            $arrayElemAt: [
              priceRanges,
              { $floor: { $multiply: [{ $rand: {} }, priceRanges.length] } }
            ]
          },
          "updatedAt": new Date()
        }
      }
    ]
  );