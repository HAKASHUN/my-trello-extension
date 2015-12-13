(function(){
  'use strict';

  var fontDefinition =
    '@font-face {' +
    'font-family: "my-trello-extension-font";' +
    'src: url("' + chrome.extension.getURL("/fonts/my-trello-extension-font.ttf") + '");' +
    '}';
  var styleNode = document.createElement ("style");
  styleNode.type          = "text/css";
  styleNode.textContent = fontDefinition;
  document.head.appendChild (styleNode);

  var config = {
    padding: 11,
    maxWidth: 270,
    minWidth: 140,
    maxFontSize: 14,
    minFontSize: 12,
    maxMemberSize: 30,
    minMemberSize: 20,
    title: 'my-trello-extension',
    label: {
      slim: 'Slim Lists',
      fat: 'Fat Lists'
    }
  };

  var button = createFitButton();
  var slimmed = false;

  init();

  function init() {
    var ob = new MutationObserver(function(records){
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if(record.target.id === 'content') {
          addFitButton();
          addWiderButton();
          unwideLists();
          unfitLists();
          break;
        }
      }
    });
    ob.observe(document.body, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }

  function createFitButton() {
    var fitButtonElement = document.createElement('a');
    fitButtonElement.className = 'board-header-btn';
    var fitButtonTextElement = document.createElement('span');
    fitButtonTextElement.className = 'board-header-btn-text';
    fitButtonTextElement.textContent = config.label.slim;
    var fitButtonIconElement = document.createElement('span');
    fitButtonIconElement.className = 'board-header-btn-icon icon-mte icon-mte-slim';
    fitButtonElement.appendChild(fitButtonIconElement);
    fitButtonElement.appendChild(fitButtonTextElement);
    fitButtonElement.addEventListener('click', handleFit);

    return fitButtonElement;
  }

  function handleFit() {
    if (slimmed) {
      unfitLists();
    } else {
      fitLists();
    }
  }

  function handleWider(e) {
    var listWrapperElement = getClosestClassElement(e.target, 'list-wrapper');
    var isWided = document.getElementById('my-trello-extension-wide-' + listWrapperElement.id);
    if (isWided) {
      unwideList(e);
    } else {
      wideList(e);
    }
  }

  function updateButtonStatus() {
    var textElement = button.getElementsByClassName('board-header-btn-text');

    if (!textElement[0]) {
      return;
    }

    if (slimmed) {
      textElement[0].textContent = config.label.fat;
    } else {
      textElement[0].textContent = config.label.slim;
    }
  }

  function addFitButton() {
    var container = document.getElementsByClassName('board-header-btns mod-left');
    if(!container[0]) {
      return;
    }
    slimmed = false;
    container[0].appendChild(button);
  }

  function addWiderButton() {
    var lists = document.getElementsByClassName('js-list list-wrapper');

    for(var i = 0; i < lists.length; i++) {
      var listElement = lists[i];
      listElement.id = 'js-list-' + i;
      var buttonWrapperElement = listElement.getElementsByClassName('js-list-header')[0];

      if (buttonWrapperElement) {
        var buttonElement = document.createElement('a');
        buttonElement.className = 'js-list-wider-btn icon-mte icon-mte-wider';
        buttonWrapperElement.appendChild(buttonElement);
        buttonElement.addEventListener('click', handleWider);
      }

    }

  }

  function fitLists() {
    var lists = document.getElementsByClassName('list-wrapper');
    var listArea = document.getElementById('board');
    var listAreaWrapper = document.getElementsByClassName('board-wrapper');
    var listHeaderName = document.getElementsByClassName('list-header-name');

    if (!lists[0] || !listAreaWrapper[0] || !listArea || !listHeaderName[0]) {
      return;
    }

    slimmed = true;
    updateButtonStatus();
    removeAllWideStyleElement();

    var maxWidth = config.maxWidth;
    var minWidth = config.minWidth;
    var padding = config.padding;
    var maxFontSize = config.maxFontSize;
    var minFontSize = config.minFontSize;
    var maxMemberSize = config.maxMemberSize;
    var minMemberSize = config.minMemberSize;
    var listAreaWrapperWidth = listAreaWrapper[0].offsetWidth;
    var idealListWidth = Math.floor((listAreaWrapperWidth / (lists.length - 1)) - padding);
    var idealFontSize = Math.floor(maxFontSize * idealListWidth / maxWidth);
    var idealMemberSize = Math.floor(maxMemberSize * idealListWidth / maxWidth);
    if (idealFontSize < minFontSize) {
      idealFontSize = minFontSize;
    }
    if (idealMemberSize < minMemberSize) {
      idealMemberSize = minMemberSize;
    }
    var styleElement = document.createElement('style');
    styleElement.id = config.title;
    styleElement.setAttribute('type', 'text/css');
    document.getElementsByTagName('head').item(0).appendChild(styleElement);

    var sheet = styleElement.sheet;
    if(listAreaWrapperWidth < (lists.length * maxWidth)) {

      if(idealListWidth > minWidth && idealListWidth < maxWidth) {
        sheet.insertRule(createStyleRule('.list-wrapper', {
          'width': idealListWidth + 'px'
        }), 0);
        sheet.insertRule(createStyleRule('.list-header-name', {
          'font-size': idealFontSize + 'px'
        }), 0);
        sheet.insertRule(createStyleRule('.list-card-details .member, .list-card-details .member-avatar, .list-card-details .member-initials', {
          'width':        idealMemberSize +'px',
          'height':       idealMemberSize +'px',
          'line-height':  idealMemberSize + 'px'
        }), 0);
      } else if (idealListWidth <= minWidth) {
        idealListWidth = minWidth;
        sheet.insertRule(createStyleRule('.list-wrapper', {
          'width': idealListWidth + 'px'
        }), 0);
        sheet.insertRule(createStyleRule('.list-header-name', {
          'font-size': idealFontSize + 'px'
        }), 0);
        sheet.insertRule(createStyleRule('.list-card-details .member, .list-card-details .member-avatar, .list-card-details .member-initials', {
          'width':        idealMemberSize +'px',
          'height':       idealMemberSize +'px',
          'line-height':  idealMemberSize + 'px'
        }), 0);
      }

    }
    if(idealListWidth < maxWidth) {
      sheet.insertRule(createStyleRule('#board', {
        'font-size': idealFontSize +'px!important'
      }), 0);
    }

  }

  function unfitLists() {
    var styleElement = document.getElementById(config.title);
    if (!styleElement) {
      return;
    }
    slimmed = false;
    updateButtonStatus();
    styleElement.remove();
  }

  function wideList(e) {
    if (slimmed) {
      unfitLists();
    }
    var boardElement = document.getElementById('board');
    var listAreaWrapper = document.getElementsByClassName('board-wrapper')[0];
    var listWrapperElement = getClosestClassElement(e.target, 'list-wrapper');
    var listAreaWrapperWidth = listAreaWrapper.offsetWidth;

    var adjustRate = Math.floor(listAreaWrapperWidth / (config.maxWidth + config.padding));

    if (adjustRate > 1) {
      removeWideStyleElement(listWrapperElement.id);
      var styleElement = getWideStyleElement(listWrapperElement.id);
      document.getElementsByTagName('head').item(0).appendChild(styleElement);
      var sheet = styleElement.sheet;
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id, {
        'width': (((config.maxWidth + config.padding) * adjustRate) + 16) +'px'
      }), 0);
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id + ' .list-card', {
        'display':        'inline-block',
        'vertical-align': 'top',
        'margin-right':   config.padding + 'px',
        'width':          config.maxWidth +'px'
      }), 0);
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id + ' .list-card:nth-child(' + adjustRate + 'n)', {
        'margin-right': 0
      }), 0);
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id + ' .list-card-cover', {
        'display':                    'none',
        'opacity':                    0,
        'animation-name':             'fade-in',
        'animation-duration':         '0.5s',
        '-webkit-animation-name':     'fade-in',
        '-webkit-animation-duration': '0.5s'
      }), 0);
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id + ' .list-card:hover .list-card-cover', {
        'display': 'block',
        'opacity': 1
      }), 0);
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id + ' .list-card-title', {
        'min-height': '80px'
      }), 0);
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id + ' .list-card-members:empty', {
        'height':  '34px',
        'display': 'block'
      }), 0);
      sheet.insertRule(createStyleRule('#' + listWrapperElement.id + ' .list-card-labels:empty', {
        'height':  '19px',
        'display': 'block'
      }), 0);
    } else {
      unwideList(e)
    }

    boardElement.scrollLeft = (listWrapperElement.offsetLeft - config.padding > 0) ? listWrapperElement.offsetLeft - config.padding : 0;

  }

  function unwideList(e) {
    var listWrapperElement = getClosestClassElement(e.target, 'list-wrapper');
    removeWideStyleElement(listWrapperElement.id);
  }

  function unwideLists() {
    removeAllWideStyleElement();
  }

  function getWideStyleElement(index) {
    var element = document.getElementById(config.title + '-wide-' + index);
    if (!element) {
      element = document.createElement('style');
      element.id = config.title + '-wide-' + index;
      element.className = config.title + '-wide';
      element.setAttribute('type', 'text/css');
    }
    return element;
  }

  function removeWideStyleElement(index) {
    var element = document.getElementById(config.title + '-wide-' + index);
    if (element) {
      element.remove();
    }
  }

  function removeAllWideStyleElement() {
    var elements = document.getElementsByClassName(config.title + '-wide');
    for (var i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  }

  function getClosestClassElement(element, className) {
    do {
      if(element.classList.contains(className))
        return element;
    } while(element = element.parentNode);
    return null;
  }

  function createStyleRule(selector, properties) {
    var rule = '';
    var prop;

    for (prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        rule += prop + ': ' + properties[prop] + ';';
      }
    }

    return selector + '{' + rule + '}';
  }

})();
