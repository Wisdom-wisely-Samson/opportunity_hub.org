const { body } = require("express-validator");

// Helper to validate JSON-string OR array
const jsonOrArray = (value) => {
  if (typeof value === "string") {
    JSON.parse(value); // throws if invalid JSON
    return true;
  }
  if (Array.isArray(value)) return true;
  throw new Error("Invalid value");
};

const createOpportunityValidator = [
  body("title")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("category")
    .optional()
    .isIn([
      "job",
      "scholarship",
      "grant",
      "training",
      "internship",
      "fellowship",
      "entrepreneurship",
    ])
    .withMessage("Invalid category"),

  body("location").optional(),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid deadline date"),

  body("applicationType")
    .optional()
    .isIn(["internal", "external"])
    .withMessage("Invalid application type"),

  body("externalLink")
    .optional()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Please provide a valid external URL starting with http:// or https://"),

  body("howToApply")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Application instructions cannot exceed 2000 characters"),

  body("externalLink").custom((value, { req }) => {
    if (req.body.applicationType === "external" && !value) {
      throw new Error("External link is required for external applications");
    }
    return true;
  }),

  // Arrays (JSON-string or array)
  body("requirements").optional().custom(jsonOrArray),
  body("benefits").optional().custom(jsonOrArray),
  body("tags").optional().custom(jsonOrArray),
];

const updateOpportunityValidator = [
  body("title")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("category")
    .optional()
    .isIn([
      "job",
      "scholarship",
      "grant",
      "training",
      "internship",
      "fellowship",
      "entrepreneurship",
    ])
    .withMessage("Invalid category"),

  body("status")
    .optional()
    .isIn(["active", "closed", "draft", "expired"])
    .withMessage("Invalid status"),

  body("applicationType")
    .optional()
    .isIn(["internal", "external"])
    .withMessage("Invalid application type"),

  body("externalLink")
    .optional()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Please provide a valid external URL starting with http:// or https://"),

  body("howToApply")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Application instructions cannot exceed 2000 characters"),

  body("externalLink").custom((value, { req }) => {
    if (req.body.applicationType === "external" && !value) {
      throw new Error("External link is required for external applications");
    }
    return true;
  }),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid deadline date"),

  // Arrays (JSON-string or array)
  body("requirements").optional().custom(jsonOrArray),
  body("benefits").optional().custom(jsonOrArray),
  body("tags").optional().custom(jsonOrArray),
];

module.exports = { createOpportunityValidator, updateOpportunityValidator };


