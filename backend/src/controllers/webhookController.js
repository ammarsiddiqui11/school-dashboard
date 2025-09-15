exports.handleWebhook = async (req, res, next) => {
  try {
    const payload = req.body;

    // log the raw payload
    const log = new WebhookLog({ received_payload: payload });
    await log.save();

    const order_info = payload?.order_info;
    if (!order_info) {
      log.processed = false;
      log.error = 'no order_info';
      await log.save();
      return res.status(400).json({ message: 'Invalid payload: no order_info' });
    }

    //  Extract identifiers
    const order_id_field = order_info.order_id || order_info.collect_id || null;
    let orderStatus = null;

    //  First try: match by gateway_collect_id (Edviron sends this)
    if (order_id_field) {
      orderStatus = await OrderStatus.findOneAndUpdate(
        { gateway_collect_id: order_id_field },
        {
          status: order_info.status || order_info.payment_status || 'unknown',
          transaction_amount: order_info.transaction_amount,
          order_amount: order_info.order_amount,
          payment_mode: order_info.payment_mode,
          payment_details: order_info.payment_details,
          bank_reference: order_info.bank_reference,
          payment_message: order_info.payment_message,
          error_message: order_info.error_message,
          payment_time: order_info.payment_time ? new Date(order_info.payment_time) : undefined
        },
        { new: true }
      );
    }

    //  Second try: by custom_order_id
    if (!orderStatus && order_info.custom_order_id) {
      orderStatus = await OrderStatus.findOneAndUpdate(
        { custom_order_id: order_info.custom_order_id },
        { status: order_info.status },
        { new: true }
      );
    }

    //  If not found, create a new status entry linked to Order
    if (!orderStatus) {
      let order = null;
      if (order_id_field && order_id_field.match && order_id_field.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(order_id_field);
      } else if (order_info.custom_order_id) {
        order = await Order.findOne({ custom_order_id: order_info.custom_order_id });
      }

      if (order) {
        const newStatus = new OrderStatus({
          collect_id: order._id,
          custom_order_id: order_info.custom_order_id || undefined,
          gateway_collect_id: order_id_field,
          status: order_info.status,
          transaction_amount: order_info.transaction_amount,
          order_amount: order_info.order_amount,
          payment_mode: order_info.payment_mode,
          payment_details: order_info.payment_details,
          bank_reference: order_info.bank_reference,
          payment_message: order_info.payment_message,
          error_message: order_info.error_message,
          payment_time: order_info.payment_time ? new Date(order_info.payment_time) : undefined
        });
        orderStatus = await newStatus.save();
      }
    }

    log.processed = true;
    await log.save();

    return res.status(200).json({ message: 'Webhook processed', orderStatus });
  } catch (err) {
    console.error("Webhook error:", err.message);
    next(err);
  }
};
