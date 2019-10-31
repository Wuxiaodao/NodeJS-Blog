const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const queryString = require('querystring');
let {userList,chapterList} = require('./box');//获取(box.js)中的后台数据
//访问对应页面
http.createServer(function (req, res){
    var urlObj = url.parse(req.url,true);
    //对应静态页chapterList.html
    if(urlObj.pathname == "/list"){
        showIndex(indexPath,res);
    //对应静态页chapter.html
    }else if(urlObj.pathname == "/detail"){
        showName(indexPath,res);
    //对应静态页login.html
    }else if(urlObj.pathname == "/login"){
        showLogin(indexPath,res);
    //对应静态页list.html
    }else if(urlObj.pathname == "/listmanager"){
        showList(indexPath,res);
    //对应静态页addChapter.html
    }else if(urlObj.pathname == "/addChapter"){
        showAdd(indexPath,res);
    }else if(urlObj.pathname == "/getChapterList"){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(chapterList));
    }else if(urlObj.pathname == "/getDetail"){//阅读全文
        var chapterId = (urlObj.query).chapterId;
        var dataList = [];
        chapterList.forEach((data)=>{
            if(data.chapterId == chapterId){
                dataList.push(data);
            }
        })
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(dataList));
    }
    else if(urlObj.pathname == "/add"){ //添加新的文章
        var postName = "";
        req.on("data", function(add){
            postName += add;
        })
        req.on("end", function(){
            var date = new Date();
            var post = queryString.parse(postName);
            var title = post.title;
            var content = post.content;
            var state = {"chapterId":chapterList[chapterList.length-1].chapterId+1,"chapterName":title,"imgPath":"","chapterDes":content,"chapterContent": content,"publishTimer":`${date.getFullYear()}-${(date.getMonth()+1).length==1?'0'+(date.getMonth()+1):date.getMonth()+1}-${date.getDate().length==1?'0'+date.getDate():date.getDate()}`,"author": "admin","views":0}
            chapterList.push(state);
            res.writeHead(200,{'Content-Type': 'text/html'});
            res.end(postName);
        })
    }
    //后台登陆验证
    else if(urlObj.pathname == "/getLogin"){
        var pwdName = "";
        req.on("data", function (chunk){
            pwdName += chunk;
        });
        req.on("end", function(){
            var post = queryString.parse(pwdName);
            var username = post.username;
            var password = post.password;
            for (var i = 0; i < userList.length; i++) {
                if(userList[i].username == username && userList[i].pwd == password) {
                    result = 0;
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify(result));
                    return 0;
                }
            }
            result = 1;
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));
        });
    }else if(urlObj.pathname == "/del"){ //删除文章
        var chapterId = (urlObj.query).chapterId;
            for(var i = 0; i < chapterList.length;i++){
                if(chapterList[i].chapterId == chapterId){
                    chapterList.splice(i,1);
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(JSON.stringify(chapterList));
                    return;
                }
            }
        }else if(urlObj.pathname == '/listmanager/'){
        res.writeHead(302, {'Location': '/listmanager'})
        res.end();
    }else if (urlObj.pathname == "/addChapter/"){
        res.writeHead(302, {'Location': '/addChapter'})
        res.end();
    }else{
        //读取静态资源
        var indexPath = path.join(__dirname,urlObj.pathname);
        fs.readFile(indexPath, (err,server)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
            }else{
                var postfix  = path.extname(indexPath).toLowerCase();
                if(postfix  === '.js'){
                    res.writeHead(200,{'Content-Type': 'text/javascript'});
                }else if(postfix  === '.css'){
                    res.writeHead(200,{'Content-Type': 'text/css'});
                }else if(postfix  === '.png'){
                    res.writeHead(200, {'Content-Type': 'image/png'});
                }else if(postfix  === '.jpg'){
                    res.writeHead(200, {'Content-Type': 'image/jpg'});
                }else{
                    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                }
                res.end(server);
            }
        })
    }
}).listen(8083);
console.log("Server is listening to 8083");
function showIndex(indexPath,res){
    var indexPath = path.join(__dirname,'./chapterList.html');
    var fileContent = fs.readFileSync(indexPath);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end(fileContent);
}
function showName(indexPath,res){
    var indexPath = path.join(__dirname,"./chapter.html");
    var fileContent1 = fs.readFileSync(indexPath);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end(fileContent1);
}
function showLogin(indexPath,res){
    var indexPath = path.join(__dirname,"./login.html");
    var fileContent2 = fs.readFileSync(indexPath);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end(fileContent2);
}   
function showList(indexPath,res){
    var indexPath = path.join(__dirname,"./list.html");
    var fileContent3 = fs.readFileSync(indexPath);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end(fileContent3);
}
function showAdd(indexPath,res){
    var indexPath = path.join(__dirname,"./addChapter.html");
    var fileContent4 = fs.readFileSync(indexPath);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end(fileContent4);
}