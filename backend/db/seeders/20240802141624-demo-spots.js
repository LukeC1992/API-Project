"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
  options.validate = true;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "1138 Royal St",
          city: "New Orleans",
          state: "Louisiana",
          country: "United States of America",
          lat: 29.9618375,
          lng: -90.0611732,
          name: "Lalaurie Mansion",
          description:
            "American Horror Story: Coven reignited interest in this famous French Quarter haunt. In the series, Kathy Bates plays Madame Delphine LaLaurie, a real-life socialite and serial killer who orchestrated a torture chamber for enslaved people at the Royal Street mansion in the early 1830s (before responders to a fire uncovered her dark secret). LaLaurie's victims are said to haunt the property to this day-from the street, pedestrians have heard shouts, moans, and weeping, while some even claim to have seen ghostly faces in the upstairs windows. Even still, the house's ghastly history hasn't stopped wealthy buyers. Before losing the home to foreclosure in 2009, actor Nicolas Cage owned it, and today, a wealthy oil tycoon is said to hold the deed.",
          price: 400.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 3,
          address: "525 S Winchester Blvd",
          city: "San Jose",
          state: "California",
          country: "United States of America",
          lat: 37.3183318,
          lng: -121.9510491,
          name: "Winchester Mystery House",
          description:
            "Following the death of her husband, rifle magnate William Wirt Winchester, Sarah Winchester commissioned a Victorian labyrinth designed to repel the vengeful spirits of the lives taken by her husband's guns. The sprawling Queen Anne-style mansion-comprising four stories, 160 rooms, 10,000 window panes, and 47 stairways-is appointed with curious elements, such as staircases leading directly into the ceiling and windows that open onto secret passages.",
          price: 48.2,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "48 Monument Square",
          city: "Concord",
          state: "Massachusets",
          country: "United States of America",
          lat: 42.461624,
          lng: -71.34958,
          name: "Concord's Colonial Inn",
          description:
            "Due to the hotel's age and role during the American Revolutionary War, Concord's Colonial Inn in Concord, Massachusetts, is rumored to have a few resident ghosts. During the war, part of the historic inn was privately owned by Dr. Timothy Minot; it was where he operated a small medical practice. When Continental soldiers were injured at the Battles of Lexington and Concord at the North Bridge, they were brought to his home for medical attention. Dr. Minot used what is now the Liberty Room as a hospital and Room 24 as an operating room. Many guests who have spent the night in the infamously haunted room have reported some strange activity. Thrillseekers travel great distances to stay at the inn's infamous Room 24, hoping to catch a glimpse of some supernatural activity. But the inn's resident spirits do not just confine themselves to Room 24; they like to wander the halls of the Concord's Colonial Inn just as much as guests do. Both an older woman and a tall, slim gentleman with a top hat have been spotted in the sitting room-thought perhaps to be former residents Henry David Thoreau himself or his aunt entertaining company. A young girl wearing a bonnet has been seen walking around by the front desk of the hotel. Both guests and employees have spotted apparitions in 18th-century attire sitting in an otherwise empty Liberty Room. Books and décor fall from shelves without worldly cause, and items go missing without explanation for weeks, only to turn up in odd places. Both guests and employees have heard voices coming from right behind them-only to see nothing when they turn around",
          price: 144.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "7696 Sam Snead Hwy",
          city: "Hot Springs",
          state: "Virginia",
          country: "United States of America",
          lat: 37.9971278,
          lng: -79.8328445,
          name: "The Omni Homestead Resort",
          description:
            "Being widely known for its more than 250 years of grand hospitality and as a favorite vacation spot for European royalty and former U.S. Presidents and their families, it should come as no surprise that a guest or two of The Omni Homestead Resort in Hot Springs, Virginia, might decide to stay forever. One of the resort's most legendary spirits involves the spirit of a jilted bride who stalks along the 14th floor. Legend has it that this young woman was set to be wed at The Homestead during the early 20th century, but her groom-to-be had become plagued by second thoughts. On the day of their wedding, the groom instructed the young woman to wait in her hotel room while he ran out for a quick errand. Unfortunately, for the bride, her beloved was never to return. Distraught, she took her own life. Guests and staff have since reported sightings of a ghostly apparition, whose outline resembles that of a woman in a wedding gown. Many believe that she is still waiting in the hotel for her long-lost lover. Some lucky few have reportedly heard the spirit speak before disappearing in a flash. In addition to this legend, overnight staff tell stories of sightings while being on late-night duty in the Great Hall. There, some believe they have seen well-dressed couples descending the stairs, but when they look up to greet them, no one is there. Similarly, there is a man in a dark suit who stands at a balcony overlooking the opposite end of the Great Hall. Again, staff say they approach to greet him only to find no one there. The Omni Homestead Resort was established in 1766 and has been a Charter Member of Historic Hotels of America since 1989.",
          price: 544.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "58 State Cir",
          city: "Annapolis",
          state: "Maryland",
          country: "United States of America",
          lat: 38.9786921,
          lng: -76.4935141,
          name: "Historic Inns of Annapolis",
          description:
            "The Maryland Inn, one of the Historic Inns of Annapolis in Annapolis, Maryland, is reportedly haunted by a variety of specters since it was established in the 1770s. Supposed sightings by employees and guests include glimpses of shadowy figures dressed in Revolutionary War-era uniforms and 19th-century clothing. Unexplained noises, scents, and missing objects-experienced by some employees-are thought by some believers to have supernatural explanations. Local legend suggests that at least two of the ghosts are that of Navy Captain Charles Campbell and his intended bride, known only as The Bride. According to the tale, Captain Campbell and The Bride were separated while he was at sea, during which time The Bride waited for him at the Maryland Inn. Campbell was killed by a horse carriage as he was returning to be reunited with his love and she took her own life minutes later, both dying right outside the historic inn. Both The Bride and Captain Campbell are rumored to haunt the Maryland Inn to this day. According to authors Mike Carter and Julia Dray in Haunted Annapolis, The Bride paces around the fourth floor and Captain Campbell has been seen in his naval uniform in the basement taproom. For guests, experiencing the ghosts in residence is uncommon but not unheard of. Some guests in the fourth-floor rooms have felt a cold presence.",
          price: 329.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "30 Main Street",
          city: "Stockbridge",
          state: "Massachusets",
          country: "United States of America",
          lat: 42.2820201,
          lng: -73.3169042,
          name: "The Red Lion Inn",
          description:
            "Ghostly rumors swirl around The Red Lion Inn, in Stockbridge, Massachusetts, which has been visited by many paranormal investigators and mediums hoping to connect with guests from centuries past. Its idyllic setting, comforting atmosphere, and dedicated staff make The Red Lion Inn an exceptional example of New England hospitality and make the 250-year-old hotel a perfect place to spend eternity. The fourth floor has been said to have the most paranormal activity, and Guestroom 301 is also known to be a haunted hotspot. Housekeepers, staff, and guests have claimed to see a ghostly young girl carrying flowers and a man in a top hat. Cold spots, unexplained knocks, and electrical disturbances have all been reported. A few guests claim they awoke to the feeling of someone standing over them at the foot of the bed, but staff familiar with the goings-on at the inn describe the spirits as friendly. The Red Lion Inn was established in 1773 and has been a Charter Member of Historic Hotels of America since 1989.",
          price: 329.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "250 Wyandotte St",
          city: "Bethlehem",
          state: "Pennsylvania",
          country: "United States of America",
          lat: 40.6122068,
          lng: -75.3870851,
          name: "The Sayre Mansion",
          description:
            "The spirits at The Sayre Mansion in Bethlehem, Pennsylvania, reportedly have mischievous natures. Employees and guests report experiencing tugs at their clothing that cannot be explained, as well as television sets that mysteriously turn off. A maintenance tech was alone repairing a toilet when a small washer suddenly disappeared and ended up across the room under the bathmat. It seems as if a playful ghost wanted to start a game of hide and seek! The standing theory is that these playful spirits are the ghosts of children because the Sayre Mansion saw more than its fair share of tragedy in its early days. The Sayre Family moved into their Gothic Revival-style Victorian mansion in Bethlehem's prestigious Fountain Hill in 1858. Of the family's 12 children, eight survived into adulthood with six drawing their last breath at the family home. A paranormal investigation several years ago detected supernatural activity in several areas around the mansion. Throughout the year, including during the Halloween season, The Sayre Mansion hosts a Paranormal Experience. The overnight stay features a catered dinner in the mansion's refurbished basement, and a paranormal presentation and investigation led by a team of ghost hunters. The Sayre Mansion also periodically offers 60-minute evening Ghost Tours. Upcoming guided tours are scheduled for October 14 and 19. Contact the hotel for more information.",
          price: 235.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "2 E Wheelock St",
          city: "Hanover",
          state: "New Hampshire",
          country: "United States of America",
          lat: 43.7021932,
          lng: -72.29137,
          name: "Hanover Inn Dartmouth",
          description:
            "Deep in the storied history of Dartmouth College, one of the oldest colleges in America, founded in 1769, are the scattered ghost stories of youth and romance torn asunder. The most prominent among them is the sad tale of nine undergraduates who perished in 1934 in a carbon monoxide accident while sleeping in their fraternity house attic. The Alpha Theta house on North Main Street was razed in 1940 and a new one built on the spot, which is where the ghosts, literally come in. More than one Dartmouth student, alone late at night in the laundry room of the new basement finds himself face to face with a room that isn't there and a party of young men in tuxedos and their dates in ball gowns. Further investigation revealed that the faces of the apparitions matched the photographs of the nine who died. The women - who would have been unauthorized guests - are not identified. Ghosts also are said to haunt the room beneath the famous bell tower in Baker Library. The grand Greek Revival building at 9 School Street that is headquarters for Panarchy, a Dartmouth undergraduate society is said to be haunted. Even the Inn has a few ghosts who interact very selectively with guests. Perhaps the most enduring spirit is the one evoked by the Jack O'Lantern, the college's humor magazine that was founded in 1908 and welcomed the wry observations of Theodore Geisel, Class of 1925 who created his pen name Dr. Seuss to contribute to its pages.",
          price: 453.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "60 School St",
          city: "Boston",
          state: "Massachusets",
          country: "United States of America",
          lat: 42.3577676,
          lng: -71.0626809,
          name: "Omni Parker House",
          description:
            "This hotel was opened by Harvey Parker and he was involved with the operations of the building until his death in 1884. Over the years, many guests have reported seeing him inquiring about their stay-a true “spirited” hotelier even after his death.",
          price: 289.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
