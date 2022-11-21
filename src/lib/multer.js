const multer = require('multer');
const path = require('path');
var fs = require('fs');
const { exit } = require('process');


// function uploadFile() {

//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, path.join(__dirname, '../../storage/' + req.user.id));
//           }
//         ,
//         filename: function (req, file, cb) {
//           cb(null, file.fieldname + '-' + Date.now());
//         }
//     })

//     // console.log(userId);
      
//     const upload = multer({ storage: storage }).single('domMaq')
//     return upload;
// }

//  select proveedor.id from users, proveedor where users.id = proveedor.user_id and users.id = ?;

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // Allow the `mask` parameter to be optional
        cb = mask;
        mask = 0o744;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // Ignore the error if the folder already exists
            else cb(err); // Something else went wrong
        } else {
            console.log('carpeta creada')
            cb(null)}; // Successfully created folder
    });
}


function uploadFile() {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {

            ensureExists(__dirname + '../../../storage/', 0o744, function(err) {
                if (err){
                    console.log('error al crear');
                } // Handle folder creation error
                else{
                    console.log('carpeta creada');
                    // exit;
                } // We're all good
            });
            ensureExists(__dirname + '../../../storage/' + req.user.id, 0o744, function(err) {
                if (err){
                    console.log('error al crear');
                } // Handle folder creation error
                else{
                    console.log('carpeta creada');
                    // exit;
                } // We're all good
            });

            cb(null, path.join(__dirname, '../../storage/' + req.user.id));
        }
        ,
        filename: function (req, file, cb) {
            console.log('multer');
            if (file.fieldname === 'domMaq') {
                cb(null, file.fieldname + '-' + "sus1");    
            }else if(file.fieldname === 'revTec'){
                cb(null, file.fieldname + '-' + "sus2");
            }else if(file.fieldname === 'perCir'){
                cb(null, file.fieldname + '-' + "sus2");
            }else if(file.fieldname === 'seg'){
                cb(null, file.fieldname + '-' + "sus2");
            }else if(file.fieldname === 'docOpe'){
                cb(null, file.fieldname + '-' + "sus2");
            }
            
        }
    })

    // console.log(userId);
    // const upload = multer({ storage: storage }).single('domMaq')
      
    const upload = multer({ storage: storage }).fields(
        [
            {
                name:'domMaq',
                maxCount:1
            },
            {
                name:'revTec',
                maxCount:1
            },
            {
                name:'perCir',
                maxCount:1
            },
            {
                name:'seg',
                maxCount:1
            },
            {
                name:'docOpe',
                maxCount:1
            }
        ]
    );
    return upload;
}


module.exports = uploadFile;

