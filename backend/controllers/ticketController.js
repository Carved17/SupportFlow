const Ticket = require("../models/ticket");

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Public
exports.createTicket = async (req, res) => {
  try {
    console.log('📝 Creating new ticket:', req.body);
    
    const ticketData = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || "Medium",
      status: req.body.status || "Open",
      category: req.body.category || "General",
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName || req.body.customerEmail.split('@')[0],
      assignedTo: req.body.assignedTo
    };

    const ticket = await Ticket.create(ticketData);
    
    console.log('✅ Ticket created successfully:', ticket._id);
    
    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    console.error('❌ Error creating ticket:', err.message);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating ticket'
    });
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Public
exports.getAllTickets = async (req, res) => {
  try {
    console.log('📋 Fetching all tickets');
    
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    
    console.log(`✅ Found ${tickets.length} tickets`);
    
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    console.error('❌ Error fetching tickets:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching tickets'
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Public
exports.getTicket = async (req, res) => {
  try {
    console.log('🔍 Fetching ticket:', req.params.id);
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      console.log('❌ Ticket not found:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }
    
    console.log('✅ Ticket found:', ticket._id);
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    console.error('❌ Error fetching ticket:', err.message);
    
    // Invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ticket ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while fetching ticket'
    });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Public
exports.updateTicket = async (req, res) => {
  try {
    console.log('✏️ Updating ticket:', req.params.id, 'with:', req.body);
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        updatedAt: new Date() 
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!ticket) {
      console.log('❌ Ticket not found for update:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    console.log('✅ Ticket updated successfully:', ticket._id);
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    console.error('❌ Error updating ticket:', err.message);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    // Invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ticket ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating ticket'
    });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Public
exports.deleteTicket = async (req, res) => {
  try {
    console.log('🗑️ Deleting ticket:', req.params.id);
    
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    
    if (!ticket) {
      console.log('❌ Ticket not found for deletion:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    console.log('✅ Ticket deleted successfully:', req.params.id);
    
    res.status(200).json({
      success: true,
      data: {
        message: 'Ticket deleted successfully',
        id: req.params.id
      }
    });
  } catch (err) {
    console.error('❌ Error deleting ticket:', err.message);
    
    // Invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ticket ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while deleting ticket'
    });
  }
};