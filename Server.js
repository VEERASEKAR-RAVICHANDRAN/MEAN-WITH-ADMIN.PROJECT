const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const cors =require('cors')
const port = 3000; 

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/your_database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, unique: true, required: true },
  dateOfBirth: String,
});

const ProductSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String, // This will store the Base64 string
    description: String,
    stock: Number,
  });
  

const OrderSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
//   shippingAddress: {
//     street: {type:String,default:'oo'},
//     city: {type:String,default:'00'},
//     state: {type:String,default:'oo'},
//     postalCode: {type:String,default:'oo'},
//     country: {type:String,default:'oon'},
//   },
  paymentMethod: String,
  totalAmount: Number,
  status: { type: String, default: 'pending' },
  paymentStatus: { type: String, default: 'pending' },
  orderDate: { type: Date, default: Date.now },
});

// const foodTimingSchema = new mongoose.Schema({
//     time: {
//       type: String,
//       required: true,
//       enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
//     },
//     type: {
//       type: String,
//       required: true,
//       enum: ['Veg', 'Non-Veg'],
//     },
//   });
const foodTimingSchema = new mongoose.Schema({
    timing: { type: String, required: true },
    foodType: { type: String, required: true },
  });
  
const BannerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bannerImage: { type: String, required: true },
    description: String,
  });
  
const Banner = mongoose.model('Banner', BannerSchema);
const FoodTiming = mongoose.model('FoodTiming', foodTimingSchema);
const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);


// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads')); // Destination folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Unique file name
    }
  });
  
  // File filter for image files
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  };
  
  // Initialize multer with storage and file filter
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
  });
  
  // For posting products
//   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

app.post('/api/products', upload.single('productImage'), async (req, res) => {
    try {
      const { name, category, price, description, stock } = req.body;
  
      if (!name || !category || !price || !stock) {
        return res.status(400).json({ error: 'Invalid input. Please check the provided data.' });
      }
  
      let productImage = null;
  
      // Convert the image file to Base64
      if (req.file) {
        const imageBuffer = req.file.buffer; // The raw buffer from multer
        productImage = imageBuffer.toString('base64');
      }
  
      // Create a new product
      const product = new Product({
        name,
        category,
        price,
        description,
        stock,
        image: productImage,
      });
  
      await product.save();
      res.status(201).json({
        productId: product._id,
        message: 'Product added successfully',
        productImage: productImage ? 'Image stored in database' : 'No image uploaded',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  });
  
  app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, price, description, stock } = req.body;
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, category, price, description, stock },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error updating product.' });
    }
  });
  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product.' });
    }
  });
  
//   app.put('/api/products/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, category, price, description, stock } = req.body;
  
//     try {
//       const updatedProduct = await Product.findByIdAndUpdate(
//         id,
//         { name, category, price, description, stock },
//         { new: true }
//       );
  
//       if (!updatedProduct) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
  
//       res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//     } catch (error) {
//       res.status(500).json({ error: 'Error updating product.' });
//     }
//   });
  
//   app.delete('/api/products/:id', async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       const deletedProduct = await Product.findByIdAndDelete(id);
//       if (!deletedProduct) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
  
//       res.status(200).json({ message: 'Product deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Error deleting product.' });
//     }
//   });


//banner api
app.post('/api/banners', upload.single('bannerImage'), async (req, res) => {
    const { name, description } = req.body;
  
    if (!name || !req.file) {
      return res.status(400).json({ error: 'Name and banner image are required.' });
    }
  
    try {
      const banner = new Banner({
        name,
        description,
        bannerImage: req.file.path,
      });
  
      await banner.save();
      res.status(201).json({ message: 'Banner created successfully', banner });
    } catch (error) {
      res.status(500).json({ error: 'Error creating banner.' });
    }
  });
  
  app.get('/api/banners', async (req, res) => {
    try {
      const banners = await Banner.find();
      res.status(200).json({ banners });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching banners.' });
    }
  });
  
  app.put('/api/banners/:id', upload.single('bannerImage'), async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedData = { name, description };
  
    if (req.file) {
      updatedData.bannerImage = req.file.path;
    }
  
    try {
      const updatedBanner = await Banner.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedBanner) {
        return res.status(404).json({ error: 'Banner not found' });
      }
  
      res.status(200).json({ message: 'Banner updated successfully', updatedBanner });
    } catch (error) {
      res.status(500).json({ error: 'Error updating banner.' });
    }
  });
  
  app.delete('/api/banners/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedBanner = await Banner.findByIdAndDelete(id);
      if (!deletedBanner) {
        return res.status(404).json({ error: 'Banner not found' });
      }
  
      res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting banner.' });
    }
  });

