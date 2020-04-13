const mongoose = require('mongoose');
const dns = require('dns');
const autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
autoIncrement.initialize(connection);

var shortUrlSchema = new mongoose.Schema({
  url: {type: String, required: true}
});

shortUrlSchema.plugin(autoIncrement.plugin, { model: 'ShortUrl', field: 'short_url' });
var ShortUrl = connection.model('ShortUrl', shortUrlSchema);

exports.isDomainValid = async (req, res, next) => {

    var url_to_shorten = req.body.url;
    var domain_start = url_to_shorten.indexOf('.') + 1;
    var domain_end = url_to_shorten.indexOf('.', domain_start) + 4;
    var domain = url_to_shorten.substring(domain_start, domain_end);

    const options = {
        family: 6,
        hints: dns.ADDRCONFIG | dns.V4MAPPED,
    };

    dns.lookup(domain, function(err, address, family){
            req.domain = address;
            console.log(req.domain);

            next();
    });

    
}

exports.isUrlValid = (req, res, next) => {

  var pattern = new RegExp('^(https?:\\/\\/)'+ 
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ 
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
  '(\\?[;&a-z\\d%_.~+=-]*)?'+
  '(\\#[-a-z\\d_]*)?$','i');

  req.isValid = pattern.test(req.body.url);

  next();

}


exports.createNew = (req, res) => {
    
    var url = req.body.url;

    if(!req.domain){

        res.send({"error":"invalid Hostname"});
        
    }else {

        if(req.isValid){

            ShortUrl.findOne({url: url}).then(urlR => {
                if(!urlR){
                    console.log("not found");
    
                    const short_url = new ShortUrl({
                        url: url
                    });
    
                    short_url.save(function(err){
                        if (err) return handleError(err);
    
                        short_url.nextCount(function(err, count){
                            res.send({original_url: url, short_url: count-1});
                        });
                    });
                }else {
                    res.send({original_url: url, short_url: urlR.short_url});
                }

            }).catch(error => {
                next(error);
            });
            
        }else {
            res.send({"error": "invalid URL"});
        }
    }    
}


exports.checkNew = (req, res) => {
    
    var short_url = req.params.i;

    ShortUrl.findOne({short_url: short_url}).then(json => {
        if(json){
            res.redirect(json.url);
        }else {
            res.send({"error": "No short url found for given input"});
        }
    })
}

