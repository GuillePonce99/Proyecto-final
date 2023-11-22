const btnSignup = document.getElementById("btn-signup");
const btnLogin = document.getElementById("btn-login");
const btnForgot = document.getElementById("btn-forgot");
const btnNewPassword = document.getElementById("btn-newPass")

const signup = async (firstName, lastName, age, email, password) => {
    const response = await fetch(`/api/sessions/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, age, email, password }),
    })

    if (response.ok) {
        return true
    } else {
        const data = await response.json()
        return data.name
    }
}

const login = async (email, password) => {

    const response = await fetch(`/api/sessions/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
        return true
    } else {
        const data = await response.json()
        return data.name
    }
}

const forgot = async (email) => {
    try {
        const response = await fetch(`/api/sessions/forgot`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })

        if (response.ok) {
            return true
        } else {
            const data = await response.json()
            return data.name
        }

    }
    catch (error) {
        console.log(error);
    }

}

const newPass = async (email, newPassword) => {

    try {
        const response = await fetch(`/api/sessions/newPassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        })

        if (response.ok) {
            return true
        } else {
            const data = await response.json()
            return data.name
        }

    }
    catch (error) {
        console.log(error);
    }

}

if (btnSignup) {

    btnSignup.addEventListener("click", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("first_name").value
        const lastName = document.getElementById("last_name").value
        const age = document.getElementById("age").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        const result = await signup(firstName, lastName, age, email, password)

        if (result === true) {
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
                window.location.href = `/`;
            }, 2000)



        } else {
            Toastify({
                text: `${result}`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)",
                }
            }).showToast()
        }


    });
} else if (btnLogin) {

    btnLogin.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        const result = await login(email, password)

        if (result === true) {
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
                window.location.href = `/products`;
            }, 2000)

        } else {
            Toastify({
                text: `${result}`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)",
                }
            }).showToast()
        }

    });
} else if (btnForgot) {

    btnForgot.addEventListener("click", async (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value

        const result = await forgot(email)

        if (result === true) {
            Toastify({
                text: `Se ha enviado un correo`,
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

        } else {
            Toastify({
                text: `${result}`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)",
                }
            }).showToast()
        }

    })
} else if (btnNewPassword) {
    btnNewPassword.addEventListener("click", async (e) => {
        e.preventDefault()

        const email = document.getElementById("email").textContent
        const newPassword = document.getElementById("newPassword").value
        const newPasswordTwo = document.getElementById("newPasswordTwo").value

        if (newPassword === newPasswordTwo) {
            const result = await newPass(email, newPassword)

            if (result === true) {
                Toastify({
                    text: `Cambio realizado!`,
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
                    window.location.href = `/`;
                }, 2000)
            } else {
                Toastify({
                    text: `${result}`,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to left, #b00017, #5e1f21)",
                    }
                }).showToast()
            }
        } else {
            Toastify({
                text: `Las contraseñas no coinciden`,
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

