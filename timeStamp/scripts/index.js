exports.dateNow = (req, res) => {
    res.json({ unix: Date.now(), utc: Date() });
}

exports.formattedDate = (req, res, next) => {
    
    let date;
    if ( /\D/.test(req.params.date_string) ) {
        date = new Date(req.params.date_string);
    } else {
        date = new Date(parseInt(req.params.date_string));
    }

    let utcDate = date.toUTCString();  
    let unixDate = date.getTime(); 

    if (utcDate === "Invalid Date"){
        res.json({"error" : "Invalid Date" });
    } else {
        res.json({ 
            "unix": unixDate, 
            "utc": utcDate 
        });
    }
}
