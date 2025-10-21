import { Router } from "express";
import { createPayment, cinetpayWebhook } from "../controllers/cinetpayController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { checkPaymentStatus } from "../controllers/cinetpayController.ts";

const router = Router();

router.post("/create-payment", authMiddleware, createPayment);
router.post("/cinetpay-webhook", createPayment); // webhook accessible sans auth
router.post("cinetpay0-webhook", cinetpayWebhook);
router.post("/check", checkPaymentStatus);

export default router;
