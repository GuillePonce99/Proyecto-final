const btnIncrease = document.querySelectorAll(".btn-increase")
const btnDecrease = document.querySelectorAll(".btn-decrease")
const cartIdElem = document.getElementById("title-cart")
const quantityElem = document.querySelectorAll("#elem-quantity")
const btnDelete = document.querySelectorAll("#btn-delete")
const totalElem = document.getElementById("total-cart")
const btnVolver = document.getElementById("btnVolver")

const purchase = async () => {
    const btnBuy = document.getElementById("btn-buy")

    const cart = await getCartId()
    const cid = cart.cartId

    btnBuy.addEventListener("click", async (e) => {

        e.preventDefault()
        const code = RandomCode(10)
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        })

        if (response.ok) {
            const data = await response.json()

            if (data.ids.length > 0) {
                Toastify({
                    text: `Algunos productos no estan disponibles`,
                    duration: 2500,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to left, #b00017, #5e1f21)",
                    }
                }).showToast()
            } else {
                Toastify({
                    text: `Compra finalizada!`,
                    duration: 2500,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast()

            }
            await fetch(`/api/tickets/sendTicket/${data.ticket.code}`).catch(error => console.log(error))

            setTimeout(() => {

                location.reload()
            }, 2500)


        } else {
            Toastify({
                text: `Productos sin stock!`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)",
                }
            }).showToast()
        }
    })

}

const RandomCode = (n) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

const getCartId = async () => {

    const response = await fetch("/api/carts/user/cart")

    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        return false
    }
}

const updateTotal = async () => {
    const data = await getCartId()
    const cart = data.carrito
    const price = []
    cart.products.map((product) => {
        price.push(product.product.price * product.quantity)
    })
    let total = price.reduce((acc, currentValue) => acc + currentValue, 0);
    totalElem.innerHTML = `
        <h2 class="total-cart"> TOTAL: $ ${total}</h2>
        <button class="btn-ptr btn-buy" id="btn-buy" type="submit">FINALIZAR COMPRA</button>
    `
    await purchase()
}
updateTotal()


const updateQuantityDom = (id, n) => {

    const boton = Array.from(quantityElem).find((e) => (e.dataset.id) === id)
    let element = ""
    element += `<p>${n}<p>`
    boton.innerHTML = element
}

const getQuantity = async (id) => {
    const data = await getCartId()
    const cart = data.carrito
    const product = cart.products.find((e) => e.product._id === id)
    return product.quantity
}

btnIncrease.forEach(btn => {


    btn.addEventListener("click", async (e) => {

        const ul = e.target.closest('ul')

        const cartId = cartIdElem.getAttribute("cartId")
        const productId = ul.dataset.id
        const quantity = await getQuantity(productId)

        await fetch(`/api/carts/${cartId}/products/${productId}`, {

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "quantity": 1 }),

        })

        updateQuantityDom(productId, quantity + 1)
        updateTotal()

        Toastify({
            text: `Actualizado!`,
            duration: 1000,
            className: "info",
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast()

    })
});

btnDecrease.forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const ul = e.target.closest('ul')

        const cartId = cartIdElem.getAttribute("cartId")
        const productId = ul.dataset.id
        const quantity = await getQuantity(productId)

        if (Number(quantity) > 1) {
            await fetch(`/api/carts/${cartId}/products/${productId}`, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "quantity": -1 }),

            })

            updateQuantityDom(productId, quantity - 1)
            updateTotal()

            Toastify({
                text: `Actualizado!`,
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

        } else {

            Toastify({
                text: `:(`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)"
                }
            }).showToast()

        }
    })
});

btnDelete.forEach(btn => {
    btn.addEventListener("click", async (e) => {

        const ul = e.target.closest("ul")
        const productId = ul.dataset.id
        const cartId = cartIdElem.getAttribute("cartId")

        Swal.fire({
            title: 'Seguro quieres eliminar el producto?',
            text: "No podras revertir el cambio",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Eliminado!',
                    'El producto ha sido eliminado.',
                    'success'
                )

                await fetch(`/api/carts/${cartId}/products/${productId}`, {

                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                ul.remove()
                updateTotal()
                purchase()

            }
        })

    })
})



