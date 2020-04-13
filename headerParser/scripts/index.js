exports.whoAmI = (req, res) => {
    
    let output = {};
    output["ipaddress"] = req.ip;
    output["language"] = req.get('Accept-Language');
    output["software"] = req.get('User-Agent');

    res.send(output);
}