// For Registration-->(working)

function validateRegistrationInput(data) {
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    // const dateOfBirthRegex = /^\d{4}-\d{2}-\d{2}$/;
    const dateOfBirthRegex = /^\d{4}-\d{2}-\d{2}$/;
  
    const errors = [];
  
    if (!usernameRegex.test(data.username)) {
      errors.push('Username must be alphanumeric and between 4 to 20 characters.');
    }
  
    if (!passwordRegex.test(data.password)) {
      errors.push('Password must have at least 8 characters, including one uppercase letter, one number, and one special character.');
    }
  
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email address format.');
    }
  
    if (data.phoneNumber && !phoneRegex.test(data.phoneNumber)) {
      errors.push('Phone number must match the format 123-456-7890.');
    }
  
    if (data.dateOfBirth && !dateOfBirthRegex.test(data.dateOfBirth)) {
      errors.push('Date of birth must be in DD-MM-YYYY format.');
    }
  
    if (data.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
  
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
  
      if (age < 13) {
        errors.push('User must be at least 13 years old.');
      }
    }
  
    return errors;
  }
  

  app.post('/api/register', async (req, res) => {
    const { username, password, email, firstName, lastName, phoneNumber, dateOfBirth } = req.body;
  
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Invalid input. Please check the provided data.' });
    }
  
    const validationErrors = validateRegistrationInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, email, firstName, lastName, phoneNumber, dateOfBirth });
      await user.save();
      res.status(201).json({ userId: user._id, message: 'Registered successfull.....' });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ error: 'Username or email already exists.' });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
      }
    }
  });
  

// For Login-->(working)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
  
      const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
      res.status(200).json({ token, expiresIn: 3600, userId: user._id });
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  });

// For Getting All Products-->(working)
app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  });
  

// For Placing Order-->(working)
app.post('/api/orders', async (req, res) => {
  const { userId, products,  paymentMethod, totalAmount } = req.body;
  if (!userId || !products  || !paymentMethod || !totalAmount) {
    console.log(req.body);
    return res.status(400).json({ error: 'Invalid input. Please check the provided data.' });
  }
  try {
    const order = new Order({ userId, products, paymentMethod, totalAmount });
    await order.save();
    res.status(201).json({ orderId: order._id, status: order.status, message: 'Order placed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
});

// For Displaying Placed Order-->(working)

app.get('/api/orders', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    try {
      const orders = await Order.find({})
        .skip((page - 1) * limit) // Skip orders for previous pages
        .limit(Number(limit)); // Limit the number of orders per page
  
      const total = await Order.countDocuments(); // Total number of orders
      res.status(200).json({
        orders,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit), // Calculate total pages
      });
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  });
  
  app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Expecting partial order object with fields to update
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate(id, updates, { new: true });
  
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found.' });
      }
  
      res.status(200).json({ order: updatedOrder, message: 'Order updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the order.' });
    }
  });
  app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);
  
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found.' });
      }
  
      res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the order.' });
    }
  });
  app.post('/api/orders/delete-multiple', async (req, res) => {
    const { ids } = req.body; // Array of order IDs to delete
  
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input. Provide an array of order IDs.' });
    }
  
    try {
      const result = await Order.deleteMany({ _id: { $in: ids } });
  
      res.status(200).json({
        message: `${result.deletedCount} orders deleted successfully.`,
      });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting orders.' });
    }
  });
      
  
// app.get('/api/orders', async (req, res) => {
//   const {  page = 1, limit = 10 } = req.query;
// //   if (!userId) {
// //     return res.status(400).json({ error: 'Invalid input. Please check the provided parameters.' });
// //   }
//   try {
//     const orders = await Order.find({  })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));
//     const total = await Order.countDocuments({  });
//     res.status(200).json({ orders, total, page: Number(page), limit: Number(limit) });
//   } catch (error) {
//     res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
//   }
// });

