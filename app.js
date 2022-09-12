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
app.get("/create",function(req,res){
    res.render("create");
});

app.post("/create",function (req,res) {
    const book = new Book({
    title:req.body.bookTitle,
    subject:req.body.bookSubject,
    assecssion:req.body.bookAssecssion,
    shelf:req.body.bookShelf,
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
        console.log(books);
    })
});

// update
app.get("/update/:bookid",function (req,res) {
    const requestedbookId = req.params.bookid;
    Book.findOne({
        _id: requestedbookId
    },
    function (err,book) {
        res.render("update",
    {
        bookid:book._id,
        title: book.title,
        subject: book.subject,
        assecssion: book.assecssion,
        shelf: book.shelf,
    });
    });
    
});
app.post("/update/:bookid",function(req,res){
    const bookid=req.params.bookid;
    const updateDocument = async (bookid) =>{
        try {
            const updateDocument = await Book.findOneAndUpdate(
                {
                    _id:bookid
                },
                {
                    $set:{
                        title:req.body.bookTitle,
                        subject:req.body.bookSubject,
                        assecssion:req.body.bookAssecssion,
                        shelf:req.body.bookShelf,
                    },
                },
                {
                    new:true,
                    userFindAndModify:false,
                }
            );
            res.redirect("/");
            console.log("update successfull");
        } catch (error) {
            console.log(error);
        }
    };
    updateDocument(bookid);
});

// delete
app.get("/delete/:bookid",function (req,res) {
   const bookid=req.params.bookid;
   const deleteDocument = async (bookid) =>{
    try {
        const result = await Book.findByIdAndDelete({
            _id:bookid,
        });
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
   }
   deleteDocument(bookid);
});

/* Server init */
port=3001;
app.listen(port,function(){
    console.log(`server at port :  http://localhost:${port}/`);
});