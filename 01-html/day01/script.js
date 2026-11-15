// Show a message for the selected header action.
const alertPush = (value) => {
  const messages = {
    login: "ログインが押されました",
    cart: "カートが押されました",
    search: "検索が押されました",
  };
  alert(messages[value] ?? "未定義のボタンが押されました");
};

// Cache the dialog and form elements used by both add and edit flows.
const dialog = document.querySelector("#productDialog");
const openDialogButton = document.querySelector("#showDialog");
const closeDialogButton = document.querySelector("#closeDialog");
const productForm = document.querySelector("#productDetail");
const productList = document.querySelector("#productList");
const dialogTitle = document.querySelector("#dialogTitle");
const saveProductButton = document.querySelector("#saveProductButton");

// Store products and the current UI state.
const products = [];
let nextProductId = 1;
let editingProductId = null;
let currentCategory = "all";

// Open a blank form for a new product.
openDialogButton.addEventListener("click", () => {
  editingProductId = null;
  productForm.reset();
  dialogTitle.textContent = "商品の追加";
  saveProductButton.textContent = "追加";
  dialog.showModal();
});

// Close the shared add/edit dialog.
closeDialogButton.addEventListener("click", () => {
  dialog.close();
});

// Fill the shared form with the selected product before editing.
function openEditDialog(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  editingProductId = productId;
  productForm.elements.productName.value = product.name;
  productForm.elements.productPrice.value = product.price;
  productForm.elements.productProperty.value = product.property;
  dialogTitle.textContent = "商品の編集";
  saveProductButton.textContent = "更新";
  dialog.showModal();
}

// Add a product or update the product currently being edited.
productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(productForm);
  const name = formData.get("productName").trim();
  const price = Number(formData.get("productPrice"));
  const property = formData.get("productProperty");
  if (!name || price < 0 || !property) return;

  if (editingProductId !== null) {
    const product = products.find((item) => item.id === editingProductId);
    if (!product) return;
    product.name = name;
    product.price = price;
    product.property = property;
  } else {
    products.push({ id: nextProductId, name, price, property });
    nextProductId += 1;
  }

  renderProducts();
  productForm.reset();
  editingProductId = null;
  dialog.close();
});

// Render only products that match the selected navigation category.
function renderProducts() {
  productList.replaceChildren();
  const visibleProducts = currentCategory === "all"
    ? products
    : products.filter((product) => product.property === currentCategory);

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const name = document.createElement("h2");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `¥${product.price.toLocaleString("ja-JP")}`;

    const detail = document.createElement("a");
    detail.className = "product-button";
    detail.href = "#";
    detail.textContent = "商品を見る";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "編集";
    edit.addEventListener("click", () => openEditDialog(product.id));

    card.append(name, price, detail, edit);
    productList.append(card);
  });
}

// Keep the selected navigation item visually and accessibly marked.
const navLinks = document.querySelectorAll(".nav-list a");
function updateActiveNav(selectedLink) {
  navLinks.forEach((link) => {
    const isActive = link === selectedLink;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

navLinks.forEach((link) => {
  if (link.dataset.category === currentCategory) updateActiveNav(link);
  link.addEventListener("click", (event) => {
    event.preventDefault();
    currentCategory = link.dataset.category;
    updateActiveNav(link);
    renderProducts();
  });
});

// Show the initial product list on page load.
renderProducts();
