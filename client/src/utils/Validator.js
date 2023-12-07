export function Validator(field, value) {
  const errors = {};
  let regex = '';

  switch (field) {
    case 'empId':
      if (value === '') {
        errors.empId = 'Employee Id cannot be empty!';
      } else {
        errors.empId = null;
      }
      break;
    case 'name':
      if (value === '') {
        errors.name = 'Name cannot be empty!';
      } else {
        errors.name = null;
      }
      break;
    case 'email':
      //eslint-disable-next-line
      regex = /^\S+@\S+\.\S+$/;
      if (value === '') {
        errors.email = 'Email cannot be empty!';
      } else if (!regex.test(value)) {
        errors.email = 'Please enter a valid email!';
      } else {
        errors.email = null;
      }

      break;
    case 'phone':
      //eslint-disable-next-line
      regex = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/;
      if (value === '') {
        errors.phone = 'Phone no. cannot be empty!';
      } else if (!regex.test(value)) {
        errors.phone = 'Please enter a valid phone no.!';
      } else {
        errors.phone = null;
      }
      break;
    case 'password':
      if (value === '') {
        errors.password = 'Password cannot be empty!';
      } else if (value.length < 6) {
        errors.password = 'Password must be atleast 6 characters!';
      } else {
        errors.password = null;
      }
      break;
    default:
      break;
  }

  return errors;
}
