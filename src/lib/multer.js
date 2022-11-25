const multer = require('multer');
const path = require('path');
var fs = require('fs');
const { exit } = require('process');


function uploadFile() {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {

            const path1 = path.join(__dirname, '../../storage/' + req.user.id);

            fs.mkdirSync(path1, { recursive: true });


            cb(null, path1);
        },
        filename: function (req, file, cb) {
            // console.log('multer');
            if (file.fieldname === 'domMaq') {
                cb(null, file.fieldname);    
            }else if(file.fieldname === 'revTec'){
                cb(null, file.fieldname);
            }else if(file.fieldname === 'perCir'){
                cb(null, file.fieldname);
            }else if(file.fieldname === 'seg'){
                cb(null, file.fieldname);
            }else if(file.fieldname === 'docOpe'){
                cb(null, file.fieldname);
            }
            
        }
    })

      
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
