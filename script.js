$(document).ready(() => {
    displayBooks(); // Display existing books on page load

    // Handle form submission to add a new book
    $('#book-form').on('submit', function(e) {
        e.preventDefault();
        addBook();
    });

    // Initialize 3D animation
    init3DAnimation();
});

async function addBook() {
    const title = $('#title').val();
    const author = $('#author').val();

    if (!title || !author) {
        alert('Please fill out both fields.');
        return;
    }

    const book = {
        title: title,
        author: author,
        year: new Date().getFullYear() // Assuming you want to capture the current year
    };

    try {
        const response = await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (response.ok) {
            console.log('Book added successfully');
            displayBooks(); // Refresh the list of books after adding
            $('#book-form')[0].reset(); // Clear form inputs
        } else {
            throw new Error('Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

async function displayBooks() {
    try {
        const response = await fetch('http://localhost:3000/books');
        if (response.ok) {
            const books = await response.json();
            const bookList = $('#book-list');
            bookList.empty();

            books.forEach(book => {
                bookList.append(`
                    <div class="book" data-id="${book._id}">
                        <h3>${book.title}</h3>
                        <p>${book.author}</p>
                        <button class="edit">Edit</button>
                        <button class="remove">Remove</button>
                    </div>
                `);
            });

            // Reattach event handlers for edit and remove buttons
            $('.edit').off('click').on('click', function() {
                editBook($(this).closest('.book').data('id'));
            });

            $('.remove').off('click').on('click', function() {
                removeBook($(this).closest('.book').data('id'));
            });
        } else {
            throw new Error('Failed to fetch books');
        }
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

async function editBook(id) {
    const editedTitle = prompt("Enter new title:");
    const editedAuthor = prompt("Enter new author:");

    if (!editedTitle || !editedAuthor) {
        alert('Please provide both title and author.');
        return;
    }

    const book = {
        title: editedTitle,
        author: editedAuthor,
        year: new Date().getFullYear() // Assuming you want to update the year
    };

    try {
        const response = await fetch(`http://localhost:3000/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (response.ok) {
            console.log('Book updated successfully');
            displayBooks();  // Refresh the list of books after editing
        } else {
            throw new Error('Failed to edit book');
        }
    } catch (error) {
        console.error('Error editing book:', error);
    }
}

async function removeBook(id) {
    try {
        const response = await fetch(`http://localhost:3000/books/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Book deleted successfully');
            displayBooks();  // Refresh the list of books after deletion
        } else {
            throw new Error('Failed to delete book');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

function init3DAnimation() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('animation-container').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}