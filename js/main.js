/* Prestige Sector 150 — site interactions (plain JavaScript + GSAP) */
(function () {
  'use strict'

  // ---------- Config ----------
  var CONTACT = { whatsapp: '+918010009002' }
  var WHATSAPP_MESSAGE = "Hi, I'm interested in the project. Please share the latest project details and pricing."
  var WHATSAPP_URL = 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE)

  var ICON = {
    X: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    Menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>',
    ArrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
    ArrowUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up" aria-hidden="true"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>',
    ArrowDown: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down" aria-hidden="true"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>',
    Check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>',
    ChevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>',
    ChevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>',
    ZoomIn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line><line x1="11" x2="11" y1="8" y2="14"></line><line x1="8" x2="14" y1="11" y2="11"></line></svg>',
    ZoomOut: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-out" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line><line x1="8" x2="14" y1="11" y2="11"></line></svg>',
    Download: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>'
  }

  var $ = function (sel, root) { return (root || document).querySelector(sel) }
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)) }
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var mq = function (q) { return window.matchMedia(q).matches }
  var reduceMotion = function () { return mq('(prefers-reduced-motion: reduce)') }
  var hasGsap = typeof window.gsap !== 'undefined'

  var root = $('.site-shell')
  var leadTemplate = $('.final-cta .lead-card').cloneNode(true) // pristine enquiry form markup
  var enquiryInterest = 'Not Sure'
  var overlay = null // currently open modal backdrop / lightbox

  // ---------- Page loader ----------
  requestAnimationFrame(function () { var l = $('.page-loader'); if (l) l.remove() })

  // ---------- Header: scrolled state ----------
  var nav = $('.site-nav')
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 24) }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  // ---------- Mobile menu ----------
  var menuButton = $('.menu-button')
  var mobileNav = $('.mobile-nav')
  var menuOpen = false
  function setMenu(open) {
    menuOpen = open
    mobileNav.classList.toggle('is-open', open)
    mobileNav.setAttribute('aria-hidden', String(!open))
    $$('a, button', mobileNav).forEach(function (el) { el.tabIndex = open ? 0 : -1 })
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    menuButton.innerHTML = open ? ICON.X : ICON.Menu
  }
  menuButton.addEventListener('click', function () { setMenu(!menuOpen) })
  $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false) }) })
  var mobileEnquire = $('.mobile-nav-actions button', mobileNav)
  if (mobileEnquire) mobileEnquire.addEventListener('click', function () { setMenu(false); openEnquiry('Not Sure') })

  // ---------- Modals ----------
  function lockScroll(lock) { document.body.style.overflow = lock ? 'hidden' : '' }

  function animateIn(backdrop, panel) {
    if (!hasGsap || reduceMotion()) return
    gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(panel, { autoAlpha: 0, y: 10, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
  }

  function closeModal() {
    if (!overlay) return
    overlay.remove()
    overlay = null
    lockScroll(false)
  }

  // backdropClass: 'modal-backdrop' | 'gallery-lightbox'
  function openModal(html, backdropClass) {
    closeModal()
    var backdrop = document.createElement('div')
    backdrop.className = backdropClass || 'modal-backdrop'
    backdrop.setAttribute('role', 'presentation')
    backdrop.innerHTML = html
    var panel = backdrop.firstElementChild
    backdrop.addEventListener('click', closeModal)
    panel.addEventListener('click', function (e) { e.stopPropagation() })
    $$('.modal-close', panel).forEach(function (b) { b.addEventListener('click', closeModal) })
    root.appendChild(backdrop)
    overlay = backdrop
    lockScroll(true)
    animateIn(backdrop, panel)
    return panel
  }

  // Enquiry modal
  function openEnquiry(interest) {
    if (interest) enquiryInterest = interest
    var panel = openModal('<div class="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button class="modal-close" aria-label="Close enquiry form">' + ICON.X + '</button><h2 id="enquiry-title">GET PROJECT <span>DETAILS</span></h2></div>')
    var card = leadTemplate.cloneNode(true)
    panel.appendChild(card)
    setupLeadCard(card, enquiryInterest)
  }

  // Floor plan modal
  function openFloorPlan(plan) {
    var panel = openModal('<div class="floor-modal" role="dialog" aria-modal="true" aria-labelledby="floor-modal-title"><button class="modal-close" aria-label="Close floor plan">' + ICON.X + '</button><span class="section-kicker">FLOOR PLAN</span><h2 id="floor-modal-title">' + esc(plan) + '</h2><div class="modal-plan-placeholder"><span>FLOOR PLAN IMAGE</span><small>Actual layout shared by our property advisor</small></div><div class="modal-tools"><button aria-label="Zoom out">' + ICON.ZoomOut + '</button><span>100%</span><button aria-label="Zoom in">' + ICON.ZoomIn + '</button><button class="download-button">' + ICON.Download + ' Download Floor Plan</button></div><div class="modal-actions"><button class="button button-accent">Get Price Details</button><button class="button button-outline">Schedule Site Visit</button></div></div>')
    $$('.modal-actions .button', panel).forEach(function (b) { b.addEventListener('click', function () { openEnquiry() }) })
  }

  // Amenity modal
  function openAmenity(card, index) {
    var img = $('img', card).getAttribute('src')
    var title = $('h3', card).textContent
    var text = $('p', card).textContent
    var num = String(index + 1).padStart(2, '0')
    openModal('<div class="amenity-modal" role="dialog" aria-modal="true" aria-labelledby="amenity-modal-title"><button class="modal-close" aria-label="Close amenity details">' + ICON.X + '</button><img src="' + esc(img) + '" alt=""><div><span class="section-kicker">AMENITY ' + num + '</span><h2 id="amenity-modal-title">' + esc(title) + '</h2><p>' + esc(text) + '</p></div></div>')
  }

  // Masterplan modal
  function openMasterplan() {
    var img = $('.masterplan-card .masterplan-placeholder img').getAttribute('src')
    var panel = openModal('<div class="masterplan-modal" role="dialog" aria-modal="true" aria-labelledby="masterplan-title"><button class="modal-close" aria-label="Close masterplan">' + ICON.X + '</button><div class="masterplan-placeholder"><img src="' + esc(img) + '" alt="Project overview"><small>Project overview</small></div><span class="section-kicker">PROJECT MASTERPLAN</span><h2 id="masterplan-title">Explore the plan</h2><button class="button button-accent">Get Project Details ' + ICON.ArrowRight + '</button></div>')
    $('.button-accent', panel).addEventListener('click', function () { openEnquiry() })
  }

  // Gallery lightbox
  var galleryTiles = $$('.gallery-tile')
  var galleryItems = galleryTiles.map(function (t) {
    return { image: $('img', t).getAttribute('src'), title: $('strong', t).textContent }
  })
  function pad(n) { return String(n).padStart(2, '0') }
  function renderLightbox(panel, index) {
    var item = galleryItems[index]
    var img = $('img', panel)
    img.src = item.image
    img.alt = item.title
    $('.gallery-lightbox-meta strong', panel).textContent = item.title
    $('.gallery-lightbox-meta small', panel).textContent = pad(index + 1) + ' / ' + pad(galleryItems.length)
  }
  function openGallery(index) {
    var current = index
    var panel = openModal('<div class="gallery-lightbox-inner" role="dialog" aria-modal="true" aria-label="Project gallery"><button class="modal-close" aria-label="Close gallery">' + ICON.X + '</button><img src="" alt=""><div class="gallery-lightbox-meta"><div><strong></strong></div><small></small></div><button class="gallery-arrow gallery-prev" aria-label="Previous image">' + ICON.ChevronLeft + '</button><button class="gallery-arrow gallery-next" aria-label="Next image">' + ICON.ChevronRight + '</button></div>', 'gallery-lightbox')
    renderLightbox(panel, current)
    $('.gallery-prev', panel).addEventListener('click', function () { current = (current - 1 + galleryItems.length) % galleryItems.length; renderLightbox(panel, current) })
    $('.gallery-next', panel).addEventListener('click', function () { current = (current + 1) % galleryItems.length; renderLightbox(panel, current) })
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return
    setMenu(false)
    closeModal()
  })

  // ---------- Enquiry form ----------
  function setupLeadCard(card, interest) {
    var form = $('form', card)
    var select = $('select[name="interest"]', form)
    if (interest !== undefined) {
      select.value = interest
      if (select.value !== interest) select.value = '' // unmatched -> "Select an option"
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var data = new FormData(form)
      var errors = {}
      var name = String(data.get('name') || '').trim()
      var phone = String(data.get('phone') || '').replace(/[\s-]/g, '')
      if (!name) errors.name = 'Please enter your name.'
      if (!/^(\+?91)?[6-9]\d{9}$/.test(phone)) errors.phone = 'Please enter a valid Indian phone number.'
      if (!data.get('interest')) errors.interest = 'Please select a configuration.'

      $$('.field-error', form).forEach(function (el) { el.remove() })
      ;['name', 'phone', 'interest'].forEach(function (field) {
        var input = form.elements[field]
        var label = input.closest('label')
        if (field !== 'interest') input.setAttribute('aria-invalid', String(Boolean(errors[field])))
        if (errors[field]) label.insertAdjacentHTML('afterend', '<small class="field-error">' + errors[field] + '</small>')
      })
      if (Object.keys(errors).length) return

      var success = document.createElement('div')
      success.className = 'lead-success'
      success.innerHTML = ICON.Check + '<span class="section-kicker">ENQUIRY RECEIVED</span><h3>Thank you</h3><p>Your enquiry has been received. A property advisor will contact you with the requested project information.</p><div class="lead-success-actions"><a class="button button-accent" href="' + esc(WHATSAPP_URL) + '">WhatsApp Us</a><a class="button button-outline" href="#top">Back to Website</a></div>'
      card.replaceWith(success)
    })
  }
  setupLeadCard($('.final-cta .lead-card'))

  // ---------- Buttons that open the enquiry form ----------
  // Hero buttons, inline links and footer "Enquire" reset the interest to "Not Sure"
  $$('.hero-actions a.button, a.inline-link[href="#"], .footer-links a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); openEnquiry('Not Sure') })
  })
  var navVisit = $('.nav-visit')
  if (navVisit) navVisit.addEventListener('click', function () { openEnquiry('Site Visit') })
  // CTA strips keep the last selected interest
  $$('.pricing-cta .button, .amenities-cta .button, .gallery-cta .button, .location-cta .button, .developer-cta .button').forEach(function (b) {
    b.addEventListener('click', function () { openEnquiry() })
  })
  var finalCta = $$('.final-cta-actions button')
  finalCta.forEach(function (b) {
    b.addEventListener('click', function () { openEnquiry(b.classList.contains('button-white') ? 'Site Visit' : 'Not Sure') })
  })

  // Configuration cards
  $$('.pc-card').forEach(function (card) {
    var title = $('h3', card).textContent
    $('.configuration-actions .button-accent', card).addEventListener('click', function () { openEnquiry(title) })
    $('.configuration-actions .button-outline', card).addEventListener('click', function () { openFloorPlan(title) })
  })
  // Price comparison rows
  $$('.pc-row:not(.pc-row-labels)').forEach(function (row) {
    var b = $('button', row)
    if (b) b.addEventListener('click', function () { openEnquiry($('strong', row).textContent) })
  })
  // Floor plan cards
  $$('.floor-plan-card').forEach(function (card) {
    var title = $('h3', card).textContent
    $$('button', card).forEach(function (b) { b.addEventListener('click', function () { openEnquiry(title) }) })
  })

  // Amenities
  $$('.amenity-card').forEach(function (card, i) { card.addEventListener('click', function () { openAmenity(card, i) }) })

  // Masterplan
  var mpButton = $('.masterplan-card .button-outline')
  if (mpButton) mpButton.addEventListener('click', openMasterplan)

  // Gallery tiles open the lightbox
  galleryTiles.forEach(function (tile, i) { tile.addEventListener('click', function () { openGallery(i) }) })

  // Gallery slider: swipe / arrows / progress, gentle autoplay that pauses on interaction
  var track = $('.gallery-slider .gallery-grid')
  if (track) {
    var prevBtn = $('.gallery-slider-prev')
    var nextBtn = $('.gallery-slider-next')
    var bar = $('.gallery-slider-progress span')
    var count = $('.gallery-slider-count')
    var visibleTiles = function () { return galleryTiles.filter(function (t) { return !t.hidden }) }
    var gapPx = function () { return parseFloat(getComputedStyle(track).columnGap) || 0 }
    var step = function () { var t = visibleTiles()[0]; return t ? t.offsetWidth + gapPx() : track.clientWidth }
    var perView = function () { return Math.max(1, Math.round((track.clientWidth + gapPx()) / step())) }
    var lastIndex = function () { return Math.max(0, visibleTiles().length - perView()) }
    var currentIndex = function () { return Math.min(lastIndex(), Math.round(track.scrollLeft / step())) }
    var maxScroll = function () { return track.scrollWidth - track.clientWidth }
    var updateSlider = function () {
      var total = visibleTiles().length
      var i = currentIndex()
      var pv = Math.min(perView(), total)
      var atEnd = track.scrollLeft >= maxScroll() - 2
      var first = atEnd ? Math.max(1, total - pv + 1) : i + 1
      var last = Math.min(total, first + pv - 1)
      count.textContent = pad(first) + (last > first ? '–' + pad(last) : '') + ' / ' + pad(total)
      bar.style.width = (total ? (last / total) * 100 : 100) + '%'
      prevBtn.disabled = track.scrollLeft <= 2
    }
    var goTo = function (i) {
      var tiles = visibleTiles()
      if (!tiles.length) return
      i = Math.max(0, Math.min(lastIndex(), i))
      track.scrollTo({ left: tiles[i].offsetLeft - tiles[0].offsetLeft, behavior: reduceMotion() ? 'auto' : 'smooth' })
    }
    var go = function (dir) {
      var atEnd = track.scrollLeft >= maxScroll() - 2
      if (dir > 0 && atEnd) goTo(0)
      else goTo(currentIndex() + dir)
    }
    prevBtn.addEventListener('click', function () { go(-1); restartAuto() })
    nextBtn.addEventListener('click', function () { go(1); restartAuto() })
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); restartAuto() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); restartAuto() }
    })
    track.addEventListener('scroll', updateSlider, { passive: true })
    window.addEventListener('resize', updateSlider)
    var autoTimer = null
    var paused = false
    var restartAuto = function () {
      clearInterval(autoTimer)
      if (reduceMotion()) return
      autoTimer = setInterval(function () { if (!paused && !document.hidden && !overlay) go(1) }, 4500)
    }
    var slider = $('.gallery-slider')
    slider.addEventListener('mouseenter', function () { paused = true })
    slider.addEventListener('mouseleave', function () { paused = false })
    slider.addEventListener('focusin', function () { paused = true })
    slider.addEventListener('focusout', function () { paused = false })
    track.addEventListener('touchstart', function () { paused = true; clearTimeout(slider._resume) }, { passive: true })
    track.addEventListener('touchend', function () { slider._resume = setTimeout(function () { paused = false }, 6000) }, { passive: true })
    updateSlider()
    restartAuto()
  }

  // Single-image viewer: other content images open full-size with a close button
  function openImage(src, title) {
    var panel = openModal('<div class="gallery-lightbox-inner" role="dialog" aria-modal="true" aria-label="Image viewer"><button class="modal-close" aria-label="Close image">' + ICON.X + '</button><img src="' + esc(src) + '" alt="' + esc(title) + '">' + (title ? '<div class="gallery-lightbox-meta"><div><strong>' + esc(title) + '</strong></div></div>' : '') + '</div>', 'gallery-lightbox')
    return panel
  }
  $$('.overview-card img').forEach(function (img) {
    img.classList.add('is-zoomable')
    img.setAttribute('tabindex', '0')
    img.setAttribute('role', 'button')
    var open = function () { openImage(img.getAttribute('src'), img.getAttribute('alt')) }
    img.addEventListener('click', open)
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } })
  })

  // ---------- FAQ accordion (one open at a time) ----------
  var faqItems = $$('.faq-item')
  faqItems.forEach(function (item) {
    $('button', item).addEventListener('click', function () {
      var willOpen = $('p', item).hidden
      faqItems.forEach(function (other) {
        var open = other === item && willOpen
        $('p', other).hidden = !open
        $('button', other).setAttribute('aria-expanded', String(open))
        $('button svg', other).classList.toggle('rotate', open)
      })
    })
  })

  // ---------- Footer disclaimer ----------
  var discToggle = $('.footer-disclaimer-toggle')
  if (discToggle) {
    discToggle.addEventListener('click', function () {
      var p = $('#footer-disclaimer')
      var expanded = !p.classList.contains('is-expanded')
      p.classList.toggle('is-expanded', expanded)
      discToggle.setAttribute('aria-expanded', String(expanded))
      discToggle.innerHTML = (expanded ? 'Read less' : 'Read more') + ' ' + (expanded ? ICON.ArrowUp : ICON.ArrowDown)
    })
  }

  // ---------- Button click ripple ----------
  document.addEventListener('click', function (e) {
    var button = e.target.closest('.button, .download-button')
    if (!button || reduceMotion()) return
    var ripple = document.createElement('span')
    ripple.className = 'click-ripple'
    var r = button.getBoundingClientRect()
    ripple.style.left = (e.clientX - r.left) + 'px'
    ripple.style.top = (e.clientY - r.top) + 'px'
    button.append(ripple)
    setTimeout(function () { ripple.remove() }, 480)
  })

  if (!hasGsap) return

  // ---------- Scroll animations (GSAP) ----------
  gsap.registerPlugin(ScrollTrigger)
  var fadeUp = function (target, opts) { return gsap.from(target, Object.assign({ autoAlpha: 0, y: 26, duration: 0.7, ease: 'power2.out' }, opts || {})) }
  var fadeIn = function (target, opts) { return gsap.from(target, Object.assign({ autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, opts || {})) }
  var mobile = mq('(max-width: 800px)')
  var noMotion = reduceMotion()

  var revealTargets = $$('.section-pad')
    .map(function (s) { return s.querySelectorAll('.section-kicker, h2, h3, .section-title-row p, .gallery-heading p, .location-intro p, .developer-copy p') })
    .filter(function (items) { return items.length })

  if (!noMotion && mobile) {
    $$('.section-pad').forEach(function (section) {
      fadeUp(section.children, { y: 12, duration: 0.5, stagger: 0.04, scrollTrigger: { trigger: section, start: 'top 88%', once: true } })
    })
  }
  if (!noMotion && !mobile) {
    var all = []
    revealTargets.forEach(function (items) { all = all.concat(Array.prototype.slice.call(items)) })
    gsap.set(all, { autoAlpha: 0, y: 24 })
    revealTargets.forEach(function (items) {
      gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: 0.06, scrollTrigger: { trigger: items[0].closest('.section-pad'), start: 'top 80%', once: true } })
    })
    $$('.pc-card, .pc-table, .floor-plan-card, .amenity-gallery > *, .connectivity-card, .location-highlight, .gallery-slider, .trust-points > div, .contact-details > div').forEach(function (group) {
      fadeUp(group, { scale: group.matches('.floor-plan-card') ? 0.97 : 1, duration: 0.65, scrollTrigger: { trigger: group.parentElement, start: 'top 82%', once: true }, stagger: 0.1 })
    })
    fadeUp('.developer-image-wrap', { x: -35, duration: 0.8, scrollTrigger: { trigger: '.developer-trust', start: 'top 78%', once: true } })
    fadeUp('.developer-copy', { x: 35, duration: 0.8, scrollTrigger: { trigger: '.developer-trust', start: 'top 78%', once: true } })
    fadeUp('.final-cta-copy, .lead-card', { duration: 0.75, stagger: 0.1, scrollTrigger: { trigger: '.final-cta', start: 'top 80%', once: true } })
    fadeIn('.floating-contact-actions a', { x: 15, stagger: 0.08, delay: 0.2 })
    fadeUp('.hero-content > *', { duration: 0.65, stagger: 0.08, delay: 0.2 })
    fadeIn('.site-nav', { y: -16, duration: 0.5 })
  }
  gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true } })
})()

// Hero slider: crossfade between hero images every 5s, with clickable dots.
;(function () {
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots button');
  if (slides.length < 2) return;
  var current = 0;
  var timer;
  function show(i) {
    slides[current].classList.remove('is-active');
    dots[current] && dots[current].removeAttribute('aria-current');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current] && dots[current].setAttribute('aria-current', 'true');
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(function () { show(current + 1); }, 5000);
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { show(i); start(); });
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearInterval(timer); else start();
  });
  start();
})();
