const Ticket = require('../models/report.model');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.created.perfil'); // Asegúrate de importar el modelo de User

async function canCreateTicket(userId) {
    // Buscar al usuario, incluyendo la compañía asociada
    const user = await User.findById(userId).populate('company');
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar si el usuario está suscrito a la compañía
    const subscription = await Subscription.findOne({ companyId: user.company._id });

    // Obtener el mes y año actuales
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Determinar el límite de tickets basado en la suscripción o sin suscripción
    let ticketLimit = 1; // Por defecto, solo puede crear 1 ticket

    if (subscription) {
        if (subscription.productId === 'prod_R023GfgtRfPNC7') {
            ticketLimit = 16; // Límite para este producto
        } else if (subscription.productId === 'prod_R024q1v8rr1odd') {
            ticketLimit = 100; // Límite para este producto
        }
    }

    // Contar el número de tickets creados por el usuario este mes
    const ticketCount = await Ticket.countDocuments({
        user: userId,
        created_at: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1),
        },
    });

    // Verificar si se alcanzó el límite
    if (ticketCount >= ticketLimit) {
        return false;
    }

    // Si no se alcanzó el límite, el reporte puede ser creado
    return true;
}

module.exports = {
    canCreateTicket,
};