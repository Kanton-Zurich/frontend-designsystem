const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;
const textLinkDefaultData = require('../../atoms/text_link/text_link.data').variants.default.props;
const inputClearButtonSmallWithIconData = require('../../atoms/form_input/form_input.data').variants
  .clearButtonSmallWithIcon.props;
const mapViewDefaultData = require('../map_view/map_view.data').variants.default.props;
const locationContactEntryDefault = require('../contact_entry/contact_entry.data').variants.location
  .props;

const locationsLatLng = [
  { lat: 47.353611, lng: 8.512877 },
  { lat: 47.44424, lng: 8.613319 },
  { lat: 47.44424, lng: 8.613319 }, // { lat: 47.441567, lng: 8.461398 },
  { lat: 47.515148, lng: 8.693981 },
  { lat: 47.532225, lng: 8.527852 },
  { lat: 47.27153, lng: 8.585463 },
];

const locationsLatLngForJurisdictionFinder = [
  { lat: 47.2770498, lng: 8.4542402 },
  { lat: 47.5209099, lng: 8.5419414 },
  { lat: 47.4802427, lng: 8.4509463 },
  { lat: 47.4054094, lng: 8.3990406 },
  { lat: 47.3981437, lng: 8.6187859 },
  { lat: 47.2611269, lng: 8.5971554 },
  { lat: 47.45413704531806, lng: 8.580374203601023 },
  { lat: 47.2801762, lng: 8.6148648 },
  { lat: 47.3645159, lng: 8.783492 },
  { lat: 47.4386126, lng: 8.4752331 },
  { lat: 47.261694, lng: 8.852738 },
  { lat: 47.3471118, lng: 8.7157254 },
  { lat: 47.498337, lng: 8.738514 },
  { lat: 47.5939858, lng: 8.6792779 },
];

const ariaDescribedBy = {
  id: 'aria-filters-list',
  text: 'Die Standortliste wird gefiltert.',
};

const locationsAsListItemLinks = [
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
    linkListItemLabel: 'Uetlibergstrasse 301, 8036 Zürich',
    linkListItemHref: false,
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Bassersdorf',
    linkListItemLabel: 'Grindelstrasse 22, 8303 Bassersdorf',
    linkListItemHref: false,
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
    linkListItemLabel: 'Riedthofstrasse 192, 8105 Regensdorf',
    linkListItemHref: false,
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
    linkListItemLabel: 'Taggenbergstrasse 1, 8408 Winterthur',
    linkListItemHref: false,
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
    linkListItemLabel: 'Schützenmatt Strasse 120, 8180 Bülach',
    linkListItemHref: false,
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
    linkListItemLabel: 'Seestrasse 87, 8942 Oberrieden',
    linkListItemHref: false,
  },
];

const locationsAsContacts = [
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'Strassenverkehrsamt Kanton Zürich',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Uetlibergstrasse 301',
      zip: '8036',
      city: 'Zürich',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'Strassenverkehrsamt Bassersdorf',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Grindelstrasse 22',
      zip: '8303',
      city: 'Bassersdorf',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Riedthofstrasse 192',
      name: 'Postfach 420',
      zip: '8105',
      city: 'Regensdorf',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'Strassenverkehrsamt Kanton Zürich',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Taggenbergstrasse 1',
      zip: '8408',
      city: 'Winterthur',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Schützenmatt Strasse 120',
      zip: '8180',
      city: 'Bülach',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Seestrasse 87',
      zip: '8942',
      city: 'Oberrieden',
    },
  }),
];

