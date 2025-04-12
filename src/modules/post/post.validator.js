const yup = require('yup');


exports.createPostValidator = yup.object({
    description: yup
        .string()
        .max(2200, 'Description can not be more than 2200 character')
        .required('Description is required')
});