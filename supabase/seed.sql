-- Initial content, taken from the academic and ML resumes and the previous site.
-- Safe to run once on an empty database. Everything here is editable in /admin.

insert into public.site_settings (
  id, full_name, short_name, headline, intro, now_text, bio, location, email, phone, show_phone,
  avatar_url, resume_url, availability, research_intro, research_primary, research_secondary,
  writing_intro, projects_intro, cv_intro, contact_intro, footer_note, seo_title, seo_description, og_image_url
) values (
  1,
  'Ovioisa Oisamaye Benjamin',
  'Oisamaye',
  'I build compact neural networks that pick attacks out of ordinary network traffic.',
  $$I'm a PhD candidate in Computer Engineering at Bahçeşehir Cyprus University, working on security for cyber-physical systems. Alongside research I build web applications with Next.js and TypeScript, and I teach. This site collects that work and what I write about it.$$,
  $$Finishing my PhD on cyber-physical security. CompactIDS, my intrusion detection model, is under peer review.$$,
  $$I research how to defend cyber-physical systems from both sides at once: the network that carries their data and the physical space they sit in. My PhD work combines a physical surveillance module (facial recognition and object detection) with a CNN-based intrusion detection system, so one platform can notice a stranger at the door and a port scan on the wire.

The core of that work is **CompactIDS**, a convolutional network of about 600,000 parameters that uses multi-scale attention, depthwise separable convolutions and Squeeze-and-Excitation blocks. I validated it on five benchmark datasets (UNSW-NB15, CICIoT2023, CICIDS2018, CICIDS2017 and USB-IDS), where it detects attacks more accurately and raises fewer false alarms than larger state-of-the-art models, and it is small enough to run in real time on edge devices.

Before research I worked as a software engineer, and I still do. I've built a food delivery platform and its analytics dashboard for Swiftmunch, more than fifteen client websites, and the content system behind this site.

I also teach. I run laboratory sessions for electrical and computer engineering students at Bahçeşehir Cyprus University, taught Information Technologies there as an instructor, and taught physics in Kutigi, Nigeria during my national service.$$,
  'Nicosia, Cyprus',
  'ovibenz@gmail.com',
  '+2348130183417',
  false,
  'https://res.cloudinary.com/du2dk0zua/image/upload/v1750166915/hero_ekswna.jpg',
  '',
  'Open to research collaborations, ML security roles and web projects.',
  $$My research is about defending cyber-physical systems with deep learning that is accurate enough to trust and small enough to deploy at the edge.$$,
  array['Cyber-physical systems (CPS) security','Intrusion detection systems','Deep learning architectures'],
  array['Explainable AI in security','Machine learning for IoT security','Adversarial machine learning','Computer vision for surveillance','Network traffic analysis'],
  'Notes on intrusion detection, deep learning, IoT security and building for the web.',
  'Research systems and web applications I have designed and built.',
  'Research, teaching and engineering work, most recent first.',
  'Write to me about research, a role, or a project you want built. I usually reply within a day.',
  'Built and maintained by Oisamaye.',
  'Ovioisa Oisamaye Benjamin: ML security researcher and web engineer',
  'PhD candidate researching deep-learning intrusion detection for cyber-physical systems, and a full-stack web engineer. Projects, publications and writing.',
  'https://res.cloudinary.com/du2dk0zua/image/upload/v1750166915/hero_ekswna.jpg'
) on conflict (id) do nothing;

insert into public.social_links (label, url, platform, sort_order) values
  ('GitHub', 'https://github.com/Oisamaye1', 'github', 1),
  ('LinkedIn', 'https://www.linkedin.com/in/ovioisa-oisamaye-benjamin-93998019b/', 'linkedin', 2),
  ('X', 'https://x.com/ovioisabenjamin', 'x', 3);

