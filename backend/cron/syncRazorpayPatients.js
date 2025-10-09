const Razorpay = require("razorpay");
require("dotenv").config();
const Patients = require("../models/Patients");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getPaymentDetails = async (patient) => {
  try {
    const paymentLink = await razorpay.paymentLink.fetch(patient.paymentId);

    return {
      ...patient._doc,
      status: paymentLink.status,
      url: paymentLink.short_url,
      created_at: new Date(paymentLink.created_at * 1000),
      updated_at: new Date(paymentLink.updated_at * 1000),
      currency: paymentLink.currency,
      amount: (paymentLink.amount / 100).toFixed(2),
      method: paymentLink.payment?.method || "",
    };
  } catch (error) {
    console.error(
      `❌ Error fetching for paymentId ${patient.paymentId}:`,
      error
    );
    return null;
  }
};
async function syncRazorpayToPatients() {
  try {
    const patients = await Patients.find({
      $or: [
        { status: "created" },
        { status: { $exists: false } },
        { status: "" },
        { status: null },
        { paymentId: { $exists: true, $ne: null, $ne: "" } },
      ],
    });

    for (const patient of patients) {
      try {
        const paymentData = await getPaymentDetails(patient);
        if (!paymentData) continue;

        console.log(
          `✅ Synced ${paymentData.name} | Status: ${paymentData.status} | Amount: ₹${paymentData.amount}`
        );

        await Patients.findByIdAndUpdate(patient._id, {
          $set: {
            status: paymentData.status,
            amount: paymentData.amount,
            method: paymentData.method,
            currency: paymentData.currency,
            payed_at: paymentData.updated_at,
          },
        });
      } catch (err) {
        console.error(`❌ Error syncing patient ${patient.name}:`, err);
      }
    }
  } catch (err) {
    console.error("❌ Top-level sync error:", err);
  }
}
module.exports = syncRazorpayToPatients;
