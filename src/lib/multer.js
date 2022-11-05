const multer = require('multer');
const path = require('path');

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

function uploadFile() {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../storage/' + req.user.id));
        }
        ,
        filename: function (req, file, cb) {
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

