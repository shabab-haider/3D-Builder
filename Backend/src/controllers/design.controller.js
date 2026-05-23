const designModel = require("../models/design.model");

const saveDesign = async (req, res) => {
  try {
    const designData = req.body;
    const design = await designModel.create(designData);
    res.status(201).json({ success: true, data: design });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to save design" });
  }
};

const getDesigns = async (req, res) => {
  try {
    const designs = await designModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: designs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch designs" });
  }
};

const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    await designModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Design deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete design" });
  }
};

module.exports = { saveDesign, getDesigns, deleteDesign };

