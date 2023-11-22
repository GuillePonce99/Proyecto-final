export class signupDTO {
    constructor(user) {
        this.firstName = user.firstName,
            this.lastName = user.lastName,
            this.age = user.age,
            this.email = user.email,
            this.password = user.password

    }
}

export class userDTO {
    constructor(user) {
        this.firstName = user.firstName,
            this.lastName = user.lastName,
            this.age = user.age,
            this.email = user.email
        this.role = user.role
    }
}
