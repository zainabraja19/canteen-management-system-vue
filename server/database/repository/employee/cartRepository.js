const Cart = require("../../models/cart");

const findItemInCart = async (data) => {
    try {
        return await Cart.findOne(data).populate("items.item");

        return cart;
    } catch (error) {
        throw error;
    }
};

const updateCart = async (data) => {
    try {
        const { query, update, options, itemId } = data;

        const updatedCart = await Cart.findOneAndUpdate(query, update, options);

        if (updatedCart && updatedCart.items) {
            const updatedItem = updatedCart.items.find((item) => {
                return item.item.toString() === itemId.toString();
            });

            if (updatedItem && updatedItem.quantity === 0) {
                // Remove the item from the array
                updatedCart.items = updatedCart.items.filter(
                    (item) => item.item.toString() !== itemId.toString()
                );
            }

            // Save the updated cart
            await updatedCart.save();
        }
        return updatedCart;
    } catch (error) {
        throw error;
    }
};

const emptyCart = async (data) => {
    try {
        return await Cart.findOneAndUpdate(
            { employee: data.empId },
            { items: [], totalItems: 0, cartTotal: 0 },
            { new: true }
        );

        return updatedCart;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findItemInCart,
    updateCart,
    emptyCart,
};
