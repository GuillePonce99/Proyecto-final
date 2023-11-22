import { fakerES_MX as faker } from "@faker-js/faker"

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        stock: faker.string.numeric({ exclude: ["0"] }),
        category: faker.helpers.arrayElements(["Frutas", "Verduras", "Pastas", "Carnes", "Otros"]),
        thumbnails: faker.image.avatar(),
        status: true
    }
}
