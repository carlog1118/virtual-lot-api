function makeUnitsArray() {
  return [
    {
      id: 1,
      year: 2015,
      make: "Honda",
      model: "Civic",
      trim: "EX Coupe",
      vin: "123456789abcdefg123",
      mileage: 75000,
      color: "Red",
      price: 10000,
      cost: 7000,
      status: "Available"
    },
    {
      id: 2,
      year: 2017,
      make: "Toyota",
      model: "Avalon",
      trim: "XLE",
      vin: "123456789abcdefg124",
      mileage: 50000,
      color: "Blue",
      price: 20000,
      cost: 16000,
      status: "Available"
    }
  ];
};

module.exports = {
  makeUnitsArray,
};