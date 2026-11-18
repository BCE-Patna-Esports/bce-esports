/**
 * BCE ESPORTS — Admin API Helper
 * Every admin page includes this. Handles token, guard, GET, POST.
 */
const ADMIN_API = (() => {
  const API_URL = "https://script.google.com/macros/s/AKfycbzxwfxg6cmOlj-WaRngV-SeAOVNLSI6btwZ9MbYQ3hM7JoD0Lf9FMGzige2S5bZBpx-/exec";
  const TOKEN_KEY = 'bce_admin_token';
  const ADMIN_KEY = 'bce_admin_info';

  const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
  const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
  const clearToken = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(ADMIN_KEY); };
  const getAdmin = () => { try { return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null'); } catch { return null; } };
  const setAdmin = (a) => localStorage.setItem(ADMIN_KEY, JSON.stringify(a));

  async function get(action, params = {}) {
    const qs = new URLSearchParams({ action, token: getToken(), ...params }).toString();
    const r = await fetch(`${API_URL}?${qs}`, { redirect: 'follow' });
    const text = await r.text();
    try { return JSON.parse(text); }
    catch { return { success: false, message: 'Invalid response from server' }; }
  }

  async function post(action, data = {}) {
    const body = JSON.stringify({ action, token: getToken(), ...data });
    const r = await fetch(API_URL, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' }, redirect: 'follow' });
    const text = await r.text();
    try { return JSON.parse(text); }
    catch { return { success: false, message: 'Invalid response from server' }; }
  }

  async function login(email, password) {
    const body = JSON.stringify({ action: 'admin.login', email, password });
    const r = await fetch(API_URL, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' }, redirect: 'follow' });
    const text = await r.text();
    try { return JSON.parse(text); }
    catch { return { success: false, message: 'Invalid response from server' }; }
  }

  async function guard() {
    if (!getToken()) { window.location.href = 'login.html'; return false; }
    try {
      const r = await get('admin.getSession');
      if (!r.success) { clearToken(); window.location.href = 'login.html'; return false; }
      setAdmin(r.data.admin);
      return true;
    } catch (e) {
      clearToken(); window.location.href = 'login.html'; return false;
    }
  }

  return { API_URL, getToken, setToken, clearToken, getAdmin, setAdmin, get, post, login, guard };
})();
