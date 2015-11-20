(function(){
  'use strict';

  var config = {
    padding: 11,
    maxWidth: 260,
    minWidth: 140,
    maxFontSize: 18,
    minFontSize: 12,
    maxMemberSize: 30,
    minMemberSize: 20,
    label: 'Slim Lists',
    title: 'my-trello-extension'
  };

  var button = createButton();
  var slimmed = false;

  init();

  function init() {
    var ob = new MutationObserver(function(records){
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if(record.target.id === 'content') {
          addButton();
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

  function createButton() {
    var fitButtonElement = document.createElement('a');
    fitButtonElement.className = 'board-header-btn';
    var fitButtonTextElement = document.createElement('span');
    fitButtonTextElement.className = 'board-header-btn-text';
    fitButtonTextElement.textContent = config.label;
    var fitButtonIconElement = document.createElement('span');
    fitButtonIconElement.className = 'board-header-btn-icon icon-sm icon-board';
    fitButtonElement.appendChild(fitButtonIconElement);
    fitButtonElement.appendChild(fitButtonTextElement);
    fitButtonElement.addEventListener('click', handleClick);

    return fitButtonElement;
  }

  function handleClick() {
    if (slimmed) {
      unfitLists();
    } else {
      fitLists();
    }
  }

  function updateButtonStatus() {
    var textElement = button.getElementsByClassName('board-header-btn-text');

    if (!textElement[0]) {
      return;
    }

    if (slimmed) {
      textElement[0].textContent = 'Fat Lists';
    } else {
      textElement[0].textContent = config.label;
    }
  }

  function addButton() {
    var container = document.getElementsByClassName('board-header-btns mod-left');
    if(!container[0]) {
      return;
    }
    slimmed = false;
    container[0].appendChild(button);
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
    var newListAreaWidth = 0;
    var styleElement = document.createElement('style');
    styleElement.id = config.title;
    styleElement.setAttribute("type", "text/css");
    document.getElementsByTagName('head').item(0).appendChild(styleElement);

    var sheet = styleElement.sheet;
    if(listAreaWrapperWidth < (lists.length * maxWidth)) {

      if(idealListWidth > minWidth && idealListWidth < maxWidth) {
        sheet.insertRule('.list-wrapper{width:' + idealListWidth + 'px}', 0);
        sheet.insertRule('.list-header-name{font-size:'+ idealFontSize +'px}', 0);
        sheet.insertRule('.member, .member-avatar, .member-initials{width:'+ idealMemberSize +'px; height:'+ idealMemberSize +'px; line-height:' + idealMemberSize + 'px}', 0);
        newListAreaWidth = (idealListWidth + padding) * lists.length;
      } else if (idealListWidth <= minWidth) {
        idealListWidth = minWidth;
        sheet.insertRule('.list-wrapper{width:' + idealListWidth + 'px}', 0);
        sheet.insertRule('.list-header-name{font-size:'+ idealFontSize +'px}', 0);
        sheet.insertRule('.member, .member-avatar, .member-initials{width:'+ idealMemberSize +'px; height:'+ idealMemberSize +'px; line-height:' + idealMemberSize + 'px}', 0);
        newListAreaWidth = (minWidth + padding) * lists.length;
      }

    }
    if(idealListWidth < maxWidth) {
      sheet.insertRule('#board{width:' + newListAreaWidth + 'px!important; font-size:'+ idealFontSize +'px!important}', 0);
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


})();
