const Cars = require("./cars-model")
const db = require("../../data/db-config")
const vinValidator = require("vin-validator")

const checkCarId = async (req, res, next) => {
      const {id} = req.params;

      try{
        const car = await Cars.getById(id);
        if(!car){
          res.status(404).json({message: `car with id ${id} is not found`})
        } else{
          next();
        }
      }
      catch(err){
        res.status(500).json({message: "Error retrieving car"})
      }
}

const checkCarPayload = (req, res, next) => {
      const{vin, make, model, mileage} = req.body;
      const badStatus = (status) =>{
         res.status(400).json({message: `${status} is missing`})
      }
      const check = (field) => {
        return (!field || field.length === 0 ? false : true);
      }
      if(!check(vin)){
          badStatus("vin")
      }
      if(!check(make)){
        badStatus("make")
      }
      if(!check(model)){
        badStatus("model")
      }
      if(!check(mileage)){
        badStatus("mileage")
      }
      next();
}

const checkVinNumberValid = (req, res, next) => {
    const vin = req.body.vin
    const isValidVin =vinValidator.validate(vin);
    if(isValidVin){
      next();
    } else{
      res.status(400).json({message: `vin ${vin} is invalid`})
    }
}

const checkVinNumberUnique = (req, res, next) => {
  const vin = req.body.vin
  db("cars")
  .where("vin", vin)
  .then(carList => {
    if(carList.length !==0){
      res.status(400).json({message: `vin ${vin} already exists`})
    } else {
      next();
    }
  })
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
}
