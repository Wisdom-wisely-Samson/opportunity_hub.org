const express = require("express");
const router = express.Router();
const oppController = require("../controllers/opportunityController");
const { protect, optionalAuth } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const {
  createOpportunityValidator,
  updateOpportunityValidator,
} = require("../validators/opportunityValidator");
const { imageUpload } = require("../middleware/upload");

// Public routes
router.get("/", optionalAuth, oppController.getOpportunities);
router.get("/featured", oppController.getFeaturedOpportunities);
router.get("/categories/stats", oppController.getCategoryStats);

router.get(
  "/my-organization",
  protect,
  authorize("organization", "admin"),
  oppController.getMyOrganizationOpportunities,
);

router.get("/:id", optionalAuth, oppController.getOpportunityById);

// Protected routes
router.use(protect);

router.post(
  "/",
  authorize("organization"),
  imageUpload.single("coverImage"),
  createOpportunityValidator,
  oppController.createOpportunity,
);

router.put(
  "/:id",
  authorize("organization", "admin"),
  imageUpload.single("coverImage"),
  updateOpportunityValidator,
  oppController.updateOpportunity,
);

router.delete(
  "/:id",
  authorize("organization", "admin"),
  oppController.deleteOpportunity,
);

module.exports = router;
