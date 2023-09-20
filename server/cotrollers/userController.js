const mysql = require("mysql");
const { param } = require("../routes/user");

//Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//View Users

exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    //Use the Connection
    connection.query("SELECT * FROM user WHERE status = 'active'", (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if (!err) {
        let removedUser = req.query.removed;
        res.render("home", {rows, removedUser});
      } else {
        console.log(err);
      }

      console.log("The data from user table: \n", rows);
    });
  });
};

//find user by search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    let searchTerm = req.body.search;
    //Use the Connection
    connection.query("SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?", ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if (!err) {
        res.render("home", { rows });
      } else {
        console.log(err);
      }

      console.log("The data from user table: \n", rows);
    });
  });
};

//add user page
exports.form = (req, res) => {
    res.render('add_user');

}

//add users using the form
exports.create = (req, res) => {
  // res.render('add_user');
const {first_name, last_name,email,phone_number,comment} = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    let searchTerm = req.body.search;
    //Use the Connection
    connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone_number = ?, comment = ?', [first_name,last_name,email,phone_number,comment], (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if (!err) {
        res.render("add_user", {rows, alert: 'A new User has been added'});
      } else {
        console.log(err);
      }

      console.log("The data from user table: \n", rows);
    });
  });

}

//edit user page
exports.edit = (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    //Use the Connection
    connection.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if (!err) {
        res.render("edit_user", { rows });
      } else {
        console.log(err);
      }

      console.log("The data from user table: \n", rows);
    });
  });

}

//update user page
exports.update = (req, res) => {

  const {first_name, last_name,email,phone_number,comment} = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    //Use the Connection
    connection.query("UPDATE user SET first_name = ?, last_name =?, email = ?, phone_number = ?, comment = ? WHERE id = ?",[first_name, last_name,email,phone_number,comment, req.params.id], (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if (!err) {
        pool.getConnection((err, connection) => {
          if (err) throw err; //not connected
          console.log("Connected as ID " + connection.threadId);
      
          //Use the Connection
          connection.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
      
            if (!err) {
              res.render("edit_user", { rows, alert: 'User has been updated' });
            } else {
              console.log(err);
            }
      
            console.log("The data from user table: \n", rows);
          });
        });
      } else {
        console.log(err);
      }

      console.log("The data from user table: \n", rows);
    });
  });

}

//delete user page
exports.delete = (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    //Use the Connection
    connection.query("UPDATE user SET status = ? WHERE id = ?",['removed',req.params.id], (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if (!err) {
        let removedUser = encodeURIComponent('User successfully removed')
        res.redirect('/?remove=' + removedUser);
      } else {
        console.log(err);
      }

      console.log("The data from user table: \n", rows);
    });
  });

}

//View Users

exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    //Use the Connection
    connection.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if (!err) {
        res.render("view_user", { rows });
      } else {
        console.log(err);
      }

      console.log("The data from user table: \n", rows);
    });
  });
};
