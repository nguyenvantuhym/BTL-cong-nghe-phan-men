const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const app = express();
const port = 3030;

app.listen(port,()=>{
    console.log("hello");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

let database = require('./controlerDB');
//method post create account
app.post('/createAcount',async (req,res)=>{

    //console.log(newuser);
     let result = await database.createAccount(req.body);
   
    res.json({status:result});
});
//method post login 
app.post('/login',async (req,res)=>{
    console.log(req.body);
     let result = await database.login(req.body);
    
    if(result.user)
    {
        //create session login 
		req.session.user = result.user;
        console.log(result.user+" da dang nhap!!!");
		req.session.save();
 
    res.json({
			success: true
		});
    }
else
res.json({
			success: false
		});
   
});


app.get("/getstatus",(req,res)=>{
console.log(req.session.user);
    if(req.session.user)
    {
        console.log(req.session.user);
        res.json({login:true});
    }
    else
    res.json({login:false});
    
});




app.post("/newlesson", async (req,res)=>{
    if(req.session.user)
    {
        console.log(req.session.user);
        let data = {...req.body,user:req.session.user};
        const result  = await database.newlesson(data);
        res.json({result});
    }
else
    res.json({status:"login"});
    
});

app.get("/alllesson", async (req,res)=>{
   let name = req.session.user;
    if(req.session.user)
    {
        let result = await database.getalllesson(name);  
        res.json(result);
        
    }
else
    res.json({err:true});
    

});

app.post("/getlessonbyid",async (req,res)=>{
     if(req.body.id)
     {
        let result = await database.getlessonbyid(req.body.id);
        if(result.err)
        {
            res.json({message:"error"});
        }else
        {
            //console.log(result);
            res.json(result);
        }
     }
        else res.json({message:"error"});

});

app.post('/updatelesson',async(req,res)=>{
    if(req.session.user)
    {
        let result = await database.updatelesson(req.body);
        res.json(result);
    }
});

app.post('/updatecard',async(req,res)=>{
    if(req.session.user)
    {
        let result = await database.updatecard(req.body);
        res.json(result);
    }
});



