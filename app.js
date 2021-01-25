const { render } = require('ejs');
const express = require('express');
const app = express();
const mongoose=require('mongoose');
const Blog=require('./models/blogs')
require('dotenv/config');
//connect to mongo
// const dbURL="";
mongoose.connect(process.env.db_connection,{ useNewUrlParser: true,useUnifiedTopology: true })
  .then((result) =>{app.listen(3000)
console.log('db connected');
})
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
          .catch(err => res.status(404).render('404', { title: '404' }))
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

