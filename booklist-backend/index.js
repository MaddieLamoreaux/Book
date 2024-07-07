const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/booklist', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number
});

const Book = mongoose.model('Book', bookSchema);

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.json(newBook);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


