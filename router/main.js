module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.get('/testpage',function(req,res){
        res.render('testpage.html');
    });
     
}