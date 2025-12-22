'use strict';
'require ui';
'require view';

return view.extend({
    render: function () {
        var form = document.querySelector('form');
        var btn = document.querySelector('input[type="submit"], button[type="submit"]') || document.querySelector('button');

        // === 1. Error Handling (Universal) ===
        if (window.location.search.indexOf('simple2fa_err=1') !== -1) {
            var errDiv = document.createElement('div');
            // Try different error classes for compatibility
            errDiv.className = 'alert-message error cbi-section-error alert alert-danger';
            errDiv.innerText = _('Authentication Failed: Invalid 2FA Code');
            errDiv.style.marginBottom = '10px';
            errDiv.style.textAlign = 'center';

            // Insert at the very top of the form or container
            if (form) {
                form.insertBefore(errDiv, form.firstChild);
            }

            // Cleanup URL
            if (history.replaceState) {
                var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                history.replaceState({ path: newUrl }, '', newUrl);
            }
        }

        // === 2. Create the 2FA Token Field ===
        var tokenDiv = document.createElement('div');
        // 'cbi-value' is standard LuCI, but we add inline styles for safety
        tokenDiv.className = 'cbi-value field';
        tokenDiv.style.marginTop = '10px';

        tokenDiv.innerHTML = [
            '<label class="cbi-value-title" style="float:left; width:30%; padding-right:10px;">' + _('2FA Code') + '</label>',
            '<div class="cbi-value-field" style="float:left; width:70%;">',
            '  <input class="cbi-input-text" type="text" id="token_visible" placeholder="' + _('Leave empty if disabled') + '" autocomplete="off" style="width:100%;" />',
            '</div>',
            '<div style="clear:both;"></div>'
        ].join('');

        // === 3. Smart Insertion (Theme Compatibility) ===
        var passInput = document.querySelector('input[type="password"]');
        if (passInput) {
            // Strategy: Find the container of the password field
            var container = passInput.parentElement;

            // Check if we are in a 'cbi-value-field' (Standard LuCI)
            if (container.classList.contains('cbi-value-field')) {
                // If so, we want to insert AFTER the parent 'cbi-value' div
                var row = container.parentElement;
                if (row) {
                    row.parentNode.insertBefore(tokenDiv, row.nextSibling);
                }
            } else {
                // Argon/Material often wrapping inputs differently
                // Just insert after the password input's direct container
                container.parentNode.insertBefore(tokenDiv, container.nextSibling);
            }

            // Adjust styles if it looks like a block layout (Argon)
            if (window.getComputedStyle(passInput).display === 'block' || passInput.clientWidth > 200) {
                tokenDiv.className = ''; // Remove cbi-value to avoid float issues
                tokenDiv.innerHTML = [
                    '<div style="margin-top:10px;">',
                    '  <input class="cbi-input-text input" type="text" id="token_visible" placeholder="' + _('2FA Code (Leave empty if disabled)') + '" autocomplete="off" style="width:100%;" />',
                    '</div>'
                ].join('');
            }
        } else {
            // Fallback: Append to form
            if (form) form.appendChild(tokenDiv);
        }

        // === 4. Submit Handler (Inject Hidden Field) ===
        if (btn && form) {
            // Function to handle the injection
            var injectAndSubmit = function (e) {
                var visibleInput = document.getElementById('token_visible');
                var val = visibleInput ? visibleInput.value.trim() : '';

                // Create hidden input for the actual POST
                var hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'token'; // Must match Lua CGI
                hiddenInput.value = val;
                form.appendChild(hiddenInput);

                // Show loading state
                if (window.ui && ui.showModal) {
                    // Use LuCI's native modal only if sure, otherwise just change button text
                    // ui.showModal(_('Logging in...'), [E('p', {class: 'spinning'}, _('Verifying...'))]);
                }
                var btnTxt = btn.value || btn.innerText;
                if (btn.tagName === 'INPUT') btn.value = _('Verifying...');
                else btn.innerText = _('Verifying...');
            };

            // Listen for click
            btn.addEventListener('click', injectAndSubmit);

            // Listen for Enter key on inputs
            form.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    injectAndSubmit();
                    // Let the form submit naturally, just ensure the listener ran first
                }
            });
        }

        // Auto-focus password if present
        if (passInput) passInput.focus();

        return '';
    },

    addFooter: function () { }
});
