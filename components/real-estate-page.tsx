'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fadeIn, fadeUp } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Download, LockKeyhole, Menu, X, ZoomIn, ZoomOut, MapPin, Navigation, Train, Route, Plane, School, Hospital, ShoppingBag, Trees } from 'lucide-react'

const CONTACT_INFO = {
  phone: '+919800001645',
  phoneDisplay: '+91 9800001645',
  whatsapp: '+918010009002',
  whatsappDisplay: '+91 8010009002',
  email: 'bhavya.tierravista@gmail.com',
  hours: 'Monday – Sunday: 10:00 AM – 7:00 PM',
}
const WHATSAPP_MESSAGE = "Hi, I'm interested in the project. Please share the latest project details and pricing."
const openEnquiry = (setInterest: (interest: string) => void, setOpen: (open: boolean) => void, interest = 'Not Sure') => { setInterest(interest); setOpen(true) }

const images = {
  hero: '/uploads/hero%20Image.webp',
  home: '/uploads/residence%20preview.webp',
  pool: '/uploads/Swimming-Wellness-Centre.webp',
  gym: '/uploads/Gymnasium.webp',
  overview: '/uploads/project%20overview.webp',
  second: '/uploads/second%20image.webp',
  developer: '/uploads/prestige%20Group.webp',
  clubhouse: '/uploads/Clubhouse.webp',
  cricket: '/uploads/Cricket-Academy.webp',
  greenSpaces: '/uploads/Extensive-Landscaped-Green-Spaces.webp',
  sportsHall: '/uploads/Indoor-Multipurpose-Sports-Hall.webp',
  joggingTrack: '/uploads/Jogging-Track.webp',
  playfield: '/uploads/Multipurpose-Playfield.webp',
  callIcon: '/uploads/icons8-call.gif',
  whatsappIcon: '/uploads/icons8-whatsapp.gif',
  floorPlan3Bhk: '/uploads/3BHK%20floor%20plan.png',
  floorPlan4Bhk: '/uploads/4BHK%20floor%20plan.png',
}

const connectivity = [
  { category: 'METRO', destination: 'Sector 148 Metro', icon: <Train /> },
  { category: 'EXPRESSWAY', destination: 'Noida-Greater Noida Expressway', icon: <Route /> },
  { category: 'YAMUNA EXPRESSWAY', destination: 'Yamuna Expressway', icon: <Route /> },
  { category: 'DELHI', destination: 'DND Flyway', icon: <Navigation /> },
  { category: 'AIRPORT', destination: 'Noida International Airport', icon: <Plane /> },
  { category: 'SCHOOLS', destination: 'Nearby educational institutions', icon: <School /> },
  { category: 'HOSPITALS', destination: 'Nearby healthcare facilities', icon: <Hospital /> },
  { category: 'SHOPPING', destination: 'Major malls and retail destinations', icon: <ShoppingBag /> },
]

const benefits = ['Project information on request', '3 & 4 BHK residences', 'Planned lifestyle spaces', 'Site visit assistance']
const faqs = ['What is the starting price?', 'Which configurations are available?', 'When is possession?', 'How do I book a site visit?']
const galleryFilters = ['ALL', 'EXTERIOR', 'RESIDENCES', 'AMENITIES', 'LANDSCAPE', 'MASTERPLAN']
const pricingRows = [
  { type: '2 BHK', area: '1,300 – 1,600 Sq. Ft.', price: '₹ 2.34 Cr*' },
  { type: '3 BHK + 2 Toilets', area: '1,700 – 1,900 Sq. Ft.', price: '₹ 3.06 Cr*' },
  { type: '3 BHK + 3 Toilets', area: '2,000 – 2,200 Sq. Ft.', price: '₹ 3.60 Cr*' },
  { type: '3 BHK + 4 Toilets + Maid Room', area: '2,400 – 2,600 Sq. Ft.', price: '₹ 4.32 Cr*' },
  { type: '4 BHK + 5 Toilets + Maid Room', area: '3,200 – 3,350 Sq. Ft.', price: '₹ 5.76 Cr*' },
]
const galleryImages = [
  { title: 'Project View', category: 'EXTERIOR', size: 'feature', image: images.hero },
  { title: 'Residence Preview', category: 'RESIDENCES', size: 'small', image: images.home },
  { title: 'Swimming Pool', category: 'AMENITIES', size: 'small', image: images.pool },
  { title: 'Project Overview', category: 'MASTERPLAN', size: 'wide', image: images.overview },
  { title: 'Planned Green Spaces', category: 'LANDSCAPE', size: 'small', image: images.greenSpaces },
  { title: 'Community Spaces', category: 'AMENITIES', size: 'small', image: images.clubhouse },
  { title: 'Sports Hall', category: 'AMENITIES', size: 'small', image: images.sportsHall },
  { title: 'Multipurpose Playfield', category: 'LANDSCAPE', size: 'small', image: images.playfield },
  { title: 'Cricket Academy', category: 'AMENITIES', size: 'small', image: images.cricket },
  { title: 'Jogging Track', category: 'LANDSCAPE', size: 'small', image: images.joggingTrack },
  { title: 'Second Project View', category: 'EXTERIOR', size: 'wide', image: images.second },
]
const experienceSteps = [
  { number: '01', title: 'ARRIVE', text: 'A welcoming entrance and thoughtfully planned surroundings.' },
  { number: '02', title: 'LIVE', text: 'Homes designed around everyday family living.' },
  { number: '03', title: 'CONNECT', text: 'Spaces that bring residents, recreation and community together.' },
]

