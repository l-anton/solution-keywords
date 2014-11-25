// Node functions setup
var http = require('http');
var url = require('url');
var qs = require('querystring');

//Database setup
var databaseUrl = 'mongodb://localhost:27017';
var collections = ['keywords', 'ips'];
var db = require('mongojs').connect(databaseUrl, collections);

//Misc messages
var apiErrMsg_api = 'Bad API method' + '\n';
var apiErrMsg_query = 'Bad query format' + '\n';

//Auxiliary : takes an array of elements with duplicated, returns deduplicated array sorted by frequency
function deduplicateAndSort(array, limit) {
    function find_mode(arr) {
        var mode = {};
        var max = 0, count = 0;

        arr.forEach(function(e) {
            if (mode[e]) { mode[e]++; }
            else { mode[e] = 1; } 

            if (count<mode[e]) { 
                max = e;
                count = mode[e];
            }
        });        
        return max;
    };
    var output_array = [];
    if (limit > 0) {
        while (array.length > 0 && output_array.length < limit) {
            var m = find_mode(array);
            output_array.push(m);
            var idx = array.indexOf(m);
            while (idx >= 0) {
                array.splice(idx, 1);
                idx = array.indexOf(m);
            };
        };
    }
    else {
        while (array.length > 0) {
            var m = find_mode(array);
            output_array.push(m);
            var idx = array.indexOf(m);
            while (idx >= 0) {
                array.splice(idx, 1);
                idx = array.indexOf(m);
            };
        };
    }
    var ouput_string = ''
    for (i=0; i<output_array.length; i++) {
        ouput_string += output_array[i] + '\n';
    }
    return ouput_string
};

//Calls db for top keywords
function get_topkwds(callback) {
    db.keywords.find({}).sort({ kwd_cnt: -1 }).limit(10).toArray( function(err, docs) {
        callback(docs);
    });
};
//Calls db for top IPs
function get_topips(callback) {
    db.ips.find({}).sort({ ip_cnt: -1 }).limit(10).toArray( function(err, docs) {
        callback(docs);
    });
};
//Calls db for IP
function get_ipsforkwd(kwd, callback) {
    var cursor = db.keywords.find( { keyword: kwd } );
    cursor.count( function(err, count) {
        if ( count > 0 ) {
            cursor.toArray( function(err, doc) {
                callback(doc);
            });
        }
        else {
            callback({});
        };
    });
};

//GET API service
var server = http.createServer(function(req, res) {
    var root = url.parse(req.url);
    var api = root.pathname;

    if (req.method == 'GET' & api == '/topkwds') {
        get_topkwds( function(docs) {
            var kwds = '';
            for (var i in docs) {
                kwds += docs[i]["keyword"] + ' ';
            };
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(kwds + '\n');
            res.end();
        });
    }
    else if (req.method == 'GET' & api == '/topips') {
        get_topips( function(docs) {
            var ips = '';
            for (var i in docs) {
                ips += docs[i]["ip"] + '\n' + deduplicateAndSort(docs[i]["kwd_list"], 10) + '\n';
            };
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(ips);
            res.end();
        });
    }
    else if (req.method == 'GET' & api == '/ipsforkwd') {
        var query = qs.parse(root.query);
        if ('kwd' in query) {
            var kwd_called = query['kwd'];
            get_ipsforkwd(kwd_called, function(doc){
                if (doc.length > 0) {
                    data = deduplicateAndSort(doc[0]["ip_list"], 0);
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write(data + '\n');
                    res.end();
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write('Keyword ' + kwd_called + ' not found' + '\n');
                    res.end();
                }
            });
        }
        else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.write(apiErrMsg_query);
            res.end();
        }
    }
    else {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write(apiErrMsg_api);
        res.end();
    }
});

server.listen(80);