const locationsAsListItemLinksForJurisdictionFinder = [
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Affoltern',
    linkListItemLabel: 'Im Winkel 2, 8910 Affoltern am Albis',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8914, 8914, 8910, 8915, 8912, 8906, 8932, 8932, 8143, 8925, 8143, 8143, 8926, 8915, 8908, 8932, 8926, 8934, 8143, 8933, 8932, 8915, 8912, 8913, 8911, 8932, 8906, 8143, 8143, 8912, 8926, 8143, 8912, 8907, 8909, Aeugstertal, Aeugst a. A, Affoltern a. A, Albisbrunn, Bickwil/Obfelden, Bonstetten, Dachelsen, Dachlissen, Dägerst (Stallikon), Ebertswil, Felsenegg, Gamlikon, Hauptikon, Hausen a. A., Hedingen, Herferswil, Kappel a. A., Knonau, Mädikon, Maschwanden, Mettmenstetten, Oberalbis, Obfelden, Ottenbach, Rifferswil, Rossau, Schachen, Sellenbüren, Stallikon, Toussen, Uerzlikon, Uetliberg, Unterlunnern, Wettswil, Zwillikon"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Bülach',
    linkListItemLabel: 'Schaffhauserstrasse 53, 8180 Bülach',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8426, 8184, 8180, 8193, 8424, 8180, 8427, 8192, 8182, 8181, 8194, 8426, 8180, 8425, 8197, 8192, 8427, 8192, 8185, 8428, 8193, 8195, 8196, 8185, 8192, Augwil, Bachenbülach, Bülach, Eglisau, Embrach, Eschenmosen, Freienstein, Glattfelden, Hochfelden, Höri, Hüntwangen, Lufingen, Nussbaumen, Oberembrach, Rafz, Rheinsfelden, Rorbas, Schachen, Seeb, Teufen, Tössriederen, Wasterkingen, Wil, Winkel, Rüti, Seeb, Zweidlen"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Dielsdorf',
    linkListItemLabel: 'Spitalstrasse 11, 8157 Dielsdorf',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8164, 8165, 8157, 8155, 8155, 8173, 8172, 8155, 8166, 8154, 8156, 8165, 8175, 8158, 8173, 8165, 8165, 8175, 8174, 8162, 8162, 8165, 8187, 8175, Bachs, Dachslern, Dielsdorf, Mettmenhasli, Nassenwil, Neerach, Niederglatt, Niederhasli, Niederweningen, Oberglatt, Oberhasli, Oberweningen, Raat, Regensberg, Riedt, Schleinikon, Schöfflisdorf, Schüpfheim, Stadel b. Niederglatt, Steinmaur, Sünikon, Wasen, Weiach, Windlach"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Dietikon',
    linkListItemLabel: 'Badenerstrasse 5 + 9, 8953 Dietikon',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8904, 8903, 8953, 8951, 8954, 8903, 8102, 8955, 8142, 8952, 8953, 8142, 8103, 8902, 8142, 8104, Aesch b. Birmensdorf, Birmensdorf, Dietikon, Fahrweid, Geroldswil, Landikon, Oberengstringen, Oetwil a.d. Limmat, Ringlikon, Schlieren, Schönenwerd, Uitikon, Unterengstringen, Urdorf, Waldegg, Weiningen"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Dübendorf',
    linkListItemLabel: 'Wallisellenstrasse 5, 8600 Dübendorf',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8121, 8306, 8600, 8117, 8044, 8600, 8118, 8600, 8602, 8603, Benglen, Brüttisellen, Dübendorf, Fällanden, Gockhausen, Hermikon, Pfaffhausen, Stettbach, Wangen, Schwerzenbach"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Horgen',
    linkListItemLabel: 'Bahnhofstrasse 6, 8810 Horgen',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8804, 8802, 8805, 8816, 8810, 8815, 8825, 8805, 8803, 8833, 8824, 8820, Au ZH, Bendlikon (Kilchberg ZH), Burghalden, Hirzel, Horgen, Horgenberg, Hütten, Richterswil, Rüschlikon, Samstagern, Schönenberg, Wädenswil, 8134, 8136, 8802, 8135, 8134, 8942, 8135, 8135, 8824, 8800, Adliswil, Gattikon, Kilchberg, Langnau a. A., Oberleimbach, Oberrieden, Sihlbrugg, Sihlwald, Tannen, Thalwil"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Kloten',
    linkListItemLabel: 'Ifangstrasse 10b, 8302 Kloten',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8303, 8303, 8309, 8305, 8302, 8302, 8152, 8152, 8302, 8309, 8309, 8152, 8304, Baltenswil, Bassersdorf, Birchwil, Dietlikon, Egetswil, Gerlisberg, Glattbrugg, Glattpark, Kloten, Nürensdorf, Oberwil b. Nürensdorf, Opfikon, Wallisellen"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Meilen',
    linkListItemLabel: 'General-Wille-Strasse 59, Eingang B, 8706 Feldmeilen',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8706, 8706, 8703, 8714, 8706, 8700, 8704, 8634, 8700, 8712, 8700, 8127, 8708, 8706, 8706, 8618, 8712, 8713, 8708, 8126, 8704, 8125, 8702, 8126, Bergmeilen, Dollikon, Erlenbach, Feldbach, Feldmeilen, Goldbach, Herrliberg, Hombrechtikon, Itschnach, Kehlhof, Küsnacht, Limberg, Männedorf, Meilen, Obermeilen, Oetwil a. See, Stäfa, Uerikon, Uetikon a. See, Waltikon, Wetzwil, Zollikerberg, Zollikon, Zumikon"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Pfäffikon',
    linkListItemLabel: 'Pilatusstrasse 12, 8330 Pfäffikon',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8308, 8331, 8494, 8307, 8307, 8314, 8307, 8493, 8483, 8484, 8335, 8307, 8489, 8315, 8320, 8310, 8330, 8335, 8308, 8308, 8330, 8335, 8493, 8310, 8314, 8484, 8315, 8494, 8307, 8322, 8484, 8307, 8335, 8307, 8330, 8307, 8332, 8332, 8493, 8482, 8494, 8494, 8499, 8317, 8484, 8493, 8330, 8484, 8494, 8492, 8489, 8335, 8332, 8312, Agasul, Auslikon, Bauma, Bietenholz, Billikon Illnau-Effretikon, Billikon Kyburg, Bisikon, Blitterswil, Brünggen , Dettenried, Dürstelen, Effretikon, Ehrikon, Eschikon, Fehraltdorf, Grafstal, Hermatswil, Hittnau, Horben, Illnau, Irgenhausen, Isikon, Juckern, Kemptthal, Kyburg, Lendikon, Lindau, Lipperschwändi, Luckhausen, Madetswil, Neschwil, Oberkempttal, Oberhittnau, Ottikon, Pfäffikon, Rikon b. Effr., Rumlikon, Russikon, Saland, Schalchen, Schindlet, Schwendi, Sternenberg, Tagelswangen, Theilingen, Undalen, Wallikon, Weisslingen, Wellenau, Wila, Wildberg, Wilen, Wilhof, Winterberg"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Regensdorf',
    linkListItemLabel: 'Eichwatt 5, 8105 Regensdorf',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8106, 8153, 8113, 8107, 8108, 8114, 8115, 8153, 8112, 8105, 8153, 8105, Adlikon bei Regensdorf, Bärenbohl, Boppelsen, Buchs, Dällikon, Dänikon, Hüttikon, Katzenrüti, Otelfingen, Regensdorf, Rümlang, Watt"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Rüti',
    linkListItemLabel: 'Joweid Zentrum 1, 8630 Rüti',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8607, 8345, 8627, 8344, 8614, 8344, 8627, 8340, 8608, 8636, 8635, 8620, 8340, 8630, 8497, 8498, 8340, 8625, 8627, 8624, 8340, 8626, 8340, 8636, 8634, 8636, 8627, 8926, 8623, 8637, 8308, 8344, 8635, 8626, 8340, 8620, 8630, 8607, 8496, 8632, 8630, 8636, 8344, 8342, 8620, 8633, Aathal/Seegräben, Adetswil, Adeltshausen, Bäretswil, Bertschikon, Bettswil, Binzikon, Bossikon, Bubikon, Dieterswil, Dürnten, Emmetschloo, Erlosen, Fägswil, Fischenthal, Gibswil, Girenbad, Gossau, Grüningen, Grüt, Hadlikon, Herschmettlen, Hinwil, Hittenberg, Hueb, Hüebli, Itzikon, Kämmoosbad, Kempten, Laupen, Mesikon, Neuthal, Oberdürnten, Ottikon, Ringwil, Robenhausen, Rüti, Seegräben, Steg, Tann, Unterbach, Wald, Wappenswil, Wernetshausen, Wetzikon, Wolfhausen"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Uster',
    linkListItemLabel: 'Schulweg 4, 8610 Uster',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8127, 8122, 8123, 8132, 8133, 8127, 8615, 8606, 8605, 8604, 8132, 8604, 8124, 8617, 8606, 8616, 8127, 8614, 8124, 8610, 8604, 8615, 8606, 8604, Aesch b. Maur, Binz, Ebmatingen, Egg, Esslingen, Forch, Freudwil, Greifensee, Gutenswil, Hegnau, Hinteregg, Kindhausen, Maur, Mönchaltorf, Nänikon, Riedikon, Scheuren, Sulzbach, Uessikon, Uster, Volketswil, Wermatswil, Werrikon, Zimikon"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'kjz Winterthur',
    linkListItemLabel: 'St. Gallerstrasse 42, 8400 Winterthur',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8412, 8479, 8544, 8471, 8544, 8311, 8471, 8421, 8406, 8354, 8474, 8405, 8353, 8548, 8352, 8474, 8354, 8405, 8543, 8523, 8409, 8442, 8354, 8354, 8412, 8488, 8405, 8543, 8483, 8486, 8543, 8411, 8546, 8413, 8488, 8418, 8488, 8418, 8471, 8404, 8472, 8422, 8487, 8352, 8404, 8544, 8474, 8412, 8486, 8471, 8354, 8418, 8495, 8523, 8352, 8488, 8405, 8482, 8472, 8495, 8404, 8545, 8406, 8488, 8400, 8418, 8474, 8354, 8542, 8400, 8487, 8353, 8408, Aesch b. Neftenbach, Altikon, Attikon, Bänk (Dägerlen), Bertschikon (Gundetswil), Brütten, Dägerlen, Dättlikon, Dättnau, Dickbuch, Dinhard, Eidberg, Elgg, Ellikon an der Thur, Elsau, Eschlikon, Geretswil, Gotzenwil, Gundetswil, Hagenbuch, Hegi, Hettlingen, Hofstetten, Huggenberg, Hünikon, Hutzikon, Iberg, Kefikon, Kollbrunn, Langenhard b. Rikon im Tösstal , Liebensberg, Mattenbach, Menzengrüt, Neftenbach, Neubrunn b. Turbenthal, Nussberg b. Schlatt, Oberhofen b. Turbenthal, Oberschlatt, Oberwil b. Dägerlen, Oberwinterthur, Ohringen b. Seuzach, Pfungen, Rämismühle, Räterschen, Reutlingen, Rickenbach b. Attikon, Riedmühle, Riet b. Aesch/Neftenbach, Rikon im Tösstal, Rutschwil-Dägerlen, Scheunberg, Schlatt b. Winterthur, Schmidrüti, Schneit b. Hagenbuch, Schottikon, Seelmatten b. Turbental, Seen, Sennhof b. Winterthur, Seuzach, Sitzberg b. Schmidrüti, Stadel b. Winterthur, Sulz, Töss, Turbenthal, Veltheim, Waltenstein, Welsikon, Wenzikon, Wiesendangen, Winterthur, Zell, Zünikon b. Elgg"',
  },
  {
    isButton: true,
    linkListItemIsLocation: true,
    linkListItemTitle: 'Zentrum Breitenstein',
    linkListItemLabel: 'Landstrasse 36, 8450 Andelfingen',
    linkListItemHref: false,
    additionalAttributes:
      'data-filter-attr="8452, 8453, 8450, 8414, 8463, 8415, 8414, 8475, 8447, 8452, 8414, 8458, 8464, 8246, 8416, 8247, 8280, 8475, 8415, 8468, 8478, 8444, 8457, 8451, 8475, 8246, 8447, 8460, 8452, 8212, 8477, 8461, 8475, 8462, 8465, 8478, 8466, 8467, 8248, 8476, 8459, 8468, 8465, 8414, Adlikon bei Andelfingen, Alten, Andelfingen, Bebikon (Buch am Irchel), Benken ZH, Berg am Irchel, Buch am Irchel, Burghof, Dachsen, Dätwil, Desibach, Dorf, Ellikon am Rhein, Feuerthalen, Flaach, Flurlingen, Girsberg, Gisenhard/Ossingen, Gräslikon, Guntalingen, Gütighausen, Henggart, Humlikon, Kleinandelfingen, Langenmoos, Langwiesen, Laufen, Marthalen, Niederwil, Nohl, Oberstammheim, Oerlingen, Ossingen, Rheinau, Rudolfingen, Thalheim, Trüllikon, Truttikon, Uhwiesen, Unterstammheim, Volken, Waltalingen, Wildensbuch, Wiler"',
  },
];

