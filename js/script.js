// Função assíncrona para buscar dados da API e renderizar a vitrine de produtos
async function fetchData() {
  try {
    // URL da API para buscar dados
    const url = 'https://desafio.xlow.com.br/search';
    // Requisição assíncrona para obter os dados
    const response = await fetch(url);
    // Conversão da resposta para formato JSON
    const data = await response.json();

    // Função para renderizar o HTML de um produto
    const renderProduct = (product) => {
      // Desestruturação dos dados do produto
      const { productId, link, image, productName, bestPrice, listPrice } = product;
      // Formatação do preço para exibição em reais
      const formattedPrice = (bestPrice.toFixed(2) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      // Construção do HTML do produto
      const productDiv = `
        <div class="product">
          <div class="product-image">
            <a href="${link}">
              <img src="${image}" alt="${productName}">
            </a>
            <h3>ID: ${productId}</h3>
          </div>
          <div class="product-info">
            <h2 class="product-name">${productName}</h2>
            <div class="product-price">
              <span class="current-price">R$ ${formattedPrice}</span>
              ${bestPrice < listPrice ? `<div><p class="discount-price">R$ ${listPrice.toFixed(2) / 100}</p></div>` : ''}
              <button class="buy-button">Comprar</button>
            </div>
          </div>
        </div>`;

      return productDiv;
    };

    // Função para atualizar a grade de produtos com base na seleção do usuário
    const updateGrid = () => {
      const itensPerLine = document.getElementById('products-per-row');
      const productList = document.getElementById('product-list');
      const totalProducts = document.getElementById('total-products');

      let valorSelecionado = itensPerLine.value;

      // Verifica se a largura da janela é suficiente para exibir a versão desktop ou mobile
      if (window.innerWidth >= 767) {
        // Seleciona os produtos para exibição na versão desktop
        const desktopProducts = data.slice(0, valorSelecionado);
        // Gera o HTML dos produtos e atualiza a lista
        const desktopProductHTML = desktopProducts.map(renderProduct).join('');
        productList.innerHTML = desktopProductHTML;
        // Atualiza o contador de produtos
        totalProducts.textContent = `${desktopProducts.length} produto${desktopProducts.length !== 1 ? 's' : ''}: `;
      } else {
        // Seleciona os produtos para exibição na versão mobile
        const mobileProducts = data.slice(0, valorSelecionado);
        // Gera o HTML dos produtos e atualiza a lista
        const mobileProductHTML = mobileProducts.map(renderProduct).join('');
        productList.innerHTML = mobileProductHTML;
        // Atualiza o contador de produtos
        totalProducts.textContent = `${mobileProducts.length} produto${mobileProducts.length !== 1 ? 's' : ''}: `;
      }
    };

    // Função para renderizar todos os produtos na lista
    const renderProducts = () => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';

      // Itera sobre todos os produtos e os adiciona à lista
      data.forEach((product) => {
        const productDiv = renderProduct(product);
        productList.insertAdjacentHTML('beforeend', productDiv);
      });
    };

    // Função para obter o total de produtos e atualizar o contador
    const getTotalProducts = () => {
      const totalProducts = data.length;
      const total = document.querySelector('#total-products');
      total.textContent = `${totalProducts} produto${totalProducts !== 1 ? 's' : ''}: `;
    };

    // Chamada das funções para iniciar a página
    getTotalProducts();
    await renderProducts();
    updateGrid();

    // Adição de event listeners para interação do usuário
    const itensPerLine = document.getElementById('products-per-row');
    itensPerLine.addEventListener('change', updateGrid);
    window.addEventListener('resize', updateGrid);
  } catch (error) {
    console.error(error);
  }
}

// Chamada da função fetchData para iniciar o processo de exibição dos produtos
fetchData();
