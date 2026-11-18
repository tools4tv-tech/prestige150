
/**
 * Prestige Sector 150
 * Vercel Serverless Function
 * Sell.Do CRM Lead Integration
 */

module.exports = async function handler(req, res) {

  // ------------------------------------------
  // 1. Allow POST requests only
  // ------------------------------------------

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  // ------------------------------------------
  // 2. Same-origin request validation
  // ------------------------------------------

  const origin = req.headers.origin;
  const host = req.headers.host;

  if (origin && host) {
    try {
      const originHost = new URL(origin).host.toLowerCase();

      if (originHost !== host.toLowerCase()) {
        return res.status(403).json({
          success: false,
          message: "Invalid request origin"
        });
      }

    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Invalid request origin"
      });
    }
  }

  try {

    // ------------------------------------------
    // 3. Environment variables
    // ------------------------------------------

    const API_KEY = process.env.SELLDO_API_KEY;
    const SRD = process.env.SELLDO_SRD;

    if (!API_KEY || !SRD) {
      console.error(
        "Sell.Do configuration is missing."
      );

      return res.status(500).json({
        success: false,
        message: "CRM configuration is incomplete."
      });
    }

    // ------------------------------------------
    // 4. Read incoming form data
    // ------------------------------------------

    const body = req.body || {};

    if (
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data."
      });
    }

    const name = String(body.name || "").trim();

    const phone = String(body.phone || "").trim();

    const email = String(body.email || "").trim();

    const interest = String(body.interest || "").trim();

    // ------------------------------------------
    // 5. Validate form data
    // ------------------------------------------

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name."
      });
    }

    if (!phone || phone.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Please enter your phone number."
      });
    }

    if (
      email &&
      (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (interest.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Please select your configuration."
      });
    }

    // ------------------------------------------
    // 6. Prepare lead notes
    // ------------------------------------------

    const noteParts = [
      "Project: Prestige Sector 150",
      "Interested In: " + (interest || "Not specified")
    ];

    const trackingFields = [
      ["utm_source", "UTM Source"],
      ["utm_medium", "UTM Medium"],
      ["utm_campaign", "UTM Campaign"],
      ["utm_term", "UTM Term"],
      ["utm_content", "UTM Content"]
    ];

    trackingFields.forEach(([key, label]) => {

      const value = String(body[key] || "")
        .trim()
        .slice(0, 250);

      if (value) {
        noteParts.push(label + ": " + value);
      }

    });

    const pageUrl = String(body.page_url || "")
      .trim()
      .slice(0, 1000);

    if (pageUrl) {
      noteParts.push("Landing Page: " + pageUrl);
    }

    const leadNotes = noteParts.join("\n");

    // ------------------------------------------
    // 7. Build Sell.Do API payload
    // ------------------------------------------

    const params = new URLSearchParams();

    params.append(
      "sell_do[form][lead][name]",
      name
    );

    params.append(
      "sell_do[form][lead][phone]",
      phone
    );

    if (email) {
      params.append(
        "sell_do[form][lead][email]",
        email
      );
    }

    params.append(
      "sell_do[campaign][srd]",
      SRD
    );

    params.append(
      "sell_do[form][note][content]",
      leadNotes
    );

    // ------------------------------------------
    // 8. Sell.Do API endpoint
    // ------------------------------------------

    const endpoint = new URL(
      "https://app.sell.do/api/leads/create"
    );

    // API key remains on the server.
    endpoint.searchParams.set(
      "api_key",
      API_KEY
    );

    // ------------------------------------------
    // 9. Send lead to Sell.Do
    // ------------------------------------------

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 20000);

    let sellDoResponse;

    try {

      sellDoResponse = await fetch(
        endpoint.toString(),
        {
          method: "POST",

          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
          },

          body: params.toString(),

          signal: controller.signal,

          cache: "no-store"
        }
      );

    } finally {

      clearTimeout(timeout);

    }

    // ------------------------------------------
    // 10. Read Sell.Do response
    // ------------------------------------------

    const responseText = await sellDoResponse.text();

    let result;

    try {

      result = JSON.parse(responseText);

    } catch (error) {

      result = null;

    }

    if (!sellDoResponse.ok) {

      console.error("Sell.Do HTTP error:", {
        status: sellDoResponse.status,
        response: result || "Non-JSON response"
      });

      return res.status(502).json({
        success: false,
        message: "Unable to submit your enquiry. Please try again."
      });

    }

    if (!result || typeof result !== "object") {

      console.error(
        "Sell.Do returned an invalid response."
      );

      return res.status(502).json({
        success: false,
        message: "Invalid CRM response. Please try again."
      });

    }

    // ------------------------------------------
    // 11. Interpret Sell.Do response correctly
    // ------------------------------------------

    // Sell.Do can return:
    // sell_do_lead_id: "2191"
    // sell_do_lead_verified: false
    // error: []
    //
    // A lead ID means Sell.Do returned a lead record.
    // verified=false alone does NOT mean lead creation failed.

    const leadId =
      result.sell_do_lead_id ||
      result.lead_id ||
      result.id ||
      null;

    // Correctly handle empty error arrays.
    const hasErrors = Array.isArray(result.error)
      ? result.error.length > 0
      : Boolean(result.error);

    const explicitFailure =
      result.success === false ||
      result.status === "error";

    // A returned lead ID takes priority over the
    // verification flag and duplicate indicator.
    const leadAccepted = Boolean(leadId);

    if (!leadAccepted && (explicitFailure || hasErrors)) {

      console.error("Sell.Do rejected lead:", {
        response: result
      });

      return res.status(502).json({
        success: false,
        message: "CRM could not process your enquiry. Please try again."
      });

    }

    // If there is no lead ID and no explicit success,
    // do not show a false success message.
    if (!leadAccepted) {

      const explicitSuccess =
        result.success === true ||
        result.status === "success";

      if (!explicitSuccess) {

        console.error(
          "Sell.Do response could not be confirmed:",
          result
        );

        return res.status(502).json({
          success: false,
          message: "CRM submission could not be confirmed. Please contact support."
        });

      }

    }

    // ------------------------------------------
    // 12. Log successful lead submission
    // ------------------------------------------

    const leadDetails =
      result.sell_do_lead_details || {};

    console.log("Sell.Do lead accepted:", {

      leadId: leadId,

      verified: result.sell_do_lead_verified ?? null,

      alreadyExists:
        leadDetails.lead_already_exists ?? null,

      createdAt:
        leadDetails.lead_created_at || null

    });

    // ------------------------------------------
    // 13. Return success to frontend
    // ------------------------------------------

    return res.status(200).json({

      success: true,

      message: "Your enquiry has been submitted successfully.",

      leadId: leadId,

      verified:
        result.sell_do_lead_verified ?? null,

      alreadyExists:
        leadDetails.lead_already_exists ?? false

    });

  } catch (error) {

    // ------------------------------------------
    // 14. Handle unexpected errors
    // ------------------------------------------

    console.error("Lead integration error:", {
      name: error.name,
      message: error.message
    });

    if (error.name === "AbortError") {

      return res.status(504).json({
        success: false,
        message: "CRM request timed out. Please try again."
      });

    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });

  }

};
