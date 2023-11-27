export function Validator(field, value) {
    const errors = {}
    let regex = ''

    switch (field) {
        case 'empId':
            if (value === '') {
                errors.empId = "Employee Id is required!"
            } else {
                errors.empId = null
            }
            break
        case 'name':
            if (value === '') {
                errors.name = "Name is required!"
            } else {
                errors.name = null
            }
            break
        case 'email':
            //eslint-disable-next-line
            regex = /^\S+@\S+\.\S+$/
            if (value === '') {
                errors.email = "Email is required!"
            } else if (!regex.test(value)) {
                errors.email = "Please enter a valid email!"
            } else {
                errors.email = null
            }

            break;
        case 'phone':
            //eslint-disable-next-line
            regex = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/
            if (value === '') {
                errors.phone = "Phone no. is required!"
            } else if (!regex.test(value)) {
                errors.phone = "Please enter a valid phone no.!"
            } else {
                errors.phone = null
            }
            break
        case 'password':
            if (value === '') {
                errors.password = "Password is required!"
            } else if (value.length < 6) {
                errors.password = "Password must be atleast 6 characters!"
            } else {
                errors.password = null
            }
            break
        default:
            break
    }

    return errors
}