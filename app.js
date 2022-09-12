/* Imports */
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const { Int32 } = require("bson");

/* EJS server */
const app=express();
app.set("view engine","ejs");
app.use(
    bodyParser.urlencoded({
        extended:true,
    })
);
app.use(express.static("public"));

/* MongoDB */
try {
    mongoose.connect("mongodb://localhost:27017/Library",
    {
        useNewUrlParser:true,
    });
    console.log("db connected");
} catch (error) {
    console.log(`database error \n ${error}`);
}

/* MongoDB Schema */
const bookSchema={
    title:String,
    subject:String,
    assecssion:String,
    shelf:String,
}

/* Model */
const Book = mongoose.model("Book",bookSchema);

/* CRUD */

// create
app.get("/create",function (req,res) {
    const book = new Book({
    title:req.body.bookTitle,
    subject:req.body.bookSubject,
    assecssion:req.body.bookassecssion,
    shelf:req.body.bookshelf,
    });

    book.save(function (err) {
        if (!err) {
            res.redirect("/");
        }
        console.log("doc created");
    });
});

// read
app.get("/",function (req,res) {
    Book.find({},function (err,books) {
        res.render("home",{
            books:books,
        });
        console.log(posts);
    })
});

// update
app.post("/update/:assecssion",function(req,res){
    const assecssion=req.params.assecssion;
    const updateDocument = async (assecssion) =>{
        try {
            const updateDocument = await Book.findOneAndUpdate(
                {
                    assecssion:assecssion
                },
                {
                    $set:{
                        title:req.body.bookTitle,
                        subject:req.body.bookSubject,
                        assecssion:req.body.bookassecssion,
                        shelf:req.body.bookshelf,
                    },
                },
                {
                    new:true,
                    userFindAndModify:false,
                }
            );
            console.log("update successfull");
        } catch (error) {
            console.log(error);
        }
    };
    updateDocument(assecssion);
});

// delete
app.get("/delete/:assecssion",function (req,res) {
   const assecssion=req.params.assecssion;
   const deleteDocument = async (assecssion) =>{
    try {
        const result = await Book.findOneAndDelete({
            assecssion:assecssion,
        })
    } catch (error) {
        console.log(error);
    }
   }
   deleteDocument(assecssion);
});

/* Server init */
port=3001;
app.listen(port,function(){
    console.log(`server at port :  http://localhost:${port}/`);
});