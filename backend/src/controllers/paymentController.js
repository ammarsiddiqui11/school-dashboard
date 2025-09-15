const axios = require('axios');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');

/**
 * createPayment:
 *  - save an Order (basic info)
 *  - sign payload with PG secret (JWT)
 *  - call Edviron create-collect-request API
 *  - store gateway_collect_id in OrderStatus
 *  - return payment link to frontend
 */
exports.createPayment = async (req, res, next) => {
  try {
    const {
      school_id = process.env.SCHOOL_ID,
      trustee_id,
      student_info,
      order_amount,
      custom_order_id
    } = req.body;

    // minimal validation
    if (!order_amount || !student_info) {
      return res.status(400).json({ message: 'Missing order_amount or student_info' });
    }

    // Create an Order document
    const order = new Order({
      school_id,
      trustee_id,
      student_info,
      custom_order_id,
      gateway_name: "Edviron"
    });
    await order.save();

    // create initial order status entry with pending
    const orderStatus = new OrderStatus({
      collect_id: order._id,
      order_amount,
      status: 'pending',
      custom_order_id: custom_order_id || undefined
    });
    await orderStatus.save();

    // ✅ Edviron requires JWT with { school_id, amount, callback_url }
    const payloadForSign = {
      school_id,
      amount: String(order_amount), // must be string
      callback_url: req.body.redirect_url || "https://google.com"
    };

    // ✅ Sign with PG secret key
    const sign = jwt.sign(payloadForSign, process.env.PAYMENT_PG_KEY, {
      algorithm: "HS256"
    });

    // ✅ Build request body as per docs
    const requestBody = {
      school_id,
      amount: String(order_amount),
      callback_url: payloadForSign.callback_url,
      sign
    };

    // ✅ Call Edviron API
    const response = await axios.post(
      process.env.PAYMENT_API_ENDPOINT, // should be https://dev-vanilla.edviron.com/erp/create-collect-request
      requestBody,
      {
        headers: {
          "Authorization": `Bearer ${process.env.PAYMENT_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    // ✅ Extract values
    const { collect_request_id, Collect_request_url } = response.data;

    // 🔹 Save gateway_collect_id in OrderStatus (for webhook lookup)
    orderStatus.gateway_collect_id = collect_request_id;
    await orderStatus.save();

    return res.status(201).json({
      message: "Payment created",
      order_id: order._id,
      local_collect_id: orderStatus._id,
      gateway_collect_id: collect_request_id,
      paymentLink: Collect_request_url,
      rawResponse: response.data
    });
  } catch (err) {
    console.error("Payment error:", err.response?.data || err.message);
    next(err);
  }

};
exports.handleWebhook = async (req, res, next) => {
  try {
    const payload = req.body;

    console.log("📩 Webhook received:", payload);

    // Extract fields (depends on Edviron’s webhook structure)
    const orderInfo = payload.order_info || {};

    // Accept either order_id or collect_request_id
    const searchId = orderInfo.order_id || orderInfo.collect_request_id;

    if (!searchId) {
      return res.status(400).json({ message: "Invalid webhook payload: missing order_id or collect_request_id" });
    }

    // Find OrderStatus by gateway_collect_id
    const orderStatus = await OrderStatus.findOne({
      gateway_collect_id: searchId
    });

    if (!orderStatus) {
      return res.status(404).json({ message: `Order status not found for gateway_collect_id=${searchId}` });
    }

    // Update with webhook data
    orderStatus.status = orderInfo.status || orderStatus.status;
    orderStatus.transaction_amount = orderInfo.transaction_amount || orderStatus.transaction_amount;
    orderStatus.gateway = orderInfo.gateway || orderStatus.gateway;
    orderStatus.bank_reference = orderInfo.bank_reference || orderStatus.bank_reference;
    orderStatus.payment_mode = orderInfo.payment_mode || orderStatus.payment_mode;
    orderStatus.payment_message = orderInfo.payment_message || orderStatus.payment_message;
    orderStatus.payment_time = orderInfo.payment_time || orderStatus.payment_time;

    await orderStatus.save();

    return res.status(200).json({ message: "Webhook processed", updated: orderStatus });
  } catch (err) {
    console.error("Webhook error:", err.message);
    next(err);
  }
};

// biddat
exports.getTransactionStatus = async (req, res, next) => {
  try {
    const { custom_order_id } = req.params;
    const status = await OrderStatus.findOne({ custom_order_id });

    if (!status) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(status);
  } catch (err) {
    next(err);
  }
};

// ✅ Get all transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const statuses = await OrderStatus.find();
    res.json(statuses);
  } catch (err) {
    next(err);
  }
};

// ✅ Get transactions by school
exports.getTransactionsBySchool = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const statuses = await OrderStatus.find().populate({
      path: "collect_id",
      match: { school_id: schoolId }
    });

    const filtered = statuses.filter(s => s.collect_id !== null);
    res.json(filtered);
  } catch (err) {
    next(err);
  }
};
exports.checkPaymentStatus = async (req, res, next) => {
  try {
    const { collectId } = req.params;

    // prepare payload
    const payload = {
      school_id: process.env.SCHOOL_ID,
      collect_request_id: collectId
    };

    // sign with PG key
    const sign = jwt.sign(payload, process.env.PAYMENT_PG_KEY, {
      algorithm: "HS256"
    });

    // call Edviron status API
    const response = await axios.get(
      `https://dev-vanilla.edviron.com/erp/collect-request/${collectId}`,
      {
        params: {
          school_id: process.env.SCHOOL_ID,
          sign
        },
        headers: {
          Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Error checking status", error: err.message });
  }
};