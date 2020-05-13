module.exports = {

    /* GENERIC */ 

    unknown: (code) => `unknown error, something went wrong - ER${code}`,  
    undefinded: (noun) =>`${noun} is not definded`,
    invalid: (noun) =>`invalid ${noun}!`,
    incorrect: (noun) =>`incorrect ${noun}!`,
    incomplete: (noun) =>`incomplete ${noun}!`,
    completed: (noun) =>`completed ${noun}!`,
    expired: (noun) =>`expired ${noun}!`,
    forbidden: (noun) =>`forbidden ${noun}!`,
    duplicate: (noun) => `${noun} is already in use!`, 
    required: (noun) =>`${noun} required!`,
    login: (noun) =>`welcome back ${noun}!`,
    logout: (noun) =>`goodbye ${noun}, hope to see you again soon!`,
    verified: (noun) =>`${noun} verification complete!`,
    verification_required: (noun) =>`${noun} verification incomplete!`,
    suspended: (noun) =>`${noun} suspended!`,
    disabled: (noun) =>`${noun} disabled`,
    missing: (noun) =>`${noun} missing`,
    confirmed: (noun) =>`${noun} confirmed`,
    confirmation_email: (noun) => `a confirmation email was sent to ${noun}, please follow the instructions to confirm your email.`,
    password_recovery_email: (noun) => `a password recovery email was sent to ${noun}, please follow the instructions to revocer your password.`,
    confirmation_required: (noun) =>`${noun} confirmation required`,
    already_confirmed: (noun) =>`${noun} already confirmed`,
    authorized_login: (noun) =>`successfully authorized ${noun}!`,
    custom: (noun) =>`${noun}`,

    /* CRUD */ 

    created: (noun) =>`successfully created new ${noun}!`,
    create_failed: (noun) =>`faild to create new ${noun}!`,
    updated: (noun) =>`successfully updated ${noun}!`,
    update_faild: (noun) =>`faild to update ${noun}!`,
    deleted: (noun) =>`successfully deleted ${noun}!`,
    delete_faild: (noun) =>`faild to delete ${noun}!`,
    authorized: (noun) =>`successfully authorized ${noun}!`,

    /* JOI */ 
    
    'any.required': ({label}) => `${label} is required`, 
    'string.empty': ({label}) => `${label} is not allowed to be empty`, 
    'string.base': ({label}) => `${label} must be a string`,
    'object.base': ({label}) => `${label} must be an object`, 
    'object.empty': ({label}) => `${label} is not allowed to be empty`, 
    'boolean.base': ({label}) => `${label} must be a boolean`, 
    'boolean.empty': ({label}) => `${label} is not allowed to be empty`, 
    'number.base': ({label}) => `${label} must be a number`, 
    'number.empty': ({label}) => `${label} is not allowed to be empty`, 
    'array.base': ({label}) => `${label} must be an array`, 
    'number.integer': ({label}) => `${label} must be an integer`, 
    'string.email': ({label}) => `${label} must be a valid email`, 
    'string.min': ({label, limit}) => `${label} length must be at least ${limit} characters long`, 
    'string.max': ({label, limit}) => `${label} length must be less than or equal to ${limit} characters long`, 
    'string.length': ({label, limit}) => `${label} length must be exactly equal to ${limit} characters long`, 
    'any.only': ({label, ref}) => `${label} and ${ref} must match`, 

}