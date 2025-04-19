import nodemailer from "nodemailer"

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Function to generate a random password
export function generatePassword(length = 10) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

// Function to send a welcome email with credentials
export async function sendWelcomeEmail({
  email,
  name,
  password,
  role,
}: {
  email: string
  name: string
  password: string
  role: "professor" | "student"
}) {
  const roleText = role === "professor" ? "Professeur" : "Étudiant"

  try {
    const info = await transporter.sendMail({
      from: `"Système de Planification" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Bienvenue sur le Système de Planification des Soutenances`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Bienvenue, ${name}!</h2>
          <p>Votre compte ${roleText} a été créé avec succès sur le Système de Planification des Soutenances.</p>
          <p>Voici vos identifiants de connexion:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mot de passe:</strong> ${password}</p>
          </div>
          <p>Veuillez vous connecter à <a href="${process.env.NEXTAUTH_URL}/login">notre plateforme</a> et changer votre mot de passe dès que possible.</p>
          <p>Cordialement,<br>L'équipe du Système de Planification</p>
        </div>
      `,
      text: `
        Bienvenue, ${name}!
        
        Votre compte ${roleText} a été créé avec succès sur le Système de Planification des Soutenances.
        
        Voici vos identifiants de connexion:
        Email: ${email}
        Mot de passe: ${password}
        
        Veuillez vous connecter à notre plateforme (${process.env.NEXTAUTH_URL}/login) et changer votre mot de passe dès que possible.
        
        Cordialement,
        L'équipe du Système de Planification
      `,
    })

    console.log("Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}
