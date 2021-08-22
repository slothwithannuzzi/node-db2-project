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
         return false;
      }
      const check = (field, fieldName) => {
        return (!field || field.length === 0 ? badStatus(fieldName) : true);
      }
      if(check(vin, "vin") || check(make, "make") || check(model, "model") || check(mileage, "mileage")){
        next();
      }
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
    if(carList !==0){
      res.status(400).json({message: `vin ${vin} already exists`})
    } else {
      next();
    }
  })
}
