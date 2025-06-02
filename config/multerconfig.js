const multer = require('multer')
const path = require('path');
const crypto = require('crypto-js')

//diskstorage

const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        cb(null,"./uploads")
    },
    filename: function(req,file,cb){
        // crypto.randomBytes(12,function(err,name){
            const fn = file.fieldname + "-" + 
            path.extname(file.originalname)
            cb(null, fn);
            console.log(fn)
        // })
      
    }
})

const upload = multer({ storage:storage })


module.exports = upload
