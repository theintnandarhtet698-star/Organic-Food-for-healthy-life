const validationErrorMsg = document.querySelector('.validation-error');
const form = document.querySelector('form');
const nameInput = form.name;
const detailsInput = form.details;
const priceInput = form.price;
const hiddenIdInput = form.hiddenId;
const hiddenDeleteIdInput = form.hiddenDeleteId;
let editProduct,
  editProductIndex = null;

const productTable = document.querySelector('#productTable');
let products = null;

// check product exists in localStorage
if (!localStorage.getItem('products')) {
  let products = [
    {
      id: 1,
      title: 'Burger',
      price: 5,
      details: '',
      imageSrc: './dist/images/products/burger.jpg',
    },
    {
      id: 2,
      title: 'Pizza',
      price: 6,
      details: '',
      imageSrc: './dist/images/products/pizza.jpg',
    },
    {
      id: 3,
      title: 'Spaghetti',
      price: 7,
      details: '',
      imageSrc: './dist/images/products/spaghetti.jpg',
    },
    {
      id: 4,
      title: 'Salad',
      price: 8,
      details: '',
      imageSrc: './dist/images/products/salad.jpg',
    },
    {
      id: 5,
      title: 'Sandwich',
      price: 9,
      details: '',
      imageSrc: './dist/images/products/sandwich.jpg',
    },
    {
      id: 6,
      title: 'Donut',
      price: 10,
      details: '',
      imageSrc: './dist/images/products/donut.png',
    },
  ];
} else {
  const jsonStr = localStorage.getItem('products');
  products = JSON.parse(jsonStr);
}

// attach click event to Add Button
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const productImg = form.img.files[0];
  const productName = form.name.value;
  const productDetails = form.details.value;
  const price = form.price.value;
  let imgSrc = '';

  const productId = products.length + 1;
  const action = `
    <a href = '#' class='edit-btn' id='edit-product-${productId}'>Edit</a>
    <a href = '#' class='delete-btn' id='delete-product-${productId}'>Delete</a>
  `;

  if (
    // productImg == '' ||
    // productName === '' ||
    // productDetails === '' ||
    // price === ''
    false
  ) {
    validationErrorMsg.classList.add('hide');
    return;
  }

  // implementing edit product when adding it
  if (hiddenIdInput.value != '') {
    const reader = new FileReader(productImg);
    reader.onload = function () {
      imgSrc = this.result;

      const jsonStr = localStorage.getItem('products');
      const products = JSON.parse(jsonStr);
      products[editProductIndex] = {
        id: editProduct.id,
        title: productName,
        details: productDetails,
        price: price,
        imageSrc: imgSrc,
      };

      localStorage.setItem('products', JSON.stringify(products));

      // edit table row
      const editRow = document.querySelector(`#row-${editProduct.id}`);
      editRow.children[0].innerHTML = `<img src='${this.result}' />`;
      editRow.children[1].textContent = productName;
      editRow.children[2].textContent = productDetails;
      editRow.children[3].textContent = price;
    };
    reader.readAsDataURL(productImg);

    hiddenIdInput.value = '';
    form.reset();
    return;
  }

  const tr = document.createElement('tr');
  tr.id = `row-${productId}`;

  // adding table ceil
  [productImg, productName, productDetails, price, action].forEach(
    (value, index) => {
      const td = document.createElement('td');

      if (index === 0) {
        const reader = new FileReader(productImg);
        reader.onload = function () {
          const imgEl = `<img src='${this.result}' />`;
          imgSrc = this.result;

          const newProduct = {
            id: productId,
            title: productName,
            details: productDetails,
            price,
            imageSrc: imgSrc,
          };

          products.push(newProduct);

          localStorage.setItem('products', JSON.stringify(products));

          td.innerHTML = imgEl;
        };
        reader.readAsDataURL(productImg);
      }

      if (index === 4) {
        td.innerHTML = value;
      } else td.textContent = value;

      // adding ceil into row
      tr.appendChild(td);
    }
  );

  // adding row into table
  productTable.querySelector('tbody').appendChild(tr);

  e.target.reset();
});

// implementing edit & delete buttons
productTable.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.id.split('-')[2];
    const jsonStr = localStorage.getItem('products');
    const products = JSON.parse(jsonStr);
    editProductIndex = null;
    editProduct = products.find((p, i) => {
      editProductIndex = i;
      return p.id == id;
    });

    const { title, details, price } = editProduct;
    nameInput.value = title;
    detailsInput.value = details;
    priceInput.value = price;
    hiddenIdInput.value = id;
  }

  if (e.target.classList.contains('delete-btn')) {
    const delProductId = e.target.id.split('-')[2];
    const jsonStr = localStorage.getItem('products');
    const products = JSON.parse(jsonStr);
    let delProductIndex = null;
    products.find((p, i) => {
      delProductIndex = i;
      return p.id == delProductId;
    });

    products.splice(delProductIndex, 1);
    localStorage.setItem('products', JSON.stringify(products));
    const delRow = productTable.querySelector(`#row-${delProductId}`);
    delRow.remove();
  }
});
