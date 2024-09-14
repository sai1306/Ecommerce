const express = require('express');
const app = express();
const router = express.Router(); //global router

const { check, validationResult } = require('express-validator');
require('dotenv').config(); // This will load the .env file
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); 
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send(`server is running on port ${port}`);
})
const UserController = require('./Controllers/UserController.js');
const userController = new UserController();
const SellerController = require('./Controllers/SellerController.js');
const sellerController = new SellerController();
const BuyerController = require('./Controllers/BuyerController.js');
const buyerController = new BuyerController();
const constant = require('./Constant.js');
const middleware = require('./authenticatetoken.js')
//signup route
app.post(
  '/signup',
  [
    check('username').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('role').isIn(['seller', 'buyer']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: constant.FALSE, message: constant.invalidInput });
    }
    userController.userRegistration(req.body)
      .then(result => {
        res.json({
          sucess: constant.TRUE,
          token: result,
          message: "user registered successfully"
        })
      })
      .catch(error => {
        res.json({
          success: constant.FALSE,
          message: error
        })
      })
  }
);

//login route
app.post(
  '/login',
  [
    check('email').isEmail(),
    check('password').exists(),
  ],
  async (req, res) => {
    userController.userLogin(req.body)
      .then(result => {
        res.json({
          sucess: constant.TRUE,
          token: result,
          message: constant.LOGIN_USER_MSG
        })
      })
      .catch(error => {
        res.json({
          success: constant.FALSE,
          message: constant.LOGIN_ERROR_MSG
        })
      })
  }
);

//add product route
app.post('/seller/addProduct/:id', middleware, async (req, res)=>{
  const data = { ...req.body, user: req.user};
  sellerController.addProduct(data)
  .then(result => {
    res.json({
      sucess: constant.TRUE,
      data: result,
      message: constant.ADD_PRODUCT_OK
    })
  })
  .catch(error => {
    res.json({
      success: constant.FALSE,
      message: error
    })
  })

});

//edit product route
app.put('/seller/editProduct', middleware, async (req, res) => {
  
  const {id} = req.query; //accessing product id
  const data = {id, ...req.body, user: req.user};
  sellerController.editProduct(data)
  .then(result => {
    res.json({
      sucess: constant.TRUE,
      data: result,
      message: constant.EDIT_PRODUCT_OK
    })
  })
  .catch(error => {
    res.json({
      success: constant.FALSE,
      message: error
    })
  })

});

//delete product
app.delete('/seller/deleteProduct', middleware, async (req, res) => {
  
  const {id} = req.query; //accessing product id
  const data = {id, user: req.user};
  sellerController.deleteProduct(data)
  .then(result => {
    res.json({
      sucess: constant.TRUE,
      data: result,
      message: constant.DELETE_PRODUCT_OK
    })
  })
  .catch(error => {
    res.json({
      success: constant.FALSE,
      message: error
    })
  })
});

//search products
app.get('/searchProduct', middleware, async (req, res)=>{
  const { name, category } = req.query;
  const data = {name, category};
  buyerController.searchProduct(data)
  .then(result => {
    res.json({
      sucess: constant.TRUE,
      data: result,
      message: constant.PRODUCT_FOUND_OK
    })
  })
  .catch(error => {
    res.json({
      success: constant.FALSE,
      message: error
    })
  })
})

//Add products to cart
app.post('/cart/addProduct', middleware, async (req, res) => {
  const { productId, quantity } = req.body;
  const data = {productId, quantity, user: req.user};
  buyerController.addCartItems(data)
  .then(result => {
    res.json({
      sucess: constant.TRUE,
      data: result,
      message: constant.CART_ITEMS_ADDED_OK
    })
  })
  .catch(error => {
    res.json({
      success: constant.FALSE,
      message: error
    })
  })
});

//Remove products from cart
app.delete('/cart/deleteProduct', middleware, async (req, res)=>{
  const { id, } = req.params;
  const data ={ id, user:req.user };
  buyerController.deleteCartItems(data)
  .then(result => {
    res.json({
      sucess: constant.TRUE,
      data: result,
      message: constant.CART_ITEMS_REMOVED_OK
    })
  })
  .catch(error => {
    res.json({
      success: constant.FALSE,
      message: error
    })
  })
})


