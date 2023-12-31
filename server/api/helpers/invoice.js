const PDFDocument = require("pdfkit");
const moment = require("moment");

function createInvoice(orderDetails, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
    generateHeader(doc);
    generateCustomerInformation(doc, orderDetails);
    generateInvoiceTable(doc, orderDetails);

    return doc;
}

function generateHeader(doc) {
    doc.image("public/logo.png", 50, 45, { width: 80 })
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Argusoft India Ltd.", 200, 50, { align: "right" })
        .font("Helvetica")
        .text("A 66, GIDC Sector - 25", 200, 65, { align: "right" })
        .text("Gandhinagar - 382016", 200, 80, { align: "right" })
        .text("Gujarat, India", 200, 95, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, orderDetails) {
    doc.font("Helvetica-Bold")
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc.fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(orderDetails.orderId, 140, customerInformationTop) //order no.
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(
            formatDate(orderDetails.orderDate),
            140,
            customerInformationTop + 15
        )

        .font("Helvetica-Bold")
        .text("Employee name:", 320, customerInformationTop)
        .text(orderDetails.employee.name, 410, customerInformationTop) //emp-name
        .font("Helvetica")
        .text("Employee Id:", 320, customerInformationTop + 15)
        .text(orderDetails.employee.empId, 410, customerInformationTop + 15) //emp-id
        .moveDown();

    generateHr(doc, 238);
}

function generateInvoiceTable(doc, orderDetails) {
    doc.font("Helvetica-Bold")
        .fillColor("#444444")
        .fontSize(20)
        .text("Order Details", 50, 280);

    generateHr(doc, 305);

    let i;
    const invoiceTableTop = 330;
    let totalQuantity = 0;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        // "Description",
        "Price",
        "Quantity",
        "Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("public/fonts/NotoSansDevanagari-Regular.ttf");

    for (i = 0; i < orderDetails.items.length; i++) {
        const item = orderDetails.items[i];
        totalQuantity = totalQuantity + item.quantity;

        const itemHeight = doc.heightOfString(item.item.itemName, {
            width: 150,
        });

        console.log(itemHeight);

        const position = invoiceTableTop + (i + 1) * 30;
        // const position = invoiceTableTop + (i + 1) * 30 + itemHeight;

        // console.log(invoiceTableTop + (i + 1) * 30, position);
        generateTableRow(
            doc,
            position,
            item.item.itemName,
            formatCurrency(item.item.price), //price of single item
            item.quantity,
            formatCurrency(item.item.price * item.quantity) //total amount
        );

        generateHr(doc, position + 20);
    }

    doc.font("public/fonts/NotoSansDevanagari-Bold.ttf");
    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "Total",
        totalQuantity,
        formatCurrency(orderDetails.totalAmount) //total
    );
    doc.font("Helvetica");
}

function generateTableRow(
    doc,
    y,
    item,
    // description,
    price,
    quantity,
    total
) {
    doc.fontSize(10)
        .text(item, 50, y, { width: 150 })
        // .text(description, 150, y)
        .text(price, 170, y, { width: 90, align: "right" })
        .text(quantity, 310, y, { width: 90, align: "right" })
        .text(total, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "₹" + cents.toFixed(2);
}

function formatDate(date) {
    return moment(date).format("DD/MM/YYYY hh:mm A");
}

module.exports = {
    createInvoice,
};
