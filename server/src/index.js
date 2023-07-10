const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const verify = require("./middlewares/verify");
const cors = require("cors");

app.use(cors());
app.use(express.json());
const router = require("./routes");
const db = require("./models");
// db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

app.use("/warehouse", verify, router.warehouseRouter);
app.use("/province&city", verify, router.provinceCityRouter);
app.use("/history", verify, router.stockHistory);

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
