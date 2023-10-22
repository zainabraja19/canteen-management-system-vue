export function formatPrice(price) {
    return price.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
    });
}