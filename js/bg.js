// Backend API URL
const API_URL = 'https://tekakacang.onrender.com/api';

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
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message || 'Failed to submit guess.');
                });
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message); // Show success message
            updateTable(); // Refresh the guesses table
            document.getElementById('guessForm').reset(); // Clear the form fields
        })
        .catch((error) => {
            alert(`Error: ${error.message}`);
            console.error('Error submitting guess:', error);
        });
}

// Function to fetch and display all guesses
function updateTable() {
    fetch(`${API_URL}/guesses`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Fetched data:', data); // For debugging
            const tbody = document.querySelector('#guessTable tbody');
            tbody.innerHTML = ''; // Clear previous data

            data.forEach(({ id, name, guess }) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${guess}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteGuess(${id})">Delete</button>
                    </td>
                `;
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

function deleteGuess(id) {
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }

    fetch(`${API_URL}/guesses/${id}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message); // Show success message
            updateTable(); // Refresh the table
        })
        .catch((error) => console.error('Error deleting guess:', error));
}


// Attach event listeners
document.getElementById('guessForm').addEventListener('submit', submitGuess);
// document.getElementById('searchButton').addEventListener('click', searchGuess);
document.getElementById('viewGuessesButton').addEventListener('click', updateTable);

// Initial load of all guesses
updateTable();