type AmenityItem = { title: string; text: string; image: string; icon: string }
const amenities: AmenityItem[] = [
  { title: 'Swimming Pool', text: 'A dedicated space for relaxation and recreation.', image: images.pool, icon: '01' },
  { title: 'Clubhouse', text: 'Planned spaces to gather, unwind and connect.', image: images.clubhouse, icon: '02' },
  { title: 'Gymnasium', text: 'A dedicated space for everyday fitness and wellbeing.', image: images.gym, icon: '03' },
  { title: 'Sports Facilities', text: 'Active spaces for play, movement and family time.', image: images.sportsHall, icon: '04' },
  { title: "Kids' Play Area", text: 'A cheerful setting for play and discovery.', image: images.playfield, icon: '05' },
  { title: 'Landscaped Gardens', text: 'Green open spaces for everyday pauses.', image: images.greenSpaces, icon: '06' },
  { title: 'Amphitheatre', text: 'An inviting outdoor space for community moments.', image: images.cricket, icon: '07' },
]

export function RealEstatePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'3 BHK' | '4 BHK' | null>(null)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [enquiryInterest, setEnquiryInterest] = useState('Not Sure')
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityItem | null>(null)
  const [galleryFilter, setGalleryFilter] = useState('ALL')
  const [selectedGallery, setSelectedGallery] = useState<number | null>(null)
  const [masterplanOpen, setMasterplanOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pageRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const cursorRingRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsLoading(false))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useLayoutEffect(() => {
    const root = pageRef.current
    if (!root) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 800px)').matches
    const context = gsap.context(() => {
      const revealSections = gsap.utils.toArray<HTMLElement>('.section-pad')
      const revealTargets = revealSections.map((section) => section.querySelectorAll('.section-kicker, h2, h3, .section-title-row p, .gallery-heading p, .location-intro p, .developer-copy p')).filter((items) => items.length)
      if (!reduceMotion && mobile) {
        gsap.utils.toArray<HTMLElement>('.section-pad').forEach((section) => fadeUp(gsap, section.children, { y: 12, duration: .5, stagger: .04, scrollTrigger: { trigger: section, start: 'top 88%', once: true } }))
      }
      if (!reduceMotion && !mobile) {
        gsap.set(revealTargets.flatMap((items) => Array.from(items)), { autoAlpha: 0, y: 24 })
        revealTargets.forEach((items) => gsap.to(items, { autoAlpha: 1, y: 0, duration: .75, ease: 'power2.out', stagger: .06, scrollTrigger: { trigger: items[0].closest('.section-pad'), start: 'top 80%', once: true } }))
        gsap.utils.toArray<HTMLElement>('.configuration-card, .floor-plan-card, .amenity-gallery > *, .connectivity-card, .location-highlight, .gallery-tile, .trust-points > div, .contact-details > div').forEach((group) => fadeUp(gsap, group, { scale: group.matches('.floor-plan-card, .gallery-tile') ? .97 : 1, duration: .65, scrollTrigger: { trigger: group.parentElement, start: 'top 82%', once: true }, stagger: .1 }))
        fadeUp(gsap, '.developer-image-wrap', { x: -35, duration: .8, scrollTrigger: { trigger: '.developer-trust', start: 'top 78%', once: true } })
        fadeUp(gsap, '.developer-copy', { x: 35, duration: .8, scrollTrigger: { trigger: '.developer-trust', start: 'top 78%', once: true } })
        fadeUp(gsap, '.final-cta-copy, .lead-card', { duration: .75, stagger: .1, scrollTrigger: { trigger: '.final-cta', start: 'top 80%', once: true } })
        fadeIn(gsap, '.floating-contact-actions a', { x: 15, stagger: .08, delay: .2 })
        if (!mobile) {
          gsap.fromTo('.hero', { backgroundSize: '105%' }, { backgroundSize: '100%', duration: 1.2, ease: 'power2.out' })
          fadeUp(gsap, '.hero-content > *', { duration: .65, stagger: .08, delay: .2 })
          fadeIn(gsap, '.site-nav', { y: -16, duration: .5 })
        }
      }
      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true } })
    }, root)
    return () => context.revert()
  }, [])

  useEffect(() => {
    const canUseCursor = window.matchMedia('(pointer: fine) and (min-width: 801px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canUseCursor || reduceMotion || !cursorRef.current || !cursorRingRef.current) return
    const moveX = gsap.quickTo(cursorRef.current, 'x', { duration: 0.12, ease: 'power2.out' })
    const moveY = gsap.quickTo(cursorRef.current, 'y', { duration: 0.12, ease: 'power2.out' })
    const ringX = gsap.quickTo(cursorRingRef.current, 'x', { duration: 0.28, ease: 'power2.out' })
    const ringY = gsap.quickTo(cursorRingRef.current, 'y', { duration: 0.28, ease: 'power2.out' })
    const onPointerMove = (event: PointerEvent) => {
      moveX(event.clientX)
      moveY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }
    const onPointerOver = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('a, button')) cursorRingRef.current?.classList.add('is-hovering')
    }
    const onPointerOut = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('a, button')) cursorRingRef.current?.classList.remove('is-hovering')
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
    }
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const button = target.closest<HTMLElement>('.button, .download-button')
      if (!button || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const ripple = document.createElement('span')
      ripple.className = 'click-ripple'
      const bounds = button.getBoundingClientRect()
      ripple.style.left = `${event.clientX - bounds.left}px`
      ripple.style.top = `${event.clientY - bounds.top}px`
      button.append(ripple)
      window.setTimeout(() => ripple.remove(), 480)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useLayoutEffect(() => {
    const overlay = document.querySelector<HTMLElement>('.modal-backdrop')
    const modal = overlay?.querySelector<HTMLElement>('.enquiry-modal, .amenity-modal, .gallery-lightbox-inner, .masterplan-modal, .floor-modal')
    if (!overlay || !modal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, ease: 'power2.out' })
    gsap.fromTo(modal, { autoAlpha: 0, y: 10, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .3, ease: 'power2.out' })
  }, [selectedPlan, enquiryOpen, selectedAmenity, selectedGallery, masterplanOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setSelectedPlan(null)
      setEnquiryOpen(false)
      setSelectedAmenity(null)
      setSelectedGallery(null)
      setMasterplanOpen(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    const hasOverlay = Boolean(selectedPlan || enquiryOpen || selectedAmenity || selectedGallery !== null || masterplanOpen)
    document.body.style.overflow = hasOverlay ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedPlan, enquiryOpen, selectedAmenity, selectedGallery, masterplanOpen])

  return (
    <main className="site-shell" ref={pageRef}>
      {isLoading && <div className="page-loader" role="status" aria-label="Loading page"><span /></div>}
      <span className="cursor-dot" ref={cursorRef} aria-hidden="true" />
      <span className="cursor-ring" ref={cursorRingRef} aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
        <a className="brand" href="#top"><span>PRESTIGE</span><small>SECTOR 150 · NOIDA</small></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#overview">Highlights</a><a href="#homes">Pricing</a><a href="#homes">Floor Plans</a><a href="#amenities">Amenities</a><a href="#gallery">Gallery</a><a href="#location">Location</a></nav>
        <div className="nav-actions"><button className="nav-visit" onClick={() => { setEnquiryInterest('Site Visit'); setEnquiryOpen(true) }}>Schedule Visit</button><a className="nav-call" href={`tel:${CONTACT_INFO.phone}`}><img src={images.callIcon} alt="" /> Call Now</a></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={`mobile-nav${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>{[['Highlights','#overview'],['Pricing','#homes'],['Floor Plans','#floor-plans'],['Amenities','#amenities'],['Gallery','#gallery'],['Location','#location'],['FAQs','#faqs'],['Contact','#contact']].map(([item, href]) => <a key={item} href={href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>{item}</a>)}<div className="mobile-nav-actions"><a href={`tel:${CONTACT_INFO.phone}`} tabIndex={menuOpen ? 0 : -1}><img src={images.callIcon} alt="" /> Call Now</a><a href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`} tabIndex={menuOpen ? 0 : -1}><img src={images.whatsappIcon} alt="" /> WhatsApp</a><button onClick={() => { setMenuOpen(false); openEnquiry(setEnquiryInterest, setEnquiryOpen) }} tabIndex={menuOpen ? 0 : -1}>Get Price Details</button></div></nav>
      </header>

      <section className="hero" id="top" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,25,28,.68), rgba(8,25,28,.08) 72%), url(${images.hero})` }}>
        <div className="hero-content"><div className="hero-badge">COMING SOON</div><p className="eyebrow light"></p><h1>PRESTIGE<br /><span>SECTOR 150</span></h1><p className="hero-developer">By Prestige Group</p><div className="hero-details"><span>Sector 150, Noida</span><span>2,3 & 4 BHK Residences</span><strong>PRICE ON REQUEST</strong></div><div className="hero-actions"><a className="button button-accent" href="#" onClick={(event) => { event.preventDefault(); openEnquiry(setEnquiryInterest, setEnquiryOpen) }}>Get Price Details <ArrowRight /></a><a className="button button-white" href="#" onClick={(event) => { event.preventDefault(); openEnquiry(setEnquiryInterest, setEnquiryOpen) }}>Schedule Site Visit</a></div></div><div className="hero-scroll">Scroll to explore <span>↓</span></div>
      </section>

      <section className="trust-strip"><div><strong>14.83</strong><span>Acres development</span></div><div><strong>12</strong><span>Towers</span></div><div><strong>3 & 4 BHK</strong><span>Residences</span></div><div><strong>NOIDA</strong><span>Sector 150</span></div></section>
      <section className="quick-trust"><span><Check /> Project Information</span><span><Check /> Floor Plans</span><span><Check /> Price Details</span><span><Check /> Site Visit</span></section>

      <section className="overview section-pad" id="overview"><div className="section-kicker">A better everyday starts here</div><div className="overview-grid"><div><h2>A home that works<br /><span>for your whole family.</span></h2><p className="body-copy">Bring everyone closer with generous rooms, green views and thoughtfully planned spaces. Here, your morning walk, your child&apos;s playtime and your weekend plans all find room to happen.</p><a className="inline-link" href="#" onClick={(event) => { event.preventDefault(); openEnquiry(setEnquiryInterest, setEnquiryOpen) }}>Get the complete floor plans <ArrowRight /></a></div><div className="overview-card"><img src={images.home} alt="Bright family living room" /><div><strong>Designed for real life</strong><span>Light-filled rooms · Vastu-friendly layouts</span></div></div></div></section>

      <section className="benefits section-pad"><div className="benefit-heading"><div className="section-kicker">Why families are choosing us</div><h2>Everything you need.<br /><span>Nothing you don&apos;t.</span></h2></div><div className="benefit-list">{benefits.map((item, index) => <div key={item}><span className="benefit-number">0{index + 1}</span><Check /><strong>{item}</strong><ArrowRight /></div>)}</div></section>

      <section className="homes pricing section-pad" id="homes"><div className="section-kicker">Choose your configuration</div><div className="section-title-row"><div><h2>PRICING &amp;<br /><span>CONFIGURATIONS</span></h2></div><p>Explore available residence configurations and request the latest pricing and availability.</p></div><div className="configuration-grid"><ConfigurationCard title="3 BHK" subtitle="Spacious Family Residences" details="3 Bedrooms + Living + Dining" onPlan={() => setSelectedPlan('3 BHK')} onEnquire={() => openEnquiry(setEnquiryInterest, setEnquiryOpen, '3 BHK')} /><ConfigurationCard title="4 BHK" subtitle="Spacious Premium Residences" details="4 Bedrooms + Living + Dining" onPlan={() => setSelectedPlan('4 BHK')} onEnquire={() => openEnquiry(setEnquiryInterest, setEnquiryOpen, '4 BHK')} /></div><div className="comparison"><div className="comparison-heading"><strong>Quick price comparison</strong><span>Starting prices shown above are indicative*</span></div><div className="comparison-row comparison-labels"><span>CONFIGURATION</span><span>AREA</span><span>STARTING PRICE</span><span>ACTION</span></div>{pricingRows.map((row) => <div className="comparison-row" key={row.type}><strong>{row.type}</strong><span>{row.area}</span><span>{row.price}</span><button onClick={() => openEnquiry(setEnquiryInterest, setEnquiryOpen, row.type)}>Complete Costing Details <ArrowRight /></button></div>)}</div></section>

      <section className="floor-plans section-pad" id="floor-plans"><div className="section-kicker">Plan your space</div><div className="section-title-row"><h2>FLOOR<br /><span>PLANS</span></h2><p>Explore the planned layouts and discover a residence that fits your lifestyle.</p></div><div className="floor-plan-grid"><FloorPlanCard title="3 BHK" image={images.floorPlan3Bhk} onClick={() => openEnquiry(setEnquiryInterest, setEnquiryOpen, '3 BHK')} /><FloorPlanCard title="4 BHK" image={images.floorPlan4Bhk} onClick={() => openEnquiry(setEnquiryInterest, setEnquiryOpen, '4 BHK')} /></div><div className="pricing-cta"><div><strong>Want the Latest Price &amp; Availability?</strong><span>Get project details, pricing, floor plans and available configurations.</span></div><div className="cta-actions"><button className="button button-accent" onClick={() => setEnquiryOpen(true)}>Get Price Details <ArrowRight /></button><button className="button button-outline" onClick={() => setEnquiryOpen(true)}>Schedule Site Visit</button></div></div></section>

      {selectedPlan && <FloorPlanModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} onEnquire={() => { setSelectedPlan(null); setEnquiryOpen(true) }} />}
      {enquiryOpen && <EnquiryModal interest={enquiryInterest} onClose={() => setEnquiryOpen(false)} />}
      {selectedAmenity && <AmenityModal item={selectedAmenity} onClose={() => setSelectedAmenity(null)} />}
      {selectedGallery !== null && <GalleryModal images={galleryImages} index={selectedGallery} onClose={() => setSelectedGallery(null)} onChange={setSelectedGallery} />}
      {masterplanOpen && <MasterplanModal onClose={() => setMasterplanOpen(false)} onEnquire={() => { setMasterplanOpen(false); setEnquiryOpen(true) }} />}

      <section className="amenities section-pad" id="amenities"><div className="section-kicker light">AMENITIES &amp; LIFESTYLE</div><div className="amenities-heading"><div><h2>Everything you need<br /><span>for everyday living.</span></h2></div><p>Everything you need for a comfortable, active and connected lifestyle.</p></div><div className="amenity-gallery"><Amenity item={amenities[0]} featured onClick={() => setSelectedAmenity(amenities[0])} /><div className="amenity-side"><Amenity item={amenities[1]} onClick={() => setSelectedAmenity(amenities[1])} /><Amenity item={amenities[2]} onClick={() => setSelectedAmenity(amenities[2])} /></div><div className="amenity-mini-grid">{amenities.slice(3).map((item) => <Amenity key={item.title} item={item} onClick={() => setSelectedAmenity(item)} />)}</div></div><div className="amenities-cta"><div><strong>Want to see the project in person?</strong><span>Schedule a site visit and explore the project and its planned lifestyle spaces.</span></div><div className="cta-actions"><button className="button button-accent" onClick={() => setEnquiryOpen(true)}>Schedule Site Visit <ArrowRight /></button><button className="button button-outline" onClick={() => setEnquiryOpen(true)}>Get Price Details</button></div></div></section>

      <section className="project-gallery section-pad" id="gallery"><div className="section-kicker">EXPLORE THE PROJECT</div><div className="gallery-heading"><div><h2>See the spaces<br /><span>come together.</span></h2></div><p>Take a closer look at the architecture, residences, amenities and planned lifestyle spaces.</p></div><div className="gallery-tabs" role="tablist">{galleryFilters.map((filter) => <button key={filter} className={galleryFilter === filter ? 'active' : ''} onClick={() => setGalleryFilter(filter)} role="tab" aria-selected={galleryFilter === filter}>{filter}</button>)}</div><div className="gallery-grid">{galleryImages.filter((item) => galleryFilter === 'ALL' || item.category === galleryFilter).map((item) => { const index = galleryImages.indexOf(item); return <button key={item.title} className={`gallery-tile gallery-${item.size}`} onClick={() => setSelectedGallery(index)}><img src={item.image} alt={item.title} loading={index > 0 ? 'lazy' : 'eager'} /><span className="gallery-tile-overlay"><small>{item.category}</small><strong>{item.title}</strong><em>VIEW <ArrowRight /></em></span></button> })}</div><div className="experience-row"><div><span className="section-kicker">PROJECT EXPERIENCE</span><h3>DESIGNED FOR<br /><span>EVERYDAY LIFE</span></h3></div>{experienceSteps.map((step) => <div className="experience-step" key={step.number}><b>{step.number}</b><strong>{step.title}</strong><p>{step.text}</p></div>)}</div><div className="masterplan-card"><div><span className="section-kicker">MASTERPLAN PREVIEW</span><h3>PROJECT MASTERPLAN</h3><p>A project overview image will be added once the verified masterplan is available.</p><button className="button button-outline" onClick={() => setMasterplanOpen(true)}>View Masterplan <ZoomIn /></button></div><div className="masterplan-placeholder"><img src={images.overview} alt="Project overview" /><small>Project overview</small></div></div><div className="gallery-cta"><div><strong>LIKE WHAT YOU SEE?</strong><span>Get the latest project information, pricing and availability.</span></div><div className="cta-actions"><button className="button button-accent" onClick={() => setEnquiryOpen(true)}>Get Price Details <ArrowRight /></button><button className="button button-outline" onClick={() => setEnquiryOpen(true)}>Schedule Site Visit</button></div></div></section>

      <section className="location section-pad" id="location"><div className="section-kicker">PRIME LOCATION IN SECTOR 150, NOIDA</div><div className="location-intro"><div><h2>Connected to what<br /><span>matters every day.</span></h2></div><p>Well connected to major roads, metro connectivity, business hubs, schools, hospitals and everyday conveniences across Noida and Delhi NCR.</p></div><div className="location-layout"><div className="location-map-wrap"><div className="location-map" aria-label="Map placeholder centered on Sector 150, Noida"><div className="map-grid-lines"></div><div className="map-route map-route-one"></div><div className="map-route map-route-two"></div><div className="map-route map-route-three"></div><div className="map-label map-label-metro"><Train /> Sector 148 Metro</div><div className="map-label map-label-express"><Route /> Expressway</div><div className="map-project-marker"><MapPin /><span>PRESTIGE<br />SECTOR 150</span></div><div className="map-controls"><button aria-label="Zoom in"><ZoomIn /></button><button aria-label="Zoom out"><ZoomOut /></button><button aria-label="Reset map"><Navigation /></button></div></div><div className="location-card"><span className="info-label">PROJECT LOCATION</span><strong>PRESTIGE SECTOR 150</strong><span>Sector 150, Noida<br />Noida, Uttar Pradesh</span><a href="#" onClick={(event) => { event.preventDefault(); openEnquiry(setEnquiryInterest, setEnquiryOpen) }}>Get Directions <ArrowRight /></a></div></div><div className="location-info"><div className="location-info-heading"><span className="section-kicker">CONNECTIVITY</span><h3>EVERYTHING WITHIN REACH</h3></div><div className="connectivity-cards">{connectivity.map((item) => <div className="connectivity-card" key={item.category}><span className="connectivity-icon">{item.icon}</span><div><span className="info-label">{item.category}</span><strong>{item.destination}</strong></div></div>)}</div></div></div><div className="location-highlights"><LocationHighlight number="01" icon={<Route />} title="EXPRESSWAYS" text="Easy access to major Noida and NCR road networks." /><LocationHighlight number="02" icon={<Train />} title="METRO" text="Access to nearby metro connectivity." /><LocationHighlight number="03" icon={<Plane />} title="AIRPORT" text="Connectivity toward Noida International Airport." /></div><div className="why-sector"><div><span className="section-kicker">LOCATION BENEFITS</span><h3>WHY SECTOR 150?</h3></div><div className="why-grid"><WhyLocation icon={<Trees />} title="GREEN SURROUNDINGS" text="A planned residential environment with open and landscaped spaces." /><WhyLocation icon={<Route />} title="NCR CONNECTIVITY" text="Convenient access to major roads and expressways." /><WhyLocation icon={<School />} title="EVERYDAY CONVENIENCE" text="Schools, hospitals, shopping and daily-use destinations within the wider Noida region." /><WhyLocation icon={<MapPin />} title="SPORTS CITY" text="Located within the broader Sector 150 Sports City environment." /></div></div><div className="location-cta"><div><strong>Want to Visit the Project?</strong><span>Plan a site visit and explore the location for yourself.</span></div><div className="cta-actions"><button className="button button-accent" onClick={() => setEnquiryOpen(true)}>Schedule Site Visit <ArrowRight /></button><button className="button button-outline" onClick={() => setEnquiryOpen(true)}>Get Project Details</button></div></div></section>

      <section className="developer-trust section-pad" id="developer"><div className="section-kicker">ABOUT PRESTIGE GROUP</div><div className="developer-intro"><div className="developer-image-wrap"><img src={images.developer} alt="Residential architecture representing Prestige Group" loading="lazy" /><span>PRESTIGE GROUP</span></div><div className="developer-copy"><h2>A Name Recognized<br /><span>Across Indian Real Estate</span></h2><p>With decades of experience across residential, commercial, retail, hospitality and other real-estate segments, Prestige Group has developed projects across multiple Indian markets.</p><div className="developer-stats"><div><strong>VERIFY</strong><span>FOUNDING YEAR</span></div><div><strong>VERIFY</strong><span>PROJECTS DELIVERED</span></div><div><strong>VERIFY</strong><span>MARKETS / CITIES</span></div><div><strong>VERIFY</strong><span>PROJECTS UNDER DEVELOPMENT</span></div></div></div></div><div className="developer-matters"><div><span className="section-kicker">BUYER CHECKLIST</span><h3>WHAT MATTERS WHEN<br /><span>CHOOSING A DEVELOPER</span></h3></div><div className="trust-points"><div><b>01</b><strong>EXPERIENCE</strong><p>Track record across multiple real-estate segments.</p></div><div><b>02</b><strong>DELIVERY</strong><p>Established project development experience.</p></div><div><b>03</b><strong>PRESENCE</strong><p>Operations across multiple Indian markets.</p></div><div><b>04</b><strong>BRAND</strong><p>A recognized name in the Indian real-estate industry.</p></div></div></div><div className="project-information"><div><span className="section-kicker">PROJECT INFORMATION</span><strong>Official documents and details</strong></div><div className="document-links"><span>RERA DETAILS <small>COMING SOON</small></span><span>PROJECT BROCHURE <small>COMING SOON</small></span><span>PRICE LIST <small>REQUEST DETAILS</small></span><span>FLOOR PLANS <small>REQUEST DETAILS</small></span></div></div><div className="developer-cta"><div><strong>Have Questions About The Project?</strong><span>Speak with our property team for the latest project information and availability.</span></div><div className="cta-actions"><button className="button button-accent" onClick={() => setEnquiryOpen(true)}>Talk to an Advisor <ArrowRight /></button><button className="button button-outline" onClick={() => setEnquiryOpen(true)}>Get Project Details</button></div></div></section>

      <section className="faq section-pad" id="faqs"><div><div className="section-kicker">Good to know</div><h2>Your questions,<br /><span>answered.</span></h2><a className="inline-link" href="#" onClick={(event) => { event.preventDefault(); openEnquiry(setEnquiryInterest, setEnquiryOpen) }}>Talk to a property advisor <ArrowRight /></a></div><div className="faq-list">{faqs.map((question, i) => <div className="faq-item" key={question}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}><span>{question}</span><ChevronDown className={openFaq === i ? 'rotate' : ''} /></button>{openFaq === i && <p>Our property advisor will share the latest details, availability and a personalised cost sheet with you.</p>}</div>)}</div></section>

      <section className="final-cta" id="contact"><div className="final-cta-copy"><div className="hero-badge">PROJECT INFORMATION</div><h2>READY TO KNOW MORE ABOUT<br /><span>PRESTIGE SECTOR 150?</span></h2><p>Get the latest pricing, floor plans, availability and project information from our property team.</p><div className="final-cta-actions"><button className="button button-accent" onClick={() => { setEnquiryInterest('Not Sure'); setEnquiryOpen(true) }}>Get Price Details <ArrowRight /></button><button className="button button-white" onClick={() => { setEnquiryInterest('Site Visit'); setEnquiryOpen(true) }}>Schedule Site Visit</button>{<a className="whatsapp-link" href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}>WhatsApp Us</a>}</div><div className="final-trust"><span><Check /> Project Details</span><span><Check /> Floor Plans</span><span><Check /> Pricing Information</span><span><Check /> Site Visit Assistance</span></div></div><EnquiryCard interest={enquiryInterest} onSubmit={() => undefined} /></section>

      <footer className="footer"><div><a className="brand" href="#top"><span>PRESTIGE</span><small>SECTOR 150 · NOIDA</small></a><p>Homes that bring your family closer.</p></div><div className="footer-links"><a href="#overview">Overview</a><a href="#homes">Homes</a><a href="#amenities">Amenities</a><a href="#location">Location</a><a href="#" onClick={(event) => { event.preventDefault(); openEnquiry(setEnquiryInterest, setEnquiryOpen) }}>Enquire</a></div><div className="footer-bottom">© 2026 Prestige Sector 150 · RERA registered project · *Terms apply</div></footer>
      <div className="floating-contact-actions" aria-label="Project contact actions"><a className="floating-contact-call" href={`tel:${CONTACT_INFO.phone}`} aria-label="Call project team"><img src={images.callIcon} alt="" /></a><a className="floating-contact-whatsapp" href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`} aria-label="Contact project team on WhatsApp" target="_blank" rel="noreferrer"><img src={images.whatsappIcon} alt="" /></a></div>
    </main>
  )
}

