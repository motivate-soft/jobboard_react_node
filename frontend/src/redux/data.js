const descriptionMD = `
<div class="description" itemprop="description"><br><h1 style="text-align:left;font-size:24px;">Pleased.com is hiring a Remote Quality Assurance Engineer</h1><div class="markdown"><p>At Pleased, our mission is to please you and your customers. To achieve that, we offer an all-inclusive, easy-to-use and affordable support software.</p>
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
<p><strong>Responsibilities</strong></p>
<p>Testing (black box, white box, integration, and performance) of the Web and Android/iOS platforms</p>
<p>Create automated Web / Mobile / API test cases</p>
<p>Track and analyze automated tests to improve test efficiency</p>
<p>Track and record product issues and analyze the problems through various tools, giving feedback to relevant personnel to make corrections</p>
<p>Share test-related information with other team members</p>
<p>Develop automated tests and test frameworks</p>
<p>Improve our Continuous Integration pipeline</p>
<p>Identify and execute on opportunities to improve or establish quality processes</p>
<p>Help automate all aspects of the software engineering process</p>
<p>Write test plans / test cases and output test reports according to feature requirements</p>
<p>Simulate user needs and actual usage scenarios from a user perspective</p>
<p>Review designs and code done by others and provide constructive feedback</p>
<p>Continuously develop your own skills </p>
<p>Mentor less experienced members of the team </p>
<p><strong>Requirements</strong></p>
<p>2+ years of testing experience</p>
<p>BS / MS in Computer Science, Information Systems, Electrical Engineering</p>
<p>Working knowledge of a programming language (e.g. Java / Python)</p>
<p>Familiarity with Web / Android / iOS manual testing</p>
<p>Familiarity with the test tool (Postman / Chrome console)</p>
<p>Familiarity with various tests (function / integration / regression / stress / API)</p>
<p>Experience in developing and running a Continuous Integration system</p>
<p>Familiarity with Automation testing knowledge with REST APIs</p>
<p>Familiarity with Automation testing knowledge with Mobile UI / Function</p>
<p>Familiarity with MySQL / SQL database</p>
<p>Docker and Kubernetes experience would be advantageous </p>
<p>Familiarity with Jira / Jenkins would be advantageous </p>
<p><strong>Benefits</strong></p>
<p>Quarterly and flash bonuses</p>
<p>Flexible working hours</p>
<p>Top-of-the-line equipment</p>
<p>Education allowance </p>
<p>Referral bonuses </p>
<p>Annual company holidays - we’re hoping to make it to Koh Samui in 2021!</p>
<p>Highly talented, dependable co-workers </p>
<p>Our team is small enough for you to be impactful </p>
<p>Our business is backed by established and successful businesses, offering stability and security to our employees</p></div>
`;

const howtoApplyMD = `<div class="markdown"><h1 id="howdoyouapply">How do you apply?</h1>
<pre><code>Make sure this job is the right fit for you, and make sure you’re the right fit for this job.
</code></pre>
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
  companyName: "Company",
  position: "Position",
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
