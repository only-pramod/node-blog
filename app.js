const { render } = require('ejs');
const express = require('express');
const app = express();
const mongoose=require('mongoose');
const Blog=require('./models/blogs')

//connect to mongo
const dbURL="mongodb+srv://pramod:pramod123@cluster0.2gpmm.mongodb.net/node-tuts?retryWrites=true&w=majority";
mongoose.connect(dbURL,{ useNewUrlParser: true,useUnifiedTopology: true })
  .then((result) =>app.listen(3000))
  .catch((err) => console.log(err))

app.set('view engine','ejs')

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) =>{
   res.redirect('/blogs')
})

app.get('/about',(req,res) =>{
    res.render('about',{title:'about'})
})

//blog route
app.get('/blogs',(req,res) => {
    Blog.find().sort({createdAt:-1})
    .then((result) => {
        res.render('index',{title:"All Blogs",blogs:result})
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/blogs',(req,res) => {
    const blog= new Blog(req.body);
    blog.save()
    .then((result) => {
        res.redirect('/blogs')
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/blogs/:id',(req,res) => {
    const id=req.params.id;
    Blog.findById(id)
          .then(result => {
              res.render('details',{blog:result,title:"Blog details"})
          })
          .catch(err => {console.log(err);})
})
app.delete('/blogs/:id',(req,res) => {
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result =>{
        res.json({redirect:'/blogs'})
    })
    .catch(err => console.log(err))
})

app.get('/create',(req,res) =>{
    res.render('create',{title:'creat new blog'})
})

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });

