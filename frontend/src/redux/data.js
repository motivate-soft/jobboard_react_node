const descriptionMD = `
<div class="description" itemprop="description"><br><div class="markdown"><p>At Pleased, our mission is to please you and your customers. To achieve that, we offer an all-inclusive, easy-to-use and affordable support software.</p>
<p>We’re looking for people who are passionate about our product and serving our clients. We retain our team members with a dynamic and flexible work life which empowers them to create value, and rewards them generously based upon their contribution.</p>
<p>In this role, you’ll be responsible for running the end to end quality assurance testing for the software, both manually and through automation testing. You’ll be working on complex systems that are used to serve hundred and thousands customers a day. We wrote our system from scratch about 1 year ago, so you’ll be working with the latest technology and won’t have to worry about decades old legacy code.</p>
<p><strong>Who We Are</strong></p>
<p>Pleased.com is a new and exciting SaaS customer support solution for small and large businesses. We pride ourselves upon the product we’ve created together in less than a year. We improve the application on a daily basis and are continuously adding new features. With us, you’ll always have something new and exciting to work on and never be bored!</p>
<p>We’re a small and fast moving agile team. We need talented individuals to drive increased growth and contribute to the innovation, creativity and hard work that currently serves our clients further via our team's grit and innovation.</p>
<p><strong>Our Stack</strong></p>
<p>Programing language: Java / Python</p>
<p>DB: MySQL / SQL database</p>
<p>DevOps: AWS / Jenkins / K8S</p>
<p>Frond-end: Vue.js </p>
`;

const howtoApplyMD = `<div class="markdown">
<p>Check out our <a href="https://alchemyandaim.com">website</a> and portfolio to see the type of projects we work on. If you’re interested in applying please send a cover letter via the application form on the Apply URL and in it include the following:</p>
<ol>
<li>Tell us what past project you loved working on most and why</li>
<li>Share a link to a custom WordPress site you built that uses ACF</li>
<li>Share a link to a custom WordPress site you built that uses Woocommerce</li>
<li>Tell us what your two superpowers are</li>
<li>Provide a URL for your portfolio</li>
<li>Tell us what your regular hourly rate is</li>
</ol>
<p>(WeOgood cover letters and details. Make sure you address ALL six items above in full.)</p>
<p>Qualified candidates will be contacted about the next step.</p></div>`;

export const singleJobData = {
  logo: "/images/sample_logo.png",
  companyName: "Pleased.com",
  position: "Full Stack Engineer",
  primaryTag: "Full stack",
  tags: ["ruby", "rails", "ecommerce"],
  location: "Worldwide",
  description: descriptionMD,
  minSalary: 50000,
  maxSalary: 80000,
  howtoApply: howtoApplyMD,
  applyUrl: "",
  applyEmail: "john@cryptozelle.com",
  isShowLogo: true,
  isHighlight: false,
  //   isHighlightColor: false,
  isStickyDay: false,
  //   isStickyWeek: false,
  isStickyMonth: true,
  postedAt: "2021-06-10 11:59:59",
  createdAt: "2020-06-10 17:59:59",
};

export const jobsData = [
  {
    id: 1,
    logo: "/images/sample_logo.png",
    companyName: "Grafana",
    position: "Documentation & Technical Writing Manager",
    primaryTag: "Technical writing",
    tags: ["writing", "documentation", "exec"],
    location: "Worldwide",
    minSalary: 50000,
    maxSalary: 80000,
    howtoApply:
      "Visit our [careers site](https://join.nadinewest.com/) to upload your resume. If your work experience suggests a potential match, you'll be invited to take a 10-hour, fully-paid [coding challenge](https://join.nadinewest.com/coding-challenge/). Top performers in the coding challenge will be invited to interview with the CEO and the tech leads.",
    applyUrl: "",
    applyEmail: "john@email.com",
    isShowLogo: true,
    isHighlight: true,
    //   isHighlightColor: false,
    isStickyDay: false,
    //   isStickyWeek: false,
    isStickyMonth: true,
    postedAt: "2021-06-10 11:59:59",
    createdAt: "2020-06-10 17:59:59",
  },
  {
    id: 2,
    logo: "/images/sample_logo.png",
    companyName: "Nadine West",
    position: "Senior Full Stack Rails Developer",
    primaryTag: "Full stack",
    tags: ["ruby", "rails", "ecommerce"],
    location: "Worldwide",
    minSalary: 100000,
    maxSalary: 150000,
    howtoApply:
      "Visit our [careers site](https://join.nadinewest.com/) to upload your resume. If your work experience suggests a potential match, you'll be invited to take a 10-hour, fully-paid [coding challenge](https://join.nadinewest.com/coding-challenge/). Top performers in the coding challenge will be invited to interview with the CEO and the tech leads.",
    applyUrl:
      "https://alchemyandaim.com/the-team/apply/front-end-developer/?utm_source=remoteok.io&ref=remoteok.io",
    applyEmail: "",

    isShowLogo: true,
    // isHighlight: false,
    isHighlightColor: true,
    highlightColor: "#ff00a2",
    isStickyDay: false,
    isStickyWeek: true,
    // isStickyMonth: true,
    postedAt: "2021-06-10 11:59:59",
    createdAt: "2020-06-10 17:59:59",
  },
  {
    id: 3,
    logo: "/images/sample_logo.png",
    companyName: "Aliens.com",
    position: "Mobile Tech Lead",
    primaryTag: "exec",
    tags: ["tech lead", "mobile", "full stack"],
    location: "Worldwide",
    minSalary: 80000,
    maxSalary: 120000,
    howtoApply:
      "Visit our [careers site](https://join.nadinewest.com/) to upload your resume. If your work experience suggests a potential match, you'll be invited to take a 10-hour, fully-paid [coding challenge](https://join.nadinewest.com/coding-challenge/). Top performers in the coding challenge will be invited to interview with the CEO and the tech leads.",
    applyUrl: "",
    applyEmail: "jhon@email.com",

    isShowLogo: true,
    isHighlight: false,
    //   isHighlightColor: false,
    isStickyDay: false,
    //   isStickyWeek: false,
    isStickyMonth: true,
    postedAt: "2021-06-10 11:59:59",
    createdAt: "2020-06-10 17:59:59",
  },
];
