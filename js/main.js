class Renderer {
  initData() {
    this.categoryDropdown = document.getElementById('category');
    this.productDropdown = document.getElementById('product');
    this.markDropdown = document.getElementById('mark');

    this.fetchData();
  }

  populateDropdown(dropdown, options) {
    options.forEach(option => dropdown.remove(option));
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option.name;
      dropdown.appendChild(optionElement);
    });
  }

  populateAllDropdowns() {
    this.populateDropdown(this.categoryDropdown, this.data.categories);
    this.populateDropdown(this.productDropdown, this.actualCategory.products);
    this.populateDropdown(this.markDropdown, this.actualProduct.marks);
  }

  updateSelectedValues(){
    Array.from(this.categoryDropdown.options).forEach(option =>
        option.selected = option.textContent === this.actualCategory.name
    );
    Array.from(this.productDropdown.options).forEach(option =>
      option.selected = option.textContent === this.actualProduct.name
    );
    Array.from(this.markDropdown.options).forEach(option =>
      option.selected = option.textContent === this.actualMark.name
    );
  }

  async fetchData() {
    const response = await fetch('./data.json');
    this.data = await response.json();
    this.actualCategory = this.data.categories[0];
    this.actualProduct = this.actualCategory.products[0];
    this.actualMark = this.actualProduct.marks[0];
    this.populateAllDropdowns();
    this.updateSelectedValues();
    this.initGraph();
  }

  handleDropdownChange() {
    const selectedCategory = this.getSelected(this.categoryDropdown.options);
    const selectedProduct = this.getSelected(this.productDropdown.options);
    const selectedMark = this.getSelected(this.markDropdown.options);

    if(this.actualCategory.name !== selectedCategory) {
      this.data.categories.forEach(category => {
        if(category.name === selectedCategory)
          this.actualCategory = category;
      });
      this.actualProduct = this.actualCategory.products[0];
      this.actualMark = this.actualProduct.marks[0];
    }
    else if(this.actualProduct.name !== selectedProduct) {
      this.actualCategory.products.forEach(product => {
        if(product.name === selectedProduct)
          this.actualProduct = product;
      });
      this.actualMark = this.actualProduct.marks[0];
    }
    else
      this.actualProduct.marks.forEach(mark => {
        if(mark.name === selectedMark)
          this.actualMark = mark;
      });
    this.populateAllDropdowns();
    this.updateSelectedValues();
    this.updateGraph();
  }

  getSelected(options) {
    var result;
    Array.from(options).forEach(option => {
      if(option.selected) {
        result = option.textContent;
      }
    })
    return result;
  }

  initGraph() {
    const ctx = document.getElementById('myChart').getContext('2d');

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May',
        'June', 'July', 'September', 'October', 'November', 'December'],
      datasets: [{
        label: 'Sales',
        data: this.actualMark.sells,
        borderColor: 'rgba(0, 123, 255, 1)', // Set the line color
        backgroundColor: 'rgba(0, 123, 255, 0.4)', // Set the fill color
        tension: 0.4 // Set the curve tension (0 to 1)
      }]
    };

    // Create the line chart
    const myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.chart = myChart;
  }

  updateGraph() {
    this.chart.destroy();
    this.initGraph();
  }
}

const renderer = new Renderer();
renderer.initData();

renderer.categoryDropdown.addEventListener('change', () => renderer.handleDropdownChange());
renderer.productDropdown.addEventListener('change', () => renderer.handleDropdownChange());
renderer.markDropdown.addEventListener('change', () => renderer.handleDropdownChange());
