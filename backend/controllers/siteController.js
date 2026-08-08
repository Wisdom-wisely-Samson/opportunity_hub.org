const SiteMetric = require('../models/SiteMetric');
const { sendSuccess, sendError } = require('../utils/response');

exports.incrementVisitor = async (req, res, next) => {
  try {
    const metric = await SiteMetric.findOneAndUpdate(
      { key: 'visitorCount' },
      { $inc: { value: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return sendSuccess(res, 200, 'Visitor recorded', { count: metric.value });
  } catch (err) {
    next(err);
  }
};

exports.getMetrics = async (req, res, next) => {
  try {
    const metric = await SiteMetric.findOne({ key: 'visitorCount' });
    return sendSuccess(res, 200, 'Site metrics retrieved', { count: metric?.value || 0 });
  } catch (err) {
    next(err);
  }
};
