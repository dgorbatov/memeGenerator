/**
 * Name: Daniel Gorbatov
 * Date:5/4/21
 * Section: CSE 154 AO
 *
 * This file provides the interactivity for the index.html website. It fetches
 * memes from the memes api, and makes it possible to cycle through the memes
 */
"use strict";

(function() {
  // This is the url for the meme api (https://imgflip.com/api)
  const URL = "https://api.imgflip.com/get_memes";

  // This is the percentage of the window height that a meme can take up
  const MAX_HEIGHT = 0.6;

  window.addEventListener("load", init);

  /**
   * This is the init function it gets called when the window loads
   */
  function init() {
    // Makes it so that the button load memes when it is clicked
    id("refresh").addEventListener("click", loadMemes);
  }

  /**
   * Loads memes from the meme api
   */
  function loadMemes() {
    id("intro").classList.add("hidden");

    // Set it up so that the refresh button goes to the first meme instead of loading new memes
    id("refresh").addEventListener("click", displayFirstMeme);
    id("refresh").removeEventListener("click", loadMemes);

    fetch(URL)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(addMemes)
      .then(changeMemes)
      .catch(handleError);
  }

  /**
   * Adds all the memes to the page
   * @param {Object} memes - a json object that contains a collection of memes
   */
  function addMemes(memes) {
    // Add meme
    for (let meme of memes.data.memes) {
      addMeme(meme);
    }
  }

  /**
   * Adds one meme to the page
   * @param {Object} meme - the meme that is being added to the page
   */
  function addMeme(meme) {
    let newArticle = gen("article");
    let newImg = gen("img");
    let newText = gen("p");

    newImg.src = meme.url;
    newImg.alt = meme.name;

    // Make sure that the image fits the page
    newImg = scaleWidthHeight(newImg, meme);

    newText.textContent = meme.name;

    newArticle.appendChild(newImg);
    newArticle.appendChild(newText);

    // Hide the meme
    newArticle.classList.add("hidden");

    id("memes").appendChild(newArticle);
  }

  /**
   * Scales the height and width so that the image fits on the screen
   * @param {Object} newImg - the meme image
   * @param {Object} meme - the meme json object
   * @returns {Object} - the new image with scaled width and height
   */
  function scaleWidthHeight(newImg, meme) {
    newImg.height = window.innerHeight * MAX_HEIGHT;
    newImg.width = meme.width * (newImg.height / meme.height);

    return newImg;
  }

  /**
   * Displays the next meme in the list
   */
  function changeMemes() {
    let memeIndex = getCurrentMemeIndex();

    if (memeIndex === -1) {
      // No memes displayed
      displayFirstMeme();
    } else if (memeIndex === countMemes() - 1) {
      // Last meme
      id("memes").lastElementChild.classList.add("hidden");
      id("memes").lastElementChild.removeEventListener("click", changeMemes);

      // Show the refresh the button
      id("refresh").classList.remove("hidden");
    } else {
      // Display next meme
      id("memes").children[memeIndex].classList.add("hidden");
      id("memes").children[memeIndex].removeEventListener("click", changeMemes);

      id("memes").children[memeIndex + 1].classList.remove("hidden");
      id("memes").children[memeIndex + 1].addEventListener("click", changeMemes);
    }
  }

  /**
   * Displays the first meme in the list
   */
  function displayFirstMeme() {
    id("refresh").classList.add("hidden");
    id("memes").firstElementChild.classList.remove("hidden");
    id("memes").firstElementChild.addEventListener("click", changeMemes);
  }

  /**
   * Finds the index of the meme that is currently displayed
   * @returns {Number} - the index of the displayed meme
   */
  function getCurrentMemeIndex() {
    let index = -1;

    for (let i = 0; i < id("memes").children.length; ++i) {
      if (!id("memes").children[i].classList.contains("hidden")) {
        index = i;
      }
    }

    return index;
  }

  /**
   * Finds the number of memes
   * @returns {Number} - number of memes
   */
  function countMemes() {
    return id("memes").children.length;
  }

  /**
   * Displays the error in a text box so that the user can see it
   * @param {Object} err - the error that is thrown
   */
  function handleError(err) {
    let newArticle = gen("article");
    let newText = gen("p");

    newText.textContent = "Error: " + err;

    newArticle.appendChild(newText);

    id("memes").appendChild(newArticle);
  }

  /** ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Checks the status of the fetch request
   * @param {Object} response - the response from the fetch
   * @returns {Object} - returns an error, or the response
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
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