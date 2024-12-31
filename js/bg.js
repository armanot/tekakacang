// Backend API URL
const API_URL = 'http://localhost:3000/api';

// Function to submit a guess
function submitGuess(event) {
    event.preventDefault(); // Prevent form from reloading the page

    const name = document.getElementById('name').value.trim();
    const guess = parseInt(document.getElementById('guess').value, 10);

    if (!name || isNaN(guess)) {
        alert('Please enter a valid name and guess.');
        return;
    }

    fetch(`${API_URL}/guess`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, guess }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                alert(data.message);
                if (response.ok) {
                    updateTable(); // Refresh the guesses table
                }
            }
        })
        .catch((error) => console.error('Error:', error));
}

// Function to fetch and display all guesses
function updateTable() {
    fetch(`${API_URL}/guesses`)
        .then((response) => response.json())
        .then((data) => {
            const tbody = document.querySelector('#guessTable tbody');
            tbody.innerHTML = ''; // Clear previous data

            data.forEach(({ name, guess }) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${name}</td><td>${guess}</td>`;
                tbody.appendChild(row);
            });
        })
        .catch((error) => console.error('Error fetching guesses:', error));
}

// Function to search for a guess by name
function searchGuess() {
    const searchName = document.getElementById('searchName').value.trim();
    if (!searchName) {
        alert('Please enter a name to search.');
        return;
    }

    fetch(`${API_URL}/guesses/${searchName}`)
        .then((response) => response.json())
        .then((data) => {
            const tbody = document.querySelector('#guessTable tbody');
            tbody.innerHTML = ''; // Clear the table

            if (data.name) {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${data.name}</td><td>${data.guess}</td>`;
                tbody.appendChild(row);
            } else {
                alert('No guess found for this name.');
            }
        })
        .catch((error) => console.error('Error searching guess:', error));
}

// Attach event listeners
document.getElementById('guessForm').addEventListener('submit', submitGuess);
document.getElementById('searchButton').addEventListener('click', searchGuess);

// Initial load of all guesses
updateTable();