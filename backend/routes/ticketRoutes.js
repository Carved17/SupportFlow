const express = require("express");
const router = express.Router();
const controller = require("../controllers/ticketController");

router.post("/", controller.createTicket);
router.get("/", controller.getAllTickets);
router.get("/:id", controller.getTicket);
router.put("/:id", controller.updateTicket);
router.delete("/:id", controller.deleteTicket);

module.exports = router;
