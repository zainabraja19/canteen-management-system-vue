const Cart = require("../../../database/models/cart");

// const fetchCart = async (data, callback) => {
//     try {
//         const cart = await Cart.findOne({ employee: data.empId })
//             .populate('items.item')

//         return car)
//     } catch (error) {
//         callback(error)
//     }
// }

const findItemInCart = async (data, callback) => {
    try {
        const cart = await Cart.findOne(data).populate("items.item");

        return cart;
    } catch (error) {
        throw error;
    }
    // console.log(cart);
    // return cart
};

const updateCart = async (data, callback) => {
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

const emptyCart = async (data, callback) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { employee: data.empId },
            { items: [], totalItems: 0, cartTotal: 0 },
            { new: true }
        );

        return updatedCart;
    } catch (error) {
        throw error;
    }
};

// const cartCount = async (data, callback) => {
//     try {
//         const cart = await Cart.findOne({ employee: data.empId })

//         return car)
//     } catch (error) {
//         callback(error)
//     }
// }

module.exports = {
    // fetchCart,
    // addToCart,
    // removeFromCart,
    // cartCount,
    findItemInCart,
    updateCart,
    emptyCart,
};
