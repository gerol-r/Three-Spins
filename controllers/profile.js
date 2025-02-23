const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
// Importing rank helper functions from /utilities
const { getRankText, isRankUsed } = require('../utilities/rankUtils');


//** ROUTES **//
// INDEX

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        // Map rank numbers to display text
        const songsWithRankText = currentUser.songs.map(song => {
            return {
                ...song.toObject(), // Convert Mongoose doc to plain object
                rankText: getRankText(song.rank) // Add rankText property
            };
        });

        // Render profile view and pass user's songs with rankText
        res.render('profile/index.ejs', {
            user: currentUser, // Pass the user object
            songs: songsWithRankText, // Pass the songs array with rankText
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

  
// INDEX
// NEW
router.get('/new', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        // Get a list of ranks that are already taken
        const takenRanks = currentUser.songs.map(song => song.rank);
        // Check if all ranks are taken
        const allRanksTaken = takenRanks.length === 3;

        res.render('profile/new.ejs', {
            user: currentUser,
            takenRanks: takenRanks, // Pass the list of taken ranks to the view
            allRanksTaken: allRanksTaken,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});
// NEW
// DELETE
router.delete('/:songId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      // Using Mongoose .deleteOne() method to delete song using id from req.params
      currentUser.songs.id(req.params.songId).deleteOne();
      // Save changes to the user
      await currentUser.save();
      res.redirect(`/users/${currentUser._id}/profile`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
// DELETE
// UPDATE
router.put('/:songId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const song = currentUser.songs.id(req.params.songId);
        // Using Mongoose.set() method to update current song + show new form data on `req.body`
        song.set(req.body);
        await currentUser.save();
        // Redir to show view of current song
        res.redirect(
            `/users/${currentUser._id}/profile/${req.params.songId}`
        );
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});
// UPDATE
// CREATE
router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        // Push req.body (the new form data object) to current user's profile array
        currentUser.songs.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/profile`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

    // CREATE route for adding a new song
router.post('/add-song', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        // Check if the rank is already used
        if (isRankUsed(currentUser, parseInt(req.body.rank))) {
            return res.render('profile/new.ejs', {
                user: currentUser,
                error: 'Rank already used. Please choose a different rank.'
            });
        }
        currentUser.songs.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/profile`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});
// CREATE
// EDIT
router.get('/:songId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const song = currentUser.songs.id(req.params.songId);
        song.rankText = getRankText(song.rank);

        res.render('profile/edit.ejs', {
            user: currentUser,
            song: song,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});
  
// EDIT
// SHOW
router.get('/:songId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const song = currentUser.songs.id(req.params.songId);
      // Render the show view, passing the song data in the context object
      res.render('profile/show.ejs', {
        user: currentUser,
        song: song,
      });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
// SHOW
//** ROUTES **//


module.exports = router;