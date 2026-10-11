/* Velaris owner dashboard sign-in. */
(function(){
  var form = document.getElementById('loginForm'), msg = document.getElementById('msg');
  function show(text, kind){ msg.textContent = text; msg.className = 'msg show ' + (kind || 'err'); }
  fetch('/api/admin/session', {credentials: 'same-origin'}).then(function(r){ return r.json(); }).then(function(s){
    if(s.authed){ location.replace('/dashboard'); return; }
    if(!s.setup.password) show('Admin password is not set up yet. Add ADMIN_PASSWORD (8+ characters) in Vercel, then redeploy.', 'info');
  }).catch(function(){});
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = form.querySelector('button'); btn.disabled = true; msg.className = 'msg';
    fetch('/api/admin/login', {method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password: form.password.value})})
      .then(function(r){ return r.json().then(function(b){ return {ok: r.ok, b: b}; }); })
      .then(function(res){ if(res.ok) location.replace('/dashboard'); else { show(res.b.error || 'Sign in failed.'); btn.disabled = false; form.password.select(); } })
      .catch(function(){ show('Network error. Try again.'); btn.disabled = false; });
  });
})();
