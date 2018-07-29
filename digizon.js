let inquirer = require("inquirer")
let mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "digizon"
});

connection.connect(function (err) {
    if (err) throw err;
    // Will request products from the database, 
    // and prompt the user for selection once retrived
    getProducts()
});

function printSeperator() {
    console.log("------------------------------------------------------------")
}

function promptProduct(products, results) {
    inquirer.prompt([{
        name: "product_name",
        type: "list",
        message: "Which product would you like to purchase?",
        choices: products
    }, {
        name: "quantity",
        type: "number",
        message: "How many would you like to purchase?"
    }]).then(function (response) {
        if (!response.quantity) {
            printSeperator()
            console.log("You entered an invalid quantity.\nPlease try again.")
            printSeperator()
            promptProduct(products)
        } else {
            let product = results.find(function (product) {
                return (product.product_name == response.product_name)
            })
            if (response.quantity > product.stock_quantity) {
                printSeperator()
                console.log(`Sorry, there are only ${product.stock_quantity} left in inventory.`)
                console.log("Please try again")
                printSeperator()
                promptProduct(products)
            } else {
                let successMessage = `Congrats, you purchased ${response.quantity} ${product.product_name} for $${product.price * response.quantity}!`
                purchaseProduct(product.item_id, product.stock_quantity - response.quantity, successMessage)
            }
        }
    })
}

function getProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        let products = []
        results.forEach(function (product) {
            products.push(product.product_name)
        })
        // Provide both array of string product_name choices,
        // and raw results so can reference id and quantity later
        promptProduct(products, results)
    })
}

function purchaseProduct(id, stockQuantityRemaining, successMessage) {
    connection.query(`UPDATE products 
    SET 
        stock_quantity = ${stockQuantityRemaining}
    WHERE
        item_id = ${id}`, function (err, results) {
            if (err) throw err;
            printSeperator()
            console.log(successMessage)
            printSeperator()
            connection.end()
        })
}
