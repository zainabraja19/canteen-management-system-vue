const cartRepository = require("../../../database/repository/employee/cartRepository");
const menuRepository = require("../../../database/repository/employee/menuRepository");
const employeeRepository = require("../../../database/repository/employee/profileRepository");

const fetchCart = async (data) => {
    const { empId } = data;

    const employeeDetails = await employeeRepository.fetchEmployeeDetails({
        query: { empId },
        select: "_id empId name phone",
    });
    if (!employeeDetails) {
        throw new Error("Employee not found");
    }

    const cartItems = await cartRepository.findItemInCart({
        employee: empId,
    });
    if (!cartItems) {
        return { items: [], cartTotal: 0, totalItems: 0 };
    }

    const { items, cartTotal, totalItems } = cartItems;
    return { items, cartTotal, totalItems };
};

const addToCart = async (data) => {
    const { itemId, empId } = data;

    const menuItem = await menuRepository.findMenuItem({ _id: itemId });

    if (!menuItem || !menuItem[0].isAvailable) {
        throw new Error("Sorry, Item is not available!");
    }

    const itemInCart = await cartRepository.findItemInCart({
        employee: empId,
        "items.item": itemId,
    });

    const query = itemInCart
        ? { "items.item": itemId, employee: empId }
        : { employee: empId };
    const update = itemInCart
        ? {
              $inc: {
                  "items.$.quantity": 1,
                  totalItems: 1,
                  cartTotal: +menuItem[0].price,
              },
          }
        : {
              $push: {
                  items: {
                      item: itemId,
                      quantity: 1,
                      price: menuItem[0].price,
                  },
              },
              $inc: {
                  totalItems: 1,
                  cartTotal: +menuItem[0].price,
              },
          };
    const options = { new: true, upsert: !itemInCart };

    return await cartRepository.updateCart({
        query,
        update,
        options,
        itemId,
    });
};

const removeFromCart = async (data) => {
    const { itemId, empId, deleteCount } = data;

    const menuItem = await menuRepository.findMenuItem({ _id: itemId });

    if (!menuItem || !menuItem[0].isAvailable) {
        throw new Error("Sorry, Item is not available!");
    }

    const query =
        +deleteCount > 1
            ? { employee: empId }
            : { "items.item": itemId, employee: empId };
    const update =
        +deleteCount > 1
            ? {
                  $pull: { items: { item: itemId } }, // Remove the item from the items array
                  $inc: {
                      totalItems: -deleteCount,
                      cartTotal: -(menuItem[0].price * +deleteCount),
                  },
              }
            : {
                  $inc: {
                      "items.$.quantity": -1,
                      totalItems: -1,
                      cartTotal: -menuItem[0].price,
                  },
              };

    const options = { new: true, upsert: true };

    const result = await cartRepository.updateCart({
        query,
        update,
        options,
        itemId,
    });

    if (!result) {
        throw new Error("Cart not found");
    }

    return result;
};

const cartCount = async (data) => {
    const result = await cartRepository.findItemInCart(data);

    if (!result) {
        return { count: 0 };
    }

    return { count: result.totalItems };
};

module.exports = {
    fetchCart,
    addToCart,
    removeFromCart,
    cartCount,
};