const locationsAsContactsForJurisdictionFinder = [
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Affoltern',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Im Winkel 2',
      zip: '8910',
      city: 'Affoltern am Albis',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Bülach',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Schaffhauserstrasse 53',
      zip: '8180',
      city: 'Bülach',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Dielsdorf',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Spitalstrasse 11',
      zip: '8157',
      city: 'Dielsdorf',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Dietikon',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Badenerstrasse 5 + 9',
      zip: '8953',
      city: 'Dietikon',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Dübendorf',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Wallisellenstrasse 5',
      zip: '8600',
      city: 'Dübendorf',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Horgen',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Bahnhofstrasse 6',
      zip: '8810',
      city: 'Horgen',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Kloten',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Ifangstrasse 10b',
      zip: '8302',
      city: 'Kloten',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Meilen',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'General-Wille-Strasse 59',
      name: 'Eingang B',
      zip: '8706',
      city: 'Feldmeilen',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Pfäffikon',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Pilatusstrasse 12',
      zip: '8330',
      city: 'Pfäffikon',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Regensdorf',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Eichwatt 5',
      zip: '8105',
      city: 'Regensdorf',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Rüti',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Joweid Zentrum 1',
      zip: '8630',
      city: 'Rüti',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Uster',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Schulweg 4',
      zip: '8610',
      city: 'Uster',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'kjz Winterthur',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'St. Gallerstrasse 42',
      zip: '8400',
      city: 'Winterthur',
    },
  }),
  _.merge({}, locationContactEntryDefault, {
    entryHeading: {
      title: 'Zentrum Breitenstein',
      level: 4,
      href: '#',
    },
    entryAddress: {
      street: 'Landstrasse 36',
      zip: '8450',
      city: 'Andelfingen',
    },
  }),
];

