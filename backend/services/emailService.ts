import sgMail from '@sendgrid/mail';

// Configurar la API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const msg = {
    to: options.to,
    from: process.env.EMAIL_FROM || 'no-reply@tuzapateria.com',
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email enviado a: ${options.to}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

// Plantillas de correo
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: '¡Bienvenido a Zapatería a Pedido!',
    text: `Hola ${name}, ¡Bienvenido a nuestra plataforma!`,
    html: `
      <div>
        <h2>¡Bienvenido a Zapatería a Pedido, ${name}!</h2>
        <p>Gracias por registrarte en nuestra plataforma.</p>
        <p>Ahora puedes comenzar a realizar tus pedidos personalizados.</p>
      </div>
    `,
  }),
  
  orderConfirmation: (orderId: string, total: number) => ({
    subject: `Confirmación de Pedido #${orderId}`,
    text: `Tu pedido #${orderId} ha sido recibido. Total: $${total}`,
    html: `
      <div>
        <h2>¡Gracias por tu pedido!</h2>
        <p>Número de pedido: <strong>#${orderId}</strong></p>
        <p>Total: <strong>$${total}</strong></p>
        <p>Te notificaremos cuando tu pedido esté en proceso.</p>
      </div>
    `,
  }),
  
  passwordReset: (token: string, name: string) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    return {
      subject: 'Restablece tu contraseña',
      text: `Hola ${name}, para restablecer tu contraseña haz clic en el siguiente enlace: ${resetUrl}`,
      html: `
        <div>
          <h2>Hola ${name},</h2>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Restablecer Contraseña
          </a>
          <p>O copia y pega esta URL en tu navegador:</p>
          <p>${resetUrl}</p>
        </div>
      `,
    };
  },
};
