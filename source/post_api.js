// Node functions setup
var http = require('http');
var url = require('url');
var qs = require('querystring');

//Database setup
var databaseUrl = 'mongodb://localhost:27017';
var collections = ['keywords', 'ips'];
var db = require('mongojs').connect(databaseUrl, collections);

//Misc messages
var apiErrorMsg_request = 'Bad API method' + '\n'; 
var apiErrorMsg_data = 'Bad query format' + '\n';
var keywords_separator = ' ';
function apiSuccessMsg(keywords_array) {
    return 'Keywords received : ' + keywords_array.toString() + '\n'
};

//Auxiliary function : takes a list with duplicates, returns an object with number of instances of each element
function createArray(value, length) {
    var output = [];
    for (i=0; i<length; i++) {
        output.push(value);
    };
    return output
};
function countDuplicates(array) {
    var output = {};
    for (i=0; i<array.length; i++) {
        if (array[i] in output) {
            output[array[i]]++;
        }
        else {
            output[array[i]]=1;
        };
    };
    return output
};

//Elementary update of keywords collection
function update_kwd(kwd, number, sender_ip) {
    db.keywords.find( { keyword: kwd } ).count( function(err, count) {
        if ( count > 0 ) {
            db.keywords.update( { keyword: kwd } , { $inc: {kwd_cnt: number}, $push: { ip_list: { $each: createArray(sender_ip, number) } } } );
        }
        else {
            db.keywords.save( { keyword: kwd, kwd_cnt: number, ip_list: createArray(sender_ip, number) } );
        }
    });  
};

//Elementary update of ips collection
function update_ip(kwd_array, sender_ip) {
    db.ips.find( { ip: sender_ip } ).count( function(err, count) {
        if ( count > 0 ) {
            db.ips.update( { ip: sender_ip } , { $inc: { ip_cnt: 1}, $push: { kwd_list: { $each: kwd_array } } } );
        }
        else {
            db.ips.save( { ip: sender_ip, ip_cnt: 1, kwd_list: kwd_array } );
        }
    });
};

//Global update of db when message received
function update_db(kwd_array, sender_ip, loop_kwd, loop_ip) {
    loop_ip(kwd_array, sender_ip);
    var deduplicated = countDuplicates(kwd_array);
    for (var h in deduplicated) {
        loop_kwd(h, deduplicated[h], sender_ip);
    };
};

//POST API service
var server = http.createServer(function(req, res) {
    var page = url.parse(req.url).pathname;
    var ipAddress = req.connection.remoteAddress;
    if (req.method == 'POST' & page == '/message') {	
        var text = '';   
        req.on('data', function (data) {
            text += data;
        });
        req.on('end', function () {
            var post = qs.parse(text);
            if ('keywords' in post) {
                var keywords_array = post['keywords'].split(keywords_separator);
                update_db(keywords_array, ipAddress, update_kwd, update_ip);               
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write(apiSuccessMsg(keywords_array));
                res.end();
            }
            else {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.write(apiErrorMsg_data);
                res.end();
            }
        });
    }
    else {
    	res.writeHead(400, {'Content-Type': 'text/plain'});
    	res.write(apiErrorMsg_request);
    	res.end();
    }
});

server.listen(8080);