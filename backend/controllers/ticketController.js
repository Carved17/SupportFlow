const Ticket = require("../models/ticket");

exports.createTicket = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }

    // Check required fields
    if (!req.body.title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!req.body.description) {
      return res.status(400).json({ error: "Description is required" });
    }
    if (!req.body.customerEmail) {
      return res.status(400).json({ error: "Customer email is required" });
    }

    const ticketData = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || "Medium",
      status: req.body.status || "Open",
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName || "",
      category: req.body.category || "General",
      assignedTo: req.body.assignedTo || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating ticket with data:', ticketData);
    const ticket = await Ticket.create(ticketData);
    console.log('Ticket created successfully:', ticket);
    
    res.status(201).json(ticket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    console.log('Fetching all tickets');
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    console.log(`Found ${tickets.length} tickets`);
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getTicket = async (req, res) => {
  try {
    console.log('Fetching ticket:', req.params.id);
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    console.log('Ticket found:', ticket);
    res.json(ticket);
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    console.log('Updating ticket:', req.params.id, 'with data:', req.body);
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    console.log('Ticket updated successfully:', ticket);
    res.json(ticket);
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    console.log('Deleting ticket:', req.params.id);
    
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    console.log('Ticket deleted successfully:', req.params.id);
    res.json({ message: "Ticket deleted successfully", id: req.params.id });
  } catch (err) {
    console.error('Error deleting ticket:', err);
    res.status(500).json({ error: err.message });
  }
};