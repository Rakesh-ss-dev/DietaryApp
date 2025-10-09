const express = require("express");
const Razorpay = require("razorpay");
const Package = require("../models/Package");
const Patient = require("../models/Patients");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Patients = require("../models/Patients");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { loadImage } = require("canvas");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");
const HealthReport = require("../models/HealthReport");
const DailyWeight = require("../models/DailyWeight");
const Diabetes = require("../models/Diabetes");
const router = express.Router();

require("dotenv").config();
const { google } = require("googleapis");
const { console } = require("inspector");
const configPath = path.join(__dirname, "../report-config.json");
const credentialsPath = path.join(
  __dirname,
  "../wow-sheets-464605-b6fdde8d81b1.json"
);

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// helper function to format date to indian format
const formatReadableDate = (isoString) => {
  if (!isoString) return "Invalid Date";

  const date = new Date(isoString);

  const day = date.toLocaleString("en-IN", {
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const month = date.toLocaleString("en-IN", {
    month: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const year = date.toLocaleString("en-IN", {
    year: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  return `${day}/${month}/${year}, ${time}`;
};

//helper function to replace placeholders in email template
function replacePlaceholders(template, data) {
  return template.replace(/\[([^\]]+)\]/g, (match, key) => data[key] || match);
}

// creating a razorpay object with keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate Razorpay Payment Link
router.post("/create-payment-link", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      city,
      phone,
      category,
      discount,
      finalAmount,
      tobePaid,
      installment,
      programStartDate,
      cause,
      referrerPhone,
      countryCode,
      tax,
    } = req.body;

    // 1) Validate package exists
    const category_from_db = await Package.findOne({ name: category });
    if (!category_from_db) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid package selected" });
    }

    // 2) Build description + amount (in subunits)
    let description = `Payment for ${category_from_db.name} | Tax: 5% `;
    let amount =
      tobePaid && parseFloat(tobePaid) > 0
        ? parseFloat(tobePaid) * 100
        : parseFloat(finalAmount) * 100;

    if (discount > 0) {
      description += ` | Discount: ${discount}%`;
    }
    description +=
      "\nBy proceeding, you agree to our \nTerms & Conditions: https://wowglobal.in/terms.html";
    const options = {
      amount: parseInt(amount, 10),
      currency: category_from_db.currency || "INR",
      accept_partial: false,
      description,
      customer: {
        name,
        contact: `${countryCode}${phone}`, // keep as-is per your flow
      },
      notify: { sms: true, email: true, whatsapp: true },
      reminder_enable: true,
      callback_method: "get",
      callback_url: `${process.env.FRONTEND_URL}/payment_success`,
    };

    // 3) Create link with Razorpay
    const order = await razorpay.paymentLink.create(options);

    const ref = await Patient.findOne({ phone: referrerPhone });

    // 4) Persist
    const patient = new Patient({
      name,
      phone,
      countryCode,
      city,
      package: category_from_db,
      paymentId: order.id,
      discount: Number(discount) || 0,
      installment, // your existing installment logic
      createdBy: req.user,
      amount: Number(parseFloat(finalAmount).toFixed(2)), // store number
      programStartDate,
      cause,
      ref,
      tax,
      dueAmount:
        Number(tobePaid) === 0
          ? 0
          : Number((parseFloat(finalAmount) - parseFloat(tobePaid)).toFixed(2)),
    });

    await patient.save();

    // 5) Response
    res.json({ success: true, payment_link: order.short_url });
  } catch (error) {
    console.error("Payment link error:", error);
    res.status(500).json({
      success: false,
      message: error?.error?.description || error.message,
    });
  }
});

router.post("/request-installment", authMiddleware, async (req, res) => {
  const { id, dueAmount } = req.body;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    const categoryfromdb = await Package.findById(patient.package);
    let description = `Payment for your Golden 90 ${categoryfromdb.name} | Tax: 5%`;
    let amount = dueAmount.toFixed(2) * 100;
    if (patient.discount > 0) {
      description += ` | Discount: ${patient.discount}%`;
    }
    const options = {
      amount: parseInt(amount),
      currency: categoryfromdb.currency,
      accept_partial: false,
      description: description,
      customer: {
        name: patient.name,
        contact: `+91${patient.phone}`,
      },
      notify: {
        sms: true,
        email: true,
        whatsapp: true,
      },
      reminder_enable: true,
      callback_method: "get",
      callback_url: `${process.env.FRONTEND_URL}/payment_success`,
    };
    const order = await razorpay.paymentLink.create(options);
    const newPatient = await new Patient({
      name: patient.name,
      phone: patient.phone,
      package: patient.package,
      paymentId: order.id,
      discount: patient.discount,
      installment: "Installment 2",
      createdBy: req.user,
      amount: patient.amount,
      tax: patient.tax ? patient.tax : 0.05,
      dueAmount: 0,
      ref: id,
    });
    await newPatient.save();
    res.json({ success: true, payment_link: order.short_url });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch patient" });
  }
});