insert into public.experiences (role, organization, location, kind, start_date, end_date, is_current, summary, highlights, tags, sort_order) values
(
  'Graduate Researcher', 'Bahçeşehir Cyprus University', 'Nicosia, Cyprus', 'research', '2023-10-01', null, true,
  'PhD research on unified cyber-physical security using deep learning.',
  array[
    'Designed CompactIDS, a ~600,000-parameter CNN for network intrusion detection that combines multi-scale attention, depthwise separable convolutions and Squeeze-and-Excitation blocks.',
    'Validated it on UNSW-NB15, CICIoT2023, CICIDS2018, CICIDS2017 and USB-IDS, with higher detection accuracy and a lower false alarm rate than state-of-the-art baselines.',
    'Ran ablation studies and time-complexity analysis showing each component''s contribution and real-time inference on resource-constrained devices.',
    'Designed a CPS security framework that pairs OpenCV-based facial recognition and object detection with the CNN intrusion detector.',
    'Advanced to PhD candidacy in 2025 after the qualifying examination.'
  ],
  array['Python','TensorFlow','OpenCV','Deep learning','IDS'],
  1
),
(
  'Teaching Assistant', 'Bahçeşehir Cyprus University', 'Nicosia, Cyprus', 'teaching', '2023-10-01', null, true,
  'Laboratory sessions for electrical and computer engineering courses.',
  array[
    'Run practical lab sessions for 100+ computer and electrical engineering students, with demonstrations and real-time support.',
    'Help organise student competitions, engineering arcades and academic workshops.',
    'Administer exams and mentor students on course projects.'
  ],
  array['C','C++','Python'],
  2
),
(
  'IT Instructor (part-time)', 'Bahçeşehir Cyprus University', 'Nicosia, Cyprus', 'teaching', '2024-02-01', '2024-07-31', false,
  'Taught Information Technologies, from computer basics to management information systems.',
  array[
    'Delivered lectures and hands-on labs on Information Technologies and MIS to cohorts of 40+ students.',
    'Raised engagement with interactive teaching and real-world examples, and mentored top-performing students.'
  ],
  array[]::text[],
  3
),
(
  'Full-Stack Software Engineer', 'Swiftmunch', 'Remote', 'industry', '2024-02-01', '2025-01-31', false,
  'Built Swiftmunch''s online food delivery platform and its admin dashboard.',
  array[
    'Built the delivery platform with Next.js, React and TypeScript, integrating REST APIs for real-time order sync and cutting backend latency by 25%.',
    'Reduced page load time by 30% with refactoring, lazy loading and image compression.',
    'Built an analytics dashboard for 200+ daily orders that improved operational efficiency by 40%.'
  ],
  array['Next.js','React','TypeScript','REST APIs'],
  4
),
(
  'Frontend Web Developer (freelance)', 'JamiLegacy', 'Remote', 'industry', '2021-12-01', null, true,
  'Freelance frontend work with a web services agency, collaborating with specialists on client projects.',
  array[]::text[],
  array['React','Next.js','TypeScript'],
  5
),
(
  'Software Engineer & Systems Technician', 'WII Technology', 'Nigeria', 'industry', '2021-02-01', '2021-08-31', false,
  'Client web applications and hardware support.',
  array[
    'Built 15+ responsive client web applications with React, HTML and CSS, cutting load times by 20%.',
    'Diagnosed and fixed hardware and software faults across 50+ computers with a 95% client satisfaction rate.'
  ],
  array['React','HTML','CSS','Webpack'],
  6
),
(
  'Physics Teacher (NYSC)', 'Idris Legbo Science College', 'Kutigi, Nigeria', 'teaching', '2019-03-01', '2020-02-29', false,
  'National Youth Service Corps teaching posting.',
  array[
    'Designed curriculum-aligned physics lessons that raised student participation by 25%.',
    'Coached a student to first place in a regional debate competition.'
  ],
  array[]::text[],
  7
);

