var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelia ORDER BY numero desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('opiskelia',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('opiskelia',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opiskelia/add', {
        nimi: '',
        arvosana: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let nimi = req.body.nimi;
    let arvosana = req.body.arvosana;
    let errors = false;

    if(nimi.length === 0 ) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter nimi and author");
        // render to add.ejs with flash message
        res.render('opiskelia/add', {
            nimi: nimi,
            arvosana: arvosana
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nimi: nimi,
            arvosana: arvosana
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelia SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opiskelia/add', {
                    nimi: form_data.nimi,
                    arvosana: form_data.arvosana                    
                })
            } else {                
                req.flash('success', 'opiskelia successfully added');
                res.redirect('/opiskelia');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:numero)', function(req, res, next) {

    let numero = req.params.numero;
   
    dbConn.query('SELECT * FROM opiskelia WHERE numero = ' + numero, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'opiskelia not found with numero = ' + numero)
            res.redirect('/opiskelia')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('opiskelia/edit', {
                title: 'Edit opiskelia', 
                numero: rows[0].numero,
                nimi: rows[0].nimi,
                arvosana: rows[0].arvosana
            })
        }
    })
})

// update book data
router.post('/update/:numero', function(req, res, next) {

    let numero = req.params.numero;
    let nimi = req.body.nimi;
    let arvosana = req.body.arvosana;
    let errors = false;

    if(nimi.length === 0 ) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('opiskelia/edit', {
            numero: req.params.numero,
            nimi: nimi,
            arvosana: arvosana
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            nimi: nimi,
            arvosana:arvosana
        }
        // update query
        dbConn.query('UPDATE opiskelia SET ? WHERE numero = ' + numero, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opiskelia/edit', {
                    numero: req.params.numero,
                    nimi: form_data.nimi,
                    arvosana: form_data.arvosana
                })
            } else {
                req.flash('success', 'opiskelia successfully updated');
                res.redirect('/opiskelia');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:numero)', function(req, res, next) {

    let numero = req.params.numero;
     
    dbConn.query('DELETE FROM opiskelia WHERE numero = ' + numero, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/opiskelia')
        } else {
            // set flash message
            req.flash('success', 'opiskelia successfully deleted! numero = ' + numero)
            // redirect to books page
            res.redirect('/opiskelia')
        }
    })
})

module.exports = router;