const mongoose = require("mongoose");

// Schema for Text Decal Overlays
const TextOverlaySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  text: { type: String, required: true },
  color: { type: String, default: "#111827" },
  position: { type: [Number], required: true }, // [x, y, z] relative to target mesh
  quaternion: { type: [Number], required: true }, // [x, y, z, w] orientation relative to normal
  size: { type: Number, required: true }, // Decal visual scale
  mesh: { type: String, required: true }, // Name or UUID of the mesh it's attached to
  rotationAngle: { type: Number, default: 0 }, // Additional spin around Z axis
});

// Schema for Logo/Image Decal Overlays
const LogoOverlaySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }, // Absolute image URL (e.g. Cloudinary)
  position: { type: [Number], required: true }, // [x, y, z]
  quaternion: { type: [Number], required: true }, // [x, y, z, w]
  size: { type: Number, required: true },
  mesh: { type: String, required: true }, // Name or UUID of target mesh
  rotationAngle: { type: Number, default: 0 },
});

// Main Design Configuration Schema
const DesignSchema = new mongoose.Schema(
  {
    productCategory: {
      type: String,
      required: true,
      default: "AMERICAN FOOTBALL",
    },
    modelPath: {
      type: String,
      required: true,
    }, // Relative path to frontend GLB (e.g. 'Glbs/football.glb')

    // Dynamic map for colors (e.g., { "football_body": "#EF4444", "laces": "#FFFFFF" })
    partColors: {
      type: Map,
      of: String,
      default: {},
    },

    textList: [TextOverlaySchema],
    logoList: [LogoOverlaySchema],
    thumbnail: { type: String },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

module.exports = mongoose.model("Design", DesignSchema);
