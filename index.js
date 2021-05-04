/**
 * Name: _your name here_
 * Date: _add date here_
 * Section: CSE 154 _your section here_
 *
 * -- your description of what this file does here --
 * Do not keep comments from this template in any work you submit (functions included under "Helper
 * functions" are an exception, you may keep the function names/comments of id/qs/qsa/gen)
 */
"use strict";

(function() {
  const URL = "https://api.imgflip.com/get_memes";

  window.addEventListener("load", init);

  function init() {
    id("refresh").addEventListener("click", loadMemes);
  }

  function loadMemes() {
    fetch(URL)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(addMemes)
      .then(changeMemes)
      .catch(handleError);

    id("refresh").classList.add("hidden");
    id("refresh").addEventListener("click", displayFirstMeme);
    id("refresh").removeEventListener("click", loadMemes);
  }

  function addMemes(memes) {
    for (let meme of memes.data.memes) {
      addMeme(meme);
    }
  }

  function addMeme(meme) {
    let newArticle = gen("article");
    let newImg = gen("img");
    let newText = gen("p");

    newImg.src = meme.url;
    newImg.alt = meme.name;

    let windowHeight = window.innerHeight * 0.6;
    let windowWidth = window.innerWidth * 0.6;

    let width = findNumber(meme.width, windowWidth);
    let newHeight = meme.height * (width / meme.width);

    if (width !== undefined) {
      newImg.width = width;
      newImg.height = newHeight;
    }

    let height = findNumber(meme.height, windowHeight);
    let newWidth = meme.width * (height / meme.height);

    if (height !== undefined) {
      newImg.height = height;
      newImg.width = newWidth;
    }

    newText.textContent = meme.name;

    newArticle.appendChild(newImg);
    newArticle.appendChild(newText);

    newArticle.classList.add("hidden");

    id("memes").appendChild(newArticle);
  }

  function findNumber(currentNumber, desiredNumber) {
    let width = currentNumber;

    if (desiredNumber > 0) {
      if (currentNumber >= desiredNumber) {
        let percentage = 1;
        width = currentNumber;

        while (width >= desiredNumber) {
          width = currentNumber * percentage;
          percentage = percentage - 0.01;
        }
      } else if (currentNumber < desiredNumber) {
        let percentage = 1;
        width = currentNumber;

        while (width < desiredNumber) {
          width = currentNumber * percentage;
          percentage = percentage + 0.01;
        }
      }
    }

    return width;
  }

  function changeMemes() {
    let memeIndex = getCurrentMemeIndex();

    if (memeIndex === -1) {
      displayFirstMeme();
    } else if (memeIndex === countMemes() - 1) {
      id("memes").lastElementChild.classList.add("hidden");
      id("memes").lastElementChild.removeEventListener("click", changeMemes);

      id("refresh").classList.remove("hidden");
    } else {

      id("memes").children[memeIndex].classList.add("hidden");
      id("memes").children[memeIndex].removeEventListener("click", changeMemes);

      id("memes").children[memeIndex + 1].classList.remove("hidden");
      id("memes").children[memeIndex + 1].addEventListener("click", changeMemes);
    }
  }

  function displayFirstMeme() {
    id("refresh").classList.add("hidden");
    id("memes").firstElementChild.classList.remove("hidden");
    id("memes").firstElementChild.addEventListener("click", changeMemes);
  }

  function getCurrentMemeIndex() {
    let index = -1;

    for (let i = 0; i < id("memes").children.length; ++i) {
      if (!id("memes").children[i].classList.contains("hidden")) {
        index = i;
      }
    }

    return index;
  }

  function countMemes() {
    return id("memes").children.length;
  }

  function handleError(err) {
    let newArticle = gen("article");
    let newText = gen("p");

    newText.textContent = "Error: " + err;

    newArticle.appendChild(newText);

    id("memes").appendChild(newArticle);
    }

    async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /** ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();