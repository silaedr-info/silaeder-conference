const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.json());
app.use(cors());

//start app 
const port = process.env.PORT || 8080;

function get_ext(filename) {
    let f = filename.split("").reverse();

    let ext = [];
    for (let i = 0; i < f.length; i++) {
        if (f[i] !== ".") {
            ext.push(f[i]);
        } else {
            break;
        }
    }

    return ext.reverse().join("");
}

app.post('/upload', async (req, res) => {
    console.log(req);
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.file;
            
            if (req.body.type == "presentations") {
                file.mv('./presentations/' + req.body.prj_id + '.' + get_ext(file.name));
            }

            //send response
            res.send({
                status: true,
                message: 'File is uploaded'
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/get-presentation', async (req, res) => {
    fs.readdir("./presentations", (err, files) => {
        files.forEach(file => {
            if (file.includes(req.query.prj_id)) {
                res.download("./presentations/"+file)
            }
        })
    })
})

app.get('/get-extname', async (req, res) => {
    fs.readdir("./presentations", (err, files) => {
        files.forEach(file => {
            if (file.includes(req.query.prj_id)) {
                res.status(200).send(get_ext(file))
            }
        })
    })
})

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);