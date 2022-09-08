const loadCategories = () => {
  showSpinner(true);
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((categories) => displayCategories(categories))
    .catch((err) => console.log(err));
};

const displayCategories = (categories) => {
  showSpinner(false);
  const categoriesUl = document.getElementById("categories");
  categories.forEach((category) => {
    const li = document.createElement("li");
    li.innerText = category.toUpperCase();
    li.classList.add("mx-3", "fs-5", "btn");
    li.setAttribute("onclick", `loadProducts("${category}")`);
    categoriesUl.appendChild(li);
  });
};

const loadProducts = (category) => {
  showSpinner(true);
  const productsSec = document.getElementById("products");
  const categoriesCount = document.getElementById("categories-count");
  const errorMessage = document.getElementById("error-message");
  categoriesCount.innerText = "";
  categoriesCount.style.display = "none";
  productsSec.innerHTML = "";
  errorMessage.innerText = "";
  let url = `https://fakestoreapi.com/products`;
  if (category) {
    url = `https://fakestoreapi.com/products/category/${category}`;
  }
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayProducts(data, category))
    .catch((err) => console.log(err));
};

const displayProducts = (products, category = "Products") => {
  showSpinner();
  if (!products.length) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = "Product not found";
    return;
  }
  const productsSec = document.getElementById("products");
  const categoriesCount = document.getElementById("categories-count");
  categoriesCount.style.display = "block";
  categoriesCount.innerText = `${products.length} items found for ${category}`;
  products.sort((a, b) => b.rating.rate - a.rating.rate);
  products.forEach((product) => {
    const { id, title, description, image, price, rating } = product;
    const newDescription = description.slice(0, 150);
    const dots = description.length > 150 ? "..." : "";
    productsSec.innerHTML += `
    <div class="col-md-4">
          <div class="shadow rounded p-3 h-100">
            <img
              src=${image}
              alt=""
              class="img-fluid"
            />
            <h4 class="mt-2">${title || "No title Found"}</h4>
            <p>${newDescription}${dots}</p>
            <h6>${price}</h6>
            <h6>${rating.rate}</h6>
            <button onclick="loadProduct('${id}')" class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">Details --></button>
          </div>
        </div>
    `;
  });
};

const loadProduct = (id) => {
  const productDetails = document.getElementById("product-details");
  const productTitle = document.getElementById("product-title");
  productTitle.innerText = "Loading...";
  productDetails.innerHTML = "<h5>Loading...</h5>";
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((data) => showProductDetails(data))
    .catch((err) => console.log(err));
};

const showProductDetails = (product) => {
  const { title, description, image, price, rating } = product;
  const productDetails = document.getElementById("product-details");
  const productTitle = document.getElementById("product-title");
  productTitle.innerText = title;
  productDetails.innerHTML = `
  <img
              src=${image}
              alt=""
              class="img-fluid"
            />
            <h4 class="mt-2">${title}</h4>
            <p>${description}</p>
            <h6>${price}</h6>
            <h6>${rating.rate}</h6>
  `;
};

const showSpinner = (isLoading = false) => {
  const spinner = document.getElementById("spinner");
  if (isLoading) {
    spinner.classList.add("d-block");
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
    spinner.classList.remove("d-block");
  }
};

loadCategories();

loadProducts();
