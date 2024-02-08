const FocusPeriod = require('../../models/FocusPeriod');

module.exports = async (_, { }, context) => {
  try {
    const focusPeriods = await FocusPeriod.findAll({
        order: [['end_date', 'DESC']],
      });

    return focusPeriods;
  } catch (error) {
    console.error('Error fetching focus periods:', error);
    throw error;
  }
}


