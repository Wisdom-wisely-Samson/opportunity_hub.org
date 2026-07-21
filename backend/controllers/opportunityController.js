const { validationResult } = require("express-validator");
const Opportunity = require("../models/Opportunity");
const { sendSuccess, sendError } = require("../utils/response");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const cloudinary = require("cloudinary").v2;
const Organization = require("../models/Organization");
const SavedOpportunity = require("../models/SavedOpportunity");
const Application = require("../models/Application");

exports.updateOpportunity = async (req, res, next) => {
  try {
    // Parse arrays safely
    ["requirements", "benefits", "tags"].forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {
          req.body[field] = [];
        }
      }
    });

    // Sanitize optional fields
    if (req.body.salary) req.body.salary = req.body.salary.toString();
    if (!req.body.duration) req.body.duration = null;

    // Run express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    // Find opportunity
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return sendError(res, 404, "Opportunity not found");

    // Authorization
    if (
      opportunity.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return sendError(
        res,
        403,
        "You are not authorized to edit this opportunity",
      );
    }

    // Handle cover image update
    let coverImage = opportunity.coverImage;
    if (req.file) {
      // Delete old image if exists
      if (coverImage?.publicId) {
        try {
          await cloudinary.uploader.destroy(coverImage.publicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      // Upload new image
      const result = await uploadToCloudinary(
        req.file.buffer || req.file.path, // handle both memoryStorage and diskStorage
        "opportunity-hub/opportunities",
        "image",
      );

      coverImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    // Allowed fields for update
    const allowedFields = [
      "title",
      "description",
      "category",
      "location",
      "isRemote",
      "deadline",
      "requirements",
      "benefits",
      "tags",
      "status",
      "salary",
      "fundingAmount",
      "duration",
      "eligibility",
      "howToApply",
      "externalLink",
    ];

    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Add coverImage if updated
    updates.coverImage = coverImage;

    // Update opportunity
    const updated = await Opportunity.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    ).populate("organization", "organizationName logo isVerified");

    return sendSuccess(res, 200, "Opportunity updated", updated);
  } catch (err) {
    console.error("Update opportunity error:", err); // ✅ log actual error
    next(err);
  }
};

exports.deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return sendError(res, 404, "Opportunity not found");
    if (
      opportunity.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return sendError(
        res,
        403,
        "You are not authorized to delete this opportunity",
      );
    }

    await Promise.all([
      Opportunity.findByIdAndDelete(req.params.id),
      Application.deleteMany({ opportunity: req.params.id }),
      SavedOpportunity.deleteMany({ opportunity: req.params.id }),
    ]);

    return sendSuccess(res, 200, "Opportunity deleted");
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      status: "active",
      deadline: { $gte: new Date() },
    })
      .populate("organization", "organizationName logo isVerified type")
      .sort("-createdAt")
      .limit(6);
    return sendSuccess(res, 200, "Featured opportunities", opportunities);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Opportunity.aggregate([
      { $match: { status: "active", deadline: { $gte: new Date() } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return sendSuccess(res, 200, "Category stats", stats);
  } catch (err) {
    next(err);
  }
};
exports.getMyOrganizationOpportunities = async (req, res, next) => {
  try {
    // Find organization linked to this user
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) {
      return sendError(res, 403, "Please create an organization profile first");
    }

    const opportunities = await Opportunity.find({ organization: org._id })
      .populate("organization", "organizationName logo isVerified")
      .sort("-createdAt");

    return sendSuccess(
      res,
      200,
      "Organization opportunities retrieved",
      opportunities,
    );
  } catch (err) {
    next(err);
  }
};
