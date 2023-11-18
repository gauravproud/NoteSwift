const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// Route 1: All Notes /api/notes/fetchallnotes
router.get('/fetch', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 2: Add New Notes
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {
        // extracting the data from thunderclient
        const { title, description, tag } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // adding the detail of new notes
        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 3 and 4 can be added in try-catch statements

// Route 3 : update an Note
router.put('/update/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;

    // create a newNote object
    const newNote = {};

    // if the data is coming then put in newNote object
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    // req.params.id is the id tha is given by the put
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not found") }

    if (note.user.toString() !== req.user.id) {
        // accesing others data
        return res.status(401).send("Not Allowed");
    }

    // setting new as true means is new entry comes it is allowed to written
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

    res.json({ note });
})

// Route 4 : delete a Note
router.delete('/delete/:id', fetchuser, async (req, res) => {

    // find the node
    // req.params.id is the id tha is given by the put
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not found") }

    if (note.user.toString() !== req.user.id) {
        // accesing others data
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted", note:note});
})

module.exports = router