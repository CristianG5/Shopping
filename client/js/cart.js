const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");

const cartBtn = document.getElementById("cart-btn")
const cartCounter = document.getElementById("cart-counter")

const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌"
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", ()=>{
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    })

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader); 

    if(cart.length > 0){
    cart.forEach((productos)=>{
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
            <div class = "product">
                <img class="product-img" src= "${productos.img}" />
                <div class="product-info">
                    <h4>${productos.productName}</h4>
            </div>

            <div class = "quantity">
                <span class="quantity-btn-decrese">-</span>
                <span class="quantity-input">${productos.quantity}</span>
                <span class="quantity-btn-increse">+</span>
            </div>

            <div class="price">${productos.price * productos.quantity} $</div>    
                <div class="delete-product">❌</div>
            </div>    
        `;
        modalContainer.append(modalBody);

        const decrese = modalBody.querySelector(".quantity-btn-decrese");
        decrese.addEventListener("click", () => {
            if(productos.quantity !== 1){
                productos.quantity--;
                displayCart();
            }
            displayCartCounter();
        });   
        
        const increse = modalBody.querySelector(".quantity-btn-increse");
        increse.addEventListener("click", ()=>{
            productos.quantity++;
            displayCart();
            displayCartCounter();
        })

        const deleteProduct = modalBody.querySelector(".delete-product");
        deleteProduct.addEventListener("click", ()=>{
            deleteCartProduct(productos.id);
        })

    });



    const total = cart.reduce((acc, el)=> acc + el.price * el.quantity, 0);

    const modalFooter = document.createElement("div");
    modalFooter.className= "modal-footer";
    modalFooter.innerHTML= `
        <div class = "total-price">Total: ${total}</div>
    `;
    modalContainer.append(modalFooter)
    }else{
        const modalText = document.createElement("h2");
        modalText.className = "modal-body";
        modalText.innerText = "Tu carrito esta vacio";
        modalContainer.append(modalText);
    }
};


cartBtn.addEventListener("click", displayCart)

const deleteCartProduct = (id)=>{
    const foundId = cart.findIndex((element)=> element.id === id);
    console.log(foundId);
    cart.splice(foundId, 1);
    displayCart();
    displayCartCounter();
};

const displayCartCounter = ()=>{
    const cartLength = cart.reduce((acc, el)=> acc + el.quantity, 0)
    if(cartLength > 0){
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    }else{
        cartCounter.style.display = "none";       
    }
}