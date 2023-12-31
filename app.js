require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const expressRateLimiter = require("express-rate-limit");
const expressMongoSanitize = require("express-mongo-sanitize");

// database
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(expressRateLimiter({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(expressMongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // temp
app.use(express.static("./public"));
app.use(fileUpload());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`server listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
};
start();
