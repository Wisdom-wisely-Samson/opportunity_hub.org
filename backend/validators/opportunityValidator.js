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


