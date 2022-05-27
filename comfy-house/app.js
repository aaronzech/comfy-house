//Variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
// Cart 
let cart = []

// buttons
let buttonsDOM = [];

// Getting the products
class Products{

    async getProducts(){
    try {
        let result = await fetch('products.json');
        let data = await result.json();
        let products = data.items;

        // Restructure the data
        products = products.map(item => {
            const {title,price} = item.fields;
            const {id} = item.sys;
            const image = item.fields.image.fields.file.url;
            return {title,price,id,image}  
        });
        return products
    } catch (error) {
        console.log(error);
    }
    
    }

}

// Display Products
class UI{
    displayProducts(products){
        console.log("DISPLAY PRODUCTS: "+products);
        let result ='';
        
        
        // Create HTML element
        products.forEach(product => {
            result +=` 
            <!--Single Product-->
             <article class="product">
                <div class="img-containter">
                    <img src=${product.image}
                    alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i> add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price}</h4>
            </article>
          <!--End of products-->
            `

            console.log(product.title);
        })
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")]; // Assign buttons into an array
        buttonsDOM = buttons;
        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
               button.innerText = "In Cart";
               button.disable = true; 
            }else{
                button.addEventListener('click',(event)=>{
                    console.log(event);
                    event.target.innerText = "In Cart"
                    event.target.disabled = true;
                    // get product from products
                    let cartItem = {...Storage.getProduct(id),amount:1}; // spread operator add a new variable amount to the object 
                    //console.log(cartItem);
                    // add product to the cart
                    cart = [...cart,cartItem];
                    console.log(cart);
                    // save cart to local storage
                    Storage.saveCart(cart);
                    // set cart values
                    this.setCartValues(cart);
                    // display cart item
                    this.addCartItem(cartItem);
                    // show the cart
                    this.showCart();
                })
            }
        });

        //console.log(buttons);
    }
    setCartValues(cart){
        let tempTotal =0;
        let itemsTotal = 0;
        cart.map(item=>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal;

    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src="${item.image}" alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>Remove</span>
        </div>
        
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`
        cartContent.appendChild(div);
        //console.log(cartContent);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupApp(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        //Event listeners
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);

    }
    populateCart(cart){
        cart.forEach(item=>this.addCartItem(item))

    
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    cartLogic(){
        //Select clear cart button
        clearCartBtn.addEventListener('click',this.clearCart)
    }
    clearCart(){
        console.log(this);
    }
}

// local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart))
    }
    static getCart(){
        
    
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    // Setup application
    ui.setupApp();
    // get all products
    products.getProducts().then(products=>{
        ui.displayProducts(products)
    Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
});