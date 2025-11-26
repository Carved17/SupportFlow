// Main application controller
class SupportFlowApp {
    constructor() {
        console.log('SupportFlow App initialized');
        this.currentUser = null;
        this.tickets = [];
        this.notifications = [];
        this.currentPage = 1;
        this.itemsPerPage = 25;
        this.currentView = 'grid';
        this.currentFilters = {
            status: 'all',
            priority: 'all',
            category: 'all',
            sort: 'newest',
            search: ''
        };
        this.init();
    }

    init() {
        console.log('App starting...');
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadSampleData();
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Login/Register forms - SAFELY CHECK IF ELEMENTS EXIST
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin(e);
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Register form submitted');
                this.handleRegister(e);
            });
        }

        // Navigation - SAFELY CHECK IF ELEMENTS EXIST
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems.length > 0) {
            navItems.forEach(item => {
                item.addEventListener('click', (e) => this.handleNavigation(e));
            });
        }

        // Topbar actions - SAFELY CHECK IF ELEMENTS EXIST
        const createTicketBtn = document.getElementById('createTicketBtn');
        const backToDashboardBtn = document.getElementById('backToDashboardBtn');
        const notificationBell = document.getElementById('notificationBell');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeNotifications = document.querySelector('.close-notifications');

        if (createTicketBtn) {
            createTicketBtn.addEventListener('click', () => {
                console.log('Create ticket button clicked');
                this.navigateToPage('create-ticket');
            });
        }

        if (backToDashboardBtn) {
            backToDashboardBtn.addEventListener('click', () => {
                console.log('Back to dashboard clicked');
                this.navigateToPage('dashboard');
            });
        }

        if (notificationBell) {
            notificationBell.addEventListener('click', () => {
                console.log('Notification bell clicked');
                this.toggleNotifications();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('Logout clicked');
                this.handleLogout();
            });
        }

        if (closeNotifications) {
            closeNotifications.addEventListener('click', () => {
                console.log('Close notifications clicked');
                this.toggleNotifications();
            });
        }

        // Global search - SAFELY CHECK IF ELEMENT EXISTS
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', 
                UI.debounce((e) => {
                    this.currentFilters.search = e.target.value;
                    console.log('Search input:', this.currentFilters.search);
                    this.applyFilters();
                }, 300)
            );
        }
        
        // Dashboard filters - SAFELY CHECK IF ELEMENTS EXIST
        const statusFilter = document.getElementById('statusFilter');
        const sortBy = document.getElementById('sortBy');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                console.log('Status filter changed:', statusFilter.value);
                this.applyFilters();
            });
        }

        if (sortBy) {
            sortBy.addEventListener('change', () => {
                console.log('Sort by changed:', sortBy.value);
                this.applyFilters();
            });
        }

        // Create ticket form - SAFELY CHECK IF ELEMENTS EXIST
        const createTicketForm = document.getElementById('createTicketForm');
        const resetFormBtn = document.getElementById('resetFormBtn');

        if (createTicketForm) {
            createTicketForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Create ticket form submitted');
                this.handleCreateTicket(e);
            });
        }

        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                console.log('Reset form clicked');
                this.resetCreateForm();
            });
        }

        // File upload - SAFELY CHECK IF ELEMENTS EXIST
        const fileUploadArea = document.getElementById('fileUploadArea');
        const ticketAttachment = document.getElementById('ticketAttachment');

        if (fileUploadArea) {
            fileUploadArea.addEventListener('click', () => {
                console.log('File upload area clicked');
                if (ticketAttachment) {
                    ticketAttachment.click();
                }
            });
        }

        if (ticketAttachment) {
            ticketAttachment.addEventListener('change', (e) => {
                console.log('File selected:', e.target.files);
                this.handleFileSelect(e.target.files);
            });
        }

        // View tickets page buttons - SAFELY CHECK IF ELEMENTS EXIST
        const newTicketBtn = document.getElementById('newTicketBtn');
        const exportTicketsBtn = document.getElementById('exportTicketsBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');

        if (newTicketBtn) {
            newTicketBtn.addEventListener('click', () => {
                console.log('New ticket button clicked');
                this.navigateToPage('create-ticket');
            });
        }

        if (exportTicketsBtn) {
            exportTicketsBtn.addEventListener('click', () => {
                console.log('Export tickets clicked');
                this.exportTickets();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                console.log('Clear filters clicked');
                this.clearFilters();
            });
        }

        // View tickets filters - SAFELY CHECK IF ELEMENTS EXIST
        const viewFilterStatus = document.getElementById('viewFilterStatus');
        const viewFilterPriority = document.getElementById('viewFilterPriority');
        const viewFilterCategory = document.getElementById('viewFilterCategory');
        const viewSortTickets = document.getElementById('viewSortTickets');
        const viewMode = document.getElementById('viewMode');
        const itemsPerPage = document.getElementById('itemsPerPage');

        if (viewFilterStatus) {
            viewFilterStatus.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                console.log('View status filter:', this.currentFilters.status);
                this.applyFilters();
            });
        }

        if (viewFilterPriority) {
            viewFilterPriority.addEventListener('change', (e) => {
                this.currentFilters.priority = e.target.value;
                console.log('View priority filter:', this.currentFilters.priority);
                this.applyFilters();
            });
        }

        if (viewFilterCategory) {
            viewFilterCategory.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                console.log('View category filter:', this.currentFilters.category);
                this.applyFilters();
            });
        }

        if (viewSortTickets) {
            viewSortTickets.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                console.log('View sort:', this.currentFilters.sort);
                this.applyFilters();
            });
        }

        if (viewMode) {
            viewMode.addEventListener('change', (e) => {
                this.currentView = e.target.value;
                console.log('View mode:', this.currentView);
                this.toggleViewMode();
            });
        }

        if (itemsPerPage) {
            itemsPerPage.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                console.log('Items per page:', this.itemsPerPage);
                this.applyFilters();
            });
        }

        // Tab switching - SAFELY CHECK IF ELEMENTS EXIST
        const tabs = document.querySelectorAll('.tab');
        if (tabs.length > 0) {
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.getAttribute('data-tab');
                    console.log('Tab clicked:', tabName);
                    
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    
                    const tabContent = document.getElementById(`${tabName}-tab`);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                    
                    UI.hideError('loginError');
                    UI.hideError('registerError');
                });
            });
        }

        console.log('All event listeners set up successfully');
    }

    checkAuthStatus() {
        const user = localStorage.getItem('supportFlowUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            console.log('User found:', this.currentUser);
            this.showApp();
        } else {
            console.log('No user found, showing login');
            this.showLogin();
        }
    }

    showLogin() {
        // SAFELY CHECK IF ELEMENTS EXIST
        const loginScreen = document.getElementById('loginScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
        
        console.log('Showing login screen');
    }

    showApp() {
        // SAFELY CHECK IF ELEMENTS EXIST
        const loginScreen = document.getElementById('loginScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
        
        this.updateUserInfo();
        this.loadDashboard();
        console.log('Showing app');
    }

    updateUserInfo() {
        if (this.currentUser) {
            const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            // SAFELY UPDATE ELEMENTS IF THEY EXIST
            const userAvatar = document.getElementById('userAvatar');
            const topbarUserAvatar = document.getElementById('topbarUserAvatar');
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            const welcomeUserName = document.getElementById('welcomeUserName');
            
            if (userAvatar) userAvatar.textContent = initials;
            if (topbarUserAvatar) topbarUserAvatar.textContent = initials;
            if (userName) userName.textContent = this.currentUser.name;
            if (userRole) userRole.textContent = this.currentUser.role === 'admin' ? 'Administrator' : 'Support Agent';
            if (welcomeUserName) welcomeUserName.textContent = this.currentUser.name.split(' ')[0];
            
            console.log('User info updated:', this.currentUser);
        }
    }

    async handleLogin(e) {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!emailInput || !passwordInput) {
            console.error('Login form elements not found');
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        UI.hideError('loginError');

        try {
            const submitBtn = document.getElementById('loginSubmitBtn');
            if (submitBtn) UI.showLoading(submitBtn, 'Signing in...');

            const user = await ticketAPI.login(email, password);
            this.currentUser = user;
            localStorage.setItem('supportFlowUser', JSON.stringify(user));
            
            UI.showSuccess('Login successful! Welcome back.');
            this.showApp();
        } catch (error) {
            UI.showError('loginError', error.message);
        } finally {
            const submitBtn = document.getElementById('loginSubmitBtn');
            if (submitBtn) UI.hideLoading(submitBtn);
        }
    }

    async handleRegister(e) {
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('registerConfirmPassword');
        
        if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            console.error('Register form elements not found');
            return;
        }

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        UI.hideError('registerError');

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            UI.showError('registerError', 'All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            UI.showError('registerError', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            UI.showError('registerError', 'Password must be at least 6 characters long');
            return;
        }

        if (!UI.isValidEmail(email)) {
            UI.showError('registerError', 'Please enter a valid email address');
            return;
        }

        try {
            const submitBtn = document.getElementById('registerSubmitBtn');
            if (submitBtn) UI.showLoading(submitBtn, 'Creating account...');

            const user = await ticketAPI.register(name, email, password);
            this.currentUser = user;
            localStorage.setItem('supportFlowUser', JSON.stringify(user));
            
            UI.showSuccess('Registration successful! Welcome to SupportFlow.');
            this.showApp();
        } catch (error) {
            UI.showError('registerError', error.message);
        } finally {
            const submitBtn = document.getElementById('registerSubmitBtn');
            if (submitBtn) UI.hideLoading(submitBtn);
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('supportFlowUser');
        this.showLogin();
        UI.showSuccess('Logged out successfully');
        console.log('User logged out');
    }

    handleNavigation(e) {
        const target = e.currentTarget;
        const page = target.getAttribute('data-page');
        
        console.log('Navigation clicked:', page, 'User role:', this.currentUser?.role);
        
        // Check admin access for admin dashboard
        if (page === 'admin-dashboard') {
            if (!this.currentUser) {
                UI.showError('globalError', 'Please login first.');
                console.log('No user logged in');
                
                // Don't proceed with navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                // Re-activate the current active item or default to dashboard
                const activeItem = document.querySelector('.nav-item[data-page="dashboard"]');
                if (activeItem) activeItem.classList.add('active');
                return;
            }
            
            if (this.currentUser.role !== 'admin') {
                UI.showError('globalError', 'Access denied. Admin privileges required.');
                console.log('Admin access denied for user role:', this.currentUser.role);
                
                // Don't proceed with navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                // Re-activate the current active item
                const activeItem = document.querySelector('.nav-item[data-page="dashboard"]');
                if (activeItem) activeItem.classList.add('active');
                return;
            }
        }
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        target.classList.add('active');
        
        // Navigate to page
        this.navigateToPage(page);
    }

    navigateToPage(page) {
        console.log('Navigating to page:', page);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Page shown:', page);
        } else {
            console.error('Page not found:', page);
        }
        
        // Load page-specific data
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'view-tickets':
                this.loadTicketsView();
                break;
            case 'create-ticket':
                this.loadCreateTicket();
                break;
            case 'admin-dashboard':
                this.loadAdminDashboard();
                break;
            case 'search':
                this.loadSearchPage();
                break;
        }
    }

    async loadDashboard() {
        try {
            console.log('Loading dashboard...');
            this.tickets = await ticketAPI.getTickets();
            this.updateStats();
            this.renderRecentTickets();
            console.log('Dashboard loaded successfully');
        } catch (error) {
            console.error('Error loading dashboard:', error);
            UI.showError('globalError', 'Failed to load dashboard data');
        }
    }

    updateStats() {
        const openTickets = this.tickets.filter(t => t.status === 'Open').length;
        const progressTickets = this.tickets.filter(t => t.status === 'In Progress').length;
        const resolvedTickets = this.tickets.filter(t => t.status === 'Resolved').length;
        const totalTickets = this.tickets.length;

        // SAFELY UPDATE STATS IF ELEMENTS EXIST
        const openTicketsCount = document.getElementById('openTicketsCount');
        const progressTicketsCount = document.getElementById('progressTicketsCount');
        const resolvedTicketsCount = document.getElementById('resolvedTicketsCount');
        const totalTicketsCount = document.getElementById('totalTicketsCount');

        if (openTicketsCount) openTicketsCount.textContent = openTickets;
        if (progressTicketsCount) progressTicketsCount.textContent = progressTickets;
        if (resolvedTicketsCount) resolvedTicketsCount.textContent = resolvedTickets;
        if (totalTicketsCount) totalTicketsCount.textContent = totalTickets;

        console.log('Stats updated - Open:', openTickets, 'In Progress:', progressTickets, 'Resolved:', resolvedTickets, 'Total:', totalTickets);
    }

    renderRecentTickets() {
        const container = document.getElementById('ticketsGrid');
        if (!container) {
            console.log('Tickets grid container not found');
            return;
        }

        const filteredTickets = this.applyFilters();
        
        if (filteredTickets.length === 0) {
            container.innerHTML = `
                <div class="no-tickets">
                    <i class="fas fa-inbox"></i>
                    <h3>No tickets found</h3>
                    <p>${this.currentFilters.search ? 'Try adjusting your search terms' : 'Create your first ticket to get started'}</p>
                    ${!this.currentFilters.search ? `<button class="btn btn-primary" onclick="app.navigateToPage('create-ticket')">Create Ticket</button>` : ''}
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTickets.slice(0, 6).map(ticket => `
            <div class="ticket-card" onclick="app.viewTicket('${ticket._id || ticket.id}')">
                <div class="ticket-header">
                    <div class="ticket-id">#${ticket._id ? ticket._id.substring(0, 8) : ticket.id}</div>
                    <div class="ticket-priority priority-${ticket.priority.toLowerCase()}">${ticket.priority}</div>
                </div>
                <div class="ticket-title">${ticket.title}</div>
                <div class="ticket-description">${ticket.description}</div>
                <div class="ticket-meta">
                    <div>${ticket.customerEmail}</div>
                    <div>${new Date(ticket.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="ticket-status status-${ticket.status.toLowerCase().replace(' ', '')}">${ticket.status}</div>
                <div class="ticket-actions">
                    <button class="action-btn action-view" onclick="event.stopPropagation(); app.viewTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn action-edit" onclick="event.stopPropagation(); app.editTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');

        console.log('Recent tickets rendered:', filteredTickets.length);
    }

    applyFilters() {
        let filteredTickets = [...this.tickets];

        // Apply search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filteredTickets = filteredTickets.filter(ticket => 
                ticket.title.toLowerCase().includes(searchTerm) ||
                ticket.description.toLowerCase().includes(searchTerm) ||
                ticket.customerEmail.toLowerCase().includes(searchTerm) ||
                (ticket._id && ticket._id.toLowerCase().includes(searchTerm)) ||
                (ticket.id && ticket.id.toLowerCase().includes(searchTerm))
            );
        }

        // Apply status filter
        if (this.currentFilters.status !== 'all') {
            filteredTickets = filteredTickets.filter(ticket => 
                ticket.status === this.currentFilters.status
            );
        }

        // Apply priority filter
        if (this.currentFilters.priority !== 'all') {
            filteredTickets = filteredTickets.filter(ticket => 
                ticket.priority === this.currentFilters.priority
            );
        }

        // Apply category filter
        if (this.currentFilters.category !== 'all') {
            filteredTickets = filteredTickets.filter(ticket => 
                ticket.category === this.currentFilters.category
            );
        }

        // Apply sorting
        switch(this.currentFilters.sort) {
            case 'newest':
                filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filteredTickets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
                filteredTickets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'status':
                const statusOrder = { 'Open': 1, 'In Progress': 2, 'Resolved': 3 };
                filteredTickets.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
                break;
        }

        this.renderFilteredTickets(filteredTickets);
        return filteredTickets;
    }

    renderFilteredTickets(tickets) {
        const ticketsCount = document.getElementById('ticketsCount');
        if (ticketsCount) {
            ticketsCount.textContent = tickets.length;
        }

        // Calculate pagination
        const totalPages = Math.ceil(tickets.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedTickets = tickets.slice(startIndex, endIndex);

        // Render based on current view mode
        if (this.currentView === 'grid') {
            this.renderGridView(paginatedTickets);
        } else {
            this.renderListView(paginatedTickets);
        }

        this.renderPagination(totalPages);
    }

    renderGridView(tickets) {
        const container = document.getElementById('ticketsGridView');
        if (!container) {
            console.log('Grid view container not found');
            return;
        }
        
        if (tickets.length === 0) {
            container.innerHTML = `
                <div class="no-tickets">
                    <i class="fas fa-inbox"></i>
                    <h3>No tickets found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button class="btn btn-primary" onclick="app.clearFilters()">Clear Filters</button>
                </div>
            `;
            return;
        }

        container.innerHTML = tickets.map(ticket => `
            <div class="ticket-card" onclick="app.viewTicket('${ticket._id || ticket.id}')">
                <div class="ticket-header">
                    <div class="ticket-id">#${ticket._id ? ticket._id.substring(0, 8) : ticket.id}</div>
                    <div class="ticket-priority priority-${ticket.priority.toLowerCase()}">
                        ${ticket.priority}
                    </div>
                </div>
                <div class="ticket-title">${ticket.title}</div>
                <div class="ticket-description">${UI.truncateText(ticket.description, 100)}</div>
                <div class="ticket-meta">
                    <div><i class="fas fa-user"></i> ${ticket.customerEmail}</div>
                    <div><i class="fas fa-calendar"></i> ${UI.formatDate(ticket.createdAt)}</div>
                </div>
                <div class="ticket-footer">
                    <span class="ticket-status status-${ticket.status.toLowerCase().replace(' ', '')}">
                        ${ticket.status}
                    </span>
                    <span class="ticket-category">${ticket.category || 'General'}</span>
                </div>
                <div class="ticket-actions">
                    <button class="action-btn action-view" onclick="event.stopPropagation(); app.viewTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn action-edit" onclick="event.stopPropagation(); app.editTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn action-resolve" onclick="event.stopPropagation(); app.resolveTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-check"></i> Resolve
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderListView(tickets) {
        const container = document.getElementById('ticketsTableBody');
        if (!container) {
            console.log('List view container not found');
            return;
        }
        
        if (tickets.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="8" class="no-tickets-cell">
                        <div class="no-tickets">
                            <i class="fas fa-inbox"></i>
                            <h3>No tickets found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = tickets.map(ticket => `
            <tr>
                <td>#${ticket._id ? ticket._id.substring(0, 8) : ticket.id}</td>
                <td>
                    <div class="ticket-title">${ticket.title}</div>
                    <div class="ticket-description">${UI.truncateText(ticket.description, 50)}</div>
                </td>
                <td>${ticket.customerEmail}</td>
                <td>
                    <span class="ticket-status status-${ticket.status.toLowerCase().replace(' ', '')}">
                        ${ticket.status}
                    </span>
                </td>
                <td>
                    <span class="ticket-priority priority-${ticket.priority.toLowerCase()}">
                        ${ticket.priority}
                    </span>
                </td>
                <td>${ticket.category || 'General'}</td>
                <td>${UI.formatDate(ticket.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn action-view" onclick="app.viewTicket('${ticket._id || ticket.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn action-edit" onclick="app.editTicket('${ticket._id || ticket.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-resolve" onclick="app.resolveTicket('${ticket._id || ticket.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderPagination(totalPages) {
        const container = document.getElementById('pagination');
        if (!container) {
            console.log('Pagination container not found');
            return;
        }
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="app.changePage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="app.changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="app.changePage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        container.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('Page changed to:', page);
    }

    toggleViewMode() {
        const gridView = document.getElementById('ticketsGridView');
        const listView = document.getElementById('ticketsListView');
        
        if (gridView && listView) {
            if (this.currentView === 'grid') {
                gridView.style.display = 'grid';
                listView.style.display = 'none';
            } else {
                gridView.style.display = 'none';
                listView.style.display = 'block';
            }
            
            this.applyFilters();
            console.log('View mode toggled to:', this.currentView);
        }
    }

    clearFilters() {
        // SAFELY CLEAR FILTERS
        const globalSearch = document.getElementById('globalSearch');
        const viewFilterStatus = document.getElementById('viewFilterStatus');
        const viewFilterPriority = document.getElementById('viewFilterPriority');
        const viewFilterCategory = document.getElementById('viewFilterCategory');
        const viewSortTickets = document.getElementById('viewSortTickets');
        
        if (globalSearch) globalSearch.value = '';
        if (viewFilterStatus) viewFilterStatus.value = 'all';
        if (viewFilterPriority) viewFilterPriority.value = 'all';
        if (viewFilterCategory) viewFilterCategory.value = 'all';
        if (viewSortTickets) viewSortTickets.value = 'newest';
        
        this.currentFilters = {
            status: 'all',
            priority: 'all',
            category: 'all',
            sort: 'newest',
            search: ''
        };
        
        this.applyFilters();
        console.log('Filters cleared');
    }

    async handleCreateTicket(e) {
        const titleInput = document.getElementById('ticketTitle');
        const descriptionInput = document.getElementById('ticketDescription');
        const priorityInput = document.getElementById('ticketPriority');
        const categoryInput = document.getElementById('ticketCategory');
        const customerEmailInput = document.getElementById('customerEmail');
        
        if (!titleInput || !descriptionInput || !priorityInput || !categoryInput || !customerEmailInput) {
            console.error('Create ticket form elements not found');
            return;
        }

        const title = titleInput.value;
        const description = descriptionInput.value;
        const priority = priorityInput.value;
        const category = categoryInput.value;
        const customerEmail = customerEmailInput.value;

        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
        });

        // Validation
        if (!title) {
            const titleError = document.getElementById('titleError');
            if (titleError) titleError.textContent = 'Title is required';
            return;
        }
        if (!description) {
            const descriptionError = document.getElementById('descriptionError');
            if (descriptionError) descriptionError.textContent = 'Description is required';
            return;
        }
        if (!priority) {
            const priorityError = document.getElementById('priorityError');
            if (priorityError) priorityError.textContent = 'Priority is required';
            return;
        }
        if (!category) {
            const categoryError = document.getElementById('categoryError');
            if (categoryError) categoryError.textContent = 'Category is required';
            return;
        }
        if (!customerEmail || !UI.isValidEmail(customerEmail)) {
            const emailError = document.getElementById('emailError');
            if (emailError) emailError.textContent = 'Valid email is required';
            return;
        }

        try {
            const submitBtn = document.getElementById('submitTicketBtn');
            if (submitBtn) UI.showLoading(submitBtn, 'Creating ticket...');

            const ticketData = {
                title,
                description,
                priority,
                category,
                customerEmail,
                customerName: this.currentUser.name
            };

            const newTicket = await ticketAPI.createTicket(ticketData);
            
            UI.showSuccess(`Ticket #${newTicket._id ? newTicket._id.substring(0, 8) : newTicket.id} created successfully!`);
            this.resetCreateForm();
            
            // Redirect to dashboard after a delay
            setTimeout(() => {
                this.navigateToPage('dashboard');
                this.loadDashboard();
            }, 2000);

        } catch (error) {
            UI.showError('formError', error.message);
        } finally {
            const submitBtn = document.getElementById('submitTicketBtn');
            if (submitBtn) UI.hideLoading(submitBtn);
        }
    }

    resetCreateForm() {
        const createTicketForm = document.getElementById('createTicketForm');
        const fileList = document.getElementById('fileList');
        
        if (createTicketForm) createTicketForm.reset();
        if (fileList) fileList.innerHTML = '';
        
        document.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
        });
        console.log('Create ticket form reset');
    }

    handleFileSelect(files) {
        const fileList = document.getElementById('fileList');
        const fileError = document.getElementById('fileError');
        
        if (!fileList || !fileError) {
            console.error('File upload elements not found');
            return;
        }
        
        fileList.innerHTML = '';
        fileError.textContent = '';

        for (let file of files) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                fileError.textContent = `File "${file.name}" exceeds size limit of 10MB`;
                continue;
            }

            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <button type="button" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        }

        console.log('Files selected:', files.length);
    }

    viewTicket(ticketId) {
        console.log('Viewing ticket:', ticketId);
        window.location.href = `ticket-details.html?id=${ticketId}`;
    }

    async editTicket(ticketId) {
        const ticket = this.tickets.find(t => t._id === ticketId || t.id === ticketId);
        if (!ticket) return;

        console.log('Editing ticket:', ticketId);

        UI.createModal(
            'Edit Ticket',
            `
            <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" id="editTitle" value="${ticket.title}">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="editDescription" rows="4">${ticket.description}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-control" id="editStatus">
                        <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                        <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <select class="form-control" id="editPriority">
                        <option value="Low" ${ticket.priority === 'Low' ? 'selected' : ''}>Low</option>
                        <option value="Medium" ${ticket.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="High" ${ticket.priority === 'High' ? 'selected' : ''}>High</option>
                    </select>
                </div>
            </div>
            `,
            [
                {
                    text: 'Cancel',
                    class: 'btn-outline',
                    onclick: `document.body.removeChild(this.closest('.modal-overlay'))`
                },
                {
                    text: 'Save Changes',
                    class: 'btn-primary',
                    onclick: `app.saveTicketEdit('${ticketId}')`
                }
            ]
        );
    }

    async saveTicketEdit(ticketId) {
        try {
            const editTitle = document.getElementById('editTitle');
            const editDescription = document.getElementById('editDescription');
            const editStatus = document.getElementById('editStatus');
            const editPriority = document.getElementById('editPriority');
            
            if (!editTitle || !editDescription || !editStatus || !editPriority) {
                throw new Error('Edit form elements not found');
            }

            const updates = {
                title: editTitle.value,
                description: editDescription.value,
                status: editStatus.value,
                priority: editPriority.value
            };

            await ticketAPI.updateTicket(ticketId, updates);
            UI.showSuccess('Ticket updated successfully!');
            await this.loadDashboard();
            
            // Close modal
            const modal = document.querySelector('.modal-overlay');
            if (modal) document.body.removeChild(modal);
        } catch (error) {
            UI.showError('editError', error.message);
        }
    }

    async resolveTicket(ticketId) {
        console.log('Resolving ticket:', ticketId);
        UI.confirm(
            'Are you sure you want to mark this ticket as resolved?',
            `app.resolveTicketConfirmed('${ticketId}')`
        );
    }

    async resolveTicketConfirmed(ticketId) {
        try {
            await ticketAPI.updateTicket(ticketId, { status: 'Resolved' });
            UI.showSuccess('Ticket marked as resolved!');
            await this.loadDashboard();
        } catch (error) {
            UI.showError('resolveError', error.message);
        }
    }

    exportTickets() {
        UI.showSuccess('Export functionality will be available soon!');
        console.log('Export tickets clicked');
    }

    toggleNotifications() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.toggle('active');
            console.log('Notifications toggled');
        }
    }

    loadTicketsView() {
        this.applyFilters();
        console.log('Tickets view loaded');
    }

    loadCreateTicket() {
        // Pre-fill email if user is logged in
        const customerEmail = document.getElementById('customerEmail');
        if (customerEmail && this.currentUser) {
            customerEmail.value = this.currentUser.email;
        }
        console.log('Create ticket page loaded');
    }

    loadAdminDashboard() {
        console.log('Loading admin dashboard...');
        
        // Check if user is admin
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            UI.showError('globalError', 'Admin access required');
            this.navigateToPage('dashboard');
            return;
        }
        
        // Load admin-specific data
        this.renderAdminTickets();
        UI.showSuccess('Welcome to Admin Dashboard!');
        console.log('Admin dashboard loaded successfully');
    }

    renderAdminTickets() {
        const container = document.getElementById('adminTicketsGrid');
        if (!container) {
            console.error('Admin tickets container not found');
            return;
        }
        
        const adminTickets = this.tickets; // Show all tickets for admin
        
        if (adminTickets.length === 0) {
            container.innerHTML = `
                <div class="no-tickets">
                    <i class="fas fa-inbox"></i>
                    <h3>No tickets available</h3>
                    <p>There are no tickets to display</p>
                </div>
            `;
            return;
        }

        container.innerHTML = adminTickets.map(ticket => `
            <div class="ticket-card">
                <div class="ticket-header">
                    <div class="ticket-id">#${ticket._id ? ticket._id.substring(0, 8) : ticket.id}</div>
                    <div class="ticket-priority priority-${ticket.priority.toLowerCase()}">${ticket.priority}</div>
                </div>
                <div class="ticket-title">${ticket.title}</div>
                <div class="ticket-description">${ticket.description}</div>
                <div class="ticket-meta">
                    <div>${ticket.customerEmail}</div>
                    <div>Assigned to: ${ticket.assignedTo || 'Unassigned'}</div>
                </div>
                <div class="ticket-status status-${ticket.status.toLowerCase().replace(' ', '')}">${ticket.status}</div>
                <div class="ticket-actions">
                    <button class="action-btn action-view" onclick="app.viewTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn action-edit" onclick="app.editTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn action-resolve" onclick="app.resolveTicket('${ticket._id || ticket.id}')">
                        <i class="fas fa-check"></i> Resolve
                    </button>
                </div>
            </div>
        `).join('');

        console.log('Admin tickets rendered:', adminTickets.length);
    }

    loadSearchPage() {
        // Initialize search page
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', () => this.performSearch());
        }
        console.log('Search page loaded');
    }

    performSearch() {
        const advancedSearch = document.getElementById('advancedSearch');
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        const assignedAgentFilter = document.getElementById('assignedAgentFilter');
        const ticketSourceFilter = document.getElementById('ticketSourceFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        
        if (!advancedSearch) {
            console.error('Search elements not found');
            return;
        }

        const searchTerm = advancedSearch.value;
        const startDateValue = startDate ? startDate.value : '';
        const endDateValue = endDate ? endDate.value : '';
        const assignedAgentValue = assignedAgentFilter ? assignedAgentFilter.value : 'all';
        const ticketSourceValue = ticketSourceFilter ? ticketSourceFilter.value : 'all';
        const ratingValue = ratingFilter ? ratingFilter.value : 'all';

        console.log('Performing search:', { searchTerm, startDateValue, endDateValue, assignedAgentValue, ticketSourceValue, ratingValue });

        // Implement search logic here
        let results = this.tickets.filter(ticket => {
            let matches = true;

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                matches = matches && (
                    ticket.title.toLowerCase().includes(term) ||
                    ticket.description.toLowerCase().includes(term) ||
                    ticket.customerEmail.toLowerCase().includes(term) ||
                    (ticket._id && ticket._id.toLowerCase().includes(term)) ||
                    (ticket.id && ticket.id.toLowerCase().includes(term))
                );
            }

            if (startDateValue) {
                matches = matches && new Date(ticket.createdAt) >= new Date(startDateValue);
            }

            if (endDateValue) {
                matches = matches && new Date(ticket.createdAt) <= new Date(endDateValue);
            }

            if (assignedAgentValue !== 'all') {
                matches = matches && ticket.assignedTo === assignedAgentValue;
            }

            return matches;
        });

        this.renderSearchResults(results);
    }

    renderSearchResults(results) {
        const container = document.getElementById('searchResultsGrid');
        const countElement = document.getElementById('resultsCount');
        
        if (!container || !countElement) {
            console.error('Search results elements not found');
            return;
        }

        countElement.textContent = results.length;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-tickets">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map(ticket => `
            <div class="ticket-card" onclick="app.viewTicket('${ticket._id || ticket.id}')">
                <div class="ticket-header">
                    <div class="ticket-id">#${ticket._id ? ticket._id.substring(0, 8) : ticket.id}</div>
                    <div class="ticket-priority priority-${ticket.priority.toLowerCase()}">
                        ${ticket.priority}
                    </div>
                </div>
                <div class="ticket-title">${ticket.title}</div>
                <div class="ticket-description">${UI.truncateText(ticket.description, 100)}</div>
                <div class="ticket-meta">
                    <div><i class="fas fa-user"></i> ${ticket.customerEmail}</div>
                    <div><i class="fas fa-calendar"></i> ${UI.formatDate(ticket.createdAt)}</div>
                </div>
                <div class="ticket-footer">
                    <span class="ticket-status status-${ticket.status.toLowerCase().replace(' ', '')}">
                        ${ticket.status}
                    </span>
                    <span class="ticket-category">${ticket.category || 'General'}</span>
                </div>
            </div>
        `).join('');

        console.log('Search results rendered:', results.length);
    }

    loadSampleData() {
        // Sample tickets data for demo
        this.tickets = [
            {
                _id: 'TK-1024',
                id: 'TK-1024',
                title: 'Login issue after update',
                description: 'Unable to login after the latest system update. Getting authentication errors.',
                status: 'Open',
                priority: 'High',
                category: 'Technical',
                customerEmail: 'sarah.j@example.com',
                customerName: 'Sarah Johnson',
                createdAt: '2023-06-15T10:30:00Z',
                updatedAt: '2023-06-15T10:30:00Z',
                assignedTo: 'John Doe'
            },
            {
                _id: 'TK-1023',
                id: 'TK-1023',
                title: 'Payment gateway not working',
                description: 'Customers reporting payment failures during checkout process.',
                status: 'In Progress',
                priority: 'High',
                category: 'Billing',
                customerEmail: 'mike.t@example.com',
                customerName: 'Mike Thompson',
                createdAt: '2023-06-14T14:20:00Z',
                updatedAt: '2023-06-15T09:15:00Z',
                assignedTo: 'Jane Smith'
            },
            {
                _id: 'TK-1022',
                id: 'TK-1022',
                title: 'Feature request: dark mode',
                description: 'Request for dark mode theme implementation for better night-time usage.',
                status: 'Open',
                priority: 'Low',
                category: 'Feature',
                customerEmail: 'alex.r@example.com',
                customerName: 'Alex Rodriguez',
                createdAt: '2023-06-13T09:15:00Z',
                updatedAt: '2023-06-13T09:15:00Z',
                assignedTo: null
            },
            {
                _id: 'TK-1021',
                id: 'TK-1021',
                title: 'Password reset not working',
                description: 'Password reset emails are not being delivered to users.',
                status: 'Resolved',
                priority: 'Medium',
                category: 'Technical',
                customerEmail: 'jessica.l@example.com',
                customerName: 'Jessica Lee',
                createdAt: '2023-06-12T16:45:00Z',
                updatedAt: '2023-06-14T11:20:00Z',
                assignedTo: 'John Doe'
            },
            {
                _id: 'TK-1020',
                id: 'TK-1020',
                title: 'Mobile app crashing on startup',
                description: 'App immediately crashes when opened on iOS devices running version 16.5.',
                status: 'In Progress',
                priority: 'High',
                category: 'Bug',
                customerEmail: 'david.k@example.com',
                customerName: 'David Kim',
                createdAt: '2023-06-11T08:30:00Z',
                updatedAt: '2023-06-13T14:45:00Z',
                assignedTo: 'Jane Smith'
            },
            {
                _id: 'TK-1019',
                id: 'TK-1019',
                title: 'Billing inquiry',
                description: 'Question about monthly subscription charges and invoice details.',
                status: 'Open',
                priority: 'Medium',
                category: 'Billing',
                customerEmail: 'maria.g@example.com',
                customerName: 'Maria Garcia',
                createdAt: '2023-06-10T11:20:00Z',
                updatedAt: '2023-06-10T11:20:00Z',
                assignedTo: null
            }
        ];
        console.log('Sample data loaded:', this.tickets.length, 'tickets');
    }
}

// Initialize the application
console.log('Initializing SupportFlow application...');
const app = new SupportFlowApp();
console.log('main.js loaded successfully!');