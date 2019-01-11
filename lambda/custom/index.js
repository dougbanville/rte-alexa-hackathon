var Alexa = require('alexa-sdk');
var https = require('https');
var striptags = require('striptags');
const utf8 = require('utf8');
var htmlToText = require('html-to-text');

exports.handler = (event, context, callback) => {
    // TODO implement
    // Create an instance of the Alexa library and pass it the requested command.
    var alexa = Alexa.handler(event, context);
    console.log("Event: " + JSON.stringify(event));
    console.log("Context: " + JSON.stringify(context));
    //SETTINGS.comscoreSettings.paramDefaults.ns_vid = event.session.sessionId;
    //alexa.appId = SETTINGS.appId;
    //alexa.dynamoDBTableName = SETTINGS.dynamoDBTableName;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
//https://www.rte.ie/feeds/rss/?index=/lifestyle/
//http://feeds.rasset.ie/sitesearch/newsnowlive/select?q=headline:%22TV%20highlights%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc
//http://feeds.rasset.ie/sitesearch/newsnowlive/select?q=url:%22/entertainment/2018/0514/963465-live-referendum-special-and-other-tv-highlights/%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc&rows=5
//http://feeds.rasset.ie/sitesearch/newsnowlive/select?q=url:%22/entertainment/2018/0608/969076-soap-spoilers-this-weeks-must-see-moments/%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc&rows=5

var urls = {
    soaps: "/entertainment/2018/0608/969076-soap-spoilers-this-weeks-must-see-moments/",
    highlights: "/entertainment/2018/0524/965790-whats-on-tv-highlights-for-thursday/"
}
var SETTINGS = {
    //tvHighlightsUrl: "https://feeds.rasset.ie/sitesearch/newsnowlive/select?q=headline:%22TV%20highlights%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc",
    tvHighlightsUrl: "https://feeds.rasset.ie/sitesearch/newsnowlive/select?q=url:%22" + urls.highlights + "%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc&rows=5",
    soapsUrl: "https://feeds.rasset.ie/sitesearch/newsnowlive/select?q=url:%22" + urls.soaps + "%22&fq=pillar:entertainment&wt=json&sort=date_modified%20desc&rows=5",
    radiHighlights: "https://radio.rte.ie/radio1highlights/wp-json/wp/v2/posts"
};

var handlers = {

    'LaunchRequest': function () {
        console.log("LaunchRequest(): START");
        //logComscore({name:'alexa.rteradio.home', rte_mt_title:'Home'});
        this.emit(':ask', 'Would you like TV, Radio or Web?', 'Please say that again?');
    },
    'tv': function () {
        this.attributes.medium = "TV";
        this.emit(':ask', 'Highlights, Soaps or both?', 'Please say that again?');
    },
    'radio': function () {
        this.attributes.medium = "radio";
        this.emit(':ask', 'Ok, just say play on any highlight you would like to hear.', 'Please say that again?');
        try{
            httpGet(SETTINGS.radiHighlights,(r)=>{
                //console.log(JSON.parse(r));
                let result = JSON.parse(r);
                console.log(result);
                //this.emit(':ask', 'Allright bud');
                //this.emit();
                let text = htmlToText.fromString(result.response.docs[0].content);
                text = utf8.encode(text);
                
                this.response.speak(text);
                this.emit(':responseReady');
            })
        }catch(e){
            console.log("error" + e)
        } 
    },
    'giveHighlights': function(){
        if(this.attributes.medium === "TV"){
            //this.emit(':ask', 'Here are the T.V. Highlights ', 'Please say that again?');
            try{
                httpGet(SETTINGS.tvHighlightsUrl,(r)=>{
                    //console.log(JSON.parse(r));
                    let result = JSON.parse(r);
                    console.log(result.response.docs[0].content);
                    //this.emit(':ask', 'Allright bud');
                    //this.emit();
                    let text = htmlToText.fromString(result.response.docs[0].content);
                    text = utf8.encode(text);
                    
                    this.response.speak(text);
                    this.emit(':responseReady');
                })
            }catch(e){
                console.log("error" + e)
            } 
        }

    }

}
/*****************************  HTTP Functions  ****************************************/

  
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