insert into public.education (degree, institution, location, start_year, end_year, in_progress, thesis, highlights, sort_order) values
(
  'PhD in Computer Engineering', 'Bahçeşehir Cyprus University', 'Nicosia, Cyprus', 2023, null, true,
  'Cyber-Physical Security Through IoT and Machine Learning: Enhancing Physical and Cyber Defense with an Improved CNN-Based Intrusion Detection System',
  array[
    'A CPS security platform combining physical surveillance (facial recognition, object detection) with a CNN-based intrusion detection system.',
    'A custom CNN with multi-scale attention, depthwise separable convolutions and Squeeze-and-Excitation blocks.',
    'Benchmarked on UNSW-NB15, CICIoT2023, CICIDS2018, CICIDS2017 and USB-IDS for accuracy, precision, false alarm rate and efficiency.'
  ],
  1
),
(
  'MSc in Computer Engineering', 'Bahçeşehir Cyprus University', 'Nicosia, Cyprus', 2021, 2023, false,
  'Internet of Things (IoT)-Based Smart Security System Using Machine Learning',
  array[
    'Designed and built a full-stack IoT security system with real-time monitoring and admin notifications.',
    'CNN facial recognition: 94% accuracy, 100% recall, 95.24% F1-score.',
    'SSD object detection: 90% accuracy, 94.7% F1-score.'
  ],
  2
),
(
  'Postgraduate Diploma in Remote Sensing and GIS', 'African Regional Centre for Space Science and Technology Education in English, OAU campus', 'Ile-Ife, Nigeria', 2020, 2021, false,
  'Analysis of Electrical Distribution Transformers in Ife Central Local Government Area, Osun State, Nigeria',
  array[
    'Mapped distribution transformers with GIS and remote sensing, building a spatial asset database.',
    'Used buffer analysis to evaluate load and capacity and find overloaded transformers.'
  ],
  3
),
(
  'HND in Electrical/Electronics Engineering Technology', 'Federal Polytechnic, Auchi', 'Edo State, Nigeria', 2016, 2018, false,
  '',
  array['Power and machines option.'],
  4
),
(
  'ND in Electrical/Electronics Engineering Technology', 'Federal Polytechnic, Auchi', 'Edo State, Nigeria', 2013, 2015, false,
  '',
  array[]::text[],
  5
);

insert into public.publications (title, authors, venue, year, status, doi, url, summary, sort_order) values
(
  'CompactIDS: An Attention-Module-Enabled Deep Learning-Based Efficient Classifier for Intrusion Detection',
  'Benjamin, O.O., Huseyin G.', '', 2025, 'Under peer review', '', '',
  'Introduces CompactIDS, a ~600,000-parameter CNN for network intrusion detection, with experiments on five benchmark datasets, ablation analysis and time-complexity analysis. It generalises better to previously unseen attacks while staying fast enough for real-time use.',
  1
),
(
  'Internet of Things-Based Smart Security System with Face and Object Detection Using Machine Learning',
  'Benjamin, O.O., Huseyin G.', 'Sakarya University Journal of Computer and Information Sciences', 2024, 'Under peer review',
  '10.22541/au.172508456.66344218/v1', 'https://doi.org/10.22541/au.172508456.66344218/v1',
  'A full-stack IoT security system using CNN facial recognition and SSD object detection with real-time alerts.',
  2
),
(
  'Cyber-Physical Security Through IoT and Machine Learning: Enhancing Physical and Cyber Defense With an Improved CNN-Based Intrusion Detection System',
  'Benjamin, O.O.', 'PhD Qualifying Examination, Bahçeşehir Cyprus University', 2025, 'Presentation', '', '',
  '',
  3
);

