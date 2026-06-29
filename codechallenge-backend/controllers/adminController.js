const statsModel = require("../models/statsModel");

const getStats = async (req, res) => {
  try {
    const stats = await statsModel.getGlobalStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTopUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await statsModel.getTopUsers(limit);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDefiStats = async (req, res) => {
  try {
    const stats = await statsModel.getDefiStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const activity = await statsModel.getActivityByDay(days);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSoumissions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const soumissions = await statsModel.getRecentSoumissions(limit);
    res.json(soumissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await statsModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await statsModel.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats, getTopUsers, getDefiStats, getActivity, getSoumissions, getAllUsers, deleteUser };