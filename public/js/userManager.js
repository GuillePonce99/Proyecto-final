const btnRole = document.querySelectorAll(".btn-changeRole")
const btnDelete = document.querySelectorAll(".btn-delete")
const btnDeleteInactiveUsers = document.getElementById("btn-deleteInactiveUsers")

const usersManager = () => {

    btnRole.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault()
            const ul = e.target.closest('ul')
            const email = ul.dataset.email
            const newRole = document.getElementById("roles").value

            const result = await fetch(`/api/users/premium/${email}/${newRole}`)

            if (result.ok) {
                Toastify({
                    text: `✅`,
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

                setTimeout(() => {
                    location.reload();
                }, 2000)
            } else {
                console.log("not");
            }

        })

    })

    btnDelete.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault()
            const ul = e.target.closest('ul')
            const email = ul.dataset.email

            Swal.fire({
                title: 'Seguro quieres eliminar este usuario?',
                text: "No podras revertir el cambio",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!'
            }).then(async (result) => {
                if (result.isConfirmed) {


                    const result = await fetch(`/api/users/deleteUser/${email}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })

                    if (result.ok) {
                        Swal.fire(
                            'Eliminado!',
                            'El usuario ha sido eliminado.',
                            'success'
                        )

                        setTimeout(() => {
                            location.reload();
                        }, 2000)
                    } else {
                        console.log(not);
                    }

                }
            })

        })
    })

    btnDeleteInactiveUsers.addEventListener("click", async (e) => {
        e.preventDefault()

        const result = await fetch(`/api/users`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (result.ok) {
            console.log("si");
        } else {
            console.log("no");
        }
    })
}
usersManager()
