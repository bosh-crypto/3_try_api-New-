require("dotenv").config();
// const port = 3000;
const express = require("express");
const app = express();
const PORT = process.env.APP_PORT || 4000;
app.use(express.json());


// const path = require('path');
// app.use(express.static(path.join(__dirname,"./viwes")));
// app.post(express.urlencoded({extended:false}))

require("./route/router")(app);


app.listen(PORT, () => console.log(`Example app listening on port !`, PORT));
