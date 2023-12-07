const btnAddCart = document.querySelectorAll(".btn-addToCart")
const profile = document.getElementById("ul-profile")
const actions = document.getElementById("actions")

//Funcion que una vez generado el perfil, podre cerrar sesion mediante su respectivo boton
const logOut = async () => {

    const btnLogout = document.getElementById("btn-logout")

    if (btnLogout) {
        btnLogout.addEventListener("click", async (e) => {
            const response = await fetch("/api/sessions/logout")
            if (response.ok) {
                Toastify({
                    text: `Se ha cerrado la sesion`,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast()

                setTimeout(() => {
                    window.location.href = `/`;
                }, 3000)

            } else {
                Toastify({
                    text: `Error al cerrar sesion`,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to left, #b00017, #5e1f21)"
                    }
                }).showToast();
            }
        })
    }
}

//Funcion para generar el mensaje de saludo
const saludo = () => {
    let message = profile.dataset.welcome

    Toastify({
        text: `Bienvenido ${message}`,
        duration: 2000,
        className: "info",
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast()

    logOut()
    updateCartNumber()
}


//Funcion para obtener de la BD el Id el carrito
const getCartId = async () => {
    if (profile.dataset.admin !== "true") {
        const response = await fetch("/api/carts/user/cart")

        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            return false
        }
    }
}

//Funcion para actualizar en el DOM el numero de cantidad de productos
const updateCartNumber = async () => {
    const cartContainer = document.getElementById("container-cart")
    const data = await getCartId()

    if (!data) {
        return
    }
    const cart = data.carrito
    let price = []
    let quantity = []
    let element = ""

    cart.products.map((product) => {
        price.push(product.product.price * product.quantity)
        quantity.push(product.quantity)
    })

    let total = price.reduce((acc, currentValue) => acc + currentValue, 0);
    let count = quantity.reduce((acc, currentValue) => acc + currentValue, 0)

    element += `
        <h1>LISTA DE PRODUCTOS</h1>
        <a href="/carts/${data.cartId}" class="btn-cart" id="btn-cart" disabled>
            <div>🛒</div>
            <p  class="counter">${count}</p>
            <p  class="total">$${total}</p>
        </a>
        `
    return cartContainer.innerHTML = element
}

const isAdmin = () => {
    const isAdmin = profile.dataset.admin
    if (isAdmin === "true") {
        console.log("is admin");

        const btnCart = document.getElementById("btn-cart")
        btnCart.setAttribute("disabled", "")
        btnCart.style.opacity = 0.2

        btnAddCart.forEach((btn) => {
            btn.style.opacity = 0.2;
            btn.setAttribute("disabled", "")
        })

    } else {
        console.log("is user");
    }
}
isAdmin()

btnAddCart.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        try {

            e.preventDefault()

            const ul = e.target.closest('ul')

            const productId = ul.dataset.id

            let cart = await getCartId()

            let cartId

            if (!cart) {
                cartId = undefined
            } else {
                cartId = cart.cartId
            }

            if (cartId === undefined) {

                await fetch(`/api/carts`, {

                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }

                }).then(res => res.json()).then(data => {

                    const { id } = data

                    cid = id

                    Toastify({
                        text: `CARRITO N°: ${cid} creado con exito `,
                        duration: 3000,
                        className: "info",
                        close: true,
                        gravity: "top",
                        position: "center",
                        stopOnFocus: true,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast()
                }).catch((error) => {

                    if (error) {

                        Toastify({
                            text: `Error al crear un carrito`,
                            duration: 3000,
                            className: "info",
                            close: true,
                            gravity: "top",
                            position: "center",
                            stopOnFocus: true,
                            style: {
                                background: "linear-gradient(to left, #b00017, #5e1f21)"
                            }
                        }).showToast();

                    }
                })
            }

            cart = await getCartId()
            cartId = cart.cartId

            const result = await fetch(`/api/carts/${cartId}/products/${productId}`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),

            })

            const data = await result.json()
            const error = data.error

            if (result.ok) {
                updateCartNumber()

                Toastify({
                    text: `Agregado exitosamente!`,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "bottom",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }

                }).showToast()

            } else {

                Toastify({
                    text: error,
                    className: "success",
                    close: true,
                    gravity: "bottom",
                    position: "center",
                    style: {
                        background: "linear-gradient(to left, #b00017, #5e1f21)",
                    }
                }).showToast();
            }


        } catch (error) {
            console.log(error);
        }
    })

})

if (actions) {
    const btnAddProduct = document.getElementById("btn-add")
    const btnDeleteProduct = document.getElementById("btn-delete")
    const actionAdd = document.getElementById("action_add");
    const actionDelete = document.getElementById("action_delete");

    btnAddProduct.addEventListener("click", async () => {
        const title = document.getElementById("product_title").value
        const description = document.getElementById("product_description").value
        const code = document.getElementById("product_code").value
        const price = document.getElementById("product_price").value
        const stock = document.getElementById("product_stock").value
        const category = document.getElementById("product_category").value

        const product = {
            title, description, code, price, stock, category
        }

        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })

        if (response.ok) {
            Toastify({
                text: `Agregado exitosamente!`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "bottom",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }

            }).showToast()
            setTimeout(() => {
                location.reload();
            }, 3000)
        } else {
            const data = await response.json()
            actionAdd.innerHTML = `${data.error}`
            setTimeout(() => {
                actionAdd.innerHTML = "";
            }, 2000)
        }

    })

    btnDeleteProduct.addEventListener("click", async () => {
        let idEliminar = document.getElementById("id_eliminar").value
        if (idEliminar === "") {
            idEliminar = null
        }
        const response = await fetch(`/api/products/${idEliminar}`, {
            method: "DELETE",
        })

        if (response.ok) {
            Toastify({
                text: `Producto eliminado!`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "bottom",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }

            }).showToast()
            setTimeout(() => {
                location.reload();
            }, 3000)
        } else {
            const data = await response.json()
            actionDelete.innerHTML = `${data.error}`
            setTimeout(() => {
                actionDelete.innerHTML = "";
            }, 2000)
        }
    })

}

saludo()