function ConfigurationCard({ title, subtitle, details, onPlan, onEnquire }: { title: string; subtitle: string; details: string; onPlan: () => void; onEnquire: () => void }) { const isThreeBhk = title === '3 BHK'; return <article className="configuration-card"><div className="configuration-top"><div><span className="info-label">CONFIGURATION</span><h3>{title}</h3><p>{subtitle}</p></div><span className="configuration-mark">{title.split(' ')[0]}</span></div><div className="configuration-details"><div><span className="info-label">DETAILS</span><strong>{details}</strong></div><div><span className="info-label">AREA</span><strong>{isThreeBhk ? '1,700 – 2,600 Sq. Ft.' : '3,200 – 3,350 Sq. Ft.'}</strong></div><div><span className="info-label">STARTING PRICE</span><strong className="price-request">{isThreeBhk ? '₹ 3.06 Cr*' : '₹ 5.76 Cr*'}</strong></div></div><div className="configuration-actions"><button className="button button-accent" onClick={onEnquire}>Get {title} Price <ArrowRight /></button><button className="button button-outline" onClick={onPlan}>View Floor Plan</button></div></article> }

function FloorPlanCard({ title, image, onClick }: { title: string; image: string; onClick: () => void }) {
  return <article className="floor-plan-card"><div className="floor-plan-visual"><img className="floor-plan-image" src={image} alt={`${title} floor plan preview`} /><div className="floor-plan-overlay"><LockKeyhole aria-hidden="true" /><strong>FLOOR PLAN PREVIEW</strong><small>Available on request</small><button className="floor-plan-request" onClick={onClick}>Request Floor Plan <ArrowRight /></button></div></div><div className="floor-plan-details"><div><span className="info-label">FLOOR PLAN</span><h3>{title}</h3></div><button className="inline-link" onClick={onClick}>View {title} Floor Plan <ArrowRight /></button></div></article>
}

