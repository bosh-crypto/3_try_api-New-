module.exports = function (app){
    app.use("/login",require("./login"))
    app.use("/update",require("./update"))
    app.use("/delete",require("./delete"))
}

