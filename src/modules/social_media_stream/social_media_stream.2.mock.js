/* eslint-disable no-template-curly-in-string */
const data = {
  posts: [
    {
      channel: 'Instagram',
      datetime: '16. Juli',
      text: 'Hopp Schwiiz 🇨🇭',
      image: '../../assets/media/image/content_768_x15.jpeg',
      link: 'http://www.instagram.com/post',
      author: {
        name: '@jaquelinefehr',
        link: 'https://www.instagram.com/author-link',
      },
      icon: '../../assets/media/image/instagram.svg',
      likes: 233,
      comments: 2,
      forwards: 2,
    },
    {
      channel: 'Twitter',
      datetime: '26. Juni',
      text: 'Willkommen! Wir freuen uns sehr auf dich <a class="atm-textlink" href="#" target="_blank">@Han_Nussbaumer</a> und sind froh um die Verstärkung ‼️',
      link: 'http://www.twitter.com/tweet',
      author: {
        name: '@jaquelinefehr',
        link: 'https://www.twitter.com/author-link',
      },
      icon: '../../assets/media/image/twitter.svg',
      likes: 4,
      comments: 1,
      forwards: 1,
      cite: {
        channel: 'Twitter',
        datetime: '24. Juni',
        text: 'In eigener Sache: Nach 20 erfüllten Jahren bei @tagesanzeiger nehme ich eine neue Herausforderung an und freue mich sehr darauf. Ab Herbst gehöre ich zum Kommunikationsstab ...<a class="atm-textlink" href="#" target="_blank"> Mehr anzeigen</a>',
        icon: '../../assets/media/image/twitter.svg',
        link: 'http://www.twitter.com/post2',
        author: {
          name: '@Han_Nussbaumer',
          link: 'https://www.twitter/author-link',
        },
        likes: 2,
        comments: 4,
        forwards: 7,
      },
    },
  ],
  hasMorePosts: false,
};

module.exports = data;
