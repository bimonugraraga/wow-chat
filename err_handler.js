async function errHandle (err, req, res, next) {
  console.log('====================================');
  console.log(err);
  console.log('====================================');
  if (err.code && err.code != 500) {
    res.status(err.code).json({
      status: err.code,
      message: err.message,
    });
  } else if (err.name === 'SequelizeValidationError') {
    let messages = [];
    for (let error in err.errors) {
      messages.push(err.errors[error].message)
    }
    res.status(400).json({
      status: 400,
      messages,
    });
  }else if(err.name === 'ParameterMissingError'){
    res.status(400).json({
      status: 400,
      message: err.message
    })
  } else if(err.name === 'SequelizeUniqueConstraintError'){
    res.status(400).json({
      status: 400,
      message: err.message
    })
  } else if (err.name === 'JsonWebTokenError'){
    res.status(401).json({
      status: 401,
      message: "Invalid Token"
    })
  } else{
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

module.exports = errHandle