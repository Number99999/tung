const port =3001;
const express =require ("express");
const app = express();
const moongoose = require ("mongoose");
const jwt = require("jsonwebtoken");
const multer = require ("multer");
const path = require ("path");
const cors = require ("cors");
const { error } = require("console");
const { ppid } = require("process");
const { type } = require("os");

app.use(express.json());
app.use(cors());

moongoose.connect("mongodb://localhost:27017/Shop_BE");

// Api Creation

app.get("/", (req ,res)=>{
    res.send("Express app is running")
})

// Image sotrage engine
 const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
 });

 const upload = multer({storage:storage})
 // Schema for create product

 const Product =moongoose.model("Product",{
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
        
    },
    category: {
        type: [String],
        require: true,
    },
    product_type: {
        type: String,
        require: true,
    },
    image: {
        type: String ,
        require: true ,
    },
    new_price: {
        type: Number,
        require: true,
    },
    old_price: {
        type: Number,
        require: true,
    },
    size: {
        type: [String], 
        require: true,
    },
    color: {
        type: [String], 
        require: true,
    },
 })

app.post('/addproduct', async(req, res)=>{
    let products= await Product.find({});
    let id;
    if(products.length>0) {
        let last_product_array = products.slice(-1);
        let last_product =last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id =1;

    }
    const product = new Product({
        id: id,
        name : req.body.name,
        image : req.body.image,
        category: req.body.category,
        product_type: req.body.product_type,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        size: req.body.size,
        color: req.body.color,

    });
    console.log(product);
    await product.save();
    console.log("Save");
    res.json({
        success:true,
        name: req.body.name,
    }) 
})


// Create Upload
app.use('/images',express.static('upload/images'))
app.post("/upload", upload.single('product'),(req, res)=>{
    res.json({
        success: 1,
        imange_url: `http://localhost:${port}/images/${req.file.filename}`,
    })
})

//Creating API for deleting Products

app.post('/removeproduct', async (req,res)=> {
     await Product.findOneAndDelete({id: req.body.id});
     console.log("removed");
     res.json({
        success:true,
        name: req.body.name,
     })
})

// Creating API for getting all Product

app.get('/allproducts', async(req, res)=>{
    let products = await Product.find({});
    console.log ("All product");
    res.send(products);
    
})

// Start server
app.listen(port, (error)=>{
    if(!error){
        console.log("server is running on port: " + port)
    }
    else {
        console.log("Error:" +error)
    }
});

