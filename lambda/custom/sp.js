var https = require('https');
var urls = {
    soaps: "/entertainment/2018/0608/969076-soap-spoilers-this-weeks-must-see-moments/"
}
var SETTINGS = {
    tvHighlightsUrl: "https://feeds.rasset.ie/sitesearch/newsnowlive/select?q=headline:%22TV%20highlights%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc",
    soapsUrl: "https://feeds.rasset.ie/sitesearch/newsnowlive/select?q=url:%22" + urls.soaps + "%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc&rows=5"
};

try{
    httpGet(SETTINGS.tvHighlightsUrl,(r)=>{
        //console.log(JSON.parse(r));
        let result = JSON.parse(r);
        console.log(result.response.docs[0].content);
        //this.emit(':ask', 'Allright bud');
    })
}catch(e){
    console.log("error" + e)
} 


function httpGet(url, callback) {
    var options = {
        host: url,
        method: 'GET',
    };
    console.log("httpGet(): START " + options.host);

    var req = https.get(url, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        
        res.on('end', () => {
            console.log("httpGet(): END ");
           // log("httpGet(): END " + JSON.stringify(returnData));
            callback(returnData);  // this will execute whatever function the caller defined, with one argument
        });
        res.on('error',()=>{
            console.log("ERROR");
        })
    });
    req.end();
}