/* Cookie consent + Google Analytics loader.
   GA4 is only loaded after the visitor accepts; nothing is sent before that. */
(function () {
    var GA_ID = 'G-ZWM8XC4WEE';
    var KEY = 'medlar_analytics_consent';

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    function read() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function write(v) {
        try { localStorage.setItem(KEY, v); } catch (e) { }
    }

    function loadAnalytics() {
        if (window.__gaLoaded) return;
        window.__gaLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function disableAnalytics() {
        window['ga-disable-' + GA_ID] = true;
        // Remove GA cookies set earlier
        var host = location.hostname.replace(/^www\./, '');
        document.cookie.split(';').forEach(function (c) {
            var name = c.split('=')[0].trim();
            if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
                [location.hostname, '.' + host].forEach(function (d) {
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
                });
            }
        });
    }

    function injectStyles() {
        var css = '#cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;' +
            'background:#16243F;color:#F4F1E9;border:1px solid #AE8838;border-top:4px solid #AE8838;border-radius:2px;' +
            'box-shadow:0 8px 32px rgba(0,0,0,.35);padding:18px 20px;z-index:99999;font:15px/1.6 "Hanken Grotesk",sans-serif}' +
            '#cookie-banner p{margin:0 0 14px}' +
            '#cookie-banner .cb-actions{display:flex;gap:12px;flex-wrap:wrap}' +
            '#cookie-banner button{cursor:pointer;font:600 15px "Hanken Grotesk",sans-serif;padding:10px 24px;border-radius:2px;' +
            'border:1px solid #F4F1E9;background:transparent;color:#F4F1E9;transition:all .3s ease}' +
            '#cookie-banner button.cb-accept{background:#AE8838;border-color:#AE8838;color:#16243F}' +
            '#cookie-banner button:hover{background:#F4F1E9;border-color:#F4F1E9;color:#16243F}' +
            '#cookie-banner button:focus-visible{outline:3px solid #F4F1E9;outline-offset:2px}';
        var st = document.createElement('style');
        st.textContent = css;
        document.head.appendChild(st);
    }

    function showBanner() {
        if (document.getElementById('cookie-banner')) return;
        injectStyles();
        var b = document.createElement('div');
        b.id = 'cookie-banner';
        b.setAttribute('role', 'dialog');
        b.setAttribute('aria-label', 'Cookie consent');
        b.innerHTML =
            '<p>We use Google Analytics cookies to understand how visitors use our site. ' +
            'They are only set if you accept. You can change your choice at any time using ' +
            '&ldquo;Cookie preferences&rdquo; in the footer.</p>' +
            '<div class="cb-actions">' +
            '<button type="button" class="cb-accept">Accept</button>' +
            '<button type="button" class="cb-decline">Decline</button></div>';
        document.body.appendChild(b);
        b.querySelector('.cb-accept').addEventListener('click', function () {
            write('granted'); window['ga-disable-' + GA_ID] = false; loadAnalytics(); b.remove();
        });
        b.querySelector('.cb-decline').addEventListener('click', function () {
            write('denied'); disableAnalytics(); b.remove();
        });
        b.querySelector('.cb-accept').focus();
    }

    // Lets visitors change their choice later (linked from the footer)
    window.medlarCookieSettings = function () {
        write('');
        showBanner();
    };

    var saved = read();
    if (saved === 'granted') {
        loadAnalytics();
    } else if (saved === 'denied') {
        disableAnalytics();
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showBanner);
        } else {
            showBanner();
        }
    }
})();
