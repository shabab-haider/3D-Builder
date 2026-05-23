require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/mongoose.config");
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
