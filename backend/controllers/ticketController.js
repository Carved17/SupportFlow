// backend/controllers/ticketController.js
const Ticket = require("../models/ticket");
const User = require("../models/user");

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
      assignedTo: req.body.assignedTo,
      createdBy: req.body.userId
    };

    const ticket = await Ticket.create(ticketData);
    
    console.log('✅ Ticket created successfully:', ticket._id);
    
    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    console.error('❌ Error creating ticket:', err.message);
    
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

// @desc    Get all tickets with role-based filtering
// @route   GET /api/tickets
// @access  Public
exports.getAllTickets = async (req, res) => {
  try {
    console.log('📋 Fetching all tickets');
    
    const { userRole, userEmail, userId } = req.query;
    
    let filter = {};
    
    // Role-based filtering
    if (userRole === 'user') {
      filter = { customerEmail: userEmail };
    } else if (userRole === 'agent') {
      filter = { 
        $or: [
          { assignedAgent: userId },
          { assignedAgent: { $exists: false } },
          { assignedAgent: null }
        ]
      };
    }
    // Admins see all tickets (no filter)
    
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${tickets.length} real tickets from database`);
    
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

// @desc    Update ticket with role-based authorization
// @route   PUT /api/tickets/:id
// @access  Public
exports.updateTicket = async (req, res) => {
  try {
    console.log('✏️ Updating ticket:', req.params.id, 'with:', req.body);
    
    const { userRole, userEmail, userId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      console.log('❌ Ticket not found for update:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Role-based authorization for updates
    if (userRole === 'user') {
      // Users can only update their own tickets
      if (ticket.customerEmail !== userEmail) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only update your own tickets.'
        });
      }
      // Users can only update specific fields
      const allowedFields = ['title', 'description', 'priority', 'category'];
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });
      // Users cannot change status directly
      delete req.body.status;
      delete req.body.assignedTo;
      delete req.body.assignedAgent;
      
    } else if (userRole === 'agent') {
      // Agents can update status and assign to themselves
      const allowedFields = ['status', 'assignedTo', 'assignedAgent', 'title', 'description', 'priority', 'category'];
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });
      // Agents can only assign to themselves
      if (req.body.assignedAgent && req.body.assignedAgent !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Agents can only assign tickets to themselves.'
        });
      }
      
    } else if (userRole === 'admin') {
      // Admins can update all fields
      // No restrictions
    } else {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Invalid user role.'
      });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
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

    console.log('✅ Ticket updated successfully:', updatedTicket._id);
    
    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (err) {
    console.error('❌ Error updating ticket:', err.message);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
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

// @desc    Assign ticket to agent
// @route   PUT /api/tickets/:id/assign
// @access  Public
exports.assignTicket = async (req, res) => {
  try {
    const { agentId, agentName, userRole } = req.body;
    
    // Check if user has permission to assign tickets
    if (userRole !== 'admin' && userRole !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Only admins and agents can assign tickets.'
      });
    }

    // Agents can only assign to themselves
    if (userRole === 'agent' && agentId !== req.body.userId) {
      return res.status(403).json({
        success: false,
        error: 'Agents can only assign tickets to themselves.'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        assignedAgent: agentId,
        assignedTo: agentName,
        status: 'In Progress',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while assigning ticket'
    });
  }
};

// @desc    Delete ticket with role-based authorization
// @route   DELETE /api/tickets/:id
// @access  Public
exports.deleteTicket = async (req, res) => {
  try {
    console.log('🗑️ Deleting ticket:', req.params.id);
    
    const { userRole, userEmail } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      console.log('❌ Ticket not found for deletion:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Role-based authorization for deletion
    if (userRole === 'user') {
      // Users can only delete their own tickets
      if (ticket.customerEmail !== userEmail) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only delete your own tickets.'
        });
      }
    } else if (userRole !== 'admin') {
      // Only admins can delete other users' tickets
      return res.status(403).json({
        success: false,
        error: 'Access denied. Only admins can delete tickets.'
      });
    }

    await Ticket.findByIdAndDelete(req.params.id);

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