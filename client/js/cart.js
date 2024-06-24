const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");

const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    });

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    if (cart.length > 0) {
        cart.forEach((producto) => {
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            modalBody.innerHTML = `
                <div class="product">
                    <img class="product-img" src="${producto.img}" />
                    <div class="product-info">
                        <h4>${producto.productName}</h4>
                    </div>
                    <div class="quantity">
                        <span class="quantity-btn-decrese">-</span>
                        <span class="quantity-input">${producto.quantity}</span>
                        <span class="quantity-btn-increse">+</span>
                    </div>
                    <div class="price">${producto.price * producto.quantity} $</div>
                    <div class="delete-product">❌</div>
                </div>
            `;
            modalContainer.append(modalBody);

            const decrese = modalBody.querySelector(".quantity-btn-decrese");
            decrese.addEventListener("click", () => {
                if (producto.quantity !== 1) {
                    producto.quantity--;
                    displayCart();
                }
                displayCartCounter();
            });

            const increse = modalBody.querySelector(".quantity-btn-increse");
            increse.addEventListener("click", () => {
                producto.quantity++;
                displayCart();
                displayCartCounter();
            });

            const deleteProduct = modalBody.querySelector(".delete-product");
            deleteProduct.addEventListener("click", () => {
                deleteCartProduct(producto.id);
            });
        });

        const total = cart.reduce((acc, el) => acc + el.price * el.quantity, 0);

        const modalFooter = document.createElement("div");
        modalFooter.className = "modal-footer";
        modalFooter.innerHTML = `
            <div class="total-price">Total: ${total}</div>
            <button class="btn-primary" id="checkout-btn">go to checkout</button>
            <div id="wallet_container"></div>
        `;
        modalContainer.append(modalFooter);

        const mp = new MercadoPago("TEST-ae017b1d-49d5-4131-b1e5-019590e34512", {
            locale: "es-AR",
        });

        const generateCartDescription = () => {
            return cart.map(product => `${product.productName} (x${product.quantity})`).join(', ');
        };

        document.getElementById("checkout-btn").addEventListener("click", async () => {
            try {
                const orderData = {
                    title: generateCartDescription(),
                    quantity: 1,
                    price: total,
                };

                const response = await fetch("http://localhost:3000/create_preference", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                const preference = await response.json();
                createCheckoutButton(preference.id);
            } catch (error) {
                alert("error");
            }
        });

        const createCheckoutButton = (preferenceId) => {
            const bricksBuilder = mp.bricks();

            const renderComponent = async () => {
                if (window.checkoutButton) window.checkoutButton.unmount();

                window.checkoutButton = await bricksBuilder.create("wallet", "wallet_container", {
                    initialization: {
                        preferenceId: preferenceId,
                    },
                });
            };

            renderComponent();
        };
    } else {
        const modalText = document.createElement("h2");
        modalText.className = "modal-body";
        modalText.innerText = "Tu carrito está vacío";
        modalContainer.append(modalText);
    }
};

cartBtn.addEventListener("click", displayCart);

const deleteCartProduct = (id) => {
    const foundId = cart.findIndex((element) => element.id === id);
    cart.splice(foundId, 1);
    displayCart();
    displayCartCounter();
};

const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quantity, 0);
    if (cartLength > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    } else {
        cartCounter.style.display = "none";
    }
};
