(function () {
    var STORAGE_KEY = 'mundialHubNavRailCollapsed';
    var mqDesk = window.matchMedia('(min-width: 1024px)');
    var body = document.body;
    var toggle = document.getElementById('hubNavToggle');
    var sidebar = document.getElementById('hub-sidebar');
    var backdrop = document.getElementById('hubNavBackdrop');
    var railBtn = document.getElementById('hubRailToggle');

    if (!toggle || !sidebar || !backdrop) return;

    function setMobileOpen(open) {
        var isDesktop = mqDesk.matches;
        if (isDesktop) {
            sidebar.classList.remove('is-open');
            backdrop.classList.remove('is-visible');
            backdrop.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('hub-nav-open');
            return;
        }
        sidebar.classList.toggle('is-open', open);
        backdrop.hidden = !open;
        backdrop.classList.toggle('is-visible', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        body.classList.toggle('hub-nav-open', open);
    }

    function applyRailCollapsed(collapsed) {
        if (!mqDesk.matches) {
            body.classList.remove('hub-rail-collapsed');
            return;
        }
        body.classList.toggle('hub-rail-collapsed', collapsed);
        if (railBtn) {
            railBtn.setAttribute(
                'aria-label',
                collapsed
                    ? 'Expandir barra lateral'
                    : 'Ocultar barra lateral (se guarda en este dispositivo)'
            );
        }
    }

    function readRailPreference() {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function persistRailCollapsed(collapsed) {
        try {
            localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
        } catch (e) {}
    }

    function syncRailFromStorage() {
        applyRailCollapsed(readRailPreference());
    }

    toggle.addEventListener('click', function () {
        setMobileOpen(!sidebar.classList.contains('is-open'));
    });

    backdrop.addEventListener('click', function () {
        setMobileOpen(false);
    });

    sidebar.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function () {
            if (!mqDesk.matches) setMobileOpen(false);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) setMobileOpen(false);
    });

    mqDesk.addEventListener('change', function () {
        setMobileOpen(false);
        syncRailFromStorage();
    });

    if (railBtn) {
        railBtn.addEventListener('click', function () {
            if (!mqDesk.matches) return;
            var next = !body.classList.contains('hub-rail-collapsed');
            applyRailCollapsed(next);
            persistRailCollapsed(next);
        });
    }

    syncRailFromStorage();
})();
