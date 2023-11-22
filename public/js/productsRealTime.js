const socket = io()

const productoTitle = document.getElementById("producto_title")
const productoDescription = document.getElementById("producto_description")
const productoCode = document.getElementById("producto_code")
const productoPrice = document.getElementById("producto_price")
const productoStock = document.getElementById("producto_stock")
const productoCategory = document.getElementById("producto_category")
const boton = document.getElementById("boton");
const actionAdd = document.getElementById("action_add");
const idEliminar = document.getElementById("id_eliminar")
const btnEliminar = document.getElementById("btn_eliminar");
const actionDelete = document.getElementById("action_delete");

//render lista productos

socket.on("lista_productos_db", (data) => {
    let form = document.getElementById("form-real-time");
    let element = "";

    data.forEach((product) => {
        element += `
      <ul class="ul-dos">
        <li class="idTitle">${product.code}</li>
        <li><strong>${product.title}</strong></li>
        <li>${product.description}</li>
        <li>$ ${product.price}</li>
        <li>${product.stock}</li>
        <li>${product.category}</li>
      </ul>`;
    });
    form.innerHTML = element;
});

//agregar producto

boton.addEventListener("click", () => {

    socket.emit("agregar_producto_db", {
        title: productoTitle.value,
        description: productoDescription.value,
        code: productoCode.value,
        price: productoPrice.value,
        stock: productoStock.value,
        category: productoCategory.value
    })
    actionAdd.innerHTML = ``
})

socket.on("action", (data) => {

    if (data.incomplete) {
        actionAdd.innerHTML = `<p>Complete todos los datos</p>`

    } else if (data.repeated) {
        actionAdd.innerHTML = `<p>El codigo esta repetido.</p>`
    } else {
        actionAdd.innerHTML = `<p>Producto agregado!!</p>`
    }

    setTimeout(() => {
        actionAdd.innerHTML = ``
    }, 3000)


})

//eliminar producto

btnEliminar.addEventListener("click", () => {
    const code = idEliminar.value
    socket.emit("eliminar_producto_db", code)
    actionDelete.innerHTML = ""
})

socket.on("action_delete", (data) => {

    if (data.notFound) {
        actionDelete.innerHTML = `<p>Not Found</p>`

    } else {
        actionDelete.innerHTML = `<p>Producto eliminado!!</p>`
    }

    setTimeout(() => {
        actionDelete.innerHTML = ``
    }, 3000)
})