'use strict';

module.exports = {
  up: (models, mongoose) => {
    
      // Add altering commands here.
      // Return a promise to correctly handle asynchronicity.

      // Example:
      return models.user
        
          .insertMany([
           {
            _id : "65d9bb622af666718a1b38f9",
            name: "Adershradhakrishnan",
            email: "adershradhakrishnan07@gmail.com",
            phonenumber: "7034603650",
            
            password: "$2a$04$Fz.QmkBnszB/Lbj7SNoV3ukl/n2gxxzHLrnsCMr8BPBBht0V7huei" //123456789
           }
          ])
        }
            

 down: (models, mongoose) => {
//     /*
//       Add reverting commands here.
//       Return a promise to correctly handle asynchronicity.

//       Example:
     return models.user
   .deleteMany([
    _id :{
      $in: [
        "65d9bb622af666718a1b38f9",
      ]
    }

    
   ])
  }
 };
