# 3D Builder Database Design Documentation

This document describes the MongoDB database schema (using Mongoose) for storing 3D product customization configurations (colors, decals, logo positions, text content, scales, and quaternions).

---

## 1. Database Model (Mongoose)

Add this file to your backend server as `models/Design.js`.

```javascript
const mongoose = require('mongoose');

// Schema for Text Decal Overlays
const TextOverlaySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  text: { type: String, required: true },
  color: { type: String, default: '#111827' },
  position: { type: [Number], required: true },     // [x, y, z] relative to target mesh
  quaternion: { type: [Number], required: true },   // [x, y, z, w] orientation relative to normal
  size: { type: Number, required: true },           // Decal visual scale
  mesh: { type: String, required: true },           // Name or UUID of the mesh it's attached to
  rotationAngle: { type: Number, default: 0 }       // Additional spin around Z axis
});

// Schema for Logo/Image Decal Overlays
const LogoOverlaySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },            // Absolute image URL (e.g. Cloudinary)
  position: { type: [Number], required: true },     // [x, y, z]
  quaternion: { type: [Number], required: true },   // [x, y, z, w]
  size: { type: Number, required: true },
  mesh: { type: String, required: true },           // Name or UUID of target mesh
  rotationAngle: { type: Number, default: 0 }
});

// Main Design Configuration Schema
const DesignSchema = new mongoose.Schema({
  productCategory: { 
    type: String, 
    required: true, 
    default: 'AMERICAN FOOTBALL' 
  },
  modelPath: { 
    type: String, 
    required: true 
  }, // Relative path to frontend GLB (e.g. 'Glbs/football.glb')
  
  // Dynamic map for colors (e.g., { "football_body": "#EF4444", "laces": "#FFFFFF" })
  partColors: {
    type: Map,
    of: String,
    default: {}
  },
  
  textList: [TextOverlaySchema],
  logoList: [LogoOverlaySchema]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Design', DesignSchema);
```

---

## 2. API Endpoints Reference

### A. Save Design (`POST /api/designs`)
- **Request Body Example:**
```json
{
  "productCategory": "AMERICAN FOOTBALL",
  "modelPath": "Glbs/football.glb",
  "partColors": {
    "body": "#EF4444",
    "sleeves": "#FFFFFF"
  },
  "textList": [
    {
      "id": "text-1716382103445",
      "name": "COBRA",
      "text": "COBRA",
      "color": "#111827",
      "position": [0, 0.5, 0.1],
      "quaternion": [0, 0, 0, 1],
      "size": 0.12,
      "mesh": "football_body",
      "rotationAngle": 0
    }
  ],
  "logoList": [
    {
      "id": "logo-1716382199211",
      "name": "Logo",
      "url": "https://res.cloudinary.com/demo/image/upload/v1570975253/sample.jpg",
      "position": [0.12, 0.45, -0.02],
      "quaternion": [0.5, 0.5, 0.5, 0.5],
      "size": 0.15,
      "mesh": "football_body",
      "rotationAngle": 45
    }
  ]
}
```

### B. Fetch Design (`GET /api/designs/:id`)
- **Response Body:** Returns the stored configuration. The frontend uses these fields directly to populate the builder contexts on load.

---

## 3. Data Integration Mapping

When fetching a design, mapping the data directly to the frontend context is straightforward:

| Database Column | Frontend Context Setter | Target Context |
| :--- | :--- | :--- |
| `productCategory` | `setProducts(data.productCategory)` | `dashboardDataContext` |
| `modelPath` | `setModel(data.modelPath)` | `dashboardDataContext` |
| `partColors` | `setPartColors(data.partColors)` | `dashboardDataContext` |
| `textList` | `setTextList(data.textList)` | `builderContext` |
| `logoList` | `setLogoList(data.logoList)` | `builderContext` |
