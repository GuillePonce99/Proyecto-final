import utils from "../../../utils.js"

export default class ProductManager {
    products;
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async addProduct(productoBody) {
        this.products = await this.getProducts();
        const codeRepetido = this.products.some((e) => e.code === productoBody.code)
        if (codeRepetido) {
            return false

            /* 
            let error = new Error(`Ya existe el producto con el CODE: ${productoBody.code}`);
            error.statusCode = 400
            throw error;
            */

        } else {
            this.products.push({ id: this.products.length ? this.products[this.products.length - 1].id + 1 : 1, ...productoBody })
            await utils.write(this.path, this.products);
        }

    };


    async getProducts() {
        try {
            let data = await utils.read(this.path)
            return data
        }
        catch (error) {
            return console.log(error);
        }
    }

    async getProductsById(id) {
        this.products = await this.getProducts();
        const productsFilter = this.products.find((product) => product.id == id)
        if (productsFilter == undefined) {
            let error = new Error(`No existe el producto con el ID: ${id}`)
            error.statusCode = 400
            throw error;
        }

        return productsFilter

    }

    async deleteProduct(id) {
        this.products = await this.getProducts();
        const productsFilter = this.products.find((product) => product.id == id)
        if (productsFilter == undefined) {
            return false
            /*
            let error = new Error(`No existe el producto con el ID: ${id}`)
            error.statusCode = 400
            throw error;
            */
        } else {
            this.products = this.products.filter(e => e.id !== id)
            await utils.write(this.path, this.products)
        }
    }

    async updateProduct(id, cambio) {
        this.products = await this.getProducts()
        let productUpdate = this.products.find(e => e.id === id)
        if (productUpdate == undefined) {
            let error = new Error('Not Found');
            error.statusCode = 400
            throw error;
        }

        if (Object.keys(cambio).includes('id')) {
            let error = new Error('No se puede modificar el ID')
            error.statusCode = 400
            throw error;
        }

        if (Object.keys(cambio).includes("code")) {
            let codigoRepetido = this.products.some(e => e.code === cambio.code)
            if (codigoRepetido) {
                let error = new Error(`Ya existe el producto con el ID: ${cambio.code}`)
                error.statusCode = 400
                throw error;
            }
        }

        let productIndex = this.products.findIndex(e => e.id === id)
        this.products[productIndex] = { ...this.products[productIndex], ...cambio }

        await utils.write(this.path, this.products)
    }

    async getProductsView(limit, page, sort, query, req, res) {

        try {
            let data = await utils.read(this.path)
            return data
        }
        catch (error) {
            return console.log(error);
        }
    }
}
