const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zraja@argusoft.com',
        pass: 'Zainab@2120'
    }
});

const mailOptions = (employee, order) => {
    const from = process.env.ADMIN_MAIL
    const to = process.env.ADMIN_MAIL
    const subject = 'New Order Placed'
    const html = `
                 <html>
                    <head>
                    <style>
                        table {
                            font-family: Arial, sans-serif;
                            border-collapse: collapse;
                            width: 100%;
                            margin-top: 1.2rem;
                        }
                        th, td {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                    </head>
                    <body>
                        <h3>Order Details:</h3>
                        <div>
                            <div>
                            <b>Ordered By:</b>
                                <div>Employee Id: ${employee.empId}</div>
                                <div>Empoyee Name: ${employee.name}</div>
                                <div>Phone number: ${employee.phone}</div>
                            </div>
                        </div>
                            <table>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                                ${order.items.map(item => `
                                    <tr>
                                        <td>${item.item.itemName}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.item.price * item.quantity}</td>
                                    </tr>
                                 `).join('')}
                                <tr>
                                    <td><b>Total</b></td>
                                    <td><b>${order.totalItems}</b></td>
                                    <td><b>${order.totalAmount}</b></td>
                                </tr>
                            </table >
                    </body >
                </ html>
            `
    return { from, to, subject, html }
};

module.exports = { transporter, mailOptions }