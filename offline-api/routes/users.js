var express = require('express');
var router = express.Router();
var Person=require('../bin/model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/save',(req,res)=>{
  //res.render('jkasdhkhasd');
  res.send('respond with a resource jkasdhjkahsdk');
})
// router.post('/save',(req,res)=>{
//   //res.render('jkasdhkhasd');
//   //res.send('respond with a resource jkasdhjkahsdk');
//         console.log("save called");
//   var user=req.body; 
//   var newuser=new Person({
//     title:user.title
//   })

//   newuser.save((err,Person)=>{
//     if(err){
//       console.log("error");
//     }
//   });
//   res.send("Succesfull");
// })

// router.post('/saveoffline',(req,res)=>{
//   //res.render('jkasdhkhasd');
//   //res.send('respond with a resource jkasdhjkahsdk');
//         console.log("save called");
//   var users=req.body; 
//   console.log("users"+JSON.stringify(users));
//   for(user of users){
//   console.log("users"+JSON.stringify(user));  
//   var newuser=new Person({
//     title:user.title
//   })
//   console.log("new title"+user.title);

//   newuser.save((err,Person)=>{
//     if(err){
//       console.log("error");
//     }
//   });
//   }
//   res.send("Succesfull");
// })
router.get('/getall',(req,res)=>{
  myrecords=[];
  //res.render('jkasdhkhasd');
  Person.find({},(err,records)=>{
    if(err){
      console.log(err);
    }
    console.log("records"+records.length);
    for(record of records){
    myrecords.push(record);
    }
     console.log("myrecords"+myrecords.length);
  res.json(myrecords);
    
  });
  //res.send('respond with a resource jkasdhjkahsdk');
  // recordTest=[{
  //     title:"test",
  //   },{
  //     title:"test2"
  //   }];
 
})
router.post('/save',(req,res)=>{
  //res.render('jkasdhkhasd');
  //res.send('respond with a resource jkasdhjkahsdk');
        console.log("save called");
  var user=req.body; 
  console.log("user "+JSON.stringify(user));
  var newuser=new Person({
    title:user.title,
    description:user.description
  })
console.log(newuser);
  newuser.save((err,Person)=>{
    if(err){
      console.log("error");
    }
  });
  res.send("Succesfull");
})

router.post('/saveoffline',(req,res)=>{
  //res.render('jkasdhkhasd');
  //res.send('respond with a resource jkasdhjkahsdk');
        console.log("save called");
  var users=req.body; 
  console.log("users"+JSON.stringify(users));
  for(user of users){
  console.log("users"+JSON.stringify(user));  
  var newuser=new Person({
    title:user.title,
    description:user.description
  })
  console.log("new title"+user);

  newuser.save((err,Person)=>{
    if(err){
      console.log("error");
    }
  });
  }
  res.send("Succesfull");
})


module.exports = router;