function FloorPlanModal({ plan, onClose, onEnquire }: { plan: string; onClose: () => void; onEnquire: () => void }) { return <div className="modal-backdrop" role="presentation" onClick={onClose}><div className="floor-modal" role="dialog" aria-modal="true" aria-labelledby="floor-modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close floor plan"><X /></button><span className="section-kicker">FLOOR PLAN</span><h2 id="floor-modal-title">{plan}</h2><div className="modal-plan-placeholder"><span>FLOOR PLAN IMAGE</span><small>Actual layout shared by our property advisor</small></div><div className="modal-tools"><button aria-label="Zoom out"><ZoomOut /></button><span>100%</span><button aria-label="Zoom in"><ZoomIn /></button><button className="download-button"><Download /> Download Floor Plan</button></div><div className="modal-actions"><button className="button button-accent" onClick={onEnquire}>Get Price Details</button><button className="button button-outline" onClick={onEnquire}>Schedule Site Visit</button></div></div></div> }

function ContactDetails() { return <div className="contact-details"><div><img src={images.callIcon} alt="" /><span>DIRECT LINE<strong><a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phoneDisplay}</a></strong></span></div><div><img src={images.whatsappIcon} alt="" /><span>WHATSAPP<strong><a href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}>{CONTACT_INFO.whatsappDisplay}</a></strong></span></div><div><span className="contact-symbol">@</span><span>EMAIL<strong><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></strong></span></div><div><span className="contact-symbol">◷</span><span>SITE VISIT HOURS<strong>{CONTACT_INFO.hours}</strong></span></div></div> }

