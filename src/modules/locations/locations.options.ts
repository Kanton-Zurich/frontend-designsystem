interface ModuleDomSelectors {
  map: string,
  listItems: string,
  distanceAnnotation: string
  filterInput: string,
  linkList: string,
  filterHead: string,
  sidebar: string,
  backBtn: string,
  detailNodes: string,
  toggleListBtn: string,
  emptyListHint: string,
  notFoundTextTemplate: string,
}
interface ModuleStateClasses {
  sidebar: {
    opened: string,
    notFound: string,
    onDetails: string,
  },
  detailShow: string,
  mapMarkerIsHovered: string,
  listItemHide: string,
}
export interface LocationsModuleOptions { // eslint-disable-line
  focusDelay: number,
  attrNames: {
    itemIndex: string;
    locDistance: string;
  }
  domSelectors: ModuleDomSelectors
  stateClasses: ModuleStateClasses
}

const focusDelay = 500;
const attrNames = {
  itemIndex: 'data-linklist-itemindex',
  locDistance: 'data-location-distance',
};
const domSelectors: ModuleDomSelectors = {
  map: '[data-map-view=map]',
  listItems: '[data-locations="listItem"]',
  distanceAnnotation: '.atm-linklist_item__distance',
  filterInput: '[data-locations="input"]',
  sidebar: '[data-locations="sidebar"]',
  backBtn: '[data-locations="back"]',
  linkList: '.mdl-locations__filter .mdl-linklist',
  filterHead: '.mdl-locations .mdl-locations__filter_head',
  detailNodes: '[data-locations="locationDetails"]',
  toggleListBtn: '[data-locations="toggleList"]',
  emptyListHint: '[data-locations="emptyNote"]',
  notFoundTextTemplate: '[data-locations="emptyNoteTextTemplate"]',
};
const stateClasses: ModuleStateClasses = {
  sidebar: {
    opened: 'opened',
    notFound: 'empty',
    onDetails: 'show-details',
  },
  detailShow: 'show',
  mapMarkerIsHovered: 'marker-hovered',
  listItemHide: 'hide',
};

export const DefaultOptions: LocationsModuleOptions = { // eslint-disable-line
  focusDelay,
  attrNames,
  domSelectors,
  stateClasses,
};
