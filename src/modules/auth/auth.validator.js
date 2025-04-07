const yup = require("yup");


exports.registerValidationSchema = yup.object({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required!'),
    username: yup
        .string()
        .min(3, 'Must be minimum 3 character')
        .max(15, 'Must be maximum 15 character')
        .required('Username is required!'),
    name: yup
        .string()
        .min(3, 'Must be minimum 3 character')
        .max(15, 'Must be maximum 15 character')
        .required('Name is required!'),
    password: yup
        .string()
        .min(7, 'Must be minimum 7 character')
        .max(20, 'Must be maximum 20 character')
        .required('password is required!'),
});

exports.loginValidationSchema = yup.object({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required!'),
    password: yup
        .string()
        .min(7, 'Must be minimum 7 character')
        .max(20, 'Must be maximum 20 character')
        .required('password is required!'),
});