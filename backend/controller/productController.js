import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
  const keyword=req.query.keyword ? {name:{$regex:req.query.keyword,$options:'i'}}:{}
  
  const products = await Product.find({...keyword});
  res.json(products);
});

const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  }
  res.send(404).json({ message: "Product not found" });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

//decs Create a new review
//route POST/api/products/:id/reviews
//access Private

const createdProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed= product.reviews.find(
      (review)=>review.user.toString()=req.user._id.toString()
    )

    if(alreadyReviewed){
      res.status(400)
      throw new Error("Product already reviewed")
    }

    const review={
      name:req.user.name,
      rating: Number(rating),
      comment,
      user:req.user._id
    }

    product.reviews.push(review)
    product.numReviews=product.reviews.length

    product.rating= product.reviews.reduce((acc,review)=>acc+review.rating,0)/product.reviews.length

    await product.save()
    res.status(201).json({message:'Review added'})

  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({}).sort({rating:-1}).limit(4)
  res.status(200).json(product)
  
});

export {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  createdProductReview,
  getTopProducts
};
