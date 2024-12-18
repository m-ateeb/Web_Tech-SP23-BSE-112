const express = require("express");
const router = express.Router();
const orderModel = require("../../models/order.model");

// Admin Panel: Fetch Orders

router.get("/admin/order",  async (req, res) => {    try {
        const pendingOrders = await orderModel.find({ status: "Pending" });
        const completedOrders = await orderModel.find({ status: "Completed" });
        res.render("admin/order", {
            layout: "adminlayout",
            pendingOrders,
            completedOrders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Error fetching orders");
    }
});


// Mark Order as Complete
router.post("/admin/order/mark-complete/:id", async (req, res) => {
    try {
        const orderId = req.params.id;

        // Update the order status to "Completed"
        await orderModel.findByIdAndUpdate(orderId, { status: "Completed" });

        // Redirect back to the admin panel
        res.redirect("/admin/order");
    } catch (error) {
        console.error("Error marking order as complete:", error);
        res.status(500).send("Error marking order as complete");
    }
});

module.exports = router;
