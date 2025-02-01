# RetailCart

This project implements a simple retail shopping cart SPA using Angular 18.  Users can browse products, add them to a cart, view cart details, and apply discount codes.

## Features

* **Product List:** Displays a list of products with their names and prices.
* **Add to Cart:** Allows users to add products to their cart.
* **Cart View:** Shows the current cart items, including product name, price, quantity, subtotal, and grand total.
* **Discount Codes:** Supports applying discount codes to the cart total.  See the "Valid Discount Codes" section below for details.
* **Responsive Design:** The application is designed to be responsive across different screen sizes.
* **Local Storage:** Cart data is persisted in local storage so that the cart is preserved across sessions.

## Technologies Used

* Angular 18
* TypeScript
* CSS
* Testing framework: Jest

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/RalphMarvin/retail-cart.git
```

2. **Navigate to the project directory:**

```bash
cd retail-cart
```

3. **Install dependencies:**
```bash
npm install
```

## Running the Application

```bash
ng serve
```

This will start the development server. Open your browser and navigate to http://localhost:4200 (or the URL displayed in the console) to view the application.

## Testing
```bash
ng test
```

This will run the unit tests for the application.

## Valid Discount Codes

The following discount codes are currently supported for testing:

* **SAVE10**: Applies a 10% discount to the grand total.
* **SAVE5**: Applies a $5 fixed discount to the grand total.

These codes are case-sensitive.  Entering an invalid code will display an error message.
