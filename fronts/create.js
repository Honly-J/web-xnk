var fs =  require("fs");
var http = require("http");
var path = require("path");  

 

function writeHTML( filename ){
	var pageUrl = "http://localhost:8888/ava-new2/avl-new/htmls/frontend/template/" + filename;
	console.log(pageUrl)
	// var pageUrl = "./template/" + filename;
	var basePath = "./build/"
	http.get(  pageUrl , function(res) {
	    var html = '';
	    res.on('data', function(data) {
	        html += data;
	    });
	    res.on('end', function() {
	        fs.writeFile(basePath + filename ,html, function(){
	        	console.log(filename + " has   created and push conent;")
	        })
	    });
	});
	   
}


var roota = path.join(__dirname);

readDirSync(roota+"/template/",writeHTML);

function readDirSync(path,fn){  
    var pa = fs.readdirSync(path);  
    pa.forEach(function(ele,index){  
        var info = fs.statSync(path+"/"+ele)      
        if(info.isDirectory()){  
             console.log("dir: "+ele)  
            readDirSync(path+"/"+ele,fn);  
        }else{  
            console.log("file: "+ele)  
        	if(ele.match(/\w+\.html$/)){
        		fn(ele)
        	}	
        }

    })  
}  