export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, received ${user?.firstName}
    * last_name  : needs to be a String, received ${user?.lastName}
    * email      : needs to be a String, receibed ${user?.email}`
}

export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title      : needs to be a String, received ${product?.title}
    * description: needs to be a String, received ${product?.description}
    * code       : needs to be a String, received ${product?.code}
    * price      : needs to be a Number, received ${product?.price}
    * category   : needs to be a String, received ${product?.category}`
}