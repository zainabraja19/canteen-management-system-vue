const PDFDocument = require("pdfkit");
const moment = require('moment');

function createInvoice(orderDetails, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, orderDetails);
    generateInvoiceTable(doc, orderDetails);

    return doc
}

function generateHeader(doc) {
    doc
        .image("public/logo.png", 50, 45, { width: 80 })
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("ArguSoft India Ltd.", 200, 50, { align: "right" })
        .font("Helvetica")
        .text("A 66, GIDC Sector - 25", 200, 65, { align: "right" })
        .text("Gandhinagar - 382016", 200, 80, { align: "right" })
        .text("Gujarat, India", 200, 95, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, orderDetails) {
    doc
        .font("Helvetica-Bold")
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(orderDetails.orderId, 140, customerInformationTop)  //order no.
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(orderDetails.orderDate), 140, customerInformationTop + 15)   //order date
        // .text("Balance Due:", 50, customerInformationTop + 30)
        // .text(
        //     formatCurrency(orderDetails.subtotal - orderDetails.paid),
        //     140,
        //     customerInformationTop + 30
        // )s

        .font("Helvetica-Bold").text("Employee name:", 320, customerInformationTop)
        .text(orderDetails.employee.name, 410, customerInformationTop)  //emp-name
        .font("Helvetica")
        .text("Employee Id:", 320, customerInformationTop + 15)
        .text(orderDetails.employee.empId, 410, customerInformationTop + 15)  //emp-id
        .moveDown();

    generateHr(doc, 238);
}


// {
//   _id: new ObjectId("654b586ea5fe7cdc492c46fc"),
//   employee: {
//     _id: new ObjectId("6548bdc92c0e8a046aca1168"),
//     empId: 'A624',
//     name: 'Zainab Raja'
//   },
//   items: [
//             {
//                 item: {
//                     _id: new ObjectId("65448db4d04fb29532e52328"),
//                     itemName: 'Milkshake',
//                     price: 20,
//                     isAvailable: true,
//                     __v: 0
//                 },
//                 quantity: 1,
//                 _id: new ObjectId("654b58edc330c5f3f28ca10f")
//             }
//         ],
//   totalAmount: 120,
//   completed: false,
//   cancelled: false,
//   orderDate: 2023-11-08T09:44:14.627Z,
//   orderId: 12,
//   __v: 0
// }

function generateInvoiceTable(doc, orderDetails) {
    doc
        .font("Helvetica-Bold")
        .fillColor("#444444")
        .fontSize(20)
        .text("Order Details", 50, 280);

    generateHr(doc, 305);

    let i;
    const invoiceTableTop = 330;

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
    doc.font("public/fonts/NotoSansDevanagari-Regular.ttf")

    for (i = 0; i < orderDetails.items.length; i++) {
        const item = orderDetails.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.item.itemName,
            formatCurrency(item.item.price),  //price of single item
            item.quantity,
            formatCurrency(item.item.price * item.quantity)  //total amount
        );

        generateHr(doc, position + 20);
    }

    doc.font("public/fonts/NotoSansDevanagari-Bold.ttf");
    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Total",
        formatCurrency(orderDetails.totalAmount)   //total
    );

    // const paidToDatePosition = subtotalPosition + 20;
    // generateTableRow(
    //     doc,
    //     paidToDatePosition,
    //     "",
    //     "Paid To Date",
    //     "",
    //     formatCurrency(orderDetails.paid)
    // );

    // const duePosition = paidToDatePosition + 25;
    // doc.font("Helvetica-Bold");
    // generateTableRow(
    //     doc,
    //     duePosition,
    //     "",
    //     "Balance Due",
    //     "",
    //     formatCurrency(orderDetails.subtotal - orderDetails.paid)
    // );
    doc.font("Helvetica");
}

// function generateFooter(doc) {
//     doc
//         .fontSize(10)
//         .text(
//             "Payment is due within 15 days. Thank you for your business.",
//             50,
//             780,
//             { align: "center", width: 500 }
//         );
// }

function generateTableRow(
    doc,
    y,
    item,
    // description,
    price,
    quantity,
    total
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        // .text(description, 150, y)
        .text(price, 170, y, { width: 90, align: "right" })
        .text(quantity, 310, y, { width: 90, align: "right" })
        .text(total, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "₹" + (cents).toFixed(2);
}

function formatDate(date) {
    return moment(date).format('DD/MM/YYYY hh:mm A');
}

module.exports = {
    createInvoice
};