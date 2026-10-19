/* =========================================================
   বিষয় সম্পত্তি খোঁজ — User App (app.js)
   ========================================================= */
(function () {
  'use strict';
  var S = Store;
  var ST = { lang: localStorage.getItem('vsk_lang') || 'bn', theme: localStorage.getItem('vsk_theme') || 'light', redirect: null, photos: [], newPhoto: null, route: 'home', payEnd: {}, timer: null, after: null };
  var VERSION = '1.0.0';

  /* ---------- helpers ---------- */
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(k, p) {
    var s = (I18N[ST.lang] && I18N[ST.lang][k]) || I18N.en[k] || k;
    if (p) for (var x in p) s = s.replace('{' + x + '}', p[x]);
    return s;
  }
  var ICON = {
    home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2m-4 4l3 3m-6-1l2 2"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>'
  };
  function ic(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + (ICON[n] || '') + '</svg>'; }
  function bg(u) { return "background-image:url('" + String(u).replace(/'/g, '%27') + "')"; }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function last10(s) { return digits(s).slice(-10); }
  function fd(ts) { try { return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return ''; } }
  function ago(ts) { var d = Math.floor((Date.now() - ts) / 864e5); return d <= 0 ? t('today') : t('daysAgo', { n: d }); }
  function appName() { var s = S.settings(); return ST.lang === 'bn' ? s.appName : s.appNameEn; }
  function money(p) { return S.money(p.price) + (p.unit === 'month' ? '<small>' + esc(t('perMonth')) + '</small>' : ''); }
  function loc(p) { return [p.district, p.block, p.mouza].filter(Boolean).join(', '); }

  var toastT;
  function toast(msg, err) {
    var el = $('#toast'); el.textContent = msg; el.className = (err ? 'err ' : '') + 'show';
    clearTimeout(toastT); toastT = setTimeout(function () { el.className = ''; }, 2800);
  }
  S.onError = function () { toast(t('storageFull'), true); };
  function openModal(html) { var m = $('#modal'); m.innerHTML = '<div class="msheet"><div class="grab"></div>' + html + '</div>'; m.className = 'open'; }
  function closeModal() { var m = $('#modal'); m.className = ''; m.innerHTML = ''; }

  /* ---------- session ---------- */
  function sid() { return localStorage.getItem('vsk_sess') || sessionStorage.getItem('vsk_sess'); }
  function clearSess() { localStorage.removeItem('vsk_sess'); sessionStorage.removeItem('vsk_sess'); }
  function user() {
    var id = sid(); if (!id) return null;
    var u = S.users.find(id);
    if (!u || u.status === 'blocked') { clearSess(); return null; }
    return u;
  }
  function setSess(id, remember) { clearSess(); (remember ? localStorage : sessionStorage).setItem('vsk_sess', id); }
  function planOf(u) { return u ? S.planOf(u) : S.freePlan(); }

  /* ---------- navigation ---------- */
  function go(h) { if (location.hash === h) render(); else location.hash = h; }
  function qh(base, q, over) {
    var o = {}; q.forEach(function (v, k) { o[k] = v; });
    for (var k in over) { if (over[k] === '' || over[k] == null) delete o[k]; else o[k] = over[k]; }
    var s = Object.keys(o).map(function (k) { return k + '=' + encodeURIComponent(o[k]); }).join('&');
    return base + (s ? '?' + s : '');
  }
  function needLogin(back) { ST.redirect = back || location.hash; toast(t('needLogin'), true); go('#/auth'); }
  function upgradeModal(msgKey) {
    openModal('<div class="crown-big">' + ic('award') + '</div><h3>' + esc(t('upgradeTitle')) + '</h3><p>' + esc(t(typeof msgKey === 'string' ? msgKey : 'upgradeMsg')) + '</p>' +
      '<button class="btn gold" data-act="plans">' + esc(t('viewPlans')) + '</button><button class="btn line" data-act="close">' + esc(t('cancel')) + '</button>');
  }

  /* ---------- card builders ---------- */
  function card(p, u) {
    var fav = u && (u.favs || []).indexOf(p.id) >= 0, img = S.postImages(p)[0];
    return '<article class="pcard" data-act="open" data-id="' + p.id + '"><div class="pimg" style="' + bg(img) + '">' +
      '<span class="tag ' + (p.type === 'rent' ? 'rent' : '') + '">' + esc(p.type === 'rent' ? t('rent') : t('sale')) + '</span>' +
      (p.featured ? '<span class="tag feat">★</span>' : '') +
      '<button class="fav ' + (fav ? 'on' : '') + '" data-act="fav" data-id="' + p.id + '" aria-label="favourite">' + ic('heart') + '</button></div>' +
      '<div class="pbody"><div class="price">' + money(p) + '</div><div class="ptitle">' + esc(p.title) + '</div>' +
      '<div class="pmeta">' + esc(p.area) + ' · ' + esc(t('c_' + p.cat)) + '</div>' +
      '<div class="pmeta">' + ic('pin') + '<span>' + esc(loc(p)) + '</span></div>' +
      '<div class="pfoot"><span style="display:flex;gap:6px;align-items:center">' + ic('clock').replace('class="i"', 'class="i" style="width:14px;height:14px"') + esc(ago(p.createdAt)) + '</span>' +
      (p.verified ? '<span class="vbadge">' + ic('check') + esc(t('verified')) + '</span>' : '') + '</div></div></article>';
  }
  function mrow(p, extra) {
    return '<div class="mrow" data-act="open" data-id="' + p.id + '"><div class="th" style="' + bg(S.postImages(p)[0]) + '"></div>' +
      '<div class="tx"><b class="ellip">' + esc(p.title) + '</b><div class="price">' + money(p) + '</div><div class="pmeta ellip">' + esc(loc(p)) + '</div></div>' + (extra || '') + '</div>';
  }
  function sub(title, right) {
    return '<header class="subhead"><button class="ic-btn" data-act="back" aria-label="back">' + ic('back') + '</button><h1>' + esc(title) + '</h1>' + (right || '') + '</header>';
  }
  function empty(msg) { return '<div class="empty">' + S.logo(70) + '<p>' + esc(msg) + '</p></div>'; }
  function opts(arr, ph, sel) {
    return '<option value="">' + esc(ph) + '</option>' + arr.map(function (x) { return '<option' + (x === sel ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('');
  }
  function feats(p) {
    var a = [];
    a.push([p.postLimit !== 0, p.postLimit < 0 ? t('f_postsU') : t('f_posts', { n: p.postLimit })]);
    a.push([true, p.viewLimit === 0 ? t('f_partial') : (p.viewLimit < 0 ? t('f_viewsU') : t('f_views', { n: p.viewLimit }))]);
    a.push(p.callLimit === 0 ? [false, t('f_nocall')] : [true, p.callLimit < 0 ? t('f_callsU') : t('f_calls', { n: p.callLimit })]);
    if (p.advSearch) a.push([true, t('f_adv')]);
    if (p.extra) a.push([true, p.extra]);
    return a;
  }
  function leftTxt(n) { return n < 0 ? t('unlimited') : n; }

  /* ---------- pages ---------- */
  var routes = {};

  routes.home = function (parts, q, u) {
    var s = S.settings(), pl = u ? S.planOf(u) : null;
    var langs = ['bn', 'en', 'hi'].map(function (l) { return '<button class="' + (ST.lang === l ? 'on' : '') + '" data-act="lang" data-l="' + l + '">' + { bn: 'বাং', en: 'EN', hi: 'हिं' }[l] + '</button>'; }).join('');
    var right = u ? '<button class="signbtn" data-act="nav" data-href="#/menu"><span class="avatar">' + (u.photo ? '<img alt="" src="' + esc(u.photo) + '">' : esc((u.name || '?').charAt(0).toUpperCase())) + '</span>' + esc((u.name || '').split(' ')[0]) + '</button>'
      : '<button class="signbtn" data-act="nav" data-href="#/auth">' + ic('user') + esc(t('signIn')) + '</button>';
    function tile(k, cls, icon, href) {
      var subT = ST.lang === 'bn' ? I18N.en[k] : I18N.bn[k];
      return '<button class="tile ' + cls + '" data-act="nav" data-href="' + href + '"><span class="ic">' + ic(icon) + '</span><b>' + esc(t(k)) + '</b><small>' + esc(subT) + '</small></button>';
    }
    var latest = S.posts.where(function (p) { return p.status === 'live'; }).sort(function (a, b) { return b.createdAt - a.createdAt; }).slice(0, 3);
    return '<div class="home-top"><div class="bgimg" style="' + bg(S.art('agri', 3)) + '"></div>' +
      '<div class="toprow"><div class="langseg" role="group" aria-label="language">' + langs + '</div>' + right + '</div>' +
      '<div class="brand">' + S.logo(58) + '<div><h1>' + esc(appName()) + '</h1><p>' + esc(t('appTag')) + '</p></div></div>' +
      '<div class="badge-row"><button class="chip-member" data-act="nav" data-href="#/plans">' + ic('award') + esc(pl && pl.id !== 'free' ? pl.name : t('navMember')) + '</button>' +
      '<button class="chip-add" data-act="nav" data-href="#/add">' + ic('plus') + esc(t('navAdd')) + '</button></div></div>' +
      '<div class="searchcard"><form class="sbox" data-form="homesearch">' + ic('search') + '<input name="q" placeholder="' + esc(t('searchPh')) + '" autocomplete="off"><button class="go" aria-label="search">' + ic('search') + '</button></form>' +
      '<div class="duo"><button class="btn-soft" data-act="adv">' + ic('sliders') + esc(t('advSearch')) + '</button><button class="btn-soft" data-act="filter">' + ic('grid') + esc(t('filter')) + '</button></div></div>' +
      '<div class="tiles">' + tile('home', 't-home', 'home', '#/list') + tile('buyer', 't-buyer', 'users', '#/list?type=sale') + tile('seller', 't-seller', 'user', '#/myads') +
      tile('rent', 't-rent', 'key', '#/list?type=rent') + tile('flatsHouse', 't-flats', 'building', '#/list?cat=house,flat') + tile('plots', 't-plots', 'grid', '#/list?cat=plot,homestead,commercial') +
      '</div>' +
      (latest.length ? '<div class="sec"><h2>' + esc(t('latest')) + '</h2><button data-act="nav" data-href="#/list">' + esc(t('seeAll')) + '</button></div><div class="list" style="padding-top:4px">' + latest.map(function (p) { return card(p, u); }).join('') + '</div>' : '');
  };

  routes.list = function (parts, q, u) {
    var type = q.get('type') || '', cats = (q.get('cat') || '').split(',').filter(Boolean), land = q.get('land'), text = (q.get('q') || '').toLowerCase().trim(),
      dist = q.get('dist'), blk = q.get('block'), mz = q.get('mouza'), min = +q.get('min') || 0, max = +q.get('max') || 0, sort = q.get('sort') || 'new';
    if (land) cats = [land];
    var items = S.posts.where(function (p) { return p.status === 'live'; }).filter(function (p) {
      if (type && p.type !== type) return false;
      if (cats.length && cats.indexOf(p.cat) < 0) return false;
      if (dist && p.district !== dist) return false;
      if (blk && p.block !== blk) return false;
      if (mz && p.mouza !== mz) return false;
      if (min && p.price < min) return false;
      if (max && p.price > max) return false;
      if (text && (p.title + ' ' + p.details + ' ' + loc(p) + ' ' + p.area).toLowerCase().indexOf(text) < 0) return false;
      return true;
    });
    items.sort(function (a, b) {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.createdAt - a.createdAt;
    });
    var title = t('listing');
    if (cats.join() === 'house,flat') title = t('flatsHouse'); else if (cats.join() === 'plot,homestead,commercial') title = t('plots');
    else if (type === 'sale' && !cats.length) title = t('buyer'); else if (type === 'rent' && !cats.length) title = t('rent');
    function tab(v, label) { return '<button class="' + (type === v ? 'on' : '') + '" data-act="nav" data-href="' + qh('#/list', q, { type: v }) + '">' + esc(label) + '</button>'; }
    return sub(title, '<button class="ic-btn" data-act="filter" aria-label="filter">' + ic('sliders') + '</button>') +
      '<div class="tabs">' + tab('', t('all')) + tab('sale', t('sale')) + tab('rent', t('rent')) + '</div>' +
      '<form class="sbox mini-search" data-form="listsearch">' + ic('search') + '<input name="q" value="' + esc(q.get('q') || '') + '" placeholder="' + esc(t('searchPh')) + '" autocomplete="off"></form>' +
      '<div class="list">' + (items.length ? items.map(function (p) { return card(p, u); }).join('') : empty(t('noResults'))) + '</div>';
  };

  routes.post = function (parts, q, u) {
    var p = S.posts.find(parts[1]);
    if (!p || (p.status !== 'live' && !(u && u.id === p.ownerId))) return sub(t('listing')) + empty(t('noResults'));
    if (!sessionStorage.getItem('v_' + p.id)) { sessionStorage.setItem('v_' + p.id, '1'); S.posts.update(p.id, { views: (p.views || 0) + 1 }); }
    var own = !!(u && u.id === p.ownerId), full = own, canCall = own, callReady = own;
    if (u && !own) {
      if (S.canUse(u, 'views', p.id)) { full = true; if (!S.has(u, 'views', p.id)) u = S.consume(u, 'views', p.id); }
      callReady = S.has(u, 'calls', p.id) && S.limit(u, 'calls') !== 0;
      canCall = callReady || S.canUse(u, 'calls', p.id);
    }
    var viewHit = !!(u && !own && !full && S.limit(u, 'views') !== 0);
    var imgs = S.postImages(p), fav = u && (u.favs || []).indexOf(p.id) >= 0, num = esc(p.mobile || '');
    var masked = esc(String(p.mobile || '').slice(0, 5) + '*****');
    var callBtn;
    if (!u) callBtn = '<button class="btn" data-act="authgo">' + ic('phone') + esc(t('loginToCall')) + '</button>';
    else if (callReady) callBtn = '<a class="btn" href="tel:' + num + '">' + ic('phone') + esc(t('call')) + '</a>';
    else if (canCall) callBtn = '<button class="btn" data-act="callask" data-id="' + p.id + '">' + ic('phone') + esc(t('call')) + '</button>';
    else callBtn = '<button class="btn" data-act="upgrade" data-m="callLimitReached">' + ic('lock') + esc(t('call')) + '</button>';
    var wa = digits(p.mobile); if (wa.length === 10) wa = '91' + wa;
    ST.after = function () {
      var tr = $('.gal-track'), c = $('#gcnt'); if (!tr || !c) return;
      tr.addEventListener('scroll', function () { c.textContent = (Math.round(tr.scrollLeft / tr.clientWidth) + 1) + '/' + imgs.length; });
    };
    return '<div class="gal"><div class="gal-track">' + imgs.map(function (i) { return '<div style="' + bg(i) + '"></div>'; }).join('') + '</div>' +
      '<div class="top"><button class="ic-btn" data-act="back" aria-label="back">' + ic('back') + '</button><button class="ic-btn ' + (fav ? 'on' : '') + '" data-act="fav" data-id="' + p.id + '" aria-label="favourite">' + ic('heart') + '</button></div>' +
      '<span class="cnt" id="gcnt">1/' + imgs.length + '</span></div>' +
      '<div class="sheet"><h1>' + esc(p.title) + '</h1><div class="price">' + money(p) + '</div>' +
      '<div class="loc">' + ic('pin') + esc(loc(p)) + (p.verified ? ' <span class="vbadge" style="margin-left:6px">' + ic('check') + esc(t('verified')) + '</span>' : '') + '</div>' +
      '<div class="info"><div><small>' + esc(t('type')) + '</small><b>' + esc(t('c_' + p.cat)) + '</b></div><div><small>' + esc(t('area')) + '</small><b>' + esc(p.area) + '</b></div>' +
      '<div><small>' + esc(t('posted')) + '</small><b>' + esc(ago(p.createdAt)) + '</b></div><div><small>' + esc(t('views')) + '</small><b>' + (p.views || 0) + '</b></div></div>' +
      '<div class="blk"><h3>' + esc(t('desc')) + '</h3>' + (full ? '<p>' + esc(p.details) + '</p>' : '<div class="fade"><p>' + esc(p.details) + '</p></div><div class="lock">' + ic('lock') + '<span>' + esc(t(viewHit ? 'viewLimitReached' : 'partialNote')) + '</span></div>') + '</div>' +
      '<div class="blk"><h3>' + esc(t('contactInfo')) + '</h3><div class="owner"><span class="avatar" style="width:44px;height:44px">' + esc((p.ownerName || '?').charAt(0).toUpperCase()) + '</span><div><b>' + esc(p.ownerName || t('owner')) + '</b><small>' + (callReady ? num : esc(t('hiddenNum')) + ' · ' + masked) + '</small></div></div>' +
      '<div class="cta2">' + callBtn + '<button class="btn line" data-act="report" data-id="' + p.id + '">' + ic('flag') + esc(t('report')) + '</button></div>' +
      (callReady && wa ? '<a class="btn line" style="margin-top:10px" target="_blank" rel="noopener" href="https://wa.me/' + wa + '">' + ic('chat') + esc(t('whatsapp')) + '</a>' : '') + (u && !own ? '<p class="hint" style="margin-top:10px">' + esc(t('viewsLeft')) + ': ' + leftTxt(S.left(u, 'views')) + ' · ' + esc(t('callsLeft')) + ': ' + leftTxt(S.left(u, 'calls')) + '</p>' : '') + '</div></div>' +
      '<div class="stickybar"><button class="btn" data-act="fav" data-id="' + p.id + '">' + ic('heart') + esc(fav ? t('inFav') : t('addFav')) + '</button></div>';
  };

  var PR = [[0, 10000], [10000, 100000], [100000, 1000000], [1000000, 2500000], [2500000, 5000000], [5000000, 0]];
  function prLabel(r) { return r[1] ? S.money(r[0]) + ' – ' + S.money(r[1]) : S.money(r[0]) + '+'; }
  routes.search = function (parts, q, u) {
    if (!u) { needLogin('#/search'); return false; }
    if (!S.planOf(u).advSearch) { go('#/plans'); setTimeout(upgradeModal, 60); return false; }
    var tree = S.locTree();
    return sub(t('advSearch')) + '<div class="wrap"><form class="card" data-form="adv">' +
      '<label class="fl">' + esc(t('district')) + '</label><select class="sel" id="f-district" name="dist">' + opts(Object.keys(tree), t('select')) + '</select>' +
      '<label class="fl">' + esc(t('block')) + '</label><select class="sel" id="f-block" name="block">' + opts([], t('select')) + '</select>' +
      '<label class="fl">' + esc(t('mouza')) + '</label><select class="sel" id="f-mouza" name="mouza">' + opts([], t('select')) + '</select>' +
      '<label class="fl">' + esc(t('priceRange')) + '</label><select class="sel" name="pr"><option value="">' + esc(t('any')) + '</option>' + PR.map(function (r) { return '<option value="' + r[0] + '-' + r[1] + '">' + esc(prLabel(r)) + '</option>'; }).join('') + '</select>' +
      '<label class="fl">' + esc(t('landType')) + '</label><select class="sel" name="land"><option value="">' + esc(t('any')) + '</option>' + ['agri', 'homestead', 'commercial', 'plot', 'house', 'flat'].map(function (c) { return '<option value="' + c + '">' + esc(t('c_' + c)) + '</option>'; }).join('') + '</select>' +
      '<div class="row2" style="margin-top:6px"><button class="btn">' + ic('search') + esc(t('search')) + '</button><button type="reset" class="btn line">' + esc(t('reset')) + '</button></div></form></div>';
  };

  routes.add = function (parts, q, u) {
    if (!u) { needLogin('#/add'); return false; }
    var pl = S.planOf(u), used = S.postCountOf(u);
    if (pl.postLimit >= 0 && used >= pl.postLimit) {
      return sub(t('navAdd')) + '<div class="wrap"><div class="card" style="text-align:center"><div class="crown-big" style="margin:0 auto 10px">' + ic('award') + '</div><h3>' + esc(t('limitReached')) + '</h3><p class="hint">' + used + ' / ' + pl.postLimit + '</p><button class="btn gold" data-act="plans">' + esc(t('viewPlans')) + '</button></div></div>';
    }
    ST.photos = [];
    var tree = S.locTree();
    return sub(t('navAdd')) + '<div class="wrap"><form class="card" data-form="add">' +
      '<label class="fl">' + esc(t('titleLbl')) + ' <i>*</i></label><input class="in" name="title" maxlength="90" required>' +
      '<label class="fl">' + esc(t('saleOrRent')) + ' <i>*</i></label><div class="seg"><label><input type="radio" name="type" value="sale" checked><span>' + esc(t('sale')) + '</span></label><label><input type="radio" name="type" value="rent"><span>' + esc(t('rent')) + '</span></label></div>' +
      '<label class="fl">' + esc(t('category')) + ' <i>*</i></label><select class="sel" name="cat">' + ['agri', 'homestead', 'commercial', 'plot', 'house', 'flat'].map(function (c) { return '<option value="' + c + '">' + esc(t('c_' + c)) + '</option>'; }).join('') + '</select>' +
      '<label class="fl">' + esc(t('district')) + ' <i>*</i></label><select class="sel" id="a-district" name="district" required>' + opts(Object.keys(tree), t('select')) + '</select>' +
      '<label class="fl">' + esc(t('block')) + '</label><select class="sel" id="a-block" name="block">' + opts([], t('select')) + '</select>' +
      '<label class="fl">' + esc(t('mouza')) + '</label><input class="in" id="a-mouza" name="mouza" list="a-mouzas" autocomplete="off"><datalist id="a-mouzas"></datalist>' +
      '<div class="row2"><div><label class="fl" id="a-pl">' + esc(t('priceLbl')) + ' (' + esc(S.settings().currency) + ') <i>*</i></label><input class="in" name="price" type="number" min="1" inputmode="numeric" required></div>' +
      '<div><label class="fl">' + esc(t('areaLbl')) + '</label><input class="in" name="area"></div></div>' +
      '<label class="fl">' + esc(t('details')) + '</label><textarea class="ta" name="details" maxlength="1500"></textarea>' +
      '<label class="fl">' + esc(t('photos')) + ' <i>*</i></label><div class="upl"><label class="addph" for="a-photos">' + ic('plus') + esc(t('choose')) + '</label><span class="hint">' + esc(t('photoHint')) + '</span></div>' +
      '<input id="a-photos" type="file" accept="image/*" multiple hidden><div class="thumbs" id="a-thumbs"></div>' +
      '<label class="fl">' + esc(t('mobileNo')) + ' <i>*</i></label><input class="in" name="mobile" type="tel" value="' + esc(u.mobile || '') + '" required>' +
      '<button class="btn">' + ic('check') + esc(t('post')) + '</button></form></div>';
  };

  routes.plans = function (parts, q, u) {
    var cur = u ? S.planOf(u) : S.freePlan();
    return sub(t('plansTitle')) + '<div class="wrap" style="display:flex;flex-direction:column;gap:16px">' + S.activePlans().map(function (p) {
      var isCur = cur.id === p.id;
      return '<div class="plan ' + (isCur ? 'cur' : '') + '" style="--pc:' + esc(p.color || '#2563eb') + '">' + (isCur ? '<span class="ribbon">' + esc(t('currentPlan')) + '</span>' : '') +
        '<h3>' + esc(p.name) + '</h3><div class="amt">' + S.money(p.price) + '<small> ' + esc(t('perMonth')) + '</small></div><ul>' +
        feats(p).map(function (f) { return '<li class="' + (f[0] ? '' : 'no') + '">' + ic(f[0] ? 'check' : 'x') + '<span>' + esc(f[1]) + '</span></li>'; }).join('') + '</ul>' +
        (p.price > 0 ? '<button class="btn" data-act="choose" data-id="' + p.id + '"' + (isCur ? ' disabled' : '') + '>' + esc(isCur ? t('currentPlan') : t('chooseNow')) + '</button>' : '') + '</div>';
    }).join('') + '</div>';
  };

  routes.pay = function (parts, q, u) {
    if (!u) { needLogin('#/pay/' + parts[1]); return false; }
    var p = S.plans.find(parts[1]), s = S.settings();
    if (!p || !(p.price > 0)) { go('#/plans'); return false; }
    if (!ST.payEnd[p.id]) ST.payEnd[p.id] = Date.now() + (s.payMinutes || 15) * 60000;
    var params = 'pa=' + encodeURIComponent(s.upiId) + '&pn=' + encodeURIComponent(s.upiName) + '&am=' + Number(p.price).toFixed(2) + '&cu=INR&tn=' + encodeURIComponent('Membership ' + p.name);
    ST.payPlan = p.id;
    ST.payLinks = { upi: 'upi://pay?' + params, pp: 'phonepe://pay?' + params };
    var upiOn = s.payUpiOn !== false, qrOn = s.payQrOn !== false; if (!upiOn && !qrOn) upiOn = true;
    var m = ST.payMethod; if (m === 'upi' && !upiOn) m = 'qr'; if (m === 'qr' && !qrOn) m = 'upi'; if (!m) m = upiOn ? 'upi' : 'qr'; ST.payMethod = m;
    var mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
    function tick() {
      var el = $('#timer'), left = ST.payEnd[p.id] - Date.now();
      if (!el) { clearInterval(ST.timer); return; }
      if (left <= 0) { clearInterval(ST.timer); delete ST.payEnd[p.id]; el.parentNode.innerHTML = '<span class="timer" style="font-size:14px">' + esc(t('payExpired')) + '</span> <button class="mini-btn" data-act="retry">' + esc(t('retry')) + '</button>'; var b = $('#paidbtn'); if (b) b.disabled = true; return; }
      var mm = Math.floor(left / 60000), sec = Math.floor(left / 1000) % 60;
      el.textContent = (mm < 10 ? '0' : '') + mm + ':' + (sec < 10 ? '0' : '') + sec;
    }
    ST.after = function () {
      tick(); clearInterval(ST.timer); ST.timer = setInterval(tick, 1000);
      var qr = $('#qr');
      if (qr && !s.qrImage) {
        if (window.QRCode) { qr.innerHTML = ''; try { new QRCode(qr, { text: ST.payLinks.upi, width: 140, height: 140, correctLevel: QRCode.CorrectLevel.M }); } catch (e) { qr.innerHTML = '<span>' + esc(t('payNoQr')) + '</span>'; } }
        else qr.innerHTML = '<span>' + esc(t('payNoQr')) + '</span>';
      }
    };
    var selector = (upiOn && qrOn) ? '<div class="msel"><button type="button" class="' + (m === 'upi' ? 'on' : '') + '" data-act="paymethod" data-m="upi">' + ic('phone') + esc(t('payViaUpi')) + '</button><button type="button" class="' + (m === 'qr' ? 'on' : '') + '" data-act="paymethod" data-m="qr">' + ic('grid') + esc(t('payViaQr')) + '</button></div>' : '';
    var body = m === 'upi'
      ? '<p class="hint" style="margin:12px 0 4px">' + esc(t('upiPayHint')) + '</p><button class="btn" style="background:linear-gradient(135deg,#7c3aed,#5b21b6)" data-act="upipay">' + ic('phone') + esc(t('payPhonePe')) + '</button><button class="btn line" data-act="upipay2">' + esc(t('payOtherUpi')) + '</button>' + (mobile ? '' : '<p class="hint">' + esc(t('desktopUpiHint')) + '</p>')
      : '<div class="qrwrap"><div class="qrbox" id="qr">' + (s.qrImage ? '<img alt="QR" src="' + esc(s.qrImage) + '">' : '') + '</div><div><b>' + esc(t('scanPay')) + '</b><p class="hint" style="margin:4px 0 8px">' + esc(s.upiName) + '</p><p class="hint">' + esc(t('qrHint')) + '</p></div></div>';
    return sub(t('payTitle')) + '<div class="wrap"><div class="paybox" style="--pc:' + esc(p.color) + '"><h2>' + ic('award') + esc(p.name) + ' · ' + S.money(p.price) + esc(t('perMonth')) + '</h2><ul>' +
      feats(p).filter(function (f) { return f[0]; }).map(function (f) { return '<li>' + ic('check') + esc(f[1]) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="card" style="margin-top:16px"><h3>' + esc(t('payMethod')) + '</h3>' + selector + body +
      '<div style="margin-top:14px;padding-top:12px;border-top:1px dashed var(--line)"><span class="hint">' + esc(t('timeLeft')) + '</span> <span class="timer" id="timer">--:--</span></div><p class="hint">' + esc(t('afterPayHint')) + '</p></div>' +
      '<button class="btn" id="paidbtn" data-act="paid" data-id="' + p.id + '">' + ic('check') + esc(t('paidBtn')) + '</button></div>';
  };

  routes.menu = function (parts, q, u) {
    var pl = u ? S.planOf(u) : null;
    function mi(icon, label, href, cls) { return '<button class="mi ' + (cls || '') + '" data-act="nav" data-href="' + href + '"><span class="mic">' + ic(icon) + '</span><span class="grow">' + esc(label) + '</span>' + ic('chev').replace('class="i"', 'class="i chev"') + '</button>'; }
    if (!u) {
      return sub(t('navMenu')) + '<div class="wrap"><div class="card" style="text-align:center">' + S.logo(60) + '<h3 style="margin-top:6px">' + esc(t('guestName')) + '</h3><p class="hint">' + esc(t('guestHint')) + '</p>' +
        '<div class="row2"><button class="btn" data-act="nav" data-href="#/auth">' + esc(t('login')) + '</button><button class="btn line" data-act="nav" data-href="#/auth?tab=signup">' + esc(t('signUp')) + '</button></div></div></div>' +
        '<div class="menu">' + mi('award', t('membership'), '#/plans') + mi('gear', t('settings'), '#/settings') + mi('book', t('navGuide'), '#/guide') + mi('info', t('navAbout'), '#/about') + mi('phone', t('contactUs'), '#/contact') + mi('file', t('termsTitle'), '#/terms') + mi('grid', t('appsTitle'), '#/apps') + '</div>';
    }
    var paid = pl.id !== 'free';
    return sub(t('navMenu')) + '<div class="prof"><span class="avatar">' + (u.photo ? '<img alt="" src="' + esc(u.photo) + '">' : esc((u.name || '?').charAt(0).toUpperCase())) + '</span><div><b>' + esc(u.name) + '</b><small>' + esc(u.mobile) + '</small></div></div>' +
      '<div class="planbar"><span class="cr">' + ic('award') + '</span><div><b>' + esc(pl.name) + '</b><small>' + (paid ? esc(t('activeTill')) + ': ' + fd(u.planExpiry) : esc(t('freeActive'))) + '</small><small style="display:block;margin-top:3px">' + esc(t('postsLeft')) + ': ' + leftTxt(S.postsLeft(u)) + ' · ' + esc(t('viewsLeft')) + ': ' + leftTxt(S.left(u, 'views')) + ' · ' + esc(t('callsLeft')) + ': ' + leftTxt(S.left(u, 'calls')) + '</small></div></div>' +
      '<div class="menu">' + mi('file', t('myAds'), '#/myads') + mi('heart', t('myFav'), '#/favs') + mi('award', t('membership'), '#/plans') + mi('user', t('myProfile'), '#/profile') + mi('card', t('payHistory'), '#/history') + mi('gear', t('settings'), '#/settings') + mi('phone', t('contactUs'), '#/contact') + mi('file', t('termsTitle'), '#/terms') + mi('grid', t('appsTitle'), '#/apps') +
      '<button class="mi red" data-act="logout"><span class="mic">' + ic('logout') + '</span><span class="grow">' + esc(t('logout')) + '</span></button></div>';
  };

  routes.auth = function (parts, q, u) {
    if (u) { go(ST.redirect || '#/home'); ST.redirect = null; return false; }
    var tab = q.get('tab') === 'signup' ? 'signup' : 'login';
    var form;
    if (tab === 'login') {
      form = '<form data-form="login"><label class="fl">' + esc(t('mobileOrEmail')) + '</label><div class="iw">' + ic('user') + '<input class="in" name="id" autocomplete="username" required></div>' +
        '<label class="fl">' + esc(t('password')) + '</label><div class="iw">' + ic('lock') + '<input class="in" name="pass" type="password" autocomplete="current-password" required></div>' +
        '<div class="between"><label class="check"><input type="checkbox" name="rem" checked>' + esc(t('remember')) + '</label><button type="button" class="link" data-act="forgot">' + esc(t('forgot')) + '</button></div>' +
        '<button class="btn">' + esc(t('login')) + '</button><div class="or">' + esc(t('or')) + '</div><button type="button" class="gbtn" data-act="google"><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.6a14.5 14.5 0 0 1 0-9.2l-7.9-6.2a24 24 0 0 0 0 21.6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z"/></svg>' + esc(t('google')) + '</button>' +
        '<p style="text-align:center;margin-top:16px"><button type="button" class="link" data-act="nav" data-href="#/auth?tab=signup">' + esc(t('newAcc')) + '</button></p></form>';
    } else {
      form = '<form data-form="signup"><label class="fl">' + esc(t('name')) + '</label><div class="iw">' + ic('user') + '<input class="in" name="name" required></div>' +
        '<label class="fl">' + esc(t('mobile')) + '</label><div class="iw">' + ic('phone') + '<input class="in" name="mobile" type="tel" inputmode="numeric" required></div>' +
        '<label class="fl">' + esc(t('email')) + '</label><div class="iw">' + ic('mail') + '<input class="in" name="email" type="email"></div>' +
        '<label class="fl">' + esc(t('password')) + '</label><div class="iw">' + ic('lock') + '<input class="in" name="pass" type="password" autocomplete="new-password" required></div>' +
        '<label class="fl">' + esc(t('address')) + '</label><div class="iw">' + ic('pin') + '<input class="in" name="address"></div>' +
        '<button class="btn">' + esc(t('signUp')) + '</button><p style="text-align:center;margin-top:16px"><button type="button" class="link" data-act="nav" data-href="#/auth">' + esc(t('haveAcc')) + '</button></p></form>';
    }
    return '<div class="auth-hero">' + S.logo(64) + '<h1>' + esc(appName()) + '</h1><p>' + esc(t('appTag')) + '</p></div><div class="card auth-card"><div class="atabs"><button class="' + (tab === 'login' ? 'on' : '') + '" data-act="nav" data-href="#/auth">' + esc(t('login')) + '</button><button class="' + (tab === 'signup' ? 'on' : '') + '" data-act="nav" data-href="#/auth?tab=signup">' + esc(t('signUp')) + '</button></div>' + form + '</div>';
  };

  routes.favs = function (parts, q, u) {
    if (!u) { needLogin('#/favs'); return false; }
    var items = (u.favs || []).map(function (id) { return S.posts.find(id); }).filter(function (p) { return p && p.status === 'live'; });
    return sub(t('favTitle')) + '<div class="list">' + (items.length ? items.map(function (p) { return mrow(p, '<div class="act"><button class="fav on" style="position:static;box-shadow:none;background:var(--field)" data-act="fav" data-id="' + p.id + '">' + ic('heart') + '</button></div>'); }).join('') : empty(t('noFav'))) + '</div>';
  };

  routes.myads = function (parts, q, u) {
    if (!u) { needLogin('#/myads'); return false; }
    var items = S.posts.where(function (p) { return p.ownerId === u.id; });
    return sub(t('myAds'), '<button class="ic-btn" data-act="nav" data-href="#/add" aria-label="add">' + ic('plus') + '</button>') + '<div class="list">' + (items.length ? items.map(function (p) {
      return mrow(p, '<div class="act"><span class="sbadge s-' + p.status + '">' + esc(t('st_' + p.status)) + '</span><div style="display:flex;gap:6px">' + (p.status === 'live' ? '<button class="mini-btn" data-act="sold" data-id="' + p.id + '">' + esc(t('markSold')) + '</button>' : '') + '<button class="mini-btn red" data-act="del" data-id="' + p.id + '">' + esc(t('del')) + '</button></div></div>');
    }).join('') : empty(t('noAds')) + '<button class="btn" data-act="nav" data-href="#/add">' + ic('plus') + esc(t('navAdd')) + '</button>') + '</div>';
  };

  routes.profile = function (parts, q, u) {
    if (!u) { needLogin('#/profile'); return false; }
    ST.newPhoto = null;
    return sub(t('myProfile')) + '<div class="wrap"><form class="card" data-form="profile"><div style="display:flex;align-items:center;gap:14px"><span class="avatar" id="p-av" style="width:64px;height:64px;font-size:26px">' + (u.photo ? '<img alt="" src="' + esc(u.photo) + '">' : esc((u.name || '?').charAt(0).toUpperCase())) + '</span><label class="mini-btn" for="p-photo" style="padding:9px 14px">' + esc(t('photo')) + '</label><input id="p-photo" type="file" accept="image/*" hidden></div>' +
      '<label class="fl">' + esc(t('name')) + '</label><input class="in" name="name" value="' + esc(u.name) + '" required>' +
      '<label class="fl">' + esc(t('mobile')) + '</label><input class="in" value="' + esc(u.mobile) + '" readonly>' +
      '<label class="fl">' + esc(t('email')) + '</label><input class="in" name="email" type="email" value="' + esc(u.email || '') + '">' +
      '<label class="fl">' + esc(t('address')) + '</label><input class="in" name="address" value="' + esc(u.address || '') + '">' +
      '<button class="btn">' + esc(t('saveChanges')) + '</button></form>' +
      '<form class="card" data-form="chpass" style="margin-top:16px"><h3>' + esc(t('changePass')) + '</h3><label class="fl">' + esc(t('oldPass')) + '</label><input class="in" name="old" type="password" required><label class="fl">' + esc(t('newPass')) + '</label><input class="in" name="new" type="password" required><button class="btn line">' + esc(t('changePass')) + '</button></form></div>';
  };

  routes.history = function (parts, q, u) {
    if (!u) { needLogin('#/history'); return false; }
    var items = S.payments.where(function (p) { return p.userId === u.id; });
    return sub(t('payHistory')) + '<div class="list">' + (items.length ? items.map(function (p) {
      return '<div class="card" style="padding:14px"><div style="display:flex;justify-content:space-between;align-items:center"><b>' + esc(p.planName) + '</b><span class="sbadge s-' + p.status + '">' + esc(t('pay_' + p.status)) + '</span></div><div class="price" style="font-size:18px">' + S.money(p.amount) + '</div><div class="pmeta">UTR: ' + esc(p.utr) + ' · ' + fd(p.createdAt) + '</div></div>';
    }).join('') : empty(t('noHistory'))) + '</div>';
  };

  routes.settings = function (parts, q, u) {
    var s = S.settings();
    return sub(t('settings')) + '<div class="wrap" style="padding-bottom:0"><h3 style="margin-bottom:10px">' + esc(t('language')) + '</h3></div><div class="langpick">' + ['bn', 'en', 'hi'].map(function (l) { return '<button class="' + (ST.lang === l ? 'on' : '') + '" data-act="lang" data-l="' + l + '">' + esc(I18N[l].langName) + '</button>'; }).join('') + '</div>' +
      '<div class="menu"><button class="mi" data-act="theme"><span class="mic">' + ic('moon') + '</span><span class="grow">' + esc(t('darkMode')) + '</span><span class="toggle ' + (ST.theme === 'dark' ? 'on' : '') + '"></span></button>' +
      (s.website ? '<a class="mi" href="' + esc(s.website) + '" target="_blank" rel="noopener"><span class="mic">' + ic('globe') + '</span><span class="grow">' + esc(s.website) + '</span></a>' : '') +
      '<div class="mi"><span class="mic">' + ic('info') + '</span><span class="grow">' + esc(t('version')) + '</span><span style="color:var(--muted)">' + VERSION + '</span></div></div>';
  };

  routes.guide = function () {
    return sub(t('guideTitle')) + '<div class="wrap">' + [1, 2, 3, 4, 5].map(function (n) { return '<div class="step"><span class="n">' + n + '</span><div><b>' + esc(t('g' + n + 't')) + '</b><p>' + esc(t('g' + n + 'd')) + '</p></div></div>'; }).join('') + '</div>';
  };

  routes.about = function () {
    var s = S.settings();
    return sub(t('aboutTitle')) + '<div class="about-hero">' + S.logo(84) + '<h2>' + esc(appName()) + '</h2><p class="hint">' + esc(t('version')) + ' ' + VERSION + '</p></div><div class="wrap"><div class="card"><p>' + esc(t('aboutText')) + '</p></div>' +
      '<button class="btn" data-act="nav" data-href="#/contact">' + ic('phone') + esc(t('contactUs')) + '</button></div>';
  };

  routes.contact = function (parts, q, u) {
    var s = S.settings(), wa = digits(s.whatsapp);
    function ci(icon, label, val, href) { return '<a class="cinfo" ' + (href ? 'href="' + esc(href) + '" target="_blank" rel="noopener"' : '') + '><span class="mic">' + ic(icon) + '</span><div><small>' + esc(label) + '</small><b>' + esc(val) + '</b></div></a>'; }
    return sub(t('contactTitle')) + '<div class="wrap">' + ci('phone', t('call'), s.phone, 'tel:' + s.phone.replace(/\s/g, '')) + (wa ? ci('chat', t('whatsapp'), '+' + wa, 'https://wa.me/' + wa) : '') + ci('mail', 'Email', s.email, 'mailto:' + s.email) + ci('pin', t('ourAddress'), s.address) +
      '<form class="card" data-form="contact" style="margin-top:6px"><h3>' + esc(t('sendMsg')) + '</h3><label class="fl">' + esc(t('name')) + '</label><input class="in" name="name" value="' + esc(u ? u.name : '') + '" required><label class="fl">' + esc(t('mobile')) + '</label><input class="in" name="mobile" type="tel" value="' + esc(u ? u.mobile : '') + '" required><label class="fl">' + esc(t('details')) + '</label><textarea class="ta" name="text" placeholder="' + esc(t('msgPh')) + '" required></textarea><button class="btn">' + esc(t('sendMsg')) + '</button></form></div>';
  };

  routes.terms = function () {
    var s = S.settings(), body;
    if (s.termsText && s.termsText.trim()) body = s.termsText.trim().split(/\n\s*\n/).map(function (x) { return '<div class="step" style="display:block"><p style="white-space:pre-line;color:var(--ink)">' + esc(x.trim()) + '</p></div>'; }).join('');
    else body = [1, 2, 3, 4, 5, 6].map(function (n) { return '<div class="step" style="display:block"><b>' + esc(t('tc' + n + 't')) + '</b><p>' + esc(t('tc' + n + 'd')) + '</p></div>'; }).join('');
    return sub(t('termsTitle')) + '<div class="wrap">' + body + '</div>';
  };

  routes.apps = function () {
    var s = S.settings();
    var list = String(s.appsText || '').split(/\r?\n/).map(function (l) { return l.split('|').map(function (x) { return x.trim(); }); }).filter(function (p) { return p[0]; });
    return sub(t('appsTitle')) + '<div class="wrap"><p class="hint" style="margin:0 0 12px">' + esc(t('appsIntro')) + '</p>' +
      '<div class="cinfo" style="align-items:flex-start"><span style="flex:none">' + S.logo(52) + '</span><div style="flex:1"><b>' + esc(appName()) + '</b><small>' + esc(t('thisApp')) + ' · v' + VERSION + '</small><small>' + esc(t('appTag')) + '</small><button class="btn" style="height:40px;margin-top:10px;font-size:14px" data-act="share">' + esc(t('shareApp')) + '</button></div></div>' +
      list.map(function (p) {
        var url = /^(https?:\/\/|\.{0,2}\/)/.test(p[2] || '') ? p[2] : '';
        return '<div class="cinfo" style="align-items:flex-start"><span class="mic">' + ic('grid') + '</span><div style="flex:1"><b>' + esc(p[0]) + '</b><small>' + esc(p[1] || '') + '</small>' + (url ? '<a class="btn" style="height:40px;margin-top:10px;font-size:14px" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(t('openApp')) + '</a>' : '') + '</div></div>';
      }).join('') + '</div>';
  };

  /* ---------- render ---------- */
  var NAV = [['home', '#/home', 'navHome', 'home'], ['guide', '#/guide', 'navGuide', 'book'], ['add', '#/add', 'navAdd', 'plus'], ['plans', '#/plans', 'navMember', 'award'], ['about', '#/about', 'navAbout', 'info'], ['menu', '#/menu', 'navMenu', 'menu']];
  function navKey(r) {
    if (r === 'home' || r === 'list' || r === 'search') return 'home';
    if (r === 'plans' || r === 'pay') return 'plans';
    if (r === 'about' || r === 'contact') return 'about';
    if (r === 'guide' || r === 'add') return r;
    return 'menu';
  }
  function render(keep) {
    var view = $('#view'), nav = $('#nav'), s = S.settings(), keepTop = keep ? view.scrollTop : 0;
    clearInterval(ST.timer); ST.after = null;
    document.title = appName();
    document.documentElement.lang = ST.lang;
    document.documentElement.setAttribute('data-theme', ST.theme);
    if (s.maintenance) { view.innerHTML = '<div class="maint">' + S.logo(80) + '<h2>' + esc(t('maintenance')) + '</h2><p class="hint">' + esc(s.maintenanceMsg) + '</p></div>'; nav.style.display = 'none'; return; }
    var h = location.hash.slice(1) || '/home', i = h.indexOf('?'), path = h.slice(0, i < 0 ? h.length : i), q = new URLSearchParams(i < 0 ? '' : h.slice(i + 1)), parts = path.split('/').filter(Boolean);
    var name = routes[parts[0]] ? parts[0] : 'home';
    if (name === 'home' && parts[0] && parts[0] !== 'home') { parts = ['home']; }
    ST.route = name;
    var u = user(), html = routes[name](parts, q, u);
    if (html === false) return;
    view.innerHTML = '<div class="page">' + html + '</div>';
    view.scrollTop = keepTop;
    var hide = name === 'post';
    view.style.paddingBottom = hide ? '0' : '';
    nav.style.display = hide ? 'none' : '';
    var k = navKey(name);
    nav.innerHTML = NAV.map(function (n) {
      return '<button class="' + (n[0] === 'add' ? 'add ' : '') + (n[0] === k ? 'on' : '') + '" data-act="nav" data-href="' + n[1] + '" aria-label="' + esc(t(n[2])) + '">' + (n[0] === 'add' ? '<div class="pl">' + ic(n[3]) + '</div>' : ic(n[3])) + '<span>' + esc(t(n[2])) + '</span></button>';
    }).join('');
    if (ST.after) ST.after();
  }

  /* ---------- actions ---------- */
  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt);
    var ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } document.body.removeChild(ta); return Promise.resolve();
  }
  function toggleFav(id) {
    var u = user(); if (!u) return needLogin();
    var f = (u.favs || []).slice(), i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    S.users.update(u.id, { favs: f });
    toast(i >= 0 ? t('favRemoved') : t('favAdded'));
    render(true);
  }
  function filterModal() {
    function chips(group, arr, cur) { return '<div class="chips" data-group="' + group + '">' + arr.map(function (a) { return '<button type="button" class="' + (a[0] === cur ? 'on' : '') + '" data-act="chip" data-v="' + a[0] + '">' + esc(a[1]) + '</button>'; }).join('') + '</div>'; }
    openModal('<h3>' + esc(t('filter')) + '</h3><label class="fl">' + esc(t('type')) + '</label>' + chips('type', [['', t('all')], ['sale', t('sale')], ['rent', t('rent')]], '') +
      '<label class="fl">' + esc(t('category')) + '</label>' + chips('cat', [['', t('typeAll')]].concat(['agri', 'homestead', 'commercial', 'plot', 'house', 'flat'].map(function (c) { return [c, t('c_' + c)]; })), '') +
      '<label class="fl">' + esc(t('sortBy')) + '</label>' + chips('sort', [['new', t('sortNew')], ['low', t('sortLow')], ['high', t('sortHigh')]], 'new') +
      '<button class="btn" data-act="applyfilter">' + esc(t('applyFilter')) + '</button>');
  }
  function fillSel(sel, arr, ph) { var el = $(sel); if (el) el.innerHTML = opts(arr, ph); }
  function setMouza(pre) {
    var tree = S.locTree(), d = $('#' + pre + '-district').value, b = $('#' + pre + '-block').value, arr = (tree[d] && tree[d][b]) || [];
    if (pre === 'f') fillSel('#f-mouza', arr, t('select'));
    else $('#a-mouzas').innerHTML = arr.map(function (m) { return '<option value="' + esc(m) + '">'; }).join('');
  }
  function loadGoogle(cb) {
    if (window.google && google.accounts) return cb();
    var sc = document.createElement('script'); sc.src = 'https://accounts.google.com/gsi/client'; sc.onload = cb; sc.onerror = function () { toast('Google load failed', true); }; document.head.appendChild(sc);
  }
  function googleLogin() {
    var cid = S.settings().googleClientId;
    if (!cid) return toast(t('gUnset'), true);
    loadGoogle(function () {
      google.accounts.id.initialize({
        client_id: cid, callback: function (r) {
          try {
            var pl = JSON.parse(decodeURIComponent(escape(atob(r.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))));
            var u = S.users.where(function (x) { return x.email && x.email.toLowerCase() === String(pl.email).toLowerCase(); })[0];
            if (!u) { if (!S.settings().allowRegistration) return toast(t('regClosed'), true); u = S.users.add({ name: pl.name || 'User', mobile: '', email: pl.email, address: '', passHash: S.hash(S.uid()), photo: '', planId: 'free', planExpiry: null, status: 'active', favs: [] }); }
            if (u.status === 'blocked') return toast(t('blocked'), true);
            setSess(u.id, true); toast(t('loginOk')); go(ST.redirect || '#/home'); ST.redirect = null;
          } catch (e) { toast('Google error', true); }
        }
      });
      google.accounts.id.prompt();
    });
  }

  var actions = {
    nav: function (a) { go(a.dataset.href); },
    back: function () { if (history.length > 1) history.back(); else go('#/home'); },
    open: function (a) { go('#/post/' + a.dataset.id); },
    fav: function (a) { toggleFav(a.dataset.id); },
    plans: function () { closeModal(); go('#/plans'); },
    close: closeModal,
    upgrade: function (a) { upgradeModal(a && a.dataset && a.dataset.m); },
    callask: function (a) {
      var u = user(); if (!u) return needLogin();
      openModal('<h3>' + esc(t('useCallTitle')) + '</h3><p>' + esc(t('useCallMsg', { n: leftTxt(S.left(u, 'calls')) })) + '</p><button class="btn" data-act="callgo" data-id="' + esc(a.dataset.id) + '">' + ic('phone') + esc(t('callGo')) + '</button><button class="btn line" data-act="close">' + esc(t('cancel')) + '</button>');
    },
    callgo: function (a) {
      var u = user(), p = S.posts.find(a.dataset.id); if (!u || !p) return;
      if (!S.canUse(u, 'calls', p.id)) { closeModal(); return upgradeModal('callLimitReached'); }
      S.consume(u, 'calls', p.id); closeModal(); render(true);
      location.href = 'tel:' + p.mobile;
    },
    paymethod: function (a) { ST.payMethod = a.dataset.m; render(true); },
    upipay: function () {
      var L = ST.payLinks; if (!L) return; ST.awaitPay = ST.payPlan; toast(t('openingApp'));
      location.href = L.pp;
      setTimeout(function () { if (!document.hidden) location.href = L.upi; }, 1800);
    },
    upipay2: function () { if (!ST.payLinks) return; ST.awaitPay = ST.payPlan; location.href = ST.payLinks.upi; },
    authgo: function () { needLogin(); },
    lang: function (a) { ST.lang = a.dataset.l; localStorage.setItem('vsk_lang', ST.lang); render(true); },
    theme: function () { ST.theme = ST.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('vsk_theme', ST.theme); render(true); },
    filter: filterModal,
    chip: function (a) { var g = a.parentNode; [].forEach.call(g.children, function (c) { c.classList.remove('on'); }); a.classList.add('on'); },
    applyfilter: function () {
      var o = {}; [].forEach.call(document.querySelectorAll('#modal .chips'), function (g) { var on = g.querySelector('.on'); o[g.dataset.group] = on ? on.dataset.v : ''; });
      closeModal(); go(qh('#/list', new URLSearchParams(''), o));
    },
    adv: function () {
      var u = user(); if (!u) return needLogin('#/search');
      if (!S.planOf(u).advSearch) return upgradeModal();
      go('#/search');
    },
    google: googleLogin,
    forgot: function () {
      openModal('<h3>' + esc(t('forgotTitle')) + '</h3><form data-form="reset"><label class="fl">' + esc(t('regMobile')) + '</label><input class="in" name="mobile" type="tel" required><label class="fl">' + esc(t('regEmail')) + '</label><input class="in" name="email" type="email" required><label class="fl">' + esc(t('newPass')) + '</label><input class="in" name="pass" type="password" required><button class="btn">' + esc(t('resetBtn')) + '</button></form>');
    },
    choose: function (a) { var id = a.dataset.id; if (!user()) { ST.redirect = '#/pay/' + id; toast(t('needLogin'), true); return go('#/auth'); } go('#/pay/' + id); },
    retry: function () { render(); },
    paid: function (a) {
      var p = S.plans.find(a.dataset.id);
      openModal('<h3>' + esc(t('enterUtr')) + '</h3><p class="hint">' + esc(t('utrHint')) + '</p><form data-form="utr"><input type="hidden" name="plan" value="' + esc(p.id) + '"><input class="in" name="utr" maxlength="30" autocomplete="off" required style="margin-top:12px"><button class="btn">' + esc(t('submit')) + '</button></form>');
    },
    report: function (a) {
      if (!user()) return needLogin();
      openModal('<h3>' + esc(t('reportTitle')) + '</h3><form data-form="report"><input type="hidden" name="id" value="' + esc(a.dataset.id) + '"><label class="fl">' + esc(t('category')) + '</label><select class="sel" name="reason">' + ['fake', 'sold', 'wrong', 'other'].map(function (r) { return '<option value="' + r + '">' + esc(t('r_' + r)) + '</option>'; }).join('') + '</select><label class="fl">' + esc(t('details')) + '</label><textarea class="ta" name="note"></textarea><button class="btn red">' + esc(t('report')) + '</button></form>');
    },
    rmph: function (a) { ST.photos.splice(+a.dataset.i, 1); drawThumbs(); },
    del: function (a) { if (confirm(t('confirmDel'))) { S.posts.remove(a.dataset.id); toast(t('saved')); render(true); } },
    sold: function (a) { S.posts.update(a.dataset.id, { status: 'sold' }); toast(t('saved')); render(true); },
    share: function () {
      var url = location.href.split('#')[0];
      if (navigator.share) navigator.share({ title: appName(), url: url }).catch(function () { });
      else copyText(url).then(function () { toast(t('linkCopied')); });
    },
    logout: function () { clearSess(); toast(t('logout')); go('#/home'); }
  };
  function drawThumbs() {
    var el = $('#a-thumbs'); if (!el) return;
    el.innerHTML = ST.photos.map(function (p, i) { return '<div style="' + bg(p) + '"><button type="button" data-act="rmph" data-i="' + i + '" aria-label="remove">×</button></div>'; }).join('');
  }

  document.addEventListener('click', function (e) {
    var m = $('#modal'); if (e.target === m) return closeModal();
    var a = e.target.closest('[data-act]'); if (!a) return;
    if (a.tagName === 'A' && a.getAttribute('href')) return;
    var fn = actions[a.dataset.act]; if (fn) { e.stopPropagation(); fn(a, e); }
  });

  document.addEventListener('change', function (e) {
    var el = e.target, id = el.id;
    if (id === 'f-district' || id === 'a-district') { var pre = id.charAt(0), tree = S.locTree(); fillSel('#' + pre + '-block', Object.keys(tree[el.value] || {}), t('select')); setMouza(pre); }
    else if (id === 'f-block' || id === 'a-block') setMouza(id.charAt(0));
    else if (el.name === 'type' && $('#a-pl')) $('#a-pl').innerHTML = esc(el.value === 'rent' ? t('perMonthLbl') : t('priceLbl')) + ' (' + esc(S.settings().currency) + ') <i>*</i>';
    else if (id === 'a-photos') {
      var files = [].slice.call(el.files).slice(0, 5 - ST.photos.length);
      if (!files.length) return;
      toast(t('uploading'));
      Promise.all(files.map(function (f) { return S.compressImage(f, 900, 0.62); })).then(function (arr) { ST.photos = ST.photos.concat(arr).slice(0, 5); drawThumbs(); el.value = ''; }).catch(function () { toast(t('fillAll'), true); });
    } else if (id === 'p-photo' && el.files[0]) {
      S.compressImage(el.files[0], 240, 0.7).then(function (d) { ST.newPhoto = d; $('#p-av').innerHTML = '<img alt="" src="' + d + '">'; });
    }
  });
  document.addEventListener('reset', function (e) { if (e.target.dataset.form === 'adv') setTimeout(function () { fillSel('#f-block', [], t('select')); fillSel('#f-mouza', [], t('select')); }, 0); });

  var forms = {
    homesearch: function (f, d) { go(qh('#/list', new URLSearchParams(''), { q: String(d.get('q') || '').trim() })); },
    listsearch: function (f, d) { var h = location.hash.slice(1), i = h.indexOf('?'); go(qh('#/list', new URLSearchParams(i < 0 ? '' : h.slice(i + 1)), { q: String(d.get('q') || '').trim() })); },
    adv: function (f, d) {
      var pr = String(d.get('pr') || '').split('-');
      go(qh('#/list', new URLSearchParams(''), { dist: d.get('dist'), block: d.get('block'), mouza: d.get('mouza'), min: +pr[0] || '', max: +pr[1] || '', land: d.get('land') }));
    },
    login: function (f, d) {
      var id = String(d.get('id')).trim(), pass = d.get('pass'), idl = id.toLowerCase();
      var u = S.users.where(function (x) { return (x.mobile && last10(x.mobile) === last10(id) && digits(id).length >= 10) || (x.email && x.email.toLowerCase() === idl); })[0];
      if (!u || u.passHash !== S.hash(pass)) return toast(t('wrongCred'), true);
      if (u.status === 'blocked') return toast(t('blocked'), true);
      setSess(u.id, !!d.get('rem')); toast(t('loginOk')); var r = ST.redirect || '#/home'; ST.redirect = null; go(r);
    },
    signup: function (f, d) {
      if (!S.settings().allowRegistration) return toast(t('regClosed'), true);
      var name = String(d.get('name')).trim(), mob = digits(d.get('mobile')), pass = String(d.get('pass'));
      if (!name) return toast(t('fillAll'), true);
      if (mob.length < 10 || mob.length > 13) return toast(t('invalidMobile'), true);
      if (pass.length < 6) return toast(t('passShort'), true);
      if (S.users.where(function (x) { return x.mobile && last10(x.mobile) === last10(mob); }).length) return toast(t('mobileUsed'), true);
      var u = S.users.add({ name: name, mobile: mob, email: String(d.get('email') || '').trim(), address: String(d.get('address') || '').trim(), passHash: S.hash(pass), photo: '', planId: 'free', planExpiry: null, status: 'active', favs: [] });
      setSess(u.id, true); toast(t('regOk')); var r = ST.redirect || '#/home'; ST.redirect = null; go(r);
    },
    reset: function (f, d) {
      var u = S.users.where(function (x) { return x.mobile && last10(x.mobile) === last10(d.get('mobile')) && x.email && x.email.toLowerCase() === String(d.get('email')).trim().toLowerCase(); })[0];
      if (!u) return toast(t('resetFail'), true);
      if (String(d.get('pass')).length < 6) return toast(t('passShort'), true);
      S.users.update(u.id, { passHash: S.hash(d.get('pass')) }); closeModal(); toast(t('resetOk'));
    },
    add: function (f, d) {
      var u = user(); if (!u) return needLogin('#/add');
      var pl = S.planOf(u); if (pl.postLimit >= 0 && S.postCountOf(u) >= pl.postLimit) return toast(t('limitReached'), true);
      var title = String(d.get('title')).trim(), price = +d.get('price');
      if (!title || !d.get('district') || !(price > 0)) return toast(t('needTitle'), true);
      if (!ST.photos.length) return toast(t('photos'), true);
      var s = S.settings(), type = d.get('type');
      var p = S.posts.add({ title: title, type: type, cat: d.get('cat'), price: price, unit: type === 'rent' ? 'month' : '', area: String(d.get('area') || '').trim(), district: d.get('district'), block: d.get('block') || '', mouza: String(d.get('mouza') || '').trim(), details: String(d.get('details') || '').trim(), images: ST.photos.slice(), mobile: String(d.get('mobile')).trim(), ownerId: u.id, ownerName: u.name, status: s.requireApproval ? 'pending' : 'live', verified: false, featured: false, views: 0, art: Math.floor(Math.random() * 9) + 1 });
      if (!S.posts.find(p.id)) return;
      toast(s.requireApproval ? t('postedPending') : t('postedLive')); ST.photos = []; go('#/myads');
    },
    utr: function (f, d) {
      var u = user(); if (!u) return needLogin(); var p = S.plans.find(d.get('plan')), utr = String(d.get('utr')).trim().toUpperCase();
      if (!/^[A-Z0-9]{8,30}$/.test(utr)) return toast(t('utrBad'), true);
      if (S.payments.where(function (x) { return x.utr === utr; }).length) return toast(t('utrUsed'), true);
      if (S.payments.where(function (x) { return x.userId === u.id && x.planId === p.id && x.status === 'pending'; }).length) return toast(t('payExists'), true);
      S.payments.add({ userId: u.id, userName: u.name, mobile: u.mobile, planId: p.id, planName: p.name, amount: p.price, utr: utr, status: 'pending' });
      delete ST.payEnd[p.id]; closeModal(); toast(t('paySent')); go('#/history');
    },
    report: function (f, d) {
      var u = user(), p = S.posts.find(d.get('id')); if (!u || !p) return;
      S.reports.add({ postId: p.id, postTitle: p.title, userId: u.id, userName: u.name, reason: d.get('reason'), note: String(d.get('note') || '').trim(), status: 'open' });
      closeModal(); toast(t('reported'));
    },
    profile: function (f, d) {
      var u = user(); if (!u) return; var patch = { name: String(d.get('name')).trim(), email: String(d.get('email') || '').trim(), address: String(d.get('address') || '').trim() };
      if (!patch.name) return toast(t('fillAll'), true);
      if (ST.newPhoto) patch.photo = ST.newPhoto;
      S.users.update(u.id, patch); toast(t('saved')); render(true);
    },
    chpass: function (f, d) {
      var u = user(); if (!u) return;
      if (u.passHash !== S.hash(d.get('old'))) return toast(t('passWrong'), true);
      if (String(d.get('new')).length < 6) return toast(t('passShort'), true);
      S.users.update(u.id, { passHash: S.hash(d.get('new')) }); f.reset(); toast(t('passChanged'));
    },
    contact: function (f, d) {
      S.messages.add({ name: String(d.get('name')).trim(), mobile: String(d.get('mobile')).trim(), text: String(d.get('text')).trim(), read: false, userId: (user() || {}).id || null });
      f.reset(); toast(t('msgSent'));
    }
  };
  document.addEventListener('submit', function (e) {
    var f = e.target, fn = forms[f.dataset.form]; if (!fn) return;
    e.preventDefault(); fn(f, new FormData(f));
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && ST.awaitPay && ST.route === 'pay' && !$('#modal.open')) { var id = ST.awaitPay; ST.awaitPay = null; actions.paid({ dataset: { id: id } }); }
  });
  window.addEventListener('hashchange', function () { closeModal(); render(); });
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf('vsk_') !== 0) return;
    var live = ['home', 'list', 'post', 'menu', 'favs', 'myads', 'plans', 'history'];
    var ae = document.activeElement;
    if (live.indexOf(ST.route) >= 0 && !(ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) && !$('#modal.open')) render(true);
  });

  /* ---------- start ---------- */
  (function boot() {
    var s = S.settings();
    $('#splash').innerHTML = S.logo(120) + '<h1>' + esc(appName()) + '</h1><p>' + esc(t('appTag')) + '</p><div class="pin">' + ic('pin').replace('class="i"', 'class="i" style="width:44px;height:44px"') + '</div><div class="pill">' + esc(t('splashTags')) + '</div>';
    document.documentElement.setAttribute('data-theme', ST.theme);
    render();
    setTimeout(function () { $('#splash').classList.add('hide'); }, 1500);
  })();
})();
