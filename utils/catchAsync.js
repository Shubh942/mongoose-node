module.exports = fn => {
    return (req, res, next) => {
      // console.log("kfnv")
      // console.log(next)
      // console.log("kfnv")
      fn(req, res, next).catch(next);
    };
  };
  