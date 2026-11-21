// Edit these, commit, and push — the site redeploys on its own.

/** The Apps Script web app URL (ends in /exec). Leave empty to preview with sample data. */
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9fylkbfAg4geGe-4SrFkYORYHGap-Wmm0Y0sFEs3TQVsM7KTL7vw8GjdvdPm2VAf_Rg/exec';

export const EVENT = {
  title: 'Deacon Christmas Party',
  /** Shown in the highlighted line under the title. Leave any empty to hide it. */
  date: 'Sunday, December 13',
  time: '5:00 PM',
  place: 'The Lemon Orchard Venue on the Lake',

  // Write the intro between the backticks. Press Enter for a new line;
  // leave an empty line between paragraphs.
  intro: `
    It's time for our annual Deacon Christmas Party!

    Join us on Sunday, December 13, at 5:00 PM for an evening of good food, fun games, and Christmas caroling… just kidding, no caroling!
  `,

  details: [
    {
      label: 'Location',
      text: 'The Lemon Orchard Venue on the Lake, 11291 Knights Griffin Rd, Thonotosassa, FL 33592 ',
      // Any detail can have a link like this one: the words to show, and where it goes.
      link: {
        text: 'Get directions',
        url: 'https://www.google.com/maps/dir/?api=1&destination=11291+Knights+Griffin+Rd,+Thonotosassa,+FL+33592',
      },
    },
    {
      label: 'Food',
      text: `We are asking you to bring a side dish or dessert to share (enough to serve approximately 10 people). 
      The church will provide the meat and drinks. `,
    },
    {
      label: 'Gift exchange',
      text: "Bring a wrapped gift valued at $15 or less if you'd like to participate.",
    },
    {
      label: 'Ministry Center donations',
      text: "We'll also be collecting new blankets, towels, and socks for the Mission Hill Ministry Center. Please consider bringing an item to support this ministry.",
    },
  ],

  signupNote: "Please use the sign-up below to let us know you're coming and what dish you plan to bring.",
  closing: 'We look forward to celebrating Christmas together and enjoying a great evening of fellowship!',
};