const template = dataHelper.getFileContent('locations.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Standorte',
    className: 'Locations',
    jira: 'CZHDEV-476',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Standorte des Strassenverkehrsamtes',
    headingLevel: 2,
    visualHeadingLevel: 2,
    noPlzFound: 'Keine PLZ / Ort gefunden',
    ariaDescribedBy,
    locationsFormInput: _.merge({}, inputClearButtonSmallWithIconData, {
      label: 'Standorte filter',
      dataSelector: 'data-locations="input"',
      type: 'text',
      ariaDescribedBy,
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    }),
    locationsList: {
      ariaLive: 'polite',
      filterListId: 'standorteFList',
      hasIndex: true,
      links: [],
    },
    backBtn: _.merge({}, buttonDefaultData, {
      additionalClasses: 'atm-button--plain-text',
      isSecondary: false,
      additionalAttribute: 'data-locations="back"',
      text: 'Zurück',
      icon: 'arrow-left',
    }),
    textLinkNoResult: _.merge({}, textLinkDefaultData, {
      icon: 'inspect',
      text: 'Gesamte Webseite nach «{searchTerm}» durchsuchen',
      additionalAttribute: 'data-locations="emptyNote"',
      isInverted: false,
      hasLeadingIcon: true,
      hasTrailingIcon: false,
    }),
    toggleListBtn: _.merge({}, buttonDefaultData, {
      isTextVisible: false,
      isInverted: true,
      icon: 'menu-list',
      text: 'anzeigen',
      additionalAttribute: 'data-locations="toggleList"',
    }),
    locationContacts: [],
    mapData: _.merge({}, mapViewDefaultData, {
      withUserLocate: true,
      mapMarker: [],
    }),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        locationsList: {
          hasIndex: true,
          links: locationsAsListItemLinks,
        },
        hasFilter: true,
        locationContacts: locationsAsContacts,
        mapData: {
          mapId: _.uniqueId('locations_map'),
          mapMarker: locationsLatLng,
        },
      },
    },
    noFilter: {
      meta: {
        title: 'Ohne Filter',
        desc: 'Für Zuständigkeitsfinder: zeigt die Standorte ohne Filter an, da die Filterung ausserhalb des Moduls erfolgt.',
      },
      props: {
        title: null,
        locationsList: {
          hasIndex: true,
          links: locationsAsListItemLinksForJurisdictionFinder,
        },
        errorMessage: {
          message: 'Für diese Postleitzahl wurde nichts gefunden. Bitte prüfen Sie Ihre Eingabe.',
          icon: '#caution',
          isGreen: false,
          isBig: false,
        },
        locationContacts: locationsAsContactsForJurisdictionFinder,
        subTitle: 'Beratungsangebote für 8302 Kloten',
        mapData: {
          mapId: _.uniqueId('locations_map'),
          mapMarker: locationsLatLngForJurisdictionFinder,
        },
      },
    },
    singleLocation: {
      meta: {
        title: 'Nur ein Eintrag mit H3 Style',
        desc: 'Shows module with only one single location entry.',
      },
      props: {
        visualHeadingLevel: 3,
        locationsList: {
          hasIndex: true,
          links: [locationsAsListItemLinks[0]],
        },
        locationContacts: [locationsAsContacts[0]],
        mapData: {
          mapId: _.uniqueId('locations_map'),
          mapMarker: [locationsLatLng[0]],
        },
      },
    },
    empty: {
      meta: {
        title: 'Leer',
        desc: 'Shows module with only one single location entry.',
      },
      props: {
        locationsList: {
          hasIndex: true,
          links: [],
        },
        locationContacts: [],
        mapData: {
          mapId: _.uniqueId('locations_map'),
          mapMarker: [],
        },
      },
    },
  },
  (variant) => {
    const variantProps = _.merge({}, data, variant).props;
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.merge({}, data, variant, {
      meta: {
        demo: compiledVariant,
        code: {
          handlebars: dataHelper.getFormattedHandlebars(template),
          html: dataHelper.getFormattedHtml(compiledVariant()),
          data: dataHelper.getFormattedJson(variantProps),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
