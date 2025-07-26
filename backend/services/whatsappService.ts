import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

interface WhatsAppMessage {
  to: string; // Número de teléfono con código de país, ej: "+5491123456789"
  body: string;
}

export const sendWhatsAppMessage = async ({ to, body }: WhatsAppMessage) => {
  if (!process.env.WHATSAPP_ENABLED) {
    console.log('WhatsApp deshabilitado. Mensaje no enviado:', { to, body });
    return;
  }

  try {
    // Asegurarse de que el número tenga el formato correcto
    const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
    const message = await client.messages.create({
      body,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: toFormatted,
    });

    console.log(`Mensaje de WhatsApp enviado a ${to}:`, message.sid);
    return message;
  } catch (error) {
    console.error('Error al enviar mensaje de WhatsApp:', error);
    throw error;
  }
};

// Plantillas de mensajes
export const whatsappTemplates = {
  welcome: (name: string) => (
    `¡Hola ${name}! Bienvenido a Zapatería a Pedido. ` +
    'Gracias por registrarte. ¿En qué podemos ayudarte hoy?'
  ),
  
  orderConfirmation: (orderId: string) => (
    '✅ *Pedido Recibido*\n\n' +
    `Hemos recibido tu pedido #${orderId}. ` +
    'Te mantendremos informado sobre su estado.\n\n' +
    '¡Gracias por elegirnos!'
  ),
  
  orderStatusUpdate: (orderId: string, status: string) => (
    `📦 *Actualización de Pedido*\n\n` +
    `El estado de tu pedido #${orderId} ha cambiado a: *${status}*\n\n` +
    'Si tienes alguna pregunta, no dudes en contactarnos.'
  ),
  
  passwordReset: (token: string) => (
    '🔑 *Restablecer Contraseña*\n\n' +
    'Hemos recibido una solicitud para restablecer tu contraseña. ' +
    `Utiliza el siguiente código: *${token}*\n\n` +
    'Si no solicitaste este cambio, ignora este mensaje.'
  ),
};
