const express = require("express");
const songs = express.Router();
const {
  getAllSongs,
  getSong,
  createSong,
  deleteSong,
  updateSong,
  getAllPlaylistSongs,
} = require("../queries/songs");
const {
  checkName,
  checkArtist,
  checkBoolean,
  validateURL,
} = require("../validations/checkSongs");

// INDEX
songs.get("/", async (req, res) => {
  const allSongs = await getAllSongs();
  if (allSongs[0]) {
    res.status(200).json(allSongs);
  } else {
    res.status(500).json({ error: "No songs found" });
  }
});

songs.get("/playlistsongs/:id", async (req, res) => {
  const { id } = req.params;
  const playlistSongs = await getAllPlaylistSongs(id);
  if (playlistSongs[0]) {
    res.status(200).json(playlistSongs);
  } else {
    res.status(500).json({ error: "No playlist songs found" });
  }
});

// SHOW
songs.get("/:id", async (req, res) => {
  const { id } = req.params;
  const song = await getSong(id);
  if (song) {
    res.json(song);
  } else {
    res.status(404).json({ error: "Song not found" });
  }
});

// CREATE
songs.post("/", checkName, checkArtist, checkBoolean, async (req, res) => {
  try {
    const song = await createSong(req.body);
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// DELETE
songs.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedSong = await deleteSong(id);
  if (deletedSong.id) {
    res.status(200).json(deletedSong);
  } else {
    res.status(404).json("Song not found");
  }
});

// UPDATE
songs.put("/:id", checkArtist, checkBoolean, checkName, async (req, res) => {
  const { id } = req.params;
  const updatedSong = await updateSong(id, req.body);
  res.status(200).json(updatedSong);
});

module.exports = songs;