insert into public.projects (slug, title, summary, body, cover_url, tags, live_url, repo_url, year, featured, sort_order) values
(
  'compactids', 'CompactIDS',
  'A ~600,000-parameter CNN that detects network intrusions accurately enough to trust and fast enough for edge devices.',
  $$CompactIDS is the intrusion detection model at the centre of my PhD.

## The problem

Deep learning intrusion detectors keep getting more accurate, and they keep getting bigger. A model that needs a GPU server is no use on the gateways and edge devices that actually sit inside cyber-physical systems.

## The approach

CompactIDS borrows components from computer vision and adapts them to network traffic:

- **Multi-scale attention** so the network can weigh features at different granularities.
- **Depthwise separable convolutions** to cut parameters and compute.
- **Squeeze-and-Excitation blocks** to re-weight channels and sharpen feature extraction.

## Results

I trained and evaluated it on five benchmark datasets: UNSW-NB15, CICIoT2023, CICIDS2018, CICIDS2017 and USB-IDS. It reaches higher accuracy and a lower false alarm rate than state-of-the-art baselines with roughly 600,000 parameters, and it generalises better to attack types it has not seen. Ablation studies show what each component contributes, and time-complexity analysis confirms real-time inference.

The paper is under peer review.$$,
  '', array['Python','TensorFlow','Deep learning','Intrusion detection'], '', '', 2025, true, 1
),
(
  'iot-smart-security-system', 'IoT smart security system',
  'My MSc project: a full-stack IoT security system with CNN face recognition, SSD object detection and real-time alerts.',
  $$A physical security system built from IoT hardware and machine learning, designed and built for my MSc thesis.

- **Face recognition** with a convolutional neural network: 94% accuracy, 100% recall, 95.24% F1-score.
- **Object detection** with a Single Shot Detector: 90% accuracy, 94.7% F1-score.
- A backend and real-time notification system that alerts administrators when something happens.

The paper describing it is under review at the Sakarya University Journal of Computer and Information Sciences (preprint DOI 10.22541/au.172508456.66344218/v1).$$,
  '', array['Python','OpenCV','Raspberry Pi','CNN'], '', '', 2023, true, 2
),
(
  'oisamaye-cms', 'Oisamaye CMS',
  'The content management system behind my previous portfolio, where every section was edited and published in real time.',
  '', 'https://res.cloudinary.com/du2dk0zua/image/upload/v1750235746/oisamaye_portfolio_lsyjgu.png',
  array['Next.js','React','TypeScript','Tailwind CSS','Vercel'], 'https://oisamaye.vercel.app/', 'https://github.com/Oisamaye1', 2025, true, 3
),
(
  'movie-discovery', 'Movie Discovery',
  'Browse films, search upcoming releases and save titles to watch later.',
  '', 'https://res.cloudinary.com/du2dk0zua/image/upload/v1749710388/Screenshot_2025-04-04_095705_j2o1ag.png',
  array['Next.js','React','TypeScript','Tailwind CSS'], 'https://movie-discovery-ten.vercel.app/', 'https://github.com/Oisamaye1/movie-discovery', 2025, false, 4
),
(
  'scupay', 'SCUPAY',
  'A dashboard where school management keeps student records and students manage their own details.',
  '', 'https://res.cloudinary.com/du2dk0zua/image/upload/v1750142859/Screenshot_2025-06-17_094324_gzyotx.png',
  array['Next.js','React','TypeScript','Tailwind CSS'], '', '', 2025, false, 5
),
(
  'jamilegacy', 'JamiLegacy',
  'Website for a web services agency.',
  '', 'https://res.cloudinary.com/du2dk0zua/image/upload/v1749710388/Screenshot_2025-02-15_134837_l2npsi.png',
  array['Next.js','React','TypeScript','Tailwind CSS'], 'https://jamilegacy.vercel.app/', 'https://github.com/Oisamaye1/jamilegacy', 2025, false, 6
),
(
  'beshop', 'BeShop',
  'Responsive storefront for an e-commerce site, with product categories.',
  '', 'https://res.cloudinary.com/du2dk0zua/image/upload/v1749710389/Screenshot_2025-02-15_135130_l0jaou.png',
  array['Next.js','React','TypeScript','Tailwind CSS'], 'https://beshop-peach.vercel.app/', 'https://github.com/Oisamaye1/Beshop', 2025, false, 7
),
(
  'subflow', 'SubFlow',
  'Full-stack web3 SaaS application with real-time features.',
  '', 'https://res.cloudinary.com/du2dk0zua/image/upload/v1749710389/Screenshot_2025-02-19_102418_xqui9q.png',
  array['Next.js','React','TypeScript','Web3'], '', '', 2025, false, 8
),
(
  'mix-fit', 'Mix-Fit',
  'Frontend for a fitness web application.',
  '', 'https://res.cloudinary.com/du2dk0zua/image/upload/v1749710390/Screenshot_2025-02-15_134937_zo2hod.png',
  array['HTML','CSS','JavaScript'], 'https://mix-fit.vercel.app/', 'https://github.com/Oisamaye1/Mix-Fit', 2025, false, 9
);