type LeadFormProps = { interest?: string; onSubmit: () => void }

function EnquiryCard({ interest = 'Not Sure', onSubmit }: LeadFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [formInterest, setFormInterest] = useState(interest)
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors: Record<string, string> = {}
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').replace(/[\s-]/g, '')
    if (!name) nextErrors.name = 'Please enter your name.'
    if (!/^\+?91?[6-9]\d{9}$/.test(phone)) nextErrors.phone = 'Please enter a valid Indian phone number.'
    if (!data.get('interest')) nextErrors.interest = 'Please select a configuration.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setFailed(false)
    setSubmitted(true)
  }
  if (submitted) return <div className="lead-success"><Check /><span className="section-kicker">ENQUIRY RECEIVED</span><h3>THANK YOU</h3><p>Your enquiry has been received. A property advisor will contact you with the requested project information.</p><div className="lead-success-actions">{CONTACT_INFO.whatsapp && <a className="button button-accent" href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}>WhatsApp Us</a>}<a className="button button-outline" href="#top">Back to Website</a></div></div>
  if (failed) return <div className="lead-error"><X /><h3>Something went wrong</h3><p>We couldn&apos;t submit your enquiry. Please try again or contact us directly.</p><button className="button button-accent" onClick={() => setFailed(false)}>Try Again</button></div>
  return <div className="lead-card"><form onSubmit={submit} noValidate><label>FULL NAME<input name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} /></label>{errors.name && <small className="field-error">{errors.name}</small>}<label>PHONE NUMBER<input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" aria-invalid={Boolean(errors.phone)} /></label>{errors.phone && <small className="field-error">{errors.phone}</small>}<label>EMAIL ADDRESS<input name="email" type="email" autoComplete="email" /></label><label>INTERESTED IN<select name="interest" value={formInterest} onChange={(event) => setFormInterest(event.target.value)}><option value="">Select an option</option><option>3 BHK</option><option>4 BHK</option><option>Site Visit</option><option>Not Sure</option></select></label>{errors.interest && <small className="field-error">{errors.interest}</small>}<button className="button button-accent" type="submit">Get Project Details <ArrowRight /></button></form><small className="privacy-note">Your information will only be used to respond to your enquiry.</small><div className="form-links"><a href="#privacy">Privacy Policy</a><a href="#terms">Terms &amp; Conditions</a></div></div>
}

