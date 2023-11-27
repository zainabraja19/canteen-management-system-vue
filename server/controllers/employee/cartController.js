const cartService = require("../../services/employee/cartService");
const menuService = require("../../services/employee/menuService");
const employeeService = require("../../services/employee/profileService");

const fetchCart = async (req, res) => {
    try {
        const employeeDetails = await employeeService.fetchEmployeeDetails({
            query: { empId: req.params.empId },
            select: "_id empId name phone",
        });

        if (!employeeDetails) {
            return res
                .status(404)
                .json({ data: null, error: "Employee not found", status: 404 });
        }

        const cartData = { employee: req.params.empId };
        const cartItems = await cartService.findItemInCart(cartData);

        if (!cartItems) {
            return res.status(200).json({
                data: { items: [], cartTotal: 0, totalItems: 0 },
                status: 200,
            });
        }

        const { items, cartTotal, totalItems } = cartItems;
        res.status(200).json({
            data: { items, cartTotal, totalItems },
            status: 200,
        });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const addToCart = async (req, res) => {
    try {
        const itemId = req.body.itemId;
        const empId = req.params.empId;

        const menuItem = await menuService.findMenuItem({ _id: itemId });

        if (!menuItem || !menuItem[0].isAvailable) {
            throw new Error("Sorry, Item is not available!");
        }

        const itemInCart = await cartService.findItemInCart({
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

        const result = await cartService.updateCart({
            query,
            update,
            options,
            itemId,
        });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const itemId = req.body.itemId;
        const empId = req.params.empId;
        const deleteCount = req.body.deleteCount;

        const menuItem = await menuService.findMenuItem({ _id: itemId });

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

        const result = await cartService.updateCart({
            query,
            update,
            options,
            itemId,
        });

        if (!result) {
            throw new Error("Cart not found");
        }

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const cartCount = async (req, res) => {
    try {
        const data = { employee: req.params.empId };
        const result = await cartService.findItemInCart(data);

        if (!result) {
            res.status(200).json({ data: { count: 0 }, status: 200 });
        } else {
            res.status(200).json({
                data: { count: result.totalItems },
                status: 200,
            });
        }
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

module.exports = {
    fetchCart,
    addToCart,
    removeFromCart,
    cartCount,
};
