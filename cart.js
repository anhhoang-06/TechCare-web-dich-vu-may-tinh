const cartStorageKey = "techcare-cart";
const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-count");
const cartItems = loadCart();

function loadCart() {
    const savedCart = localStorage.getItem(cartStorageKey);

    if (!savedCart) {
        return [];
    }

    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart) || !parsedCart.every((item) =>
        item &&
        typeof item.name === "string" &&
        Number.isFinite(item.price) &&
        item.price >= 0
    )) {
        throw new Error("The saved TechCare cart has an invalid format.");
    }

    return parsedCart;
}

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    updateCartCount();
}

function updateCartCount() {
    cartCount.textContent = String(cartItems.length);
    cartButton.setAttribute("aria-label", `Giỏ hàng, ${cartItems.length} sản phẩm`);
}

const cartDialog = document.createElement("dialog");
cartDialog.id = "cart-dialog";
cartDialog.className = "cart-dialog";
cartDialog.setAttribute("aria-labelledby", "cart-title");
cartDialog.innerHTML = `
    <div class="cart-dialog-content">
        <div class="cart-dialog-header">
            <h2 id="cart-title">Giỏ hàng</h2>
            <button class="cart-close-button" type="button" aria-label="Đóng giỏ hàng">×</button>
        </div>
        <div class="cart-items"></div>
        <p class="cart-total"></p>
    </div>
`;
document.body.append(cartDialog);

const cartItemsContainer = cartDialog.querySelector(".cart-items");
const cartTotal = cartDialog.querySelector(".cart-total");

function renderCart() {
    cartItemsContainer.replaceChildren();
    cartTotal.hidden = cartItems.length === 0;

    if (cartItems.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Giỏ hàng của bạn đang trống.";
        cartItemsContainer.append(emptyMessage);
        return;
    }

    let total = 0;
    cartItems.forEach((item, index) => {
        total += item.price;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");
        const name = document.createElement("p");
        name.className = "cart-item-name";
        name.textContent = item.name;

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = `${item.price.toLocaleString("vi-VN")} VNĐ`;
        details.append(name, price);

        const removeButton = document.createElement("button");
        removeButton.className = "cart-remove-button";
        removeButton.type = "button";
        removeButton.textContent = "Xóa";
        removeButton.setAttribute("aria-label", `Xóa ${item.name} khỏi giỏ hàng`);
        removeButton.addEventListener("click", () => {
            cartItems.splice(index, 1);
            saveCart();
            renderCart();
        });

        row.append(details, removeButton);
        cartItemsContainer.append(row);
    });

    cartTotal.textContent = `Tổng cộng: ${total.toLocaleString("vi-VN")} VNĐ`;
}

cartButton.addEventListener("click", () => {
    renderCart();
    cartDialog.showModal();
});

cartDialog.querySelector(".cart-close-button").addEventListener("click", () => {
    cartDialog.close();
});

cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) {
        cartDialog.close();
    }
});

document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
        cartItems.push({
            name: button.dataset.productName,
            price: Number(button.dataset.productPrice)
        });
        saveCart();
        button.textContent = "Đã thêm";
        window.setTimeout(() => {
            button.textContent = "Thêm";
        }, 1000);
    });
});

updateCartCount();
