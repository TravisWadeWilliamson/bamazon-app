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

//OPEN THE DATABASE CONNECT
mySqlConnection.connect((err) => {
    if (err) throw err;
    console.log('MYSQL is connected');
    mySqlConnection.query('SELECT * FROM products', (err, data) => {
        mainMenu(data);

    })

});

const mainMenu = (data) => {
    inquirer.prompt([

        {
            type: 'list',
            message: 'Please select a option',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            name: 'action',
        }
    ]).then(option => {
        console.log(option);
        switch (option.action) {
            case 'View Products for Sale':
                renderTable(data);
                break;
            case 'View Low Inventory':
                viewLowInventory(data);

                break;
        }

    })
        .catch(err => console.log(err));
};

const renderTable = (tableData) => {
    const table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty'],
        colWidths: [10, 20, 20, 10, 10]
    });
    for (let row of tableData) {
        table.push(
            [row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]
        );
    }
    console.log(table.toString());
};

const viewLowInventory = (tableData) => {
    const table = new Table({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Qty'],
        colWidths: [10, 20, 20, 10, 10]
    });
    for (let row of tableData) {
        if (row.stock_quantity < 3) {

            table.push(
                [row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]
            );
        } else {
            console.log(`${row.product_name} Sufficient Inventory!`);
        }
    } 
    console.log(table.toString());
};