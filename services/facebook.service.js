const FB = require('facebook-node-sdk');

// Configurez l'application avec votre App ID et App Secret
const accessToken = 'EAAeQjEomcF8BOyRTMz3aTCZA7T2HCGbMcnBDv66FvFdYQGCLKhLUdAZAnxDxGgGGpguUNaCevbzX5qQMZCyu3SlZAxxtHr9SG1hPMoGIQ3ToZCvanvXOQ8L94AZB6oaQUJpzemY0T336DinYgH2wKyZCcKjVhj5VNRnAM1Ths7ptRqOEvLrPYoASvsCgRzQtql6OBn7npFKrcujt37d2VzjGHF7'; // Remplace par ton token d'accès
FB.setAccessToken(accessToken);

/**
 * Publier un message et un lien sur une page Facebook
 * @param {string} pageId - L'ID de la page Facebook
 * @param {Object} postData - Les données à publier (message, lien, image, etc.)
 */
const postOnFacebookPage = (pageId, postData) => {
  return new Promise((resolve, reject) => {
    FB.api(
      `/${pageId}/feed`,
      'POST',
      postData,
      function(response) {
        if (response && !response.error) {
          resolve(response.id);
        } else {
          reject(response.error);
        }
      }
    );
  });
};

module.exports = { postOnFacebookPage };
