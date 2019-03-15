// Initialize Firebase
var config = {
    apiKey: "AIzaSyDpz6AJDbh9-ikKcomRGmKalOiPF_ciJz4",
    authDomain: "train-scheduler-2151f.firebaseapp.com",
    databaseURL: "https://train-scheduler-2151f.firebaseio.com",
    projectId: "train-scheduler-2151f",
    storageBucket: "",
    messagingSenderId: "366090233298"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// This callback keeps the page updated when a value changes in firebase.
database.ref().on("child_added", function (snapshot) {
    // Console.log the "snapshot" value (a point-in-time representation of the database)
    console.log(snapshot.val());

    // var newTableRow = $("<tr>");
    $("tbody").append("<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + snapshot.val().next + "</td><td>" + snapshot.val().time + "</td></tr>");

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// Variables
var trainName = "";
var trainDestination = "";
var trainTime ;
var trainFrequency ;

// When user clicks submit
$("#user-submit").on("click", function () {
    // Prevent page refresh
    event.preventDefault();
    // Variables for each train criteria
    trainName = $("#user-train-name").val().trim();
    trainDestination = $("#user-train-destination").val().trim();
    trainTime = $("#user-train-time").val().trim();
    trainFrequency = $("#user-frequency").val().trim();
    // log user values
    console.log("Train name: " + trainName);
    console.log("Train destination: " + trainDestination);
    console.log("Train time: " + trainTime);
    console.log("Train frequency: " + trainFrequency);

    // THE MATH!
    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years").format("hh:mm a");
    console.log(firstTimeConverted);     
    var currentTime = moment().format("hh:mm a");
    console.log(currentTime);
    var firstTimeMoment = moment(firstTimeConverted);
    var diffTime = moment().diff(moment(firstTimeMoment), "minutes");
    console.log(diffTime);
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log(tMinutesTillTrain);
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log(nextTrain);      // This does not update train minutes left and next train actively

    // Save new data to Firebase
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: tMinutesTillTrain,
        frequency: trainFrequency,
        next: nextTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("input").val(""); 
})