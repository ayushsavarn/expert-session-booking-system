import Expert from '../models/Expert.js';

export const getExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const experts = await Expert.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-availableSlots');

    const total = await Expert.countDocuments(query);

    res.json({
      success: true,
      data: experts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    res.json({
      success: true,
      data: expert
    });
  } catch (error) {
    next(error);
  }
};