router.post("/getPaymentDetails", authMiddleware, async (req, res) => {
  try {
    const { request } = req.body;
    const paymentLink = await razorpay.paymentLink.fetch(request.paymentId);
    console.log("Payment Link Details:", paymentLink);
    let output = {
      ...request,
      status: paymentLink.status,
      url: paymentLink.short_url,
      amount: (paymentLink.amount / 100).toFixed(2),
    };
    res.json({ success: true, request: output });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

//payment Success
router.post("/success", async (req, res) => {
  try {
    let payment;
    try {
      payment = await Patient.findOne({
        paymentId: req.body.razorpay_payment_link_id,
      })
        .populate(["createdBy", "package"])
        .exec();
      if (!payment) throw new Error("Payment record not found.");
    } catch (err) {
      console.error("Error fetching payment:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching payment." });
    }

    if (payment.notified === false) {
      let amount, discount, discountAmount, taxAmount;
      try {
        amount = parseFloat(payment.package.amount || 0).toFixed(2);
        discount = parseFloat(payment.discount || 0).toFixed(2);
        discountAmount = (amount * (discount / 100)).toFixed(2);
        taxAmount = ((amount - discountAmount) * payment.tax).toFixed(2);
      } catch (err) {
        console.error("Error calculating amounts:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error calculating amounts." });
      }

      let finalAmount, dueAmount, payedAmount;
      try {
        if (payment.installment === "Installment 2") {
          const parent = mongoose.Types.ObjectId.isValid(payment.ref)
            ? await Patient.findById(payment.ref)
            : null;
          if (!parent)
            throw new Error("Parent record not found for Installment 2.");

          finalAmount = parseFloat(parent.amount || 0).toFixed(2);
          dueAmount = 0;
          payedAmount = parseFloat(payment.amount || 0).toFixed(2);
          parent.dueAmount = 0;
          await parent.save();
        } else {
          finalAmount = (
            parseFloat(amount) -
            parseFloat(discountAmount) +
            parseFloat(taxAmount)
          ).toFixed(2);
          dueAmount = parseFloat(payment.dueAmount || 0).toFixed(2);
          payedAmount = (
            parseFloat(finalAmount) - parseFloat(dueAmount)
          ).toFixed(2);
        }
      } catch (err) {
        console.error("Error calculating final/due/payed amounts:", err);
        return res.status(500).json({
          success: false,
          message: "Error calculating payment details.",
        });
      }

      let emailContent;
      try {
        const emailData = {
          "Client Name": payment.name,
          "Coach's Name": payment.createdBy?.name || "N/A",
          "Package Name": payment.package?.name || "N/A",
          "Base Amount": amount,
          "Discount Amount": discountAmount,
          "GST Amount": taxAmount,
          "Final Amount": finalAmount,
          "Amount Paid": payedAmount,
          "Due Amount": dueAmount.toString(),
        };

        let emailTemplate = fs.readFileSync(
          "mailers/successful_payment.html",
          "utf8"
        );
        emailContent = replacePlaceholders(emailTemplate, emailData);
      } catch (err) {
        console.error("Error generating email content:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error generating email content." });
      }

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"WOW Purchase" <${process.env.EMAIL_USER}>`,
          to: payment.createdBy?.email || "no-reply@example.com",
          subject: `Payment Confirmation - ${payment.name}`,
          html: emailContent,
        };

        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error sending email." });
      }

      try {
        payment.notified = true;
        payment.status = "paid";
        payment.payed_at = new Date();
        await payment.save();
        res.json({ success: true, message: "Email sent successfully!" });
      } catch (err) {
        console.error("Error updating payment status:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error updating payment status." });
      }
    } else {
      res.json({ success: true, message: "Already Notified!" });
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Unexpected Error Occurred." });
  }
});

//generate Invoice
router.post("/generate-invoice", async (req, res) => {
  try {
    const payment = await Patient.findOne({
      paymentId: req.body.razorpay_payment_link_id,
    })
      .populate(["createdBy", "package"])
      .exec();
    const amount = payment.package.amount.toFixed(2);
    const discount = payment.discount.toFixed(2);
    const discountAmount = (amount * (discount / 100)).toFixed(2);
    const tempAmount = (amount - discountAmount).toFixed(2);
    const taxAmount = (tempAmount * payment.tax).toFixed(2);
    const finalAmount = (
      parseFloat(amount) -
      parseFloat(discountAmount) +
      parseFloat(taxAmount)
    ).toFixed(2);
    const paymentDate = formatReadableDate(payment.createdAt);
    let paymentStatus;
    if (payment.installment === "Installment 1") {
      paymentStatus = "Partially Paid";
    } else {
      paymentStatus = req.body.razorpay_payment_link_status;
    }
    image = await loadImage("invoice/WowInvoice@2x-100.jpg");
    const invoiceData = [
      { text: req.body.razorpay_payment_id, x: 500, y: 930 },
      { text: paymentDate, x: 265, y: 985 },
      { text: "1", x: 190, y: 1450 },
      { text: paymentDate, x: 330, y: 1450 },
      { text: payment.package.name, x: 750, y: 1450 },
      { text: "1", x: 1480, y: 1450 },
      { text: amount, x: 1750, y: 1450 },
      { text: amount, x: 1650, y: 1760 },
      { text: discountAmount, x: 1650, y: 1835 },
      { text: tempAmount, x: 1650, y: 1935 },
      { text: taxAmount, x: 1650, y: 2010 },
      { text: finalAmount, x: 1650, y: 2110 },
      { text: finalAmount, x: 1650, y: 2185 },
      { text: "1", x: 350, y: 2600 },
      { text: finalAmount, x: 800, y: 2600 },
      { text: paymentDate, x: 1240, y: 2600 },
      { text: paymentStatus, x: 1780, y: 2600 },
    ];
    const pdfDoc = new PDFDocument({ size: [image.width, image.height] });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    pdfDoc.pipe(res);
    pdfDoc.image("invoice/WowInvoice@2x-100.jpg", 0, 0, {
      width: image.width,
      height: image.height,
    });
    pdfDoc.registerFont("Poppins", "fonts/Poppins-Regular.ttf");
    pdfDoc.font("Poppins").fontSize(50).fillColor("black");
    invoiceData.forEach(({ text, x, y }) => {
      pdfDoc.text(text, x, y);
    });
    pdfDoc.end();
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
});

router.post("/user-status", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const spreadsheetId = config.spreadsheetId;
    const startDate = new Date(
      config.lastEndDate || "2000-01-01T00:00:00.000Z"
    );
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const spreadsheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = spreadsheetInfo.data.sheets;

    const monthWiseSheets = {};
    const users = await User.find({}).exec();

    for (const user of users) {
      const requests = await Patients.find({
        createdBy: user._id,
        status: { $in: ["paid", "active", "old"] },
        payed_at: { $gte: startDate, $lte: endDate },
      })
        .sort({ createdAt: -1 })
        .populate("package")
        .exec();

      const grouped = {};

      for (const reqItem of requests) {
        const dateKey = reqItem.payed_at.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(reqItem);
      }

      for (const [month, items] of Object.entries(grouped)) {
        if (!monthWiseSheets[month]) {
          monthWiseSheets[month] = [
            [
              "Coach",
              "Name",
              "Phone",
              "PaymentID",
              "Package",
              "Discount",
              "Tax",
              "Created_Date",
              "Paid_Date",
              "Currency",
              "Amount_INR",
              "GST_INR",
              "RZR_INR",
              "WOW_INR",
              "Principle_INR",
              "TDS_INR",
              "Final_INR",
              "Amount_USD",
              "GST_USD",
              "RZR_USD",
              "WOW_USD",
              "Principle_USD",
              "TDS_USD",
              "Final_USD",
            ],
          ];
        }

        const rows = monthWiseSheets[month];
        const startRow = rows.length + 1;

        for (const reqItem of items) {
          const rowNum = rows.length + 1;
          const amountINR =
            reqItem.currency === "INR" ? reqItem.amount || 0 : 0;
          const amountUSD =
            reqItem.currency === "USD" ? reqItem.amount || 0 : 0;

          rows.push([
            user.name || "",
            reqItem.name || "",
            reqItem.phone || "",
            reqItem.paymentId || "",
            reqItem.package?.name || "",
            reqItem.discount !== undefined ? `${reqItem.discount}%` : "",
            reqItem.tax !== undefined
              ? `${(reqItem.tax * 100).toFixed(2)}%`
              : "",
            reqItem.createdAt
              ? new Date(reqItem.createdAt).toLocaleDateString("en-IN")
              : "",
            reqItem.payed_at
              ? new Date(reqItem.payed_at).toLocaleDateString("en-IN")
              : "",
            reqItem.currency || "",

            amountINR,
            `=ROUND(K${rowNum}*${1 + Number(reqItem.tax)} - K${rowNum}, 2)`,
            `=ROUND(K${rowNum}*0.0275, 2)`,
            `=ROUND((K${rowNum}-L${rowNum}-M${rowNum})*0.3, 2)`,
            `=ROUND((K${rowNum}-L${rowNum}-M${rowNum})*0.7, 2)`,
            `=ROUND(O${rowNum}*0.02, 2)`,
            `=ROUND(O${rowNum}-P${rowNum}, 2)`,

            amountUSD,
            `=ROUND(R${rowNum}*${1 + Number(reqItem.tax)} - R${rowNum}, 2)`,
            `=ROUND(R${rowNum}*0.0275, 2)`,
            `=ROUND((R${rowNum}-S${rowNum}-T${rowNum})*0.3, 2)`,
            `=ROUND((R${rowNum}-S${rowNum}-T${rowNum})*0.7, 2)`,
            `=ROUND(V${rowNum}*0.02, 2)`,
            `=ROUND(V${rowNum}-W${rowNum}, 2)`,
          ]);
        }

        const endRow = rows.length;

        rows.push([]);

        // Totals for INR
        rows.push([
          user.name,
          "TOTAL_INR",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "INR",
          `=SUM(K${startRow}:K${endRow})`,
          `=SUM(L${startRow}:L${endRow})`,
          `=SUM(M${startRow}:M${endRow})`,
          `=SUM(N${startRow}:N${endRow})`,
          `=SUM(O${startRow}:O${endRow})`,
          `=SUM(P${startRow}:P${endRow})`,
          `=SUM(Q${startRow}:Q${endRow})`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        // Totals for USD
        rows.push([
          user.name,
          "TOTAL_USD",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "USD",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          `=SUM(R${startRow}:R${endRow})`,
          `=SUM(S${startRow}:S${endRow})`,
          `=SUM(T${startRow}:T${endRow})`,
          `=SUM(U${startRow}:U${endRow})`,
          `=SUM(V${startRow}:V${endRow})`,
          `=SUM(W${startRow}:W${endRow})`,
          `=SUM(X${startRow}:X${endRow})`,
        ]);

        rows.push([]);
      }
    }

    const sortedMonths = Object.keys(monthWiseSheets).sort((a, b) => {
      return new Date("01 " + a) - new Date("01 " + b);
    });

    for (const month of sortedMonths) {
      const rows = monthWiseSheets[month];

      // Delete and recreate sheet if exists
      const existingSheet = existingSheets.find(
        (s) => s.properties.title === month
      );
      if (existingSheet) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              { deleteSheet: { sheetId: existingSheet.properties.sheetId } },
              { addSheet: { properties: { title: month } } },
            ],
          },
        });
      } else {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{ addSheet: { properties: { title: month } } }],
          },
        });
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${month}!A1`,
        valueInputOption: "USER_ENTERED",
        resource: { values: rows },
      });
    }

    config.lastEndDate = endDate.toISOString();

    res.json({
      success: true,
      message: `Reports written to sheets`,
      lastFetchedTo: config.lastEndDate,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    });
  } catch (err) {
    console.error("Monthly sheet split failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Details of all the paid requests made
router.get("/get_requests", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: { $in: ["paid", "active", "old"] },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: { $in: ["paid", "active", "old"] },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/get-installments", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        installment: "Installment 1",
        dueAmount: { $gt: 0 },
        status: { $in: ["paid", "active", "old"] },
      }).populate("package", "name amount");
    } else {
      requests = await Patient.find({
        installment: "Installment 1",
        createdBy: userData._id,
        dueAmount: { $gt: 0 },
        status: { $in: ["paid", "active", "old"] },
      }).populate("package", "name amount");
    }
    res.json({ success: true, installments: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
//

router.get("/get_active_users", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: "active",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: "active",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/get_paid_users", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: "paid",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: "paid",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});
router.get("/get_old_users", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: "old",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: "old",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.post("/make_active", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await Patient.findById(id);
    const namePart =
      user.name?.replace(/\s+/g, "").substring(0, 4).toLowerCase() || "user";
    const phonePart = user.phone?.slice(-4) || "0000";
    const password = `${namePart}${phonePart}`;
    user.status = "paid";
    await user.save();
    res.json({
      success: true,
      message: `User activated!! Now  the user can login using phone number as username and password :${password} `,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.post("/deactivate_user", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await Patient.findById(id);
    user.status = "old";
    await user.save();
    res.json({
      success: true,
      message: `User deactivated !!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// Details of all the paid requests made
router.get("/get_pending_requests", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: { $nin: ["paid", "active", "old"] },
        package: { $ne: null },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: { $nin: ["paid", "active", "old"] },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/getSelfRegistered", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        package: null,
      })
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        package: null,
      }).exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/getRequests/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Patient.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const requests = await HealthReport.find({ userId: user._id });
    res.status(200).json({ requests, user });
  } catch (error) {
    console.error("Error fetching health reports:", error);
    res.status(500).json({
      message: "Failed to fetch health reports",
      error: error.message,
    });
  }
});

router.get("/health-metrics/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Patient.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const latest = await HealthReport.findOne({ userId: user._id })
      .sort({ date: -1 })
      .exec();
    res.status(200).json({ latest, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the report", error });
  }
});

router.get("/getWeightGraphData/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Patient.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const weights = await DailyWeight.find({ userId: user }).sort({
      date: 1,
    });
    res.json(weights);
  } catch (error) {
    console.error("Error fetching weight graph data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch weight graph data", error });
  }
});

router.get("/getSugarData/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Patient.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const sugar_values = await Diabetes.find({ userId: user });
    res.json(sugar_values);
  } catch (error) {
    console.error("Error fetching sugar graph data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch sugar graph data", error });
  }
});

router.get("/referred_users/:userId", async (req, res) => {
  try {
    console.log("Fetching referred users...");
    const { userId } = req.params;
    console.log(userId);
    const users = await Patient.find({
      ref: userId,
    })
      .populate("package")
      .exec();
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch all users", error });
  }
});

module.exports = router;
