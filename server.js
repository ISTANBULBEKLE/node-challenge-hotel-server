const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//Reading all the bookings;
app.get('/bookings', (req,res)=>{
  res.send(bookings);
});

// Reading one booking with a specified ID;

app.get('/bookings/:id', (req, res)=>{
    const Id = req.params.id;
    const Booking = bookings.find(m => m.id == Id);
    if (Booking) { 
      res.json(Booking); 
    } else { 
      res.status(404).send("Booking not found"); 
    }
})

// Creating a new booking;

app.post('/bookings', (req, res)=>{
  const newBooking = req.body;
  bookings.push(newBooking);
})
// TODO add your routes and helper functions here


app.listen(3000, function () {
  console.log('Server is running on 3000');
});

/* const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

 */