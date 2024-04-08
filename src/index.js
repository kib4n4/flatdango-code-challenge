// Initialize an empty array to store all movies
let allmovies = [];
// Initialize a variable to store the currently selected movie
let currentMovie = null;

// Add a click event listener to the "buy-ticket" element
document.getElementById("buy-ticket").addEventListener("click", function () {
  // Store the current movie in a variable
  let result = currentMovie;
  // Calculate the remaining tickets for the selected movie
  let remainingTickets = result.capacity - result.tickets_sold;

  // Get the ticket number element
  const ticket = document.getElementById("ticket-num");

  // Check if there are remaining tickets for the selected movie
  if (remainingTickets > 0) {
    // If there are remaining tickets, proceed with the ticket sale
    makeAsale(result);
  } else {
    // If there are no remaining tickets, display a "sold out" message
    ticket.innerText = "!!! sold out !!!";
  }
});

// Function to fetch movies from the API
function getmovies() {
  // Define the request options for the API call
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  // Fetch the list of movies from the API
  fetch("http://localhost:3000/films", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // Store the fetched movies in the "allmovies" array
      allmovies = result;
      // Display the list of movies on the webpage
      listmovies(result);
    })
    .catch((error) => console.error(error));
}

// Function to display the list of movies on the webpage
function listmovies(movies) {
  // Get the element to display the list of movies
  const movielist = document.getElementById("films");
  let html = "";
  // Loop through the list of movies and create HTML elements for each movie
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i];
    html += `<li class="film item" onclick="clickedmovie(${i})">${movie.title}</li>`;
  }
  // Set the inner HTML of the movie list element
  movielist.innerHTML = html;
}

// Function to handle a clicked movie
function clickedmovie(i) {
  // Get the poster element
  let poster = document.getElementById("poster");
  // Get the clicked movie from the list of all movies
  let clickedmovie = allmovies[i];
  // Set the source and alt attributes of the poster element
  poster.src = clickedmovie.poster;
  poster.alt = clickedmovie.title;
  // Fetch and display information about the clicked movie
  movieinfo(clickedmovie.id);
}

// Function to fetch and display movie information
function movieinfo(id) {
  // Get the elements to display movie information
  const title = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const info = document.getElementById("film-info");
  const showtime = document.getElementById("showtime");
  const ticket = document.getElementById("ticket-num");

  // Define the request options for the API call
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  // Fetch information about the movie from the API
  fetch(`http://localhost:3000/films/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // Display the fetched movie information on the webpage
      title.innerText = result.title;
      runtime.innerText = `${result.runtime} minutes`;
      info.innerText = result.description;
      showtime.innerText = result.showtime;
      ticket.innerText = `remaining tickets ${result.capacity - result.tickets_sold}`;
      // Store the current movie in the "currentMovie" variable
      currentMovie = result;
    })
    .catch((error) => console.error(error));
}

// Call the getmovies function to fetch and display the movies
getmovies();

// Function to handle the ticket purchase
function buyTicket() {
  // Get the ticket number element using jQuery
  const ticketHolder = $('#ticket-num');
  let tickets = ticketHolder.text();
  tickets = parseInt(tickets);

  // Check if there are available tickets
  if (tickets > 0) {
    // If there are available tickets, decrement the ticket count and update the display
    tickets--;
    ticketHolder.html(tickets);
  } else {
    // If there are no available tickets, display an alert message
    alert("This movie has no tickets left");
  }
}

// Function to update the movie information after a ticket sale
function makeAsale(movie) {
  // Define the headers for the API request
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");

  // Create a JSON string with the updated movie information
  const raw = JSON.stringify({
    "title": movie.title,
    "runtime": movie.runtime,
    "capacity": movie.capacity,
    "showtime": movie.showtime,
    "tickets_sold": movie.tickets_sold + 1,
    "description": movie.description,
    "poster": movie.poster,
  });

  // Define the request options for the API call
  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  // Update the movie information in the API
  fetch(`http://localhost:3000/films/${movie.id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // Display the updated movie information
      console.log(result);
      movieinfo(movie.id);
    })
    .catch((error) => console.error(error));
}
