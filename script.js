// 1. MOBILE MENU TOGGLE
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// 2. PRODUCT IMAGE GALLERY (For sproduct.html)
var MainImg = document.getElementById("MainImg");
var smallimg = document.getElementsByClassName("small-img");

if(MainImg && smallimg.length > 0){
    for(let i=0; i<smallimg.length; i++) {
        smallimg[i].onclick = function() {
            MainImg.src = smallimg[i].src;
        }
    }
}

// 3. CART SYSTEM

// Function: Add to Cart (Called from sproduct.html)
function addToCart() {
    const name = document.getElementById('product-name').innerText;
    const price = document.getElementById('product-price').innerText;
    const img = document.getElementById('MainImg').src;
    const size = document.getElementById('product-size').value;
    const quantity = document.getElementById('product-quantity').value;

    if (size === "Select Size") {
        alert("Please select a size!");
        return;
    }

    const product = {
        name: name,
        price: price, // Keeps string like "$25.00"
        img: img,
        size: size,
        quantity: parseInt(quantity)
    };

    // Get current cart from local storage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add new product
    cart.push(product);
    
    // Save back to storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert("Item added to cart!");
    window.location.href = "cart.html"; // Go to cart page
}

// Function: Load Cart Items (Called automatically on cart.html)
function loadCart() {
    const tableBody = document.querySelector("#cart tbody");
    const subtotalBox = document.querySelector("#cart-subtotal");
    const totalBox = document.querySelector("#cart-total");

    if (!tableBody) return; // Stop if we are not on cart page

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    tableBody.innerHTML = ""; // Clear existing rows

    let totalAmount = 0;

    if(cart.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>Your cart is empty</td></tr>";
    } else {
        cart.forEach((item, index) => {
            // Clean price string (remove $) to do math
            let priceVal = parseFloat(item.price.replace("$", ""));
            let rowSubtotal = priceVal * item.quantity;
            totalAmount += rowSubtotal;

            let row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" onclick="removeFromCart(${index})"><i class="fa-regular fa-circle-xmark"></i></a></td>
                <td><img src="${item.img}" alt=""></td>
                <td>${item.name}<br><small>Size: ${item.size}</small></td>
                <td>${item.price}</td>
                <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></td>
                <td>$${rowSubtotal.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Update Totals Table
    if(subtotalBox) subtotalBox.innerText = "$" + totalAmount.toFixed(2);
    if(totalBox) totalBox.innerText = "$" + totalAmount.toFixed(2);
}

// Function: Remove Item
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove 1 item at specific index
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Refresh the list
}

// Function: Update Quantity directly in Cart
function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(newQty < 1) newQty = 1;
    cart[index].quantity = parseInt(newQty);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Refresh totals
}

// Run loadCart only if on cart page
if (window.location.pathname.includes("cart.html")) {
    window.onload = loadCart;
}

function updateCartTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    // Loop through all items
    cart.forEach(item => {
        // 1. Remove "$" and convert string to number
        let price = parseFloat(item.price.replace("$", "")); 
        
        // 2. Add to total (Price x Quantity)
        total += price * item.quantity;
    });

    // 3. Update the HTML elements
    let subtotalElement = document.getElementById("cart-subtotal");
    let totalElement = document.getElementById("cart-total");

    if (subtotalElement) {
        subtotalElement.innerText = "$" + total.toFixed(2);
    }
    
    if (totalElement) {
        totalElement.innerText = "$" + total.toFixed(2);
    }
}

// Add this to script.js to allow clicking the cart icon on grid items
function addFromGrid(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Create product object (Default size: Large)
    let product = {
        name: name,
        price: price,
        img: img,
        size: "Large", 
        quantity: 1
    };

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart!");
    window.location.href = "cart.html";
}