insert into public.skill_groups (name, items, sort_order) values
  ('Machine learning', array['Convolutional neural networks','Anomaly detection','Intrusion detection','Computer vision','Feature engineering','Model evaluation','Hyperparameter optimisation','Ablation analysis'], 1),
  ('Security', array['Cyber-physical systems security','Network security','IoT security','Network traffic analysis','Edge computing','IDS benchmarking'], 2),
  ('Languages', array['Python','TypeScript','JavaScript','C','C++'], 3),
  ('Frameworks & libraries', array['TensorFlow','PyTorch','OpenCV','scikit-learn','NumPy','pandas','Flask','SQLAlchemy'], 4),
  ('Web', array['Next.js','React','Tailwind CSS','Chakra UI','Bootstrap','HTML','CSS'], 5),
  ('Tools & platforms', array['Git','Docker','PostgreSQL','MySQL','REST APIs','Vercel','Figma','WordPress'], 6),
  ('Hardware & IoT', array['Raspberry Pi','IoT architectures','Physical surveillance systems'], 7);

insert into public.certifications (name, issuer, year, sort_order) values
  ('Remote Sensing & GIS', 'African Regional Centre for Space Science and Technology Education', 2021, 1),
  ('Health, Safety and Environment (HSE) Levels 1, 2 & 3', '', null, 2);

insert into public.testimonials (quote, author, role, organization, sort_order) values
  ('Always punctual with all deliverables and very professional to work with. Would highly recommend.', 'Felicity O.', 'Partnership Manager', 'She Leads Africa', 1),
  ('Always up to the task and keen on doing the possible best. Great job.', 'Emmanuel A.', 'CEO', 'HealBlox Africa', 2);

insert into public.posts (slug, title, excerpt, body, tags, published, published_at) values
(
  'why-i-made-my-intrusion-detector-small',
  'Why I made my intrusion detector small',
  'Most deep-learning intrusion detectors chase accuracy with size. CompactIDS goes the other way. A draft about why.',
  $$*This is a starter draft. Edit or delete it in the admin.*

Intrusion detection research keeps producing larger models. They post excellent numbers on benchmark datasets, but the places that most need protection, such as IoT gateways, building controllers and camera hubs, can't run them.

When I started CompactIDS, I set a budget first: the model had to stay small enough to run in real time on modest hardware. Everything else had to fit inside that budget.

## What fits in 600,000 parameters

- Depthwise separable convolutions, which do most of the work of a normal convolution for a fraction of the parameters.
- Squeeze-and-Excitation blocks, which let the network decide which feature channels matter for each input.
- Multi-scale attention, so short and long patterns in a traffic record both get a say.

## What I measured

Accuracy alone hides the cost of false alarms, so I tracked precision, recall, F1, AUC and the false alarm rate on five datasets: UNSW-NB15, CICIoT2023, CICIDS2018, CICIDS2017 and USB-IDS.

More soon.$$,
  array['Intrusion detection','Deep learning'], false, null
);
