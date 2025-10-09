const siteContent = {
  services: {
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        subtitle: 'Launch-ready Landing Page',
        price: {
          currency: 'Rp',
          amount: '800.000'
        },
        features: [
          '1–3 section landing page',
          'Basic custom design',
          'Responsive & accessible',
          'Light copy polish (EN/ID)',
          'Basic SEO (semantic HTML)',
          'Standard analytics setup'
        ],
        cta: {
          label: 'Start Now',
          href: 'contact.html',
          ariaLabel: 'Start Starter plan'
        },
        note: 'ETA 3–5 days • 1 revision'
      },
      {
        id: 'growth',
        name: 'Growth',
        subtitle: 'Small Business',
        ribbon: 'Most Popular',
        price: {
          currency: 'Rp',
          amount: '2.500.000'
        },
        features: [
          'Up to 5–7 custom pages',
          'Core Web Vitals checked',
          'Copy polish (EN/ID, 2 revisions)',
          'Basic SEO + performance optimization',
          'Simple analytics dashboard',
          '3-month Care Plan'
        ],
        cta: {
          label: 'Start Growth',
          href: 'contact.html'
        },
        note: 'ETA 1–2 weeks • 2 revisions',
        featured: true
      },
      {
        id: 'premium',
        name: 'Premium',
        subtitle: 'Brand-level Experience',
        price: {
          currency: 'Rp',
          amount: '5.500.000'
        },
        features: [
          '12–15 custom design pages',
          'Premium UI + light animations',
          'Full copy polish (EN/ID, 4 revisions)',
          'Complete performance tuning',
          'Advanced on-page SEO',
          'Analytics setup + reporting',
          '6-month Care Plan'
        ],
        cta: {
          label: 'Get Premium',
          href: 'contact.html'
        },
        note: 'ETA 3–4 weeks • 4 revisions'
      }
    ],
    addons: [
      {
        name: 'Booking Integration',
        description:
          'Channel manager / booking widget (e.g., SiteMinder, Cloudbeds, or custom form)',
        price: 'from Rp 1.700.000'
      },
      {
        name: 'Brand Content Pack',
        description: 'Copy refinement, menu/rooms descriptions (EN/ID), assets organization',
        price: 'from Rp 550.000'
      },
      {
        name: 'Photo Optimization',
        description: 'Hero & gallery curation, compression, EXIF/alt text, lazy-load setup',
        price: 'from Rp 300.000'
      }
    ]
  },
  faq: [
    {
      question: 'What’s included vs not included?',
      answer:
        'All plans include design, build, on-page SEO, and basic analytics. Domain/hosting, paid plugins, and third-party subscriptions are billed separately unless stated in the proposal.'
    },
    {
      question: 'How do revisions work?',
      answer:
        'Each plan includes the listed number of revision rounds. Extra rounds or scope changes are available as add-ons.'
    },
    {
      question: 'Payment & timeline?',
      answer:
        '50% deposit to start, 50% on launch. Estimated timelines are shown per plan and adjusted after content is finalized.'
    },
    {
      question: 'Care Plan details?',
      answer:
        'Care Plan covers small content updates, uptime checks, and scheduled backups. Feature requests beyond “small” are quoted separately.'
    }
  ],
  portfolio: [
    {
      name: 'MiniTools',
      description: 'Collection of small utilities (UI polish, clean code). Deployed on GitHub Pages.',
      link: {
        label: 'View',
        href: 'https://astika327-dev.github.io/minitools'
      },
      slides: [
        {
          src: 'assets/img/ss/ssminitool1.png',
          alt: 'MiniTools screenshot 1'
        },
        {
          src: 'assets/img/ss/ssminitool2.png',
          alt: 'MiniTools screenshot 2'
        },
        {
          src: 'assets/img/ss/ssminitool3.png',
          alt: 'MiniTools screenshot 3'
        },
        {
          src: 'assets/img/ss/ssminitool4.png',
          alt: 'MiniTools screenshot 3'
        }
      ]
    },
    {
      name: 'Ops Playbook',
      description: 'Unified SOP/QA kit: checklists, incident notes, and audit templates.',
      link: {
        label: 'View',
        href: 'https://astika327-dev.github.io/opsplaybook-hospitality/'
      },
      slides: [
        {
          src: 'assets/img/ss/ssops1.png',
          alt: 'Markdown Previewer screenshot 1'
        },
        {
          src: 'assets/img/ss/ssops2.png',
          alt: 'Markdown Previewer screenshot 2'
        },
        {
          src: 'assets/img/ss/ssops3.png',
          alt: 'Markdown Previewer screenshot 2'
        }
      ]
    },
    {
      name: 'Portfolio',
      description: 'Refined personal portfolio with better structure, accessibility and SEO.',
      link: {
        label: 'Live',
        href: 'https://astika.is-a.dev'
      },
      slides: [
        {
          src: 'assets/img/ss/ssporto1.png',
          alt: 'Portfolio v2 screenshot 1'
        },
        {
          src: 'assets/img/ss/ssporto2.png',
          alt: 'Portfolio v2 screenshot 2'
        }
      ]
    }
  ],
  certifications: [
    {
      title: 'freeCodeCamp — Front End Development Libraries',
      href: 'https://www.freecodecamp.org/certification/astika/front-end-development-libraries'
    },
    {
      title: 'freeCodeCamp — Responsive Web Design',
      href: 'https://www.freecodecamp.org/certification/astika/responsive-web-design'
    },
    {
      title: 'freeCodeCamp — Javascript Algorithms and Data Structures',
      href: 'https://www.freecodecamp.org/certification/astika/javascript-algorithms-and-data-structures-v8'
    }
  ]
};

module.exports = siteContent;
