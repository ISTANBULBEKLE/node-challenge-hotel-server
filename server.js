const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// Test
app.get('/date', (req,res)=>{
  const day = moment(new Date("2020-11-4"));
  res.send(day);
})

// TODO add your routes and helper functions here
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
 let newBooking = {
    id: req.body.id,
    title: req.body.title,
    firstName:req.body.firstName,
    surname:req.body.surname,
    email:req.body.email,
    roomId: req.body.roomId,
    checkInDate:req.body.checkInDate,
    checkOutDate:req.body.checkOutDate
  };

  if (validateNewBooking(newBooking)) {
    newBooking.id = createId();
    // newBooking.timeSent = new Date().toISOString();
    newBooking.title =req.body.title;
    newBooking.firstName = req.body.firstName;
    newBooking.surname = req.body.surname;
    newBooking.email = req.body.email;
    newBooking.roomId = req.body.roomId;
    newBooking.checkInDate = moment(new Date().toLocaleDateString());
    newBooking.checkOutDate = moment(new Date().toLocaleDateString());

    bookings.push(newBooking);
    res.status(200).send('The booking is created successfully.');
  } else {
    res.status(400).send('Bad request');
  }


function validateNewBooking(newBooking) {
  if (
    newBooking.title !== '' &&
    newBooking.firstName !== '' &&
    newBooking.surname !== '' &&
    newBooking.email !== '' &&
    newBooking.roomId !== '' &&
    newBooking.checkInDate !== '' &&
    newBooking.checkOutDate !== ''
  ) {
    return true;
  } else return false;
}

function createId() {
  let newId = bookings[bookings.length - 1].id + 1;
  return newId;
};

});

// Deleting a booking with a specified ID;
app.delete('/bookings/:id', (req, res) => {
    const Id  = req.params.id;
    const elementIndex = bookings.findIndex(m => m.id == Id);
  
    if(elementIndex === -1) {
      res.status(404).send('Not found');
    } else { 
      bookings.splice(elementIndex, 1);
      res.status(200).send('Bookings deleted');
    }
});

//Search a booking with a date marge;
app.get('/bookings/search', (req, res)=>{
  console.log(req.query);
  let date = req.query.date; 
  const checkInD = moment(`${bookings.checkInDate}`)
  const checkOutD = moment(`${bookings.checkOutDate}`)
  let bookingsMatching = bookings.filter(m => ((m.checkInD.toString() || m.checkOutD.toString()).includes(date.toString())));

  if(bookingsMatching){
    res.status(200).send(bookingsMatching, 'Bookings found');
  }else{
     res.status(404).send('Booking-not found');
  };
});

//Listen to the port;
app.listen(3000, function () {
  console.log('Server is running on 3000');
});

/* const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

 */