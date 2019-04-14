const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');

const mySqlConnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "2t@EkrD!zm^.^b.b",
    database: "bamazon"
});

//opens the db connection
mySqlConnection.connect(function (err) {
    if (err) throw err;
    getDataFromDatabase();
});

const renderTable = (tableData) => {
    const table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty'],
        colWidths: [10, 20, 20, 10, 10]
    });
    for (let row of tableData) {
        console.log(row);
        table.push(
            [row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]
        );
    }
    console.log(table.toString());
};

//pulls the database
const getDataFromDatabase = () => {
    mySqlConnection.query('select * from products', (err, data) => {
        if (err) throw err;
        console.log(data);
        renderTable(data);
        customerPrompt();

    });
};

const customerPrompt = () => {
    inquirer
        .prompt([{
            name: "product_id",
            type: "input",
            message: "What is the ID of the product you would you like to purchase?",
        },
        ])
        .then(userInput => {
            mySqlConnection.query(`SELECT * FROM products WHERE item_id =${userInput.product_id}`, (err, data) => {
                if (data[0]) {
                    const qtyPrompt = () => {
                        inquirer.prompt([
                            {
                                name: 'quantity',
                                message: `How many/much ${data[0].product_name} would you like?`,
                                type: 'input'
                            }
                        ])
                            .then(qty => {
                                if (qty.quantity <= data[0].stock_quantity) {
                                    const remainQTY = data[0].stock_quantity - qty.quantity;
                                    mySqlConnection.query(`UPDATE products SET stock_quantity = ${remainQTY} WHERE item_id = ${userInput.product_id}`, (err, res) => {
                                        const total = (data[0].price * qty.quantity).toFixed(2)
                                        console.log(`Your total is $${total}.`);
                                        mySqlConnection.end();
                                    })
                                } else {
                                    console.log(`We're sorry. We don't have enough of what you want.`)
                                    qtyPrompt();
                                }

                            });
                    }
                    qtyPrompt();
                }
                else {
                    console.log('Item not found. Please enter the correct ID.');
                    customerPrompt();
                }

            });

        });
}
