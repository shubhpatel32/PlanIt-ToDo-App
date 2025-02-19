const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    const status = err.status || 400;
    const message = "Please fill in the input properly";
    const extraDetails = err.errors.map((error) => error.message).join(", ");

    res.status(status).json({
      message,
      extraDetails,
    });
  }
};

module.exports = validate;