function EnquiryModal({ interest = 'Not Sure', onClose }: { interest?: string; onClose: () => void }) { return <div className="modal-backdrop" role="presentation" onClick={onClose}><div className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close enquiry form"><X /></button><h2 id="enquiry-title">GET PROJECT <span>DETAILS</span></h2><EnquiryCard interest={interest} onSubmit={onClose} /></div></div> }

function LocationHighlight({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) { return <article className="location-highlight"><span>{number}</span><div className="location-highlight-icon">{icon}</div><div><h4>{title}</h4><p>{text}</p></div></article> }
function WhyLocation({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <article className="why-location"><div>{icon}</div><h4>{title}</h4><p>{text}</p></article> }

function HomeCard({ title, size, price, image }: { title: string; size: string; price: string; image: string }) { return <article className="home-card"><img src={image} alt={`${title} interior`} /><div><div><h3>{title}</h3><p>{size} · {price}</p></div><a href="#contact" aria-label={`Get details for ${title}`}><ArrowRight /></a></div></article> }
function Amenity({ item, featured = false, onClick }: { item: AmenityItem; featured?: boolean; onClick: () => void }) { return <button className={`amenity-card${featured ? ' amenity-featured' : ''}`} onClick={onClick} aria-label={`View ${item.title} details`}><div className="amenity-image"><img src={item.image} alt="" /><span className="amenity-view">VIEW <ZoomIn /></span></div><div className="amenity-copy"><div><h3>{item.title}</h3><p>{item.text}</p></div></div></button> }

function AmenityModal({ item, onClose }: { item: AmenityItem; onClose: () => void }) { return <div className="modal-backdrop" role="presentation" onClick={onClose}><div className="amenity-modal" role="dialog" aria-modal="true" aria-labelledby="amenity-modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close amenity details"><X /></button><img src={item.image} alt="" /><div><span className="section-kicker">AMENITY {item.icon}</span><h2 id="amenity-modal-title">{item.title}</h2><p>{item.text}</p></div></div></div> }

function GalleryModal({ images, index, onClose, onChange }: { images: typeof galleryImages; index: number; onClose: () => void; onChange: (index: number) => void }) { const item = images[index]; return <div className="gallery-lightbox" role="presentation" onClick={onClose}><div className="gallery-lightbox-inner" role="dialog" aria-modal="true" aria-label="Project gallery" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close gallery"><X /></button><img src={item.image} alt={item.title} /><div className="gallery-lightbox-meta"><div><span>{item.category}</span><strong>{item.title}</strong></div><small>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</small></div><button className="gallery-arrow gallery-prev" onClick={() => onChange((index - 1 + images.length) % images.length)} aria-label="Previous image"><ChevronLeft /></button><button className="gallery-arrow gallery-next" onClick={() => onChange((index + 1) % images.length)} aria-label="Next image"><ChevronRight /></button></div></div> }
function MasterplanModal({ onClose, onEnquire }: { onClose: () => void; onEnquire: () => void }) { return <div className="modal-backdrop" role="presentation" onClick={onClose}><div className="masterplan-modal" role="dialog" aria-modal="true" aria-labelledby="masterplan-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close masterplan"><X /></button><div className="masterplan-placeholder"><img src={images.overview} alt="Project overview" /><small>Project overview</small></div><span className="section-kicker">PROJECT MASTERPLAN</span><h2 id="masterplan-title">Explore the plan</h2><button className="button button-accent" onClick={onEnquire}>Get Project Details <ArrowRight /></button></div></div> }
