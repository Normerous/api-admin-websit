const express = require("express"),
  app = require("express")(),
  cors = require("cors"),
  passport = require("passport"),
  authRoutes = require('./routers/authRoutes'),
  productRoutes = require("./routers/productRoutes"),
  mongoose = require("mongoose"),
  dotenv = require("dotenv"),
  multer = require('multer'),
  upload = multer({ dest: 'uploads/' });

dotenv.config();
const uri = process.env.URL_MONGODB;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("[success] task 2 : connected to the database ");
    },
    (error) => {
      console.log("[failed] task 2 " + error);
      process.exit();
    }
  );
app.use(cors());
app.use(express.json());

require('./configs/passport');
const checkAuthJWT = passport.authenticate('jwt', { session: false });
app.use('/auth', authRoutes);
app.use('/auth/checkToken', checkAuthJWT, (req, res) => {
  res.status(200).json({ status: "success", user: req.user });
});
app.use("/product", checkAuthJWT, productRoutes);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log("Server is running in port", PORT);
})