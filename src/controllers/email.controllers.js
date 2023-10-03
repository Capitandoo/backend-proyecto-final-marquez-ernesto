import { transporter } from "../services/email.services.js";
import config from "../../config.js";
import { logger } from "../utils/logger.js";

export const sendGmail = async (nameEmail, ticketData) => {
  try {
    const { name } = nameEmail;
    const { code, purchase_datetime, amount, purchaser } = ticketData;
    const gmailOptions = {
      from: config.EMAIL,
      to: config.EMAIL,
      subject: "Detalle de compra",
      html: `<h1>Gracias por tu compra ${name}!</h1>
            <p>Detalles del ticket:</p>
            <ul>
              <li>Código: ${code}</li>
              <li>Fecha de compra: ${purchase_datetime}</li>
              <li>Monto total: $${amount}</li>
              <li>Comprador: ${purchaser}</li>
            </ul>
          `,
      attachments: [{}],
    };
    const response = await transporter.sendMail(gmailOptions);
    logger.info("Email enviado!");
    return response;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const sendAccountDeletionEmail = async (recipientEmail) => {
  try {
    const mailOptions = {
      from: config.EMAIL,
      to: config.EMAIL,
      subject: 'Eliminación de Cuenta',
      html: `
        <p>Lamentamos informarte que tu cuenta ha sido eliminada.</p>
        <p>Si consideras que ha habido un error o deseas obtener más información, por favor contáctanos.</p>
      `
    };

    const response = await transporter.sendMail(mailOptions);
    logger.info(`Email de eliminación de cuenta enviado a ${recipientEmail}`);
    return response;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const sendProductDeletionEmail = async (ownerEmail, productName) => {
  try {
    const mailOptions = {
      from: config.EMAIL,
      to: config.EMAIL,
      subject: 'Notificación de Eliminación de Producto',
      html: `
        <p>Hola,</p>
        <p>Queremos informarte que tu producto "${productName}" ha sido eliminado.</p>
        <p>Si consideras que ha habido un error o deseas obtener más información, por favor contáctanos.</p>
      `
    };

    const response = await transporter.sendMail(mailOptions);
    logger.info(`Email de notificación de eliminación de producto enviado a ${ownerEmail}`);
    return response;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

