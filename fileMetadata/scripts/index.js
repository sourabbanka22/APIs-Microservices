exports.fileUpload = (req, res) => {

    if(req.file){
        res.send({
            name: req.file.originalname, 
            type: req.file.mimetype, 
            size: req.file.size
        });
    }else {
        res.send({error: "no file uploaded"});
    }
    
}