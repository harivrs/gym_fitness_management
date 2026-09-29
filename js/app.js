/**
 * FitPulse Gym & Fitness Club Membership System
 * Application Controller & UI Logic
 */

const App = {
  currentView: 'dashboard',
  currentRole: 'admin',
  activeEnrollClassId: null,
  charts: {},

  init() {
    // Check if initial data is present
    const data = DB.load();

    // Start live clock
    this.startClock();

    // Setup Event Listeners
    this.setupNavigation();
    this.setupGlobalSearch();
    this.setupModals();

    // Render Initial State
    this.renderAll();

    // Init Analytics Charts
    this.initCharts();
  },

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const el = document.getElementById('liveTimeBadge');
      if (el) {
        el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  },

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-view]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        this.showView(view);
      });
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }
  },

  showView(viewName) {
    this.currentView = viewName;

    // Update active nav-link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle active section
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Update headings
    const titleEl = document.getElementById('view-title');
    const subEl = document.getElementById('view-subtitle');

    const headers = {
      dashboard: { title: "Club Overview", sub: "Live health status, subscriptions, and active operations" },
      members: { title: "Member Directory & Registrations", sub: "Manage client subscriptions, personal trainers, and access tiers" },
      trainers: { title: "Certified Trainers & Coaches", sub: "Faculty profiles, client loads, and specialties" },
      classes: { title: "Fitness Classes & Schedules", sub: "Group workouts, room allocations, and roster enrollments" },
      equipment: { title: "Gym Equipment & Maintenance", sub: "Machinery tracking, inspection logs, and warranty records" },
      portal: { title: "Member Self-Service Experience", sub: "Interactive digital pass, coach connection, and enrolled workouts" },
      settings: { title: "Club Profile & Data Tools", sub: "Centralized database backup, import/export, and club settings" }
    };

    if (headers[viewName]) {
      titleEl.textContent = headers[viewName].title;
      subEl.textContent = headers[viewName].sub;
    }

    // Refresh view specific contents
    if (viewName === 'dashboard') {
      this.renderDashboard();
      this.updateCharts();
    } else if (viewName === 'members') {
      this.renderMembers();
    } else if (viewName === 'trainers') {
      this.renderTrainers();
    } else if (viewName === 'classes') {
      this.renderClasses();
    } else if (viewName === 'equipment') {
      this.renderEquipment();
    } else if (viewName === 'portal') {
      this.renderPortal();
    } else if (viewName === 'settings') {
      this.renderSettings();
    }
  },

  switchRole(role) {
    this.currentRole = role;
    const btnAdmin = document.getElementById('btnRoleAdmin');
    const btnMember = document.getElementById('btnRoleMember');

    if (role === 'admin') {
      btnAdmin.classList.add('active');
      btnMember.classList.remove('active');
      this.showToast("Switched to Lead Administrator mode", "info");
      this.showView('dashboard');
    } else {
      btnMember.classList.add('active');
      btnAdmin.classList.remove('active');
      this.showToast("Switched to Member Self-Service mode", "info");
      this.showView('portal');
    }
  },

  renderAll() {
    this.renderDashboard();
    this.renderMembers();
    this.renderTrainers();
    this.renderClasses();
    this.renderEquipment();
    this.renderPortal();
    this.renderSettings();
    this.updateBadges();
  },

  updateBadges() {
    const data = DB.load();
    const memBadge = document.getElementById('sidebar-member-badge');
    const classBadge = document.getElementById('sidebar-class-badge');
    const eqBadge = document.getElementById('sidebar-eq-badge');

    if (memBadge) memBadge.textContent = data.members.length;
    if (classBadge) classBadge.textContent = data.classes.length;

    const maintenanceCount = data.equipment.filter(e => e.status !== 'Operational').length;
    if (eqBadge) eqBadge.textContent = maintenanceCount;
  },

  /* ==========================================================================
     DASHBOARD MODULE
     ========================================================================== */
  renderDashboard() {
    const data = DB.load();

    // Calculate metrics
    const activeMembers = data.members.filter(m => m.status === 'Active');
    const expiringMembers = data.members.filter(m => m.status === 'Expiring Soon');
    const totalMembers = data.members.length;

    // Monthly revenue estimation
    const tierPricing = { 'VIP Black': 150, 'Premium': 95, 'Standard': 60, 'Basic': 35 };
    const monthlyRev = data.members.reduce((acc, m) => {
      if (m.status !== 'Expired') {
        return acc + (tierPricing[m.tier] || 50);
      }
      return acc;
    }, 0);

    const totalEnrollments = data.classes.reduce((acc, c) => acc + (c.enrolledMembers ? c.enrolledMembers.length : 0), 0);
    const eqAlerts = data.equipment.filter(e => e.status !== 'Operational').length;

    // Update DOM KPIs
    document.getElementById('kpi-active-members').textContent = activeMembers.length;
    document.getElementById('kpi-total-members').textContent = totalMembers;
    document.getElementById('kpi-revenue').textContent = (data.settings.currency || '$') + monthlyRev.toLocaleString();
    document.getElementById('kpi-classes-count').textContent = data.classes.length;
    document.getElementById('kpi-enrollments-count').textContent = totalEnrollments;
    document.getElementById('kpi-eq-alerts').textContent = eqAlerts;

    // Render Recent Activities
    const actContainer = document.getElementById('activityListContainer');
    if (actContainer) {
      if (data.activities.length === 0) {
        actContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">No logged activities yet.</p>`;
      } else {
        actContainer.innerHTML = data.activities.slice(0, 5).map(act => `
          <div class="activity-item">
            <div class="activity-icon ${act.type || 'system'}">
              <i class="fa-solid ${act.icon || 'fa-bell'}"></i>
            </div>
            <div class="activity-details">
              <div class="activity-title">
                <span>${this.escapeHTML(act.title)}</span>
                <span class="activity-time">${act.timestamp}</span>
              </div>
              <div class="activity-desc">${this.escapeHTML(act.description)}</div>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Subscriptions Due / Expiring
    const expiringContainer = document.getElementById('dashboardExpiringContainer');
    if (expiringContainer) {
      const flagged = data.members.filter(m => m.status === 'Expiring Soon' || m.status === 'Expired');
      if (flagged.length === 0) {
        expiringContainer.innerHTML = `
          <div style="padding: 1.5rem; text-align: center; color: var(--accent-primary);">
            <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            <strong>All Subscriptions Current</strong>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">No accounts currently flagged for renewal expiry.</p>
          </div>
        `;
      } else {
        expiringContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${flagged.map(m => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight: 600; font-size: 0.88rem; color: #fff;">${this.escapeHTML(m.name)}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Expires: ${m.expiryDate} (${m.tier})</div>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <span class="badge badge-${m.status === 'Expired' ? 'expired' : 'expiring'}">${m.status}</span>
                  <button class="btn btn-sm btn-secondary" onclick="App.renewMember('${m.id}')" title="Renew for 1 Year">
                    <i class="fa-solid fa-rotate"></i> Renew
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    // Update gym name in sidebar footer
    const gymSidebar = document.getElementById('gym-name-sidebar');
    if (gymSidebar) gymSidebar.textContent = data.settings.gymName || "FitPulse Athletic";
  },

  initCharts() {
    const data = DB.load();

    // Chart 1: Weekly Attendance Velocity
    const ctxAttendance = document.getElementById('weeklyAttendanceChart');
    if (ctxAttendance) {
      this.charts.attendance = new Chart(ctxAttendance, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Class Check-ins',
              data: [38, 45, 52, 49, 61, 74, 58],
              backgroundColor: '#10b981',
              borderRadius: 6
            },
            {
              label: 'Open Gym Access',
              data: [92, 110, 105, 98, 124, 140, 115],
              backgroundColor: '#3b82f6',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#94a3b8', font: { family: 'Inter' } }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // Chart 2: Membership Tier Distribution
    const ctxTier = document.getElementById('membershipTierChart');
    if (ctxTier) {
      const tierCounts = {
        'VIP Black': data.members.filter(m => m.tier === 'VIP Black').length,
        'Premium': data.members.filter(m => m.tier === 'Premium').length,
        'Standard': data.members.filter(m => m.tier === 'Standard').length,
        'Basic': data.members.filter(m => m.tier === 'Basic').length
      };

      this.charts.tier = new Chart(ctxTier, {
        type: 'doughnut',
        data: {
          labels: ['VIP Black', 'Premium', 'Standard', 'Basic'],
          datasets: [{
            data: [tierCounts['VIP Black'], tierCounts['Premium'], tierCounts['Standard'], tierCounts['Basic']],
            backgroundColor: ['#f59e0b', '#8b5cf6', '#06b6d4', '#64748b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#94a3b8', boxWidth: 12, font: { family: 'Inter', size: 11 } }
            }
          }
        }
      });
    }
  },

  updateCharts() {
    if (!this.charts.tier) return;
    const data = DB.load();
    const tierCounts = {
      'VIP Black': data.members.filter(m => m.tier === 'VIP Black').length,
      'Premium': data.members.filter(m => m.tier === 'Premium').length,
      'Standard': data.members.filter(m => m.tier === 'Standard').length,
      'Basic': data.members.filter(m => m.tier === 'Basic').length
    };
    this.charts.tier.data.datasets[0].data = [
      tierCounts['VIP Black'],
      tierCounts['Premium'],
      tierCounts['Standard'],
      tierCounts['Basic']
    ];
    this.charts.tier.update();
  },

  /* ==========================================================================
     MEMBERS MODULE
     ========================================================================== */
  renderMembers() {
    const data = DB.load();
    const searchVal = (document.getElementById('memberFilterSearch')?.value || '').toLowerCase().trim();
    const tierVal = document.getElementById('memberFilterTier')?.value || 'ALL';
    const statusVal = document.getElementById('memberFilterStatus')?.value || 'ALL';

    let list = data.members.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchVal) ||
                          m.code.toLowerCase().includes(searchVal) ||
                          m.email.toLowerCase().includes(searchVal);
      const matchTier = tierVal === 'ALL' || m.tier === tierVal;
      const matchStatus = statusVal === 'ALL' || m.status === statusVal;
      return matchSearch && matchTier && matchStatus;
    });

    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No members found matching current filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(m => {
      const trainer = data.trainers.find(t => t.id === m.trainerId);
      const trainerName = trainer ? trainer.name : '<span style="color: var(--text-muted);">None</span>';
      
      let tierClass = 'basic';
      if (m.tier === 'VIP Black') tierClass = 'vip';
      else if (m.tier === 'Premium') tierClass = 'premium';
      else if (m.tier === 'Standard') tierClass = 'standard';

      let statusBadge = `<span class="badge badge-active">Active</span>`;
      if (m.status === 'Expiring Soon') statusBadge = `<span class="badge badge-expiring">Expiring Soon</span>`;
      if (m.status === 'Expired') statusBadge = `<span class="badge badge-expired">Expired</span>`;

      const initials = m.name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();

      return `
        <tr>
          <td>
            <div class="member-cell">
              <div class="member-avatar-initials">${initials}</div>
              <div class="name-code">
                <h4>${this.escapeHTML(m.name)}</h4>
                <span>${m.code} • ${m.gender}, ${m.age}y</span>
              </div>
            </div>
          </td>
          <td><span class="badge badge-tier-${tierClass}">${m.tier}</span></td>
          <td>${statusBadge}</td>
          <td><i class="fa-solid fa-user-ninja" style="color: var(--accent-secondary); margin-right: 4px;"></i> ${trainerName}</td>
          <td>
            <div style="font-size: 0.8rem;">
              <div>From: <span style="color: var(--text-secondary);">${m.startDate}</span></div>
              <div>Until: <strong style="color: #fff;">${m.expiryDate}</strong></div>
            </div>
          </td>
          <td style="font-size: 0.8rem; color: var(--text-secondary);">${this.escapeHTML(m.emergencyContact || 'None listed')}</td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn-icon" title="Renew 1 Year" onclick="App.renewMember('${m.id}')">
                <i class="fa-solid fa-rotate"></i>
              </button>
              <button class="btn-icon" title="Edit Member" onclick="App.openEditMemberModal('${m.id}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-icon" style="color: #f87171;" title="Delete Member" onclick="App.deleteMember('${m.id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Populate trainer select in member modal
    const memTrainerSelect = document.getElementById('memTrainerSelect');
    if (memTrainerSelect) {
      memTrainerSelect.innerHTML = `<option value="">No Trainer Assigned</option>` +
        data.trainers.map(t => `<option value="${t.id}">${t.name} (${t.specialization})</option>`).join('');
    }
  },

  openEditMemberModal(memberId) {
    const data = DB.load();
    const member = data.members.find(m => m.id === memberId);
    if (!member) return;

    document.getElementById('modalMemberTitle').innerHTML = `<i class="fa-solid fa-user-pen"></i> Edit Member: ${this.escapeHTML(member.name)}`;
    document.getElementById('memberFormId').value = member.id;
    document.getElementById('memName').value = member.name;
    document.getElementById('memEmail').value = member.email;
    document.getElementById('memPhone').value = member.phone;
    document.getElementById('memGender').value = member.gender || 'Male';
    document.getElementById('memAge').value = member.age || 25;
    document.getElementById('memTier').value = member.tier;
    document.getElementById('memStatus').value = member.status;
    document.getElementById('memStart').value = member.startDate;
    document.getElementById('memExpiry').value = member.expiryDate;
    document.getElementById('memTrainerSelect').value = member.trainerId || '';
    document.getElementById('memEmergency').value = member.emergencyContact || '';
    document.getElementById('memNotes').value = member.notes || '';

    this.openModal('modal-member');
  },

  saveMemberForm(event) {
    event.preventDefault();
    const data = DB.load();
    const formId = document.getElementById('memberFormId').value;

    const memberData = {
      name: document.getElementById('memName').value.trim(),
      email: document.getElementById('memEmail').value.trim(),
      phone: document.getElementById('memPhone').value.trim(),
      gender: document.getElementById('memGender').value,
      age: parseInt(document.getElementById('memAge').value, 10) || 25,
      tier: document.getElementById('memTier').value,
      status: document.getElementById('memStatus').value,
      startDate: document.getElementById('memStart').value,
      expiryDate: document.getElementById('memExpiry').value,
      trainerId: document.getElementById('memTrainerSelect').value,
      emergencyContact: document.getElementById('memEmergency').value.trim(),
      notes: document.getElementById('memNotes').value.trim()
    };

    if (formId) {
      // Edit existing
      const idx = data.members.findIndex(m => m.id === formId);
      if (idx !== -1) {
        data.members[idx] = { ...data.members[idx], ...memberData };
        DB.save(data);
        DB.logActivity("Member Updated", `Updated record for ${memberData.name}`, "member", "fa-user-pen");
        this.showToast(`Updated member: ${memberData.name}`, "success");
      }
    } else {
      // Create new
      const newCode = `FP-${1000 + data.members.length + 1}`;
      const newMember = {
        id: "mem-" + Date.now(),
        code: newCode,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + data.members.length}?auto=format&fit=crop&w=250&q=80`,
        ...memberData
      };
      data.members.unshift(newMember);
      DB.save(data);
      DB.logActivity("New Member Registered", `${newMember.name} joined with ${newMember.tier} membership.`, "member", "fa-user-plus");
      this.showToast(`Member ${newMember.name} registered successfully!`, "success");
    }

    this.closeModal('modal-member');
    this.renderAll();
    this.updateCharts();
  },

  renewMember(memberId) {
    const data = DB.load();
    const member = data.members.find(m => m.id === memberId);
    if (!member) return;

    // Extend expiry by 1 year from current or today
    const currentExpiry = new Date(member.expiryDate);
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    baseDate.setFullYear(baseDate.getFullYear() + 1);
    
    member.expiryDate = baseDate.toISOString().split('T')[0];
    member.status = 'Active';

    DB.save(data);
    DB.logActivity("Membership Renewed", `Extended subscription for ${member.name} to ${member.expiryDate}`, "subscription", "fa-rotate");
    this.showToast(`Renewed ${member.name}'s subscription to ${member.expiryDate}`, "success");
    this.renderAll();
    this.updateCharts();
  },

  deleteMember(memberId) {
    const data = DB.load();
    const member = data.members.find(m => m.id === memberId);
    if (!member) return;

    if (confirm(`Are you sure you want to permanently delete member ${member.name} (${member.code})?`)) {
      data.members = data.members.filter(m => m.id !== memberId);
      // Also unenroll from any classes
      data.classes.forEach(c => {
        c.enrolledMembers = c.enrolledMembers.filter(id => id !== memberId);
      });

      DB.save(data);
      DB.logActivity("Member Deleted", `Removed ${member.name} from club database`, "member", "fa-user-xmark");
      this.showToast(`Member removed`, "warning");
      this.renderAll();
      this.updateCharts();
    }
  },

  exportMembersCSV() {
    const data = DB.load();
    let csv = "ID,Code,Name,Email,Phone,Gender,Age,Tier,Status,Start Date,Expiry Date,Emergency Contact\n";
    data.members.forEach(m => {
      csv += `"${m.id}","${m.code}","${m.name}","${m.email}","${m.phone}","${m.gender}","${m.age}","${m.tier}","${m.status}","${m.startDate}","${m.expiryDate}","${m.emergencyContact || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpulse_members_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    this.showToast("Exported members to CSV", "success");
  },

  /* ==========================================================================
     TRAINERS MODULE
     ========================================================================== */
  renderTrainers() {
    const data = DB.load();
    const searchVal = (document.getElementById('trainerFilterSearch')?.value || '').toLowerCase().trim();
    const specVal = document.getElementById('trainerFilterSpec')?.value || 'ALL';

    const list = data.trainers.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchVal) || t.specialization.toLowerCase().includes(searchVal);
      const matchSpec = specVal === 'ALL' || t.specialization.toLowerCase().includes(specVal.toLowerCase());
      return matchSearch && matchSpec;
    });

    const grid = document.getElementById('trainersGridContainer');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No certified trainers found matching search criteria.</p>`;
      return;
    }

    grid.innerHTML = list.map(t => {
      // Calculate active clients count
      const clientCount = data.members.filter(m => m.trainerId === t.id).length;
      const capacityPercent = Math.min(100, Math.round((clientCount / (t.maxClients || 15)) * 100));

      const trnInitials = t.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      return `
        <div class="trainer-card">
          <div class="trainer-card-header">
            <div class="card-profile-initials" style="width: 72px; height: 72px; font-size: 1.35rem; background: linear-gradient(135deg, #06b6d4, #10b981); border: 2px solid var(--accent-primary); border-radius: var(--radius-md);">${trnInitials}</div>
            <div class="trainer-meta">
              <h3>${this.escapeHTML(t.name)}</h3>
              <div class="trainer-spec">${this.escapeHTML(t.specialization)}</div>
              <div class="trainer-rating">
                <i class="fa-solid fa-star"></i>
                <span>${t.rating || '4.9'}</span>
                <span style="color: var(--text-muted); margin-left: 4px;">(${t.experienceYears}y exp)</span>
              </div>
            </div>
          </div>
          <div class="trainer-card-body">
            <p class="trainer-bio">${this.escapeHTML(t.bio || 'Elite strength and conditioning master coach.')}</p>
            <div class="trainer-capacity-bar">
              <div class="capacity-labels">
                <span>Client Roster Load</span>
                <span><strong>${clientCount}</strong> / ${t.maxClients || 15} Athletes (${capacityPercent}%)</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${capacityPercent}%;"></div>
              </div>
            </div>
            <div class="trainer-contact-row">
              <div><i class="fa-solid fa-envelope"></i> ${this.escapeHTML(t.email)}</div>
              <div><i class="fa-solid fa-phone"></i> ${this.escapeHTML(t.phone)}</div>
            </div>
          </div>
          <div class="trainer-card-footer">
            <span style="font-size: 0.8rem; color: var(--text-muted);"><strong style="color: var(--accent-primary);">${data.settings.currency || '₹'}${t.hourlyRate || 1000}</strong> / private session</span>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn btn-sm btn-secondary" onclick="App.openEditTrainerModal('${t.id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="App.deleteTrainer('${t.id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Update class coach select dropdown
    const clsTrainerSelect = document.getElementById('clsTrainerSelect');
    if (clsTrainerSelect) {
      clsTrainerSelect.innerHTML = data.trainers.map(t => `<option value="${t.id}">${t.name} (${t.specialization})</option>`).join('');
    }
  },

  openEditTrainerModal(trainerId) {
    const data = DB.load();
    const trainer = data.trainers.find(t => t.id === trainerId);
    if (!trainer) return;

    document.getElementById('modalTrainerTitle').innerHTML = `<i class="fa-solid fa-user-ninja"></i> Edit Coach: ${this.escapeHTML(trainer.name)}`;
    document.getElementById('trainerFormId').value = trainer.id;
    document.getElementById('trnName').value = trainer.name;
    document.getElementById('trnSpec').value = trainer.specialization;
    document.getElementById('trnEmail').value = trainer.email;
    document.getElementById('trnPhone').value = trainer.phone;
    document.getElementById('trnExp').value = trainer.experienceYears;
    document.getElementById('trnCapacity').value = trainer.maxClients;
    document.getElementById('trnBio').value = trainer.bio;

    this.openModal('modal-trainer');
  },

  saveTrainerForm(event) {
    event.preventDefault();
    const data = DB.load();
    const formId = document.getElementById('trainerFormId').value;

    const trnData = {
      name: document.getElementById('trnName').value.trim(),
      specialization: document.getElementById('trnSpec').value.trim(),
      email: document.getElementById('trnEmail').value.trim(),
      phone: document.getElementById('trnPhone').value.trim(),
      experienceYears: parseInt(document.getElementById('trnExp').value, 10) || 5,
      maxClients: parseInt(document.getElementById('trnCapacity').value, 10) || 15,
      bio: document.getElementById('trnBio').value.trim()
    };

    if (formId) {
      const idx = data.trainers.findIndex(t => t.id === formId);
      if (idx !== -1) {
        data.trainers[idx] = { ...data.trainers[idx], ...trnData };
        DB.save(data);
        DB.logActivity("Trainer Profile Updated", `Updated faculty record for ${trnData.name}`, "trainer", "fa-user-ninja");
        this.showToast(`Updated trainer ${trnData.name}`, "success");
      }
    } else {
      const newTrainer = {
        id: "trn-" + Date.now(),
        code: "TR-" + (200 + data.trainers.length + 1),
        rating: 4.9,
        hourlyRate: 65,
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80",
        ...trnData
      };
      data.trainers.push(newTrainer);
      DB.save(data);
      DB.logActivity("Trainer Hired", `${newTrainer.name} joined as certified coach`, "trainer", "fa-user-ninja");
      this.showToast(`Added trainer ${newTrainer.name}`, "success");
    }

    this.closeModal('modal-trainer');
    this.renderAll();
  },

  deleteTrainer(trainerId) {
    const data = DB.load();
    const trainer = data.trainers.find(t => t.id === trainerId);
    if (!trainer) return;

    if (confirm(`Remove coach ${trainer.name} from faculty? Any assigned members will be unlinked.`)) {
      data.trainers = data.trainers.filter(t => t.id !== trainerId);
      // Unlink members
      data.members.forEach(m => {
        if (m.trainerId === trainerId) m.trainerId = '';
      });
      DB.save(data);
      DB.logActivity("Trainer Removed", `Coach ${trainer.name} removed from faculty`, "trainer", "fa-user-slash");
      this.showToast(`Coach removed`, "warning");
      this.renderAll();
    }
  },

  /* ==========================================================================
     CLASSES & ENROLLMENT MODULE
     ========================================================================== */
  renderClasses() {
    const data = DB.load();
    const searchVal = (document.getElementById('classFilterSearch')?.value || '').toLowerCase().trim();
    const catVal = document.getElementById('classFilterCategory')?.value || 'ALL';

    const list = data.classes.filter(c => {
      const coach = data.trainers.find(t => t.id === c.trainerId);
      const coachName = coach ? coach.name.toLowerCase() : '';
      const matchSearch = c.title.toLowerCase().includes(searchVal) || coachName.includes(searchVal) || c.room.toLowerCase().includes(searchVal);
      const matchCat = catVal === 'ALL' || c.category === catVal;
      return matchSearch && matchCat;
    });

    const grid = document.getElementById('classesGridContainer');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No fitness classes match search or category criteria.</p>`;
      return;
    }

    grid.innerHTML = list.map(c => {
      const coach = data.trainers.find(t => t.id === c.trainerId);
      const coachName = coach ? coach.name : "Senior Staff Instructor";
      const enrolledCount = c.enrolledMembers ? c.enrolledMembers.length : 0;
      const capacityPercent = Math.min(100, Math.round((enrolledCount / c.maxCapacity) * 100));

      return `
        <div class="class-card">
          <div class="class-banner-wrap">
            <img src="${c.banner || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'}" alt="${this.escapeHTML(c.title)}">
            <div class="class-category-badge">${c.category}</div>
            <div class="class-intensity-badge intensity-${c.intensity || 'High'}">${c.intensity || 'High'} Intensity</div>
          </div>
          <div class="class-card-body">
            <h3>${this.escapeHTML(c.title)}</h3>
            <div class="class-instructor">
              <i class="fa-solid fa-chalkboard-user"></i> Coach: <strong>${this.escapeHTML(coachName)}</strong>
            </div>
            <div class="class-info-list">
              <div><i class="fa-regular fa-calendar"></i> ${c.dayOfWeek}</div>
              <div><i class="fa-regular fa-clock"></i> ${c.time} (${c.duration || 60} mins)</div>
              <div><i class="fa-solid fa-location-dot"></i> ${c.room}</div>
            </div>
            <div class="trainer-capacity-bar">
              <div class="capacity-labels">
                <span>Roster Spots</span>
                <span><strong>${enrolledCount}</strong> / ${c.maxCapacity} enrolled</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${capacityPercent}%;"></div>
              </div>
            </div>
          </div>
          <div class="class-card-footer">
            <button class="btn btn-sm btn-primary" onclick="App.openEnrollmentModal('${c.id}')">
              <i class="fa-solid fa-user-plus"></i> Manage Roster
            </button>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn btn-sm btn-secondary" onclick="App.openEditClassModal('${c.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-danger" onclick="App.deleteClass('${c.id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  openEditClassModal(classId) {
    const data = DB.load();
    const c = data.classes.find(item => item.id === classId);
    if (!c) return;

    document.getElementById('modalClassTitle').innerHTML = `<i class="fa-solid fa-calendar-pen"></i> Edit Class: ${this.escapeHTML(c.title)}`;
    document.getElementById('classFormId').value = c.id;
    document.getElementById('clsTitle').value = c.title;
    document.getElementById('clsCategory').value = c.category;
    document.getElementById('clsTrainerSelect').value = c.trainerId;
    document.getElementById('clsDays').value = c.dayOfWeek;
    document.getElementById('clsTime').value = c.time;
    document.getElementById('clsRoom').value = c.room;
    document.getElementById('clsCapacity').value = c.maxCapacity;
    document.getElementById('clsIntensity').value = c.intensity || 'High';
    document.getElementById('clsDesc').value = c.description || '';

    this.openModal('modal-class');
  },

  saveClassForm(event) {
    event.preventDefault();
    const data = DB.load();
    const formId = document.getElementById('classFormId').value;

    const classData = {
      title: document.getElementById('clsTitle').value.trim(),
      category: document.getElementById('clsCategory').value,
      trainerId: document.getElementById('clsTrainerSelect').value,
      dayOfWeek: document.getElementById('clsDays').value.trim(),
      time: document.getElementById('clsTime').value.trim(),
      room: document.getElementById('clsRoom').value.trim(),
      maxCapacity: parseInt(document.getElementById('clsCapacity').value, 10) || 16,
      intensity: document.getElementById('clsIntensity').value,
      description: document.getElementById('clsDesc').value.trim()
    };

    if (formId) {
      const idx = data.classes.findIndex(c => c.id === formId);
      if (idx !== -1) {
        data.classes[idx] = { ...data.classes[idx], ...classData };
        DB.save(data);
        DB.logActivity("Class Updated", `Class schedule updated for ${classData.title}`, "class", "fa-calendar-pen");
        this.showToast(`Updated class ${classData.title}`, "success");
      }
    } else {
      const newClass = {
        id: "cls-" + Date.now(),
        code: "CLS-" + (300 + data.classes.length + 1),
        enrolledMembers: [],
        banner: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
        ...classData
      };
      data.classes.push(newClass);
      DB.save(data);
      DB.logActivity("New Class Scheduled", `Created new group workout: ${newClass.title}`, "class", "fa-calendar-plus");
      this.showToast(`Created class: ${newClass.title}`, "success");
    }

    this.closeModal('modal-class');
    this.renderAll();
  },

  deleteClass(classId) {
    const data = DB.load();
    const c = data.classes.find(item => item.id === classId);
    if (!c) return;

    if (confirm(`Are you sure you want to cancel and remove class ${c.title}?`)) {
      data.classes = data.classes.filter(item => item.id !== classId);
      DB.save(data);
      DB.logActivity("Class Cancelled", `Removed class ${c.title} from schedule`, "class", "fa-calendar-xmark");
      this.showToast(`Class cancelled`, "warning");
      this.renderAll();
    }
  },

  /* Roster Enrollment Manager */
  openEnrollmentModal(classId) {
    this.activeEnrollClassId = classId;
    const data = DB.load();
    const c = data.classes.find(item => item.id === classId);
    if (!c) return;

    document.getElementById('enrollModalClassTitle').textContent = c.title;
    document.getElementById('enrollModalClassSub').textContent = `${c.dayOfWeek} • ${c.time} • ${c.room}`;
    document.getElementById('enrollCountSpan').textContent = `${c.enrolledMembers ? c.enrolledMembers.length : 0} / ${c.maxCapacity}`;

    // Populate members dropdown (only those not yet enrolled)
    const select = document.getElementById('enrollMemberSelect');
    const availableMembers = data.members.filter(m => !c.enrolledMembers.includes(m.id) && m.status !== 'Expired');
    
    if (availableMembers.length === 0) {
      select.innerHTML = `<option value="">No eligible members available</option>`;
    } else {
      select.innerHTML = availableMembers.map(m => `<option value="${m.id}">${m.name} (${m.code} - ${m.tier})</option>`).join('');
    }

    // Render current roster
    const rosterList = document.getElementById('enrolledMembersList');
    if (!c.enrolledMembers || c.enrolledMembers.length === 0) {
      rosterList.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem;">No members enrolled in this session yet.</p>`;
    } else {
      rosterList.innerHTML = c.enrolledMembers.map(mId => {
        const m = data.members.find(item => item.id === mId);
        if (!m) return '';
          const mInitials = m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div class="member-avatar-initials" style="width: 28px; height: 28px; font-size: 0.7rem;">${mInitials}</div>
              <div>
                <strong style="font-size: 0.85rem; color: #fff;">${this.escapeHTML(m.name)}</strong>
                <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 4px;">(${m.code})</span>
              </div>
            </div>
            <button class="btn btn-sm btn-danger" onclick="App.unenrollMember('${c.id}', '${m.id}')" title="Remove member">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `;
      }).join('');
    }

    this.openModal('modal-enroll');
  },

  enrollSelectedMember() {
    const select = document.getElementById('enrollMemberSelect');
    const memberId = select.value;
    if (!memberId) {
      this.showToast("Please choose an eligible member", "warning");
      return;
    }

    const data = DB.load();
    const c = data.classes.find(item => item.id === this.activeEnrollClassId);
    const m = data.members.find(item => item.id === memberId);
    if (!c || !m) return;

    if (c.enrolledMembers.length >= c.maxCapacity) {
      this.showToast("This class has reached full capacity limit!", "danger");
      return;
    }

    c.enrolledMembers.push(memberId);
    DB.save(data);
    DB.logActivity("Class Enrollment", `${m.name} enrolled in ${c.title}`, "class", "fa-user-check");
    this.showToast(`${m.name} successfully enrolled in ${c.title}!`, "success");

    this.openEnrollmentModal(this.activeEnrollClassId);
    this.renderAll();
  },

  unenrollMember(classId, memberId) {
    const data = DB.load();
    const c = data.classes.find(item => item.id === classId);
    const m = data.members.find(item => item.id === memberId);
    if (!c) return;

    c.enrolledMembers = c.enrolledMembers.filter(id => id !== memberId);
    DB.save(data);
    DB.logActivity("Class Withdrawal", `Removed ${m ? m.name : 'member'} from ${c.title}`, "class", "fa-user-minus");
    this.showToast(`Removed from class roster`, "info");

    this.openEnrollmentModal(classId);
    this.renderAll();
  },

  /* ==========================================================================
     EQUIPMENT MODULE
     ========================================================================== */
  renderEquipment() {
    const data = DB.load();
    const searchVal = (document.getElementById('eqFilterSearch')?.value || '').toLowerCase().trim();
    const catVal = document.getElementById('eqFilterCategory')?.value || 'ALL';
    const statusVal = document.getElementById('eqFilterStatus')?.value || 'ALL';

    const list = data.equipment.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(searchVal) ||
                          e.serialNo.toLowerCase().includes(searchVal) ||
                          e.brand.toLowerCase().includes(searchVal);
      const matchCat = catVal === 'ALL' || e.category === catVal;
      const matchStatus = statusVal === 'ALL' || e.status === statusVal;
      return matchSearch && matchCat && matchStatus;
    });

    // Update KPI stats
    const totalCount = data.equipment.length;
    const operCount = data.equipment.filter(e => e.status === 'Operational').length;
    const maintCount = data.equipment.filter(e => e.status === 'Needs Maintenance').length;
    const repairCount = data.equipment.filter(e => e.status === 'Under Repair').length;

    document.getElementById('eq-stat-total').textContent = totalCount;
    document.getElementById('eq-stat-oper').textContent = operCount;
    document.getElementById('eq-stat-maint').textContent = maintCount;
    document.getElementById('eq-stat-repair').textContent = repairCount;

    const tbody = document.getElementById('equipmentTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No gym equipment found matching filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(e => {
      let statusBadge = `<span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> Operational</span>`;
      if (e.status === 'Needs Maintenance') {
        statusBadge = `<span class="badge badge-expiring"><i class="fa-solid fa-triangle-exclamation"></i> Needs Service</span>`;
      } else if (e.status === 'Under Repair') {
        statusBadge = `<span class="badge badge-expired"><i class="fa-solid fa-ban"></i> Under Repair</span>`;
      }

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: #fff;">${this.escapeHTML(e.name)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${e.code} • ${this.escapeHTML(e.notes || 'In regular rotation')}</div>
          </td>
          <td>
            <span class="badge badge-tier-standard">${e.category}</span>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${this.escapeHTML(e.zone || 'Floor Area')}</div>
          </td>
          <td style="font-family: monospace; font-size: 0.8rem;">
            <div>${this.escapeHTML(e.serialNo)}</div>
            <span style="color: var(--text-muted); font-size: 0.72rem;">${this.escapeHTML(e.brand)}</span>
          </td>
          <td>${statusBadge}</td>
          <td style="font-size: 0.8rem; color: var(--text-secondary);">${e.lastServiceDate || 'N/A'}</td>
          <td style="font-size: 0.8rem; color: #fff; font-weight: 600;">${e.nextServiceDate || 'N/A'}</td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn-icon" title="Log Service Completed" onclick="App.serviceEquipmentDone('${e.id}')">
                <i class="fa-solid fa-screwdriver-wrench"></i>
              </button>
              <button class="btn-icon" title="Edit Equipment" onclick="App.openEditEquipmentModal('${e.id}')">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-icon" style="color: #f87171;" title="Delete Equipment" onclick="App.deleteEquipment('${e.id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openEditEquipmentModal(eqId) {
    const data = DB.load();
    const eq = data.equipment.find(e => e.id === eqId);
    if (!eq) return;

    document.getElementById('modalEqTitle').innerHTML = `<i class="fa-solid fa-screwdriver-wrench"></i> Edit Equipment: ${this.escapeHTML(eq.name)}`;
    document.getElementById('eqFormId').value = eq.id;
    document.getElementById('eqName').value = eq.name;
    document.getElementById('eqCategory').value = eq.category;
    document.getElementById('eqZone').value = eq.zone;
    document.getElementById('eqBrand').value = eq.brand;
    document.getElementById('eqSerial').value = eq.serialNo;
    document.getElementById('eqStatus').value = eq.status;
    document.getElementById('eqPurchaseDate').value = eq.purchaseDate || '';
    document.getElementById('eqLastService').value = eq.lastServiceDate || '';
    document.getElementById('eqNextService').value = eq.nextServiceDate || '';
    document.getElementById('eqNotes').value = eq.notes || '';

    this.openModal('modal-equipment');
  },

  saveEquipmentForm(event) {
    event.preventDefault();
    const data = DB.load();
    const formId = document.getElementById('eqFormId').value;

    const eqData = {
      name: document.getElementById('eqName').value.trim(),
      category: document.getElementById('eqCategory').value,
      zone: document.getElementById('eqZone').value.trim(),
      brand: document.getElementById('eqBrand').value.trim(),
      serialNo: document.getElementById('eqSerial').value.trim(),
      status: document.getElementById('eqStatus').value,
      purchaseDate: document.getElementById('eqPurchaseDate').value,
      lastServiceDate: document.getElementById('eqLastService').value,
      nextServiceDate: document.getElementById('eqNextService').value,
      notes: document.getElementById('eqNotes').value.trim()
    };

    if (formId) {
      const idx = data.equipment.findIndex(e => e.id === formId);
      if (idx !== -1) {
        data.equipment[idx] = { ...data.equipment[idx], ...eqData };
        DB.save(data);
        DB.logActivity("Equipment Log Updated", `Updated machine specs for ${eqData.name}`, "equipment", "fa-wrench");
        this.showToast(`Updated equipment: ${eqData.name}`, "success");
      }
    } else {
      const newEq = {
        id: "eq-" + Date.now(),
        code: "EQ-" + (400 + data.equipment.length + 1),
        condition: "Operational",
        ...eqData
      };
      data.equipment.push(newEq);
      DB.save(data);
      DB.logActivity("Equipment Added", `Added new asset: ${newEq.name} (${newEq.category})`, "equipment", "fa-plus");
      this.showToast(`Added ${newEq.name} to equipment inventory`, "success");
    }

    this.closeModal('modal-equipment');
    this.renderAll();
  },

  serviceEquipmentDone(eqId) {
    const data = DB.load();
    const eq = data.equipment.find(e => e.id === eqId);
    if (!eq) return;

    const today = new Date().toISOString().split('T')[0];
    const nextDue = new Date();
    nextDue.setMonth(nextDue.getMonth() + 3);

    eq.status = 'Operational';
    eq.lastServiceDate = today;
    eq.nextServiceDate = nextDue.toISOString().split('T')[0];
    eq.notes = `Serviced & certified operational on ${today}`;

    DB.save(data);
    DB.logActivity("Equipment Serviced", `${eq.name} inspected and restored to Operational`, "equipment", "fa-circle-check");
    this.showToast(`${eq.name} marked Operational & inspection log updated!`, "success");
    this.renderAll();
  },

  deleteEquipment(eqId) {
    const data = DB.load();
    const eq = data.equipment.find(e => e.id === eqId);
    if (!eq) return;

    if (confirm(`Are you sure you want to decommission and remove ${eq.name}?`)) {
      data.equipment = data.equipment.filter(e => e.id !== eqId);
      DB.save(data);
      DB.logActivity("Equipment Decommissioned", `Removed ${eq.name} from gym registry`, "equipment", "fa-trash-can");
      this.showToast(`Equipment removed`, "warning");
      this.renderAll();
    }
  },

  /* ==========================================================================
     MEMBER SELF-SERVICE PORTAL SIMULATOR
     ========================================================================== */
  renderPortal() {
    const data = DB.load();
    const select = document.getElementById('portalMemberSelect');
    if (!select) return;

    // Populate select
    if (select.children.length !== data.members.length) {
      select.innerHTML = data.members.map(m => `
        <option value="${m.id}">${m.name} (${m.code} - ${m.tier})</option>
      `).join('');
    }

    const selectedMemberId = select.value || (data.members[0] ? data.members[0].id : null);
    if (!selectedMemberId) return;

    const member = data.members.find(m => m.id === selectedMemberId);
    if (!member) return;

    // Update Digital Pass Card
    document.getElementById('cardName').textContent = member.name;
    document.getElementById('cardCode').textContent = member.code;
    const cardInitialsEl = document.getElementById('cardAvatarInitials');
    if (cardInitialsEl) {
      cardInitialsEl.textContent = member.name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();
    }
    document.getElementById('cardValidFrom').textContent = member.startDate;
    document.getElementById('cardExpiry').textContent = member.expiryDate;
    document.getElementById('cardTierText').textContent = member.tier;

    const tierBadge = document.getElementById('cardTierBadge');
    tierBadge.textContent = member.tier;
    tierBadge.className = `badge badge-tier-${member.tier === 'VIP Black' ? 'vip' : member.tier.toLowerCase()}`;

    const statusBadge = document.getElementById('cardStatusBadge');
    statusBadge.textContent = member.status + " Member";
    statusBadge.className = `badge badge-${member.status === 'Active' ? 'active' : member.status === 'Expired' ? 'expired' : 'expiring'}`;

    // Assigned Coach details
    const coachContainer = document.getElementById('portalTrainerInfo');
    const coach = data.trainers.find(t => t.id === member.trainerId);
    document.getElementById('cardCoach').textContent = coach ? coach.name : "Not Assigned";

    if (coach) {
      const coachInitials = coach.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      coachContainer.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="card-profile-initials" style="width: 58px; height: 58px; font-size: 1.25rem; background: linear-gradient(135deg, #06b6d4, #10b981); border: 2px solid var(--accent-primary); border-radius: var(--radius-md);">${coachInitials}</div>
          <div style="flex: 1;">
            <h4 style="color: #fff; font-size: 1rem;">${this.escapeHTML(coach.name)}</h4>
            <div style="color: var(--accent-primary); font-size: 0.8rem; font-weight: 600;">${this.escapeHTML(coach.specialization)}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${this.escapeHTML(coach.bio)}</div>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="App.showToast('Direct messaging with ${coach.name} launched (Demo)', 'info')">
            <i class="fa-solid fa-comment-dots"></i> Message Coach
          </button>
        </div>
      `;
    } else {
      coachContainer.innerHTML = `
        <div style="padding: 1rem; background: var(--bg-surface); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">No dedicated coach assigned to this membership yet.</span>
          <button class="btn btn-sm btn-primary" onclick="App.openEditMemberModal('${member.id}')">Select Coach</button>
        </div>
      `;
    }

    // Enrolled Classes
    const classesContainer = document.getElementById('portalEnrolledClasses');
    const enrolledClasses = data.classes.filter(c => c.enrolledMembers && c.enrolledMembers.includes(member.id));

    if (enrolledClasses.length === 0) {
      classesContainer.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          You are not currently enrolled in any upcoming group fitness classes.
        </div>
      `;
    } else {
      classesContainer.innerHTML = enrolledClasses.map(c => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); margin-bottom: 0.5rem; border: 1px solid var(--border-subtle);">
          <div>
            <strong style="color: #fff; font-size: 0.9rem;">${this.escapeHTML(c.title)}</strong>
            <div style="font-size: 0.75rem; color: var(--accent-secondary);">${c.dayOfWeek} • ${c.time} (${c.room})</div>
          </div>
          <button class="btn btn-sm btn-danger" onclick="App.unenrollMember('${c.id}', '${member.id}')">
            Cancel Booking
          </button>
        </div>
      `).join('');
    }
  },

  printMemberPass() {
    window.print();
  },

  /* ==========================================================================
     SETTINGS & BACKUP MODULE
     ========================================================================== */
  renderSettings() {
    const data = DB.load();
    const s = data.settings;
    document.getElementById('setGymName').value = s.gymName || '';
    document.getElementById('setAddress').value = s.address || '';
    document.getElementById('setPhone').value = s.phone || '';
    document.getElementById('setEmail').value = s.email || '';
    document.getElementById('setCurrency').value = s.currency || '$';
    document.getElementById('setHours').value = s.operatingHours || '';
  },

  saveSettings(event) {
    event.preventDefault();
    const data = DB.load();
    data.settings = {
      gymName: document.getElementById('setGymName').value.trim(),
      address: document.getElementById('setAddress').value.trim(),
      phone: document.getElementById('setPhone').value.trim(),
      email: document.getElementById('setEmail').value.trim(),
      currency: document.getElementById('setCurrency').value.trim(),
      operatingHours: document.getElementById('setHours').value.trim()
    };
    DB.save(data);
    DB.logActivity("Club Profile Saved", `Updated club operational settings`, "system", "fa-gear");
    this.showToast("Club settings successfully saved!", "success");
    this.renderAll();
  },

  exportDatabaseJSON() {
    const jsonStr = DB.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpulse_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    this.showToast("Database backup downloaded", "success");
  },

  importDatabaseJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const success = DB.importJSON(content);
      if (success) {
        this.showToast("Database restored successfully!", "success");
        this.renderAll();
        this.updateCharts();
      } else {
        this.showToast("Invalid JSON backup structure!", "danger");
      }
    };
    reader.readAsText(file);
  },

  resetToDefault() {
    if (confirm("Reset the database back to initial factory demo seed records? Any custom data will be replaced.")) {
      DB.reset();
      this.showToast("Reset database to factory defaults", "info");
      this.renderAll();
      this.updateCharts();
    }
  },

  clearActivities() {
    const data = DB.load();
    data.activities = [];
    DB.save(data);
    this.renderDashboard();
    this.showToast("Activity feed cleared", "info");
  },

  /* ==========================================================================
     GLOBAL SEARCH & UI HELPERS
     ========================================================================== */
  setupGlobalSearch() {
    const input = document.getElementById('globalSearchInput');
    if (!input) return;

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim().toLowerCase();
        if (!query) return;

        // Auto-route to members or classes or equipment
        const data = DB.load();
        const foundMember = data.members.some(m => m.name.toLowerCase().includes(query));
        const foundTrainer = data.trainers.some(t => t.name.toLowerCase().includes(query));
        const foundClass = data.classes.some(c => c.title.toLowerCase().includes(query));

        if (foundMember) {
          this.showView('members');
          const filter = document.getElementById('memberFilterSearch');
          if (filter) { filter.value = query; this.renderMembers(); }
        } else if (foundTrainer) {
          this.showView('trainers');
          const filter = document.getElementById('trainerFilterSearch');
          if (filter) { filter.value = query; this.renderTrainers(); }
        } else if (foundClass) {
          this.showView('classes');
          const filter = document.getElementById('classFilterSearch');
          if (filter) { filter.value = query; this.renderClasses(); }
        } else {
          this.showView('members');
          const filter = document.getElementById('memberFilterSearch');
          if (filter) { filter.value = query; this.renderMembers(); }
        }
      }
    });
  },

  setupModals() {
    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });

    // Outside click closes modal
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  },

  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      // If member modal, reset form if adding new
      if (modalId === 'modal-member' && !document.getElementById('memberFormId').value) {
        document.getElementById('modalMemberTitle').innerHTML = `<i class="fa-solid fa-user-plus"></i> Member Registration`;
        document.getElementById('memberForm').reset();
        document.getElementById('memStart').value = new Date().toISOString().split('T')[0];
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        document.getElementById('memExpiry').value = expiry.toISOString().split('T')[0];
      }
      m.classList.add('active');
    }
  },

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      m.classList.remove('active');
      // Clear form IDs
      if (modalId === 'modal-member') document.getElementById('memberFormId').value = '';
      if (modalId === 'modal-trainer') document.getElementById('trainerFormId').value = '';
      if (modalId === 'modal-class') document.getElementById('classFormId').value = '';
      if (modalId === 'modal-equipment') document.getElementById('eqFormId').value = '';
    }
  },

  showToast(message, type = "info") {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    if (type === "warning") icon = "fa-triangle-exclamation";
    if (type === "danger") icon = "fa-circle-xmark";

    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="font-size: 1.1rem;"></i>
      <span>${this.escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  showActivitiesToast() {
    const data = DB.load();
    const count = data.activities.length;
    this.showToast(`${count} recent operational activities logged`, "info");
  },

  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
