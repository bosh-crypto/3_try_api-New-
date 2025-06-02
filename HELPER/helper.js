exports.firstErrorValidatorjs = (validator) => {
  return Object.values(validator.errors.all())[0][0];
};


