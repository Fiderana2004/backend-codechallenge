const defiModel = require("../models/defiModel");

const getAllDefis = async (req, res) => {
  try {
    const defis = await defiModel.getAllDefis();
    res.json(defis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDefiById = async (req, res) => {
  try {
    const defi = await defiModel.getDefiById(req.params.id);
    if (!defi) return res.status(404).json({ error: "Défi introuvable" });
    res.json(defi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDefi = async (req, res) => {
  try {
    const { titre, description, difficulte, points, reponse_attendue, langage } = req.body;
    if (!titre || !difficulte || !points) {
      return res.status(400).json({ error: "titre, difficulte et points sont requis" });
    }
    const defi = await defiModel.createDefi({ titre, description, difficulte, points, reponse_attendue, langage });
    res.status(201).json(defi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDefi = async (req, res) => {
  try {
    const defi = await defiModel.updateDefi(req.params.id, req.body);
    if (!defi) return res.status(404).json({ error: "Défi introuvable" });
    res.json(defi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDefi = async (req, res) => {
  try {
    const defi = await defiModel.deleteDefi(req.params.id);
    if (!defi) return res.status(404).json({ error: "Défi introuvable" });
    res.json({ message: "Défi supprimé avec ses soumissions", defi });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllDefis, getDefiById, createDefi, updateDefi, deleteDefi };