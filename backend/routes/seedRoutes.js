import express from "express"
import seed from "../seed.js"   // your seed script

const router = express.Router()

let hasRun = false   // prevents multiple runs

router.get("/run", async (req, res) => {
  if (hasRun) {
    return res.status(403).json({
      success: false,
      message: "Seed already executed",
    })
  }

  try {
    await seed()
    hasRun = true

    res.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

export default router
