
// api/lead.js
// Vercel Serverless Function - Sell.Do Lead Integration

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  // Allow same-origin requests only.
  const origin = req.headers.origin;
  const host = req.headers.host;

  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return res.status(403).json({
          success: false,
          message: "Invalid request origin"
        });
      }
    } catch {
      return res.status(403).json({
        success: false,
        message: "Invalid request origin"
      });
    }
  }

  try {
    const API_KEY = process.env.SELLDO_API_KEY;
    const SRD = process.env.SELLDO_SRD;

    if (!API_KEY || !SRD) {
      console.error("Sell.Do environment variables missing");

      return res.status(500).json({
        success: false,
        message: "CRM configuration is incomplete"
      });
    }

    const body = req.body || {};

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    const email = String(body.email || "").trim();
    const interest = String(body.interest || "").trim();

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name."
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number."
      });
    }

    if (
      email &&
      (email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (!interest) {
      return res.status(400).json({
        success: false,
        message: "Please select your configuration."
      });
    }

    // Build lead notes, including available attribution.
    const noteParts = [
      "Project: Prestige Sector 150",
      "Interested In: " + interest
    ];

    const trackingFields = [
      ["utm_source", "UTM Source"],
      ["utm_medium", "UTM Medium"],
      ["utm_campaign", "UTM Campaign"],
      ["utm_term", "UTM Term"],
      ["utm_content", "UTM Content"]
    ];

    trackingFields.forEach(([key, label]) => {
      const value = String(body[key] || "").trim().slice(0, 250);
      if (value) noteParts.push(label + ": " + value);
    });

    const pageUrl = String(body.page_url || "").trim().slice(0, 1000);
    if (pageUrl) noteParts.push("Landing Page: " + pageUrl);

    const params = new URLSearchParams();

    params.append("sell_do[form][lead][name]", name);
    params.append("sell_do[form][lead][phone]", phone);

    if (email) {
      params.append("sell_do[form][lead][email]", email);
    }

    params.append("sell_do[campaign][srd]", SRD);
    params.append(
      "sell_do[form][note][content]",
      noteParts.join("\n")
    );

    const endpoint = new URL(
      "https://app.sell.do/api/leads/create"
    );

    // Sell.Do's supplied integration example uses api_key in the URL.
    endpoint.searchParams.set("api_key", API_KEY);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let sellDoResponse;

    try {
      sellDoResponse = await fetch(endpoint.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: params.toString(),
        signal: controller.signal,
        cache: "no-store"
      });
    } finally {
      clearTimeout(timeout);
    }

    const responseText = await sellDoResponse.text();

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { raw: responseText };
    }

    if (!sellDoResponse.ok) {
      console.error("Sell.Do API error:", sellDoResponse.status, result);

      return res.status(502).json({
        success: false,
        message: "Unable to submit your enquiry. Please try again."
      });
    }

    if (
      result &&
      (result.success === false ||
       result.status === "error" ||
       result.error)
    ) {
      console.error("Sell.Do rejected lead:", result);

      return res.status(502).json({
        success: false,
        message: "CRM could not process your enquiry. Please try again."
      });
    }

    console.log("Sell.Do lead submission response:", result);

    return res.status(200).json({
      success: true,
      message: "Your enquiry has been submitted successfully."
    });

  } catch (error) {
    console.error("Lead integration error:", error);

    return res.status(500).json({
      success: false,
      message: error.name === "AbortError"
        ? "CRM request timed out. Please try again."
        : "Something went wrong. Please try again."
    });
  }
};