// //get users
// app.get('/api/orders', async (req, res) => {
//     const { page = 1, limit = 10 } = req.query;
  
//     try {
//       const orders = await Order.find({})
//         .populate('products.productId') // Populate product details
//         .skip((page - 1) * limit)
//         .limit(Number(limit));
  
//       const total = await Order.countDocuments({});
//       res.status(200).json({ orders, total, page: Number(page), limit: Number(limit) });
//     } catch (error) {
//       res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
//     }
//   });
  





//user api---->(working)

app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({}, 'username email firstName lastName phoneNumber');
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  });
  
  app.post('/api/users', async (req, res) => {
    const { username, email, firstName, lastName, phoneNumber } = req.body;
    try {
      const user = new User({ username, email, firstName, lastName, phoneNumber });
      await user.save();
      res.status(201).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Error adding user.' });
    }
  });
  
  app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Error updating user.' });
    }
  });
  
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });
    
//food timing
app.get('/api/food-timings', async (req, res) => {
    try {
      const foodTimings = await FoodTiming.find();
      res.json({ foodTimings });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching food timings' });
    }
  });
app.post('/api/food-timings', async (req, res) => {
    const { timing, foodType } = req.body;
  
    if (!timing || !foodType) {
      return res.status(400).json({ message: 'Invalid input' });
    }
  
    try {
      const newFoodTiming = new FoodTiming({ timing, foodType });
      await newFoodTiming.save();
      res.status(201).json({ foodTiming: newFoodTiming });
    } catch (error) {
      res.status(500).json({ message: 'Error adding food timing' });
    }
  });
// app.post('/api/food-timings', async (req, res) => {
//     const { time, type } = req.body;
  
//     // Validation
//     if (!time || !type) {
//       return res.status(400).json({ error: 'Both time and type are required.' });
//     }
  
//     if (!['Morning', 'Afternoon', 'Evening', 'Night'].includes(time)) {
//       return res.status(400).json({ error: 'Invalid time. Allowed values: Morning, Afternoon, Evening, Night.' });
//     }
  
//     if (!['Veg', 'Non-Veg'].includes(type)) {
//       return res.status(400).json({ error: 'Invalid type. Allowed values: Veg, Non-Veg.' });
//     }
  
//     try {
//       const foodTiming = new FoodTiming({ time, type });
//       await foodTiming.save();
//       res.status(201).json({ message: 'Food timing added successfully.', foodTiming });
//     } catch (error) {
//       console.error('Error saving food timing:', error);
//       res.status(500).json({ error: 'Internal server error. Please try again later.' });
//     }
//   });
// app.get('/api/food-timings', async (req, res) => {
//     try {
//       const foodTimings = await FoodTiming.find();
//       res.status(200).json({ foodTimings });
//     } catch (error) {
//       console.error('Error fetching food timings:', error);
//       res.status(500).json({ error: 'Internal server error. Please try again later.' });
//     }
//   });

//for admin
// app.post('/api/admin/products', authenticateAdmin, async (req, res) => {
//     const { name, category, price, description } = req.body;
//     try {
//       const product = new Product({ name, category, price, description });
//       await product.save();
//       res.status(201).json({ message: 'Product added successfully', product });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to add product' });
//     }
//   });

//   app.put('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
//     const { name, category, price, description } = req.body;
//     try {
//       const product = await Product.findByIdAndUpdate(req.params.id, { name, category, price, description }, { new: true });
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
//       res.status(200).json({ message: 'Product updated successfully', product });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to update product' });
//     }
//   });
//   app.post('/api/admin/banner', authenticateAdmin, upload.single('bannerImage'), async (req, res) => {
//     const { name } = req.body;
//     const bannerImage = req.file ? req.file.path : '';
//     try {
//       const banner = new Banner({ name, bannerImage });
//       await banner.save();
//       res.status(201).json({ message: 'Banner added successfully', banner });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to add banner' });
//     }
//   });
//   const authenticateAdmin = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(403).json({ error: 'Unauthorized access' });
//     }
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ error: 'Unauthorized access' });
//       }
//       if (decoded.role !== 'admin') {
//         return res.status(403).json({ error: 'You do not have admin privileges' });
//       }
//       req.user = decoded;
//       next();
//     });
//   };
    

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
