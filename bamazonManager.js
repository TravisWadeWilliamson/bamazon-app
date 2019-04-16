const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

const mySqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2t@EkrD!zm^.^b.b',
    port: 3306,
    database: 'bamazon',
});


mySqlConnection.connect((err) => {
    if (err) throw err;
    queryDatabase();
});

const queryDatabase = function () {
    mySqlConnection.query('SELECT * FROM products', (err, data) => {
        mainMenu(data);
    })
}

const mainMenu = (data) => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please select an option',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            name: 'action',
        }
    ]).then(option => {
        switch (option.action) {
            case 'View Products for Sale':
                renderTable(data);
                break;
            case 'View Low Inventory':
                viewLowInventory(data);
                break;
            case 'Add to Inventory':
                addToInventory(data);
                break;
            case 'Add New Product':
                addNewProduct(data);
                break;
        }
    })
        .catch(err => console.log(err));
};

const renderTable = (tableData) => {
    let table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty'],
        colWidths: [10, 20, 20, 10, 10]
    });

    for (let row of tableData) {
        table.push(
            [row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]
        );
    }
    console.log(table.toString());
    queryDatabase();
};


const viewLowInventory = (tableData) => {
    const table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty'],
        colWidths: [10, 20, 20, 10, 10]
    });
    for (let row of tableData) {
        if (row.stock_quantity < 10) {

            table.push(
                [row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]
            );
        }
    }
    console.log(`The following products have reached the low inventory mark.`)
    console.log(table.toString());

    queryDatabase();
};

const addToInventory = () => {
    inquirer.prompt([
        {
            name: 'product_id',
            type: 'input',
            message: 'Please select the ID of the product you would you like to add to.',
        },
    ])
        .then(userInput => {
            mySqlConnection.query(`SELECT * FROM products WHERE item_id =${userInput.product_id}`, (err, data) => {

                const qtyPrompt = () => {
                    inquirer.prompt([
                        {
                            name: 'addQuantity',
                            message: `How many/much of ${data[0].product_name} would you like to add?`,
                            type: 'input',
                        }
                    ])
                        .then(qty => {
                            const addQty = parseInt(qty.addQuantity);
                            if (addQty !== 0) {
                                console.log(addQty);
                                //set qty plus the remaining qty
                                mySqlConnection.query(`UPDATE products SET stock_quantity = stock_quantity + ${addQty} WHERE item_id = ${userInput.product_id}`, (err, res) => {
                                    const total = (data[0].stock_quantity + addQty);
                                    console.log(`Quantity of ${data[0].product_name} = ${total}.`);
                                    queryDatabase();

                                })
                            } else {
                                console.log(`Can't add 0 quantity. Please add a number greater than 0 to inventory.`)
                                queryDatabase();
                            }
                        })
                }
                qtyPrompt();
            })
        })
}

const addNewProduct = () => {
    inquirer.prompt([
        {
            name: 'product_id',
            type: 'input',
            message: 'What is the product you would like to add to inventory?',
        },
    ])
        .then(userInput => {
            mySqlConnection.query(`SELECT * FROM products WHERE item_id =${userInput.product_id}`, (err, data) => {

                const qtyPrompt = () => {
                    inquirer.prompt([
                        {
                            name: 'addQuantity',
                            message: `How many/much of ${data[0].product_name} would you like to add?`,
                            type: 'input',
                        }
                    ])
                        .then(qty => {
                            const addQty = parseInt(qty.addQuantity);
                            if (addQty !== 0) {
                                console.log(addQty);
                                //set qty plus the remaining qty
                                mySqlConnection.query(`UPDATE products SET stock_quantity = stock_quantity + ${addQty} WHERE item_id = ${userInput.product_id}`, (err, res) => {
                                    const total = (data[0].stock_quantity + addQty);
                                    console.log(`Quantity of ${data[0].product_name} = ${total}.`);
                                    queryDatabase();

                                })
                            } else {
                                console.log(`Can't add 0 quantity. Please add a number greater than 0 to inventory.`)
                                queryDatabase();
                            }
                        })
                }
                qtyPrompt();
            })
        })
}
