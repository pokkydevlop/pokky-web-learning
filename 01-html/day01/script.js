// const alertLogin = () => {
//   alert("ログインが押されました");
// };

// const alertCart = () => {
//   alert("カートが押されました");
// };

const alertPush = (value) => {
  switch (value) {
    case "login":
      alert("ログインが押されました");
      break;
    case "cart":
      alert("カートが押されました");
      break;
    case "search":
      alert("検索が押されました");
      break;
    default:
      alert("未定義のボタンが押されました");
  }
};

// ダイアログ
const dialog = document.querySelector("#addDialog");
const openDialogButton = document.querySelector("#showDialog");
const closeDialogButton = document.querySelector("#closeDialog");

openDialogButton.addEventListener("click", () => {
  dialog.showModal();
});

closeDialogButton.addEventListener("click", () => {
  dialog.close();
});

// 商品の配列
const products = [];
let nextProductId = 1;

const productForm = document.querySelector("#productDetail");
const productList = document.querySelector("#productList");

// 配列に商品を追加
productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(productForm);
  const name = formData.get("productName").trim();
  const price = Number(formData.get("productPrice"));

  if (!name || price < 0) return;

  const product = {
    id: nextProductId,
    name,
    price,
  };

  nextProductId += 1;
  products.push(product);

  renderProducts();
  productForm.reset();
  dialog.close();
});

<summary>カードの追加（表示系）</summary>;
function renderProducts() {
  productList.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const name = document.createElement("h2");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `¥${product.price.toLocaleString("ja-JP")}`;

    card.append(name, price);
    productList.append(card);
  });
}
