DROP DATABASE IF EXISTS digizon; 

CREATE DATABASE digizon;

USE digizon;

CREATE TABLE products (
    item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(255),
    department_name VARCHAR(255),
    price DECIMAL(10 , 2 ),
    stock_quantity INTEGER,
    PRIMARY KEY (item_id)
);
