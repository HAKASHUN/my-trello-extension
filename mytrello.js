(function(){
  'use strict';

  var config = {
    padding: 11,
    maxWidth: 260,
    minWidth: 140,
    maxFontSize: 18,
    minFontSize: 12,
    label: 'Slim Lists'
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
    var listAreaWrapperWidth = listAreaWrapper[0].offsetWidth;
    var idealListWidth = Math.floor((listAreaWrapperWidth / (lists.length - 1)) - padding);
    var idealFontSize = Math.floor(maxFontSize * idealListWidth / maxWidth);
    if (idealFontSize < minFontSize) {
      idealFontSize = minFontSize
    }
    var newListAreaWidth = 0;

    if(listAreaWrapperWidth < (lists.length * maxWidth)) {
      for(var i = 0, listCount = lists.length; i < listCount; i++) {
        if(idealListWidth > minWidth && idealListWidth < maxWidth) {
          lists[i].style.width = idealListWidth + 'px';
          newListAreaWidth += (idealListWidth + padding);
          if (listHeaderName[i]) {
            listHeaderName[i].style.fontSize = idealFontSize + 'px';
          }
        } else if(idealListWidth <= minWidth) {
          idealListWidth = minWidth;
          lists[i].style.width = idealListWidth + 'px';
          newListAreaWidth += (minWidth + padding);
          if (listHeaderName[i]) {
            listHeaderName[i].style.fontSize = idealFontSize + 'px';
          }
        }
      }
    }
    if(idealListWidth < maxWidth) {
      listArea.style.width = newListAreaWidth + 'px!important';
      listArea.style.fontSize = idealFontSize + 'px';
    }

  }

  function unfitLists() {
    var lists = document.getElementsByClassName('list-wrapper');
    var listArea = document.getElementById('board');

    if (!lists[0] || !listArea) {
      return;
    }

    slimmed = false;
    updateButtonStatus();

    for(var i = 0, listCount = lists.length; i < listCount; i++) {
      lists[i].style.width = '';
    }
    listArea.style.width = '';
    listArea.style.fontSize = '';
  }


})();
