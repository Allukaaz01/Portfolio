import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini if key is provided
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI Client:", err);
  }
} else {
  console.log("GEMINI_API_KEY not found. App will run in rule-based fallback mode for AI queries.");
}

const DB_DIR = path.join(process.cwd(), "database");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DatabaseSchema {
  settings: {
    notificationEmail: string;
  };
  bookings: Array<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    surgeryType: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
    hotelSentStatus: boolean;
    hotelEmailSentTo?: string;
    hotelSentAt?: string;
    hotelComments?: string;
    archived?: boolean;
  }>;
}

// Ensure database file exists
function readDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const defaultData: DatabaseSchema = {
    settings: {
      notificationEmail: "rayanelasfar02@gmail.com"
    },
    bookings: []
  };

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf8");
    return defaultData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, resetting to defaults:", err);
    return defaultData;
  }
}

function writeDatabase(data: DatabaseSchema) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // HEALTH CHECK
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // GET SETTINGS
  app.get("/api/settings", (req, res) => {
    const db = readDatabase();
    res.json(db.settings);
  });

  // POST SETTINGS
  app.post("/api/settings", (req, res) => {
    const { notificationEmail } = req.body;
    if (!notificationEmail || !notificationEmail.includes("@")) {
      return res.status(400).json({ error: "Adresse email invalide." });
    }

    const db = readDatabase();
    db.settings.notificationEmail = notificationEmail;
    writeDatabase(db);

    res.json({ message: "Email mis à jour avec succès", settings: db.settings });
  });

  // GET BOOKINGS
  app.get("/api/bookings", (req, res) => {
    const db = readDatabase();
    res.json(db.bookings);
  });

  // POST BOOKING
  app.post("/api/bookings", (req, res) => {
    const { fullName, email, phone, checkIn, checkOut, surgeryType, notes } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: "Le nom, l'e-mail et le téléphone sont obligatoires." });
    }

    const db = readDatabase();
    
    const newBooking = {
      id: "b_" + Date.now().toString(36),
      fullName,
      email,
      phone,
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      surgeryType: surgeryType || "primary",
      notes: notes || "",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      hotelSentStatus: false
    };

    db.bookings.push(newBooking);
    writeDatabase(db);

    // Simulated Emails Logs: Send immediate confirmation text
    const targetEmail = db.settings.notificationEmail;
    console.log(`[EMAIL DISPATCH] Automatic Confirmation sent to patient: ${email}`);
    console.log(`[EMAIL DISPATCH] Notification sent to Dr. Hüseyin Balıkçı workspace target email (${targetEmail}) about new patient request: ${fullName}`);

    res.status(201).json({
      message: "Réservation enregistrée avec succès. Confirmation automatique envoyée.",
      booking: newBooking,
      dispatchLogs: {
        patientEmailSent: true,
        recipientPatient: email,
        adminEmailSent: true,
        recipientAdmin: targetEmail
      }
    });
  });

  // UPDATE BOOKING DETAILS (checkIn, checkOut, status)
  app.post("/api/bookings/update-details", (req, res) => {
    const { bookingId, checkIn, checkOut, status } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "ID de réservation requis." });
    }

    const db = readDatabase();
    const index = db.bookings.findIndex(b => b.id === bookingId);
    if (index === -1) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    if (checkIn !== undefined) db.bookings[index].checkIn = checkIn;
    if (checkOut !== undefined) db.bookings[index].checkOut = checkOut;
    if (status !== undefined) db.bookings[index].status = status;

    writeDatabase(db);
    res.json({ message: "Détails mis à jour avec succès.", booking: db.bookings[index] });
  });

  // ARCHIVE SINGLE BOOKING / PATIENT
  app.post("/api/bookings/archive", (req, res) => {
    const { bookingId, archived } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "ID de réservation requis." });
    }

    const db = readDatabase();
    const index = db.bookings.findIndex(b => b.id === bookingId);
    if (index === -1) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    db.bookings[index].archived = archived !== undefined ? !!archived : true;

    writeDatabase(db);
    res.json({ message: "Dossier patient mis à jour avec succès.", booking: db.bookings[index] });
  });

  // ARCHIVE ALL ACTIVE BOOKINGS (CLEARING LIST BUT KEEPING HISTORY)
  app.post("/api/bookings/archive-all", (req, res) => {
    const db = readDatabase();
    
    let count = 0;
    db.bookings = db.bookings.map(b => {
      if (!b.archived) {
        count++;
        return { ...b, archived: true };
      }
      return b;
    });

    writeDatabase(db);
    res.json({ message: `${count} patient(s) archivé(s) avec succès. Historique conservé.` });
  });

  // FORWARD PATIENT INFORMATION TO HOTEL EMAIL Directly
  app.post("/api/bookings/send-hotel", (req, res) => {
    const { bookingId, hotelEmail, messageBody, additionalNotes } = req.body;

    if (!bookingId || !hotelEmail || !hotelEmail.includes("@")) {
      return res.status(400).json({ error: "ID de réservation ou email d'hôtel invalide." });
    }

    const db = readDatabase();
    const bookingIdx = db.bookings.findIndex(b => b.id === bookingId);

    if (bookingIdx === -1) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    const booking = db.bookings[bookingIdx];
    
    // Perform simulated email dispatch
    console.log("-----------------------------------------");
    console.log(`[EMAIL TO HOTEL DISPATCH] Sending patient details directory to: ${hotelEmail}`);
    console.log(`Patient Name: ${booking.fullName}`);
    console.log(`Check-In Date: ${booking.checkIn}`);
    console.log(`Check-Out Date: ${booking.checkOut}`);
    console.log(`Message Details:\n${messageBody}`);
    if (additionalNotes) {
      console.log(`Additional Admin Notes:\n${additionalNotes}`);
    }
    console.log("-----------------------------------------");

    // Update dispatch markers in db
    booking.hotelSentStatus = true;
    booking.hotelEmailSentTo = hotelEmail;
    booking.hotelSentAt = new Date().toISOString();
    booking.hotelComments = additionalNotes || "Détails envoyés de l'administration.";

    db.bookings[bookingIdx] = booking;
    writeDatabase(db);

    res.json({
      message: `Informations de ${booking.fullName} transmises avec succès à l'hôtel (${hotelEmail}).`,
      booking
    });
  });

  // AI-DRAFT HELP FOR HOTEL EMAILS
  app.post("/api/bookings/draft-email", async (req, res) => {
    const { bookingId, hotelName, language, customRequest, checkIn, checkOut } = req.body;
    
    const db = readDatabase();
    const booking = db.bookings.find(b => b.id === bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    const finalCheckIn = checkIn || booking.checkIn || "à convenir";
    const finalCheckOut = checkOut || booking.checkOut || "à convenir";

    const prompt = `Compose a formal, polite, and detailed email to the manager or host of "${hotelName || 'the Hotel'}" in ${language || 'French'} to facilitate the arrival and registration of Dr. Hüseyin Balıkçı's aesthetic rhinoplasty patient traveling to Antalya.
    Patient details:
    Name: ${booking.fullName}
    Check-In (Arrival): ${finalCheckIn}
    Check-Out (Departure): ${finalCheckOut}
    Patient Contact: ${booking.phone} / ${booking.email}
    Surgery context: Patient is receiving clinic treatment with post-operative care. 
    ${customRequest ? `Special Requests/Comments to include: ${customRequest}` : ''}
    
    Requirements:
    - Standard professional structure (object, greeting, body, politeness closing).
    - Request soft Pillows or quiet room if post-op.
    - Ask them to pre-verify the room for standard check-in.
    - Avoid medical disclosures that violate privacy, keep it focused on registration convenience.
    - Write only the ready-to-copy email content with no other conversational filler.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });
        const text = response.text || "";
        return res.json({ draft: text.trim() });
      } catch (err: any) {
        console.error("Gemini context dispatch failed:", err);
        return res.status(500).json({ error: "L'assistant IA est temporairement indisponible." });
      }
    } else {
      // Fallback response composer
      const greeting = language === 'English' ? `Dear Reservations Team at ${hotelName || 'the Hotel'},` : `Madame, Monsieur l'Équipe de Réservation du ${hotelName || 'Hôtel'},`;
      const subject = language === 'English' ? `Patient Stay Registration Facilitation - ${booking.fullName}` : `Facilitation d'enregistrement séjour patient - ${booking.fullName}`;
      const body = language === 'English' ?
        `We are contacting you on behalf of Dr. Hüseyin Balıkçı's clinic in Antalya. We kindly request you to prepare the registration for our patient, ${booking.fullName}, scheduled to stay at your hotel from ${finalCheckIn} to ${finalCheckOut}. Given the post-op context, please ensure a quiet room with comfortable bedding to facilitate their recovery. Thank you.` :
        `Nous vous contactons de la part de la clinique du Dr. Hüseyin Balıkçı à Antalya. Nous sollicitons votre bienveillance afin de faciliter l'enregistrement de notre patient, ${booking.fullName}, qui séjournera au sein de votre établissement du ${finalCheckIn} au ${finalCheckOut}. Pour des raisons de confort post-opératoire, une chambre calme avec une literie confortable sera très appréciée. Nous vous remercions.`;
      
      const draft = `${subject}\n\n${greeting}\n\n${body}\n\nCordialement,\nÉquipe Clinique Dr. Hüseyin Balıkçı`;
      return res.json({ draft });
    }
  });

  // GEMINI AI INTEGRATIVE ADVISORY ENDPOINT
  app.post("/api/ask-gemini", async (req, res) => {
    const { prompt, history, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt vide." });
    }

    const systemInstruction = `You are the Virtual Assistant Representative of Dr. Hüseyin Balıkçı (renowned aesthetic rhinoplasty surgeon in Antalya, Turkey). 
    Your goal is to answer patient inquiries in a compassionate, professional, clean, and highly reassuring style.
    IMPORTANT: Respond to the patient in the following language: "${language || 'French'}". If not specified or if the user asks in another language, adapt gracefully. Keep answers concise.
    Explain that Dr. Hüseyin Balıkçı is an absolute specialist in Primary, Revision, and Ethnic Rhinoplasty.
    Provide useful info on:
    - Pre-operative guidelines (stopping smoking/alcohol, fasting 8 hours before, staying relaxed).
    - Post-operative guidelines (swelling is normal, sleeping with head elevated, avoiding glasses for 2 months, soft foods, saline nasal sprays).
    - Hotel arrangements & Airport pick-up: The admin can facilitate coordinates and dispatch their traveler information directly with hotels to guarantee quick check-in.
    IMPORTANT: Provide general professional guidance, but always mention that the final instructions will be verified directly by Dr. Hüseyin Balıkçı and his medical staff during their live physical consultation in Antalya.
    Be very polite and warm. Do not use any technical markdown schemas that could break simple html rendering. Use clear bullet points.`;

    if (ai) {
      try {
        const contents = [];
        if (history && Array.isArray(history)) {
          for (const msg of history) {
            contents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          }
        }
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction
          }
        });

        res.json({ answer: response.text });
      } catch (err: any) {
        console.error("Gemini chat error:", err);
        res.status(500).json({ error: "L'assistant IA rencontre une difficulté temporaire." });
      }
    } else {
      // Elegant rule-based medical expert fallback response
      let answer = "";
      const text = prompt.toLowerCase();
      if (text.includes("rhinoplastie") || text.includes("nose") || text.includes("nez")) {
        answer = `Le **Dr. Hüseyin Balıkçı** est l'un des plus grands experts de la rhinoplastie à Antalya. Nous proposons des traitements sur mesure :\n\n- **Rhinoplastie Primaire** : Corriger la forme, la taille et le pont nasal pour l'harmonie du visage.\n- **Rhinoplastie de Révision** (Secondaire) : Réparer les complications et asymétries antérieures.\n- **Rhinoplastie Ethnique** : Respecter l'héritage d'origine tout en affinant la structure.\n\n*Conseil clinique : Les gonflements initiaux diminuent après 2 à 4 semaines, mais le nez final se structure idéalement sur 1 an. Une consultation physique détaillée permettra d'établir le plan opératoire final.*`;
      } else if (text.includes("hotel") || text.includes("hébergement") || text.includes("stay") || text.includes("check")) {
        answer = `Notre clinique s'occupe de rationaliser votre séjour à Antalya ! Lorsque vous réservez l'opération, vous entrez vos dates d'arrivée (Check-in) et de départ (Check-out).\n\nDepuis notre **panneau administratif**, nous transmettons directement vos coordonnées médicales légères et d'identité à l'hôtel de votre choix pour valider et d'accélérer votre enregistrement d'arrivée automatiquement. Vous n'avez aucune frustration administrative !`;
      } else if (text.includes("post") || text.includes("après") || text.includes("recup") || text.includes("care")) {
        answer = `Précautions Post-Opératoires Clés :\n1. Dormir la tête surélevée à l'aide de 2 oreillers pour minimiser le gonflement.\n2. Éviter de porter des lunettes de vue ou de soleil pendant au moins 2 mois.\n3. Nettoyer les fosses nasales avec le spray salin prescrit.\n4. Éviter les exercices vigoureux pendant 4 à 6 semaines.\n\n_Tous les médicaments et pansements détaillés vous seront expliqués en face-à-face par l'équipe médicale._`;
      } else {
        answer = `Bienvenue au cabinet du **Dr. Hüseyin Balıkçı** à Antalya. Nous sommes ravis de vous accompagner dans votre transformation.\n\nVous pouvez planifier votre intervention via notre formulaire de réservation (en indiquant les dates de séjours souhaitées) ou poser des questions sur la rhinoplastie, l'hôtel de séjour, ou le rétablissement. Souhaitez-vous d'autres précisions ?`;
      }
      res.json({ answer });
    }
  });

  // SERVE CLIENT WITH VITE OR STATIC FILES
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
