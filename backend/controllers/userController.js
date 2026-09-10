import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || {},
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, phone)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), phone: phone?.trim() || '' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user shipping address
// @route   PUT /api/users/address
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message:
          'Full name, phone, address line 1, city, state and pincode are required.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        address: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2?.trim() || '',
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          country: country?.trim() || 'India',
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Address updated successfully.',
      address: user.address,
    });
  } catch (error) {
    next(error);
  }
};
