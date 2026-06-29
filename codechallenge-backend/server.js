require("dotenv").config()
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const defiRoutes = require("./routes/defiRoutes");
const codeRoutes = require("./routes/codeRoutes");
const userRoutes = require("./routes/userRoutes");
const classementRoutes = require("./routes/classementRoutes");


const app = express();




app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api/defis", defiRoutes);
app.use("/api/code", codeRoutes);



app.use("/api/user", userRoutes);
app.use("/api/classement", classementRoutes);

app.listen(3000, () => {

    console.log(
      "Serveur démarré sur port 3000"
    );
});