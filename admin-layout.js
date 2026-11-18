/**
 * BCE ESPORTS — Admin Layout
 * Injects sidebar + topbar. Every page calls ADMIN_LAYOUT.init().
 */
const ADMIN_LAYOUT = (() => {
  const MENU = [
    { group: 'Overview', items: [
      { label: 'Dashboard', href: 'index.html', icon: '◉' }
    ]},
    { group: 'Tournaments', items: [
      { label: 'All Tournaments', href: 'tournaments.html', icon: '🏆' },
      { label: 'Create Tournament', href: 'tournament-form.html', icon: '＋' }
    ]},
    { group: 'Games', items: [
      { label: 'Games', href: 'games.html', icon: '🎮' }
    ]},
    { group: 'Registrations', items: [
      { label: 'Registrations', href: 'registrations.html', icon: '📝' },
      { label: 'Payments', href: 'payments.html', icon: '💳' }
    ]},
    { group: 'Teams & Players', items: [
      { label: 'Teams', href: 'teams.html', icon: '👥' },
      { label: 'Players', href: 'players.html', icon: '🎯' }
    ]},
    { group: 'Matches & Results', items: [
      { label: 'Matches', href: 'matches.html', icon: '📅' },
      { label: 'Results', href: 'results.html', icon: '📊' },
      { label: 'Standings', href: 'standings.html', icon: '🏅' }
    ]},
    { group: 'Content', items: [
      { label: 'Announcements', href: 'announcements.html', icon: '📢' },
      { label: 'Gallery', href: 'gallery.html', icon: '🖼️' },
      { label: 'Contacts', href: 'contacts.html', icon: '✉️' }
    ]},
    { group: 'System', items: [
      { label: 'Admins', href: 'admins.html', icon: '🔐', roles: ['Super Admin'] },
      { label: 'Audit Logs', href: 'audit-logs.html', icon: '📋', roles: ['Super Admin','Admin'] },
      { label: 'Settings', href: 'settings.html', icon: '⚙️', roles: ['Super Admin'] },
      { label: 'My Profile', href: 'profile.html', icon: '👤' }
    ]}
  ];

  function currentPage() {
    const p = window.location.pathname.split('/').pop();
    return p || 'index.html';
  }

  function buildSidebar(admin) {
    const active = currentPage();
    return MENU.map(group => {
      const items = group.items
        .filter(i => !i.roles || i.roles.includes(admin.Role))
        .map(i => {
          const cls = (i.href === active) ? 'active' : '';
          return `<a href="${i.href}" class="nav-item ${cls}">
            <span class="nav-icon">${i.icon}</span>
            <span class="nav-label">${i.label}</span>
          </a>`;
        }).join('');
      if (!items) return '';
      return `<div class="nav-group">
        <div class="nav-group-title">${group.group}</div>
        ${items}
      </div>`;
    }).join('');
  }

  function buildSidebarHtml(admin) {
    return `
      <div class="sidebar-header">
        <a href="index.html" class="sidebar-logo">
          <div class="logo-mark">B</div>
          <div class="logo-text">
            <span class="logo-main">BCE</span>
            <span class="logo-sub">ADMIN</span>
          </div>
        </a>
      </div>
      <nav class="sidebar-nav">${buildSidebar(admin)}</nav>
      <div class="sidebar-footer">
        <a href="../index.html" target="_blank" rel="noopener" class="nav-item">
          <span class="nav-icon">🌐</span>
          <span class="nav-label">Public Site ↗</span>
        </a>
      </div>
    `;
  }

  function buildTopbarHtml(admin, breadcrumb) {
    const initial = (admin.DisplayName || admin.Email || 'A').charAt(0).toUpperCase();
    return `
      <button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>
      <div class="breadcrumb">${breadcrumb || 'Dashboard'}</div>
      <div class="topbar-right">
        <div class="user-menu">
          <button class="user-btn" id="userBtn">
            <span class="user-avatar">${initial}</span>
            <span class="user-name">${admin.DisplayName || admin.Email}</span>
            <span class="user-role">${admin.Role}</span>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <a href="profile.html">My Profile</a>
            <button id="logoutBtn">Logout</button>
          </div>
        </div>
      </div>
    `;
  }

  async function init(breadcrumb) {
    const ok = await ADMIN_API.guard();
    if (!ok) return null;
    const admin = ADMIN_API.getAdmin();

    const shell = document.getElementById('adminShell');
    const sidebar = document.getElementById('adminSidebar');
    const topbar = document.getElementById('adminTopbar');

    if (sidebar) sidebar.innerHTML = buildSidebarHtml(admin);
    if (topbar) topbar.innerHTML = buildTopbarHtml(admin, breadcrumb);

    document.getElementById('menuToggle')?.addEventListener('click', () => {
      document.getElementById('adminSidebar')?.classList.toggle('open');
    });
    document.getElementById('userBtn')?.addEventListener('click', () => {
      document.getElementById('userDropdown')?.classList.toggle('open');
    });
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await ADMIN_API.post('admin.logout');
      ADMIN_API.clearToken();
      window.location.href = 'login.html';
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      const menu = document.querySelector('.user-menu');
      if (menu && !menu.contains(e.target)) {
        document.getElementById('userDropdown')?.classList.remove('open');
      }
    });

    // Close sidebar on nav click (mobile)
    document.querySelectorAll('.nav-item').forEach(a => {
      a.addEventListener('click', () => {
        document.getElementById('adminSidebar')?.classList.remove('open');
      });
    });

    return admin;
  }

  return { init };
})();