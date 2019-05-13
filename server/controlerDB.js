const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = require('./models/user.model');

let lesson = require('./models/lesson.model');

class Database{

    constructor()
    {
        this._connect();
    }
    //connect database
    async _connect()
    {
       await  mongoose.connect('mongodb://localhost:27017/BTL',
                                {useNewUrlParser: true })
            .then(()=>console.log('Database connection successful'))
            .catch(()=>console.log('Database connection error!!'));
    }
    
    // create new account
    async createAccount(data)
    {
        let {username} = data;
        console.log(username);
        const usernameExists = await user.findOne({username});
        if(usernameExists){
            console.log(usernameExists);
                    return false;
        }

        let newacc = user(data);
        newacc.save();
        return true;
    }

    async login(data)
    {
        let {username, password} = data;
        //console.log(username);
        const userExists = await user.findOne({username,password});
        if(userExists)
        {
            return ({user:username});
        }
        return false;
    }
    
    async newlesson(data)
    {
        console.log(data);
        const newlesson = new lesson({
            title:data.title,
            description:data.description,
            author:data.user,
            cards:data.cards                      
        });
        
        newlesson.save();

        console.log(typeof newlesson._id);
        return({
            success:true,
            lessonID:newlesson._id
        });
        
    }

    async getalllesson(name)
    {
        console.log(name);
        let data;
        await lesson.find({author:name}, (error, lessons)=>{
               if(!error){
                    //console.log({lessonresult:lessons,success:true});
                    data ={lessonresult:lessons,success:true};
                }
                else{
                    console.log("error");
                    data= {success:false,mes:"error"};
                }
        });
        return data;
    }
    async getlessonbyid(id)
    {
        let result;
        await lesson.findById(id,(error, lessons)=>{
            if(error)
            result ={err:error}; 
            else
            result = lessons;
        });
        //console.log(result);
        return result;
    }
    
    async updatecard(data)
    {
        let result;
        await lesson.updateOne({
            "_id": mongoose.Types.ObjectId(req.body.deckId)},
            {$set: {"cards" : data.card}},

            (err)=>{

                if(err){
                    console.log(error)
				    result = {success : false};    
                }else 
                {
                    result = {success : false};   
                }

            });
    }

    async updatelesson(data)
    {
        let result;
        lesson.updateOne({
            "_id": mongoose.Types.ObjectId(req.body.deckId)},
            {$set: {
                        "title": data.title,
                        "description" : data.description,
                        "cards" : data.cards
                    }        
        },
        (err)=>{

            if(err){
                console.log(error)
				result = {success : false};   
            }else 
            {
                result = {success : true};   
            }

        });
    }
}

module.exports = new Database();
