require('dotenv').config();
const express = require("express");


//inicializaciones
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const pool = require('./database');
const { db } = require('./keys');

//const db = require("./database");
app.use(cors());

var whitelist = ['https://frontenterprises-add.herokuapp.com']


var corsOption ={
 origin: function(origin, callback){
    if (whitelist.indexOf(origin) !== -1){
        callback(null, true);

    } else{

        callback(new Error('Not allowed by CORS :)'));
    }
   
 }


}


app.use(express.json());




app.post('/create', cors(corsOption), async(req, res)=>{

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const gender= req.body.gender;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const adress = req.body.adress;
    const documenttype = req.body.documenttype;
    const documentnumber = req.body.documentnumber;
    
    var todaydate = new Date();

    var date1=todaydate.getFullYear() +'-'+(todaydate.getMonth()+1)+'-'+todaydate.getDate();
    var hour1=todaydate.getHours()+':'+todaydate.getMinutes()+':'+todaydate.getSeconds();
    const created= date1+ ' '+ hour1;

    await pool.query("INSERT INTO employee ( firstname, lastname, gender, email, phonenumber, adress, documenttype, documentnumber, created ) VALUES(?,?,?,?,?,?,?,?,? )",
    [firstname, lastname, gender, email,phonenumber, adress, documenttype, documentnumber, created],
    (err, result)=>{
        if(err){

                console.log(err);

        }else {
            res.send("Values Inserted");

        }

    }
    );
    

});

app.get('/employees',  cors(corsOption),async(req, res)=>{
    await pool.query("SELECT * FROM employee", (err, result)=>{
    if (err){
        console.log(err);


    }else {
        res.send(result);

    }


 });


});

app.put('/update',  cors(corsOption), async (req, res)=>{
    const employeeid = req.body.employeeid;
    const firstname =req.body.firstname;
    const lastname = req.body.lastname;
    const gender= req.body.gender;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const adress= req.body.adress;
    const documenttype= req.body.documenttype;
    const documentnumber = req.body.documentnumber;
    
    
    //const updated = "2030-02-02 12:12:54"
    var todaydate = new Date();

    var date1=todaydate.getFullYear() +'-'+(todaydate.getMonth()+1)+'-'+todaydate.getDate();
    var hour1=todaydate.getHours()+':'+todaydate.getMinutes()+':'+todaydate.getSeconds();
    const updated= date1+ ' '+ hour1;


    await pool.query(
        "UPDATE employee set firstname=?, lastname=?, gender=?, email=?, phonenumber =?, adress=?, documenttype=?, documentnumber=?, updated =?   WHERE employeeid = ?", 
        [firstname, lastname, gender ,email,  phonenumber, adress, documenttype, documentnumber, updated, employeeid], 
        (err, result)=>{
        if (err){
            console.log(err);


    } else {
        res.send(result);

      }


    }
    );



});



app.delete('/delete/:employeeid',  cors(corsOption), async (req, res)=>{
    const employeeid = req.params.employeeid;
    await pool.query('DELETE FROM employee WHERE employeeid = ?' , [employeeid], (err, result)=>{
        if(err){
            console.log(err);


        }else{

            res.send(result);
        }


    });
});
const PORT = process.env.PORT || 5000;
//app.set('port', process.env.PORT || 3001);

//Starting the server
app.listen((PORT), ()=>{
    console.log(`Listening on ${ PORT }`